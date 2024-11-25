import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DocumentController } from './apis/document/document.controller';
import { DocumentService } from './apis/document/document.service';
import { DocumentModule } from './apis/document/document.module';
import { AuthModule } from './apis/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from './dataSource';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DocumentModule,
    TypeOrmModule.forRootAsync(dataSource),
  ],
  controllers: [AppController, DocumentController],
  providers: [AppService, DocumentService],
})
export class AppModule {}
