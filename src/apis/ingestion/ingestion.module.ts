import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { S3Module } from '../s3/s3.module';
import { DocumentModule } from '../document/document.module';
import { RoleGuard } from '../shared/guards/role.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [S3Module, DocumentModule],
  controllers: [IngestionController],
  providers: [IngestionService, RoleGuard, Reflector],
})
export class IngestionModule {}
