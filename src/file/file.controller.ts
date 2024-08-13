import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Public } from '@/common/decorator/auth.decorator';
import { LargeFileDto } from './dto/large-file.dto';
import { FileDto } from './dto/file.dto';

@Public()
@Controller('file')
@ApiTags('文件模块')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @ApiOperation({ summary: '上传文件' })
  @ApiBody({ description: '上传的文件和文件名', type: FileDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './publicFile', // 文件保存路径 注意：确保这个文件夹已经存在，或者Multer有权限创建它
        filename: (req, file, cb) => {
          // 也可以使用uuid生成文件名字
          const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 10, // 限制文件大小为 10MB
      },
      // fileFilter: (req, file, cb) => {
      //   if (file && file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      //     cb(null, true);
      //   } else {
      //     cb(new Error('Only image files are allowed!'), false);
      //   }
      // },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return `publicFile/${file.filename}`;
  }

  @Post('large-upload')
  @ApiOperation({ summary: '大上传文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: '上传的文件和文件名', type: LargeFileDto })
  @UseInterceptors(FileInterceptor('file', { dest: 'publicFile' }))
  largeUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
  ) {
    return this.fileService.largeUpload(file, name);
  }

  @Get('merge')
  @ApiQuery({ name: 'name', type: String, description: '文件名' })
  @ApiOperation({ summary: '大上传文件完毕通知' })
  uploadMessage(@Query('name') name: string) {
    return this.fileService.merge(name);
  }
}
