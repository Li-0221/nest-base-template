import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { ConfigService } from "@nestjs/config";
import { UploadConfig } from "@/common/configs/config.interface";

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uploadConfig = configService.get<UploadConfig>("upload");

        return {
          storage: diskStorage({
            destination: join(process.cwd(), uploadConfig.path),
            filename: (_, file, callback) => {
              const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
              const ext = extname(file.originalname);
              const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
              callback(null, filename);
            }
          })
        };
      }
    })
  ],
  controllers: [UploadController],
  providers: [UploadService]
})
export class FileModule {}
