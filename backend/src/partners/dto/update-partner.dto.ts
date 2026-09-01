//create partner (changes all fields), maybe allow creation of user through creation of partner
import { IsString, IsNotEmpty } from 'class-validator';
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
}