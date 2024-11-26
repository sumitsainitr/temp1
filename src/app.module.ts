import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DocumentController } from './apis/document/document.controller';
import { DocumentService } from './apis/document/document.service';
import { DocumentModule } from './apis/document/document.module';
import { AuthModule } from './apis/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from './dataSource';
import { IngestionModule } from './apis/ingestion/ingestion.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DocumentModule,
    IngestionModule,
    TypeOrmModule.forRootAsync(dataSource),
  ],
  controllers: [ DocumentController],
  providers: [ DocumentService],
})
export class AppModule {}
