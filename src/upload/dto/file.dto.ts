import { ApiProperty } from "@nestjs/swagger";

export class FileDto {
  @ApiProperty({
    type: "string",
    format: "binary",
    description: "文件"
  })
  file: Blob;
}
