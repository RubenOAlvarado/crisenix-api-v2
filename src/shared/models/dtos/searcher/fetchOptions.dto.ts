import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsBoolean } from 'class-validator';

export class FetchOptionsDto {
  @ApiProperty({
    description: 'Indicator if we want to load sub catalogs.',
    default: false,
    type: Boolean,
  })
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  shouldPopulate!: boolean;
}
