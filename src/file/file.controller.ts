import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileDto } from './dto/file.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@Controller('file')
@ApiTags('文件模块')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @ApiOperation({ summary: '上传文件' })
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() fileDto: FileDto) {
    return this.fileService.upload(fileDto);
  }
}
