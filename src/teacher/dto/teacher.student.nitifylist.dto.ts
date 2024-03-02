import { IsNotEmpty, IsString, IsInt, IsPositive } from 'class-validator';

export class TeacherStudentNotifyList {


    @IsNotEmpty({ message: 'Email should not be empty' })
    @IsString()
    recipients: string[];


}