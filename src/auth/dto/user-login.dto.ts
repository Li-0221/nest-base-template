import { ApiProperty } from '@nestjs/swagger';
//更多验证规则查看文档
import { IsString, Length, IsEmail } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  @ApiProperty({ description: '邮箱' })
  email: string;

  @IsString()
  @Length(6, 12)
  @ApiProperty({ description: '密码(6-12位)' })
  password: string;

  @IsString()
  @Length(4, 4)
  @ApiProperty({ description: '验证码(4位)' })
  code: string;

  @IsString()
  @Length(1)
  @ApiProperty({ description: '验证码key' })
  key: string;
}
