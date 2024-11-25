import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { S3Module } from '../s3/s3.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from '../../entities/document';
import { RoleGuard } from '../shared/guards/role.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [S3Module, TypeOrmModule.forFeature([DocumentEntity])],
  controllers: [DocumentController],
  providers: [DocumentService, RoleGuard, Reflector],
})
export class DocumentModule {}
