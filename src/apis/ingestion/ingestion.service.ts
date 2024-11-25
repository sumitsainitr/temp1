import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { DocumentService } from '../document/document.service';
import { S3Service } from '../s3/s3.service';
import { DocumentEntity } from '../../entities/document';

/**
 * Note: Basic idea here is to send file store file blob in s3 and send it over to external provider,
 * external provider will internally transform data using ELT or ETL approachs
 * This controller provide 2 method 1 to submit data for ingestion from s3 bucket & other one is to check the status of
 * ongoing process.
 *
 * There are may LLM api providers to ingest data for example: Cleartax, Celonis, Druid
 */
@Injectable()
export class IngestionService {
  axiosClient: AxiosInstance;
  constructor(
    readonly documentService: DocumentService,
    readonly s3Service: S3Service,
  ) {
    this.axiosClient = axios.create({
      baseURL: 'http://python-backend', // mocked api
      headers: { Authorization: 'Bearer XYZ' },
    });
  }

  async triggerIngestion(documentId: string): Promise<any> {
    const pythonBackendUrl: string = '/ingest';
    const headers: AxiosRequestConfig['headers'] = {};

    try {
      const requiredDocument: DocumentEntity =
        await this.documentService.findOne(documentId);
      const assetUrl: string = await this.s3Service.getSignedUrl(
        'getObject',
        requiredDocument.fileName,
      );

      const response: AxiosResponse = await this.axiosClient.post(
        pythonBackendUrl,
        {
          source: assetUrl,
        },
        { headers },
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to trigger ingestion process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getIngestionStatus(pid: string): Promise<string> {
    const statusUrl: string = `/ingest/status/${pid}`;

    try {
      const response: AxiosResponse = await this.axiosClient.get(statusUrl);
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch ingestion status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
