import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UploadConfig } from "@/common/configs/config.interface";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class UploadService {
  private uploadPath: string;

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get<UploadConfig>("upload");
    this.uploadPath = path.join(process.cwd(), config.path);
  }

  /**
   * 处理切片上传
   * @param file 当前上传的切片文件 (Multer处理后的临时文件)
   * @param name 原始文件名 (前端传递，例如: avatar.png)
   * @param hash 文件hash (建议前端传递唯一hash，用于创建文件夹)
   * @param index 切片索引 (前端传递)
   */
  async largeUpload(file: Express.Multer.File, name: string, hash: string, index: number) {
    // 1. 定义切片临时目录: public/uploads/temp_HASH
    const chunkDir = path.join(this.uploadPath, `temp_${hash}`);

    // 2. 如果目录不存在则创建
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir, { recursive: true });
    }

    // 3. 移动切片文件 (比 copy + rm 更快)
    // 目标文件名: temp_HASH/hash-index
    const destPath = path.join(chunkDir, `${hash}-${index}`);

    try {
      fs.renameSync(file.path, destPath);
    } catch (error) {
      // 跨分区移动可能失败，降级为 copy + unlink
      fs.copyFileSync(file.path, destPath);
      fs.unlinkSync(file.path);
    }

    return {
      message: `切片 ${index} 上传成功`,
      path: destPath
    };
  }

  /**
   * 合并切片
   * @param name 最终文件名
   * @param hash 文件hash
   */
  async merge(name: string, hash: string) {
    const chunkDir = path.join(this.uploadPath, `temp_${hash}`);

    if (!fs.existsSync(chunkDir)) {
      throw new BadRequestException("切片目录不存在或已过期");
    }

    // 1. 读取并排序切片
    const chunks = fs.readdirSync(chunkDir).sort((a, b) => {
      // 文件名格式: hash-index
      const indexA = parseInt(a.split("-").pop());
      const indexB = parseInt(b.split("-").pop());
      return indexA - indexB;
    });

    if (chunks.length === 0) {
      throw new BadRequestException("没有可合并的切片");
    }

    // 2. 定义最终文件路径
    const finalFilePath = path.join(this.uploadPath, name);

    // 如果文件已存在，先删除 (可选策略)
    if (fs.existsSync(finalFilePath)) {
      fs.unlinkSync(finalFilePath);
    }

    // 3. 创建写入流 (最终文件)
    const writeStream = fs.createWriteStream(finalFilePath);

    // 4. 串行合并 (关键优化点: 必须按顺序一个接一个写入)
    try {
      for (const chunk of chunks) {
        const chunkPath = path.join(chunkDir, chunk);
        // 读取切片流
        const readStream = fs.createReadStream(chunkPath);

        // 使用 pipeline 管道传输，设置 end: false 保持写入流开启
        // 注意：这里不能直接 pipe，因为 pipe 默认会结束目标流
        await new Promise<void>((resolve, reject) => {
          readStream.pipe(writeStream, { end: false });
          readStream.on("end", () => resolve());
          readStream.on("error", reject);
        });
      }

      // 5. 关闭写入流
      writeStream.end();

      // 6. 删除切片临时目录
      fs.rmSync(chunkDir, { recursive: true, force: true });

      // 7. 返回访问地址
      const config = this.configService.get<UploadConfig>("upload");
      return {
        url: `${config.prefix}/${name}`,
        filename: name
      };
    } catch (error) {
      writeStream.close();
      throw new BadRequestException("文件合并失败: " + error.message);
    }
  }
}
