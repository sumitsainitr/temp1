import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { DocumentEntity } from '../../entities/document';
import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly documentRepository: Repository<DocumentEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async uploadDocumentToS3(
    file: Express.Multer.File,
    userId: string,
  ): Promise<DocumentEntity> {
    const fileKey = `${v4()}-${file.originalname}`;
    try {
      await this.s3Service.upload(fileKey, file.buffer, file.mimetype);
      const fileEntity = this.documentRepository.create({
        fileName: fileKey,
        uploadedBy: userId,
      });

      return this.documentRepository.save(fileEntity);
    } catch (error) {
      throw new HttpException(
        'Failed to upload file to S3',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<DocumentEntity[]> {
    return this.documentRepository.find();
  }

  async findOne(id: string): Promise<DocumentEntity> {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }
    return document;
  }

  async remove(id: string): Promise<DeleteResult> {
    const file = await this.findOne(id);
    await this.s3Service.remove(file.fileName);
    return this.documentRepository.delete(id);
  }
}
