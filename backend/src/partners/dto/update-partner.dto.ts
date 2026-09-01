//create partner (changes all fields), maybe allow creation of user through creation of partner
import { IsString, IsNotEmpty } from 'class-validator';
import { UpdateUserDto } from "../../users/dto/update-user.dto";

export class UpdatePartnerDto {
    userdto: UpdateUserDto;

    @IsString()
    @IsNotEmpty({ message: 'Object Social Required' })
    objet_social: string;
}

