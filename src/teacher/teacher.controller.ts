import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherStudentDTO } from './dto/teacher-student.dto';
import { Teacher } from './teacher.entity';
import { Student } from '../student/student.entity';
import { StudentDto } from '../student/dto/student.dto';
import { ParseQueryValuePipe } from './input.filter.pipe';
import { TeacherNotificationRequest } from './dto/teacher.notity.request.dto';
import { TeacherStudentNotifyList } from './dto/teacher.student.nitifylist.dto';
import { TeacherStudentResponse } from './dto/teacher.student.response.dto';


@Controller('/api')
export class TeacherController {

    constructor(private readonly teacherService: TeacherService) { }

    @Post('/register') // Handle HTTP POST requests to create a student
    create(@Body() createTeacherDto: TeacherStudentDTO): Promise<TeacherStudentResponse> {

        console.log(createTeacherDto);
        console.log("dsfdsfdsfds => " + createTeacherDto.teacher);

        return this.teacherService.createStudent(createTeacherDto);
    }

    @Get() // requests to retrieve all student
    findAll(): Promise<Student[]> {

        return this.teacherService.findAllStudent();
    }

    @Get('/students-list') // requests to retrieve all student
    findStudentByTeacherEmail(@Query('teacher', new ParseQueryValuePipe()) teacher: string[]): Promise<StudentDto> {

        return this.teacherService.findStudentByTeacherEmail(teacher);
    }

    @Put(':email')
    updateStudent(@Param('email') email: string) {

        return this.teacherService.updateStudent(email)
    }

    @Post('/notification-list')
    findNotificationList(@Body() notificationRequest: TeacherNotificationRequest): Promise<TeacherStudentNotifyList> {

        return this.teacherService.findStudentToBeNotified(notificationRequest);
    }
}
