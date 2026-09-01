//create partner (changes all fields), maybe allow creation of user through creation of partner
import { IsString, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from "../../users/dto/create-user.dto";

export class CreatePartnerDto {
    userdto: CreateUserDto;

    @IsNotEmpty({ message: "SIREN Required" })
    siren: number;

    @IsString()
    @IsNotEmpty({ message: "Object Social Required" })
    objet_social: string;
}

