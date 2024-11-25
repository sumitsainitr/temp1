import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  MaxFileSizeValidator,
  ParseFilePipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentEntity } from '../../entities/document';
import { AuthenticatedRequest } from '../../shared/utils/types';
import { SetRole } from '../shared/decorators/role.decortor';
import { Roles } from '../../shared/utils/constants';
import { AuthGuard } from '../shared/guards/auth.guard';
import { RoleGuard } from '../shared/guards/role.guard';

@Controller('document')
@SetRole(Roles.ADMIN, Roles.EDITOR)
@UseGuards(AuthGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @UseGuards(RoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10 * 1024, // 10MB
            message: 'File is too large. Max file size is 10MB',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Req() request: AuthenticatedRequest,
  ): Promise<DocumentEntity> {
    return this.documentService.uploadDocumentToS3(file, request.user.id);
  }

  @Get()
  async findAll(): Promise<DocumentEntity[]> {
    return this.documentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.documentService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  async remove(@Param('id') id: string): Promise<any> {
    return this.documentService.remove(id);
  }
}
