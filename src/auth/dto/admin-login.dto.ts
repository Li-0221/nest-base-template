import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsPhoneNumber } from 'class-validator';

export class AdminLoginDto {
  @IsPhoneNumber('CN')
  @ApiProperty({ description: '电话号码' })
  phone: string;

  @IsString()
  @Length(6, 12)
  @ApiProperty({ description: '密码(6-12位)' })
  password: string;
}
