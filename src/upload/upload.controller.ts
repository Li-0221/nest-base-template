import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { ApiTags, ApiOperation, ApiQuery, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { Public } from "@/common/decorator/auth.decorator";
import { LargeFileDto } from "./dto/large-file.dto";
import { FileDto } from "./dto/file.dto";
import { UploadConfig } from "@/common/configs/config.interface";
import { ConfigService } from "@nestjs/config";

@Public()
@Controller("upload")
@ApiTags("文件模块")
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService
  ) {}

  @Post("file")
  @ApiOperation({ summary: "上传文件" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ description: "上传的文件", type: FileDto })
  @UseInterceptors(FileInterceptor("file"))
  upload(@UploadedFile() file: Express.Multer.File) {
    const { prefix } = this.configService.get<UploadConfig>("upload");

    const { filename, originalname, mimetype, size } = file;
    return {
      filename,
      originalname,
      mimetype,
      size,
      url: `${prefix}/${filename}`
    };
  }

  @Post("large-upload")
  @ApiOperation({ summary: "大上传文件" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ description: "上传的文件和文件名", type: LargeFileDto })
  @UseInterceptors(FileInterceptor("file", { dest: "public/uploads" }))
  largeUpload(@UploadedFile() file: Express.Multer.File, @Body("name") name: string) {
    return this.uploadService.largeUpload(file, name);
  }

  @Get("merge")
  @ApiQuery({ name: "name", type: String, description: "文件名" })
  @ApiOperation({ summary: "大上传文件完毕通知" })
  uploadMessage(@Query("name") name: string) {
    return this.uploadService.merge(name);
  }
}
