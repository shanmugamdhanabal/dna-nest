
import { IsNotEmpty, IsString, IsInt, IsPositive } from 'class-validator';

export class StudentDto {

    @IsNotEmpty({ message: 'Email should not be empty' })
    @IsString()
    students: string[];



}