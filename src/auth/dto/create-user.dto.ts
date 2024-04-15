import { ApiProperty } from '@nestjs/swagger';
//更多验证规则查看文档
import { IsString, Length, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 5)
  @ApiProperty({ description: '姓名(2-5位)' })
  name: string;

  @IsEmail()
  @ApiProperty({ description: '邮箱' })
  email: string;

  @IsString()
  @Length(6, 12)
  @ApiProperty({ description: '密码(6-12位)' })
  password: string;
}
