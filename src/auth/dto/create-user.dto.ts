import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 8)
  @ApiProperty({ description: '姓名(1-8位)' })
  name: string;

  @IsPhoneNumber('CN')
  @ApiProperty({ description: '手机号' })
  phone: string;

  @IsString()
  @Length(6, 12)
  @ApiProperty({ description: '密码(6-12位)' })
  password: string;
}
