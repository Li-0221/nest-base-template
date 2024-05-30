import { Injectable } from '@nestjs/common';
import { File } from 'buffer';
import { createReadStream, createWriteStream } from 'fs';
import path from 'path';

@Injectable()
export class FileService {
  constructor() {}

  async upload(file: any) {
    if (!file) throw new Error('No file uploaded');
    try {
      const { buffer, originalname } = file;
      // 生成要保存的文件路径
      const filePath = path.join(
        __dirname,
        '../../',
        'publicFile',
        originalname,
      );
      const writeStream = createWriteStream(filePath);
      writeStream.write(buffer);

      return `publicFile/${originalname}`;
    } catch (error) {
      return { responseCode: 500, message: '文件存储错误' };
    }
  }
}
