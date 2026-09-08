import { IsString, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnterpriseDto {
    @ApiProperty({
        type: () => CreateUserDto,
        description: 'User credentials and basic information linked to the new enterprise'
    })
    @ValidateNested()
    @Type(() => CreateUserDto)
    userdto: CreateUserDto;

    @ApiProperty({
        example: 123456789,
        description: 'The 9-digit SIREN number of the enterprise'
    })
    @IsNotEmpty({ message: "SIREN Required" })
    siren: number;
}
