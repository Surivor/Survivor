//create partner (changes all fields), maybe allow creation of user through creation of partner
import { IsString, IsNotEmpty, ValidateNested, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePartnerDto {
    @ApiProperty({
        type: () => CreateUserDto,
        description: 'User credentials and basic information linked to the new partner'
    })
    @ValidateNested()
    @Type(() => CreateUserDto)
    userdto: CreateUserDto;

    @ApiProperty({
        example: 123456789,
        description: 'The 9-digit SIREN number of the partner company'
    })
    @IsNotEmpty({ message: "SIREN Required" })
    siren: number;

    @ApiProperty({
        example: 'Equestrian club and team building',
        description: 'The registered social purpose or business sector of the partner'
    })
    @IsString()
    @IsNotEmpty({ message: "Object Social Required" })
    objet_social: string;

    @ApiPropertyOptional({
	example: true,
	description: 'The partner is verified by the government'
    })
    @IsBoolean()
    @IsOptional()
    verified: boolean;

    @ApiPropertyOptional({
	example: true,
	description: 'The partner should be featured on the app main page'
    })
    @IsBoolean()
    @IsOptional()
    featured: boolean;
}

