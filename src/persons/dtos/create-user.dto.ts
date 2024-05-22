import { IsNotEmpty, IsEmail, IsDate, MaxDate, IsDateString } from 'class-validator'
import { Type } from 'class-transformer';
import moment from 'moment'

export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsDateString()
    // @Type(() => Date)
    // @MaxDate(moment().subtract(13, 'y').toDate())
    dateOfBirth: string;

    firstName?: string;
    lastName?: string;
}