import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
  controllers: [],
  providers: [],
})
export class AppModule {}
