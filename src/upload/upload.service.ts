import { Injectable } from "@nestjs/common";
import { rm, rmSync, cpSync, statSync, mkdirSync, existsSync, readdirSync, createReadStream, createWriteStream } from "fs";

@Injectable()
export class UploadService {
  constructor() {}

  async largeUpload(file: Express.Multer.File, name: string) {
    const fileName = name.match(/(.+)\-\d+$/)[1];
    const chunkDir = "publicFile/chunks_" + fileName;

    if (!existsSync(chunkDir)) {
      mkdirSync(chunkDir);
    }

    cpSync(file.path, chunkDir + "/" + name);
    rmSync(file.path);

    return `切片 ${name} 上传成功`;
  }

  async merge(name: string) {
    const chunkDir = "publicFile/chunks_" + name;

    const files = readdirSync(chunkDir).sort((a, b) => {
      const numA = parseInt(a.split("-").pop(), 10);
      const numB = parseInt(b.split("-").pop(), 10);
      return numA - numB;
    });

    let startPos = 0;
    let count = 0;
    files.map(file => {
      const filePath = chunkDir + "/" + file;
      const stream = createReadStream(filePath);
      stream
        .pipe(
          createWriteStream("public/uploads/" + name, {
            start: startPos
          })
        )
        .on("finish", () => {
          count++;
          if (count === files.length) {
            rm(chunkDir, { recursive: true }, () => {});
          }
        });
      startPos += statSync(filePath).size;
    });
    return `public/uploads/${name}`;
  }
}
