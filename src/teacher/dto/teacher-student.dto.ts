import { IsNotEmpty } from 'class-validator';


export class TeacherStudentDTO {

    @IsNotEmpty({ message: 'Teacher should not be empty' })
    teacher: string;

    students: string[];

}