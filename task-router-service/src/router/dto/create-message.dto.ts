import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  ValidateIf,
  Matches,
} from 'class-validator';
import { ChannelEnum } from '../enums/router.enum';

const PHONE_NUMBER_REGEX = /^\+?[1-9]\d{6,14}$/;

export class SendMessageDto {
  @ValidateIf((o) => o.channel === ChannelEnum.EMAIL)
  @IsEmail(
    {},
    {
      message:
        'The "to" field must be a valid email address when the channel is email.',
    },
  )
  // 2. Validate 'to' as a PHONE NUMBER if channel is SMS or WHATSAPP
  @ValidateIf(
    (o) => o.channel === ChannelEnum.SMS || o.channel === ChannelEnum.WHATSAPP,
  )
  @Matches(PHONE_NUMBER_REGEX, {
    message:
      'The "to" field must be a valid phone number when the channel is sms or whatsapp.',
  })
  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(ChannelEnum)
  channel: ChannelEnum;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsNotEmpty()
  @IsString()
  body: string;
}
