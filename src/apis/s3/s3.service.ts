import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  private readonly s3Client: AWS.S3;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new AWS.S3({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucketName = this.configService.get('S3_BUCKET_NAME');
  }

  async get(fileKey: string) {
    return this.s3Client
      .getObject({ Bucket: this.bucketName, Key: fileKey })
      .promise();
  }

  async getSignedUrl(operation: 'getObject' | 'putObject', fileKey: string) {
    return this.s3Client.getSignedUrlPromise(operation, {
      Bucket: this.bucketName,
      Key: fileKey,
      Expires: 3600,
    });
  }

  async upload(fileKey: string, fileContent: Buffer, mimetype: string) {
    await this.s3Client
      .upload({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: fileContent,
        ContentType: mimetype,
        ACL: 'public-read',
      })
      .promise();
  }

  async remove(fileName: string) {
    await this.s3Client
      .deleteObject({ Bucket: this.bucketName, Key: fileName })
      .promise();
  }
}
