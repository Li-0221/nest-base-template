import { Injectable } from '@nestjs/common';
import fs from 'fs';

@Injectable()
export class FileService {
  constructor() {}

  async largeUpload(file: Express.Multer.File, name: string) {
    const fileName = name.match(/(.+)\-\d+$/)[1];
    const chunkDir = 'publicFile/chunks_' + fileName;

    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }

    fs.cpSync(file.path, chunkDir + '/' + name);
    fs.rmSync(file.path);

    return `切片 ${name} 上传成功`;
  }

  async merge(name: string) {
    const chunkDir = 'publicFile/chunks_' + name;

    const files = fs.readdirSync(chunkDir);

    let startPos = 0;
    let count = 0;
    files.map((file) => {
      const filePath = chunkDir + '/' + file;
      const stream = fs.createReadStream(filePath);
      stream
        .pipe(
          fs.createWriteStream('publicFile/' + name, {
            start: startPos,
          }),
        )
        .on('finish', () => {
          count++;
          if (count === files.length) {
            fs.rm(chunkDir, { recursive: true }, () => {});
          }
        });
      startPos += fs.statSync(filePath).size;
    });
    return `publicFile/${name}`;
  }
}
