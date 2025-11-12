import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors, BadRequestException } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { ApiTags, ApiOperation, ApiQuery, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { Public } from "@/common/decorator/auth.decorator";
import { FileDto } from "./dto/file.dto";
import { LargeFileDto } from "./dto/large-file.dto";
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
  @ApiOperation({ summary: "普通文件上传" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ description: "上传的文件", type: FileDto })
  @UseInterceptors(FileInterceptor("file"))
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("文件不能为空");

    const { prefix } = this.configService.get<UploadConfig>("upload");
    return {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `${prefix}/${file.filename}`
    };
  }

  @Post("large-upload")
  @ApiOperation({ summary: "切片上传" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  async largeUpload(@UploadedFile() file: Express.Multer.File, @Body() body: LargeFileDto) {
    if (!file) throw new BadRequestException("切片文件不能为空");

    const { name, hash, index } = body;

    return this.uploadService.largeUpload(file, name, hash, parseInt(index as any));
  }

  @Get("merge")
  @ApiOperation({ summary: "合并切片" })
  @ApiQuery({ name: "name", type: String, description: "原始文件名" })
  @ApiQuery({ name: "hash", type: String, description: "文件Hash值" })
  async merge(@Query("name") name: string, @Query("hash") hash: string) {
    return this.uploadService.merge(name, hash);
  }
}
