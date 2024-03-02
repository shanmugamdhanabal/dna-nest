import { IsNotEmpty } from 'class-validator';

export class TeacherNotificationRequest {

    @IsNotEmpty({ message: 'Teacher must not be empty ' })
    teacher: string;

    @IsNotEmpty({ message: 'Notification must not be empty ' })
    notification: string;

}