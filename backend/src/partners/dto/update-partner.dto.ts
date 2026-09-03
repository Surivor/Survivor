//create partner (changes all fields), maybe allow creation of user through creation of partner
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';
import { UpdateUserDto } from "../../users/dto/update-user.dto";
import { ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

export class UpdatePartnerDto {
    @ApiPropertyOptional({
        type: () => UpdateUserDto,
        description: 'Updated user credentials and basic information linked to the partner'
    })
    userdto: UpdateUserDto;

    @ApiProperty({
        example: 'Event planning and catering',
        description: 'The updated registered social purpose or business sector'
    })
    @IsString()
    @IsNotEmpty({ message: 'Object Social Required' })
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

