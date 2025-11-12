import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumberString } from "class-validator";

export class LargeFileDto {
  @ApiProperty({ type: "string", format: "binary", description: "文件切片" })
  file: any;

  @ApiProperty({ description: "原始文件名", example: "video.mp4" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "文件Hash (唯一标识)", example: "e10adc3949ba59abbe56e057f20f883e" })
  @IsString()
  @IsNotEmpty()
  hash: string;

  @ApiProperty({ description: "切片索引", example: "0" })
  @IsNumberString()
  index: number;
}
