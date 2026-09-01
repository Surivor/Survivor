//create partner (changes all fields), maybe allow creation of user through creation of partner
import { IsString, IsNotEmpty, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from "../../users/dto/create-user.dto";

export class CreatePartnerDto {
    @ValidateNested()
    @Type(() => CreateUserDto)
    userdto: CreateUserDto;

    @IsNotEmpty({ message: "SIREN Required" })
    siren: number;

    @IsString()
    @IsNotEmpty({ message: "Object Social Required" })
    objet_social: string;
}

