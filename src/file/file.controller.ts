import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileDto } from './dto/file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Public } from '@/common/decorator/auth.decorator';

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

  @Post('large-upload')
  @Public()
  @ApiOperation({ summary: '大上传文件' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // 上传文件保存的目录
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 10, // 限制文件大小为 10MB
      },
      fileFilter: (req, file, cb) => {
        if (file && file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
    }),
  )
  async largeUpload(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.largeUpload(file);
  }

  // @Post('upload-message')
  // @ApiOperation({ summary: '大上传文件完毕通知' })
  // @UseInterceptors(FileInterceptor('file'))
  // uploadMessage(@UploadedFile() fileDto: FileDto) {
  //   return this.fileService.uploadMessage(fileDto);
  // }
}
