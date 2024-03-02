import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherStudentDTO } from './dto/teacher-student.dto';
import { StudentDto } from '../student/dto/student.dto';
import { Student } from '../student/student.entity';
import { Teacher } from './teacher.entity';
import { TeacherNotificationRequest } from './dto/teacher.notity.request.dto';
import { TeacherStudentNotifyList } from './dto/teacher.student.nitifylist.dto';
import { TeacherStudentResponse } from './dto/teacher.student.response.dto';

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>,
        @InjectRepository(Student)
        private readonly studentRepositoty: Repository<Student>) {

    }

    /****
     * 
     As a teacher, I want to register one or more students to a specified teacher.
     **** 
     */
    async createStudent(teacherStudentDTO: TeacherStudentDTO): Promise<TeacherStudentResponse> {
        if (teacherStudentDTO) {
            let newTeacher: Teacher;
            let teacher: Teacher;
            teacher = new Teacher();
            teacher.email = teacherStudentDTO.teacher;
            teacher.student = [];
            const teacherStudentResponse = new TeacherStudentResponse();
            teacherStudentResponse.students = [];

            const existingTeacher = await this.findTeacherByTeacherEmail(teacher.email);
            if (!existingTeacher) {

                const teacherStudent = this.teacherRepository.create(teacher);
                newTeacher = await this.teacherRepository.save(teacherStudent);


            } else {
                newTeacher = existingTeacher;
            }

            for (const val of teacherStudentDTO.students) {
                const studentRegistered = await this.findStudentByStudentEmail(val);
                if (!studentRegistered) {
                    let student: Student;
                    student = new Student();
                    student.teacherId = newTeacher.id;
                    student.email = val;
                    teacher.student.push(student);
                    teacherStudentResponse.students.push(val)
                } else {

                    teacherStudentResponse.message = teacherStudentResponse.message === null
                        || teacherStudentResponse.message === undefined ? '@' + val + ' Student Already Registered '
                        : teacherStudentResponse.message + '@' + val + ' Student Already Registered ';
                }
            }

            await this.studentRepositoty.save(teacher.student);
            teacherStudentResponse.teacher = newTeacher.email;
            return (teacherStudentResponse);
        }
    }

    /****
     * 
     As a teacher, I want to retrieve a list of students common to a given list of teachers 
     (i.e. retrieve students who are registered to ALL of the given teachers).
     **** 
     */
    async findStudentByTeacherEmail(teacher: string[]): Promise<StudentDto> {
        let studentDto = new StudentDto();
        if (teacher) {
            try {
                studentDto.students = [];
                const query = this.teacherRepository.createQueryBuilder("teacher");
                query.leftJoinAndSelect('teacher.student', 'student', 'student.teacherId = teacher.id');
                teacher.forEach(emailObj => {
                    query.andWhere('teacher.email=:email', { email: emailObj })
                })
                query.distinct(true)
                //console.log("Teacher Student Query : " + query.getSql());
                const response = await query.getMany();
                if (!response) {
                    throw new NotFoundException(`Student with ID ${teacher} not found`);
                }
                response.forEach(obj => {
                    obj.student.forEach(stu => {
                        studentDto.students.push(stu.email);
                    })
                });
                studentDto.students.push(teacher[0]);
            } catch (err) {
                throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            throw new NotFoundException(`Please pass the correct teacher ID`);
        }
        return studentDto;
    }



    /****
     * 
     As a teacher, I want to suspend a specified student.
     ****
     */

    async updateStudent(email: string): Promise<Student> {
        const student = await this.studentRepositoty.findOne({ where: { email: email } });
        if (!student) {
            throw new NotFoundException(`Student with ID ${email} not found`);
        }
        student.suspend = true;
        this.studentRepositoty.save(student);
        return (student);
    }



    /****
     * 
        A notification consists of:
        the teacher who is sending the notification, and
        the text of the notification itself.
        To receive notifications from e.g. 'teacherken@gmail.com', a student:
        MUST NOT be suspended,
        AND MUST fulfill AT LEAST ONE of the following:
        i. is registered with “teacherken@gmail.com"
        ii. has been @mentioned in the notification
     ****
     */

    async findStudentToBeNotified(notificationRequest: TeacherNotificationRequest): Promise<TeacherStudentNotifyList> {
        let emailList: string[] = [];
        let teacherStudentNotifyList = new TeacherStudentNotifyList();
        teacherStudentNotifyList.recipients = [];

        let notifyByStudentList = notificationRequest.notification.split(' ');
        notifyByStudentList.forEach(obj => {
            if (obj.startsWith('@')) {
                emailList.push(obj.substring(1, obj.length));
            }
        });

        const teacherQuery = this.teacherRepository.createQueryBuilder("teacher");
        teacherQuery.leftJoinAndSelect('teacher.student', 'student', 'student.teacherId = teacher.id');
        teacherQuery.where('teacher.email = :email', { email: notificationRequest.teacher })
        teacherQuery.andWhere('student.suspend != :suspend', { suspend: true })
        teacherQuery.distinct(true)
        console.log("Teacher  Query : " + teacherQuery.getSql());
        const response = await teacherQuery.getMany();

        const studentQuery = this.studentRepositoty.createQueryBuilder("student");
        studentQuery.andWhere('student.suspend != :suspend', { suspend: true })
        emailList.forEach(emailObj => {
            studentQuery.orWhere('student.email=:email', { email: emailObj })
        })
        studentQuery.distinct(true)
        console.log(" Student Query : " + studentQuery.getSql());
        const individualStudent = await studentQuery.getMany();

        response.map(teacherEmailList => {
            teacherEmailList.student.forEach(teacherStudent => {
                teacherStudentNotifyList.recipients.push(teacherStudent.email);
            });
        });
        individualStudent.map(studentEmailList => {
            teacherStudentNotifyList.recipients.push(studentEmailList.email);
        });


        return teacherStudentNotifyList;
    }


    async findOneStudent(id: number): Promise<Teacher> {
        const teacher = await this.teacherRepository.findOne({ where: { id: id } });
        if (!teacher) {
            throw new NotFoundException(`Teacher with ID ${id} not found`);
        }
        return (teacher);
    }

    async findAllStudent(): Promise<Student[]> {
        return await this.studentRepositoty.find();
    }

    async findStudentByStudentEmail(studentEmail: string): Promise<Student> {
        const studentQuery = this.studentRepositoty.createQueryBuilder("student");
        studentQuery.where('student.email=:email', { email: studentEmail })
        studentQuery.distinct(true)
        console.log(" Student Query : " + studentQuery.getSql());
        const individualStudent = await studentQuery.getOne();
        return individualStudent;

    }


    async findTeacherByTeacherEmail(teacherEmail: string): Promise<Teacher> {
        const teacherQuery = this.teacherRepository.createQueryBuilder("teacher");
        teacherQuery.where('teacher.email=:email', { email: teacherEmail })
        teacherQuery.distinct(true)
        console.log(" TeacheQuery : " + teacherQuery.getSql());
        const individualTeacher = await teacherQuery.getOne();
        return individualTeacher;

    }

}
