import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../shared/utils/constants';
import { SetRole } from '../shared/decorators/role.decortor';
import { RoleGuard } from '../shared/guards/role.guard';

@Controller('ingestion')
@SetRole(Roles.ADMIN, Roles.EDITOR)
@UseGuards(AuthGuard)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('/trigger/:documentId')
  @UseGuards(RoleGuard)
  async triggerIngestion(@Param('documentId') documentId: string) {
    const result = await this.ingestionService.triggerIngestion(documentId);
    return result;
  }

  @Get('/status/:pid')
  async checkIngestionStatus(@Param('pid') pid: string) {
    const status = await this.ingestionService.getIngestionStatus(pid);
    return { status };
  }
}
