import { Test, TestingModule } from '@nestjs/testing';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { Teacher } from './teacher.entity';
import { Student } from 'src/student/student.entity';
import { TeacherStudentResponse } from './dto/teacher.student.response.dto';
import { StudentDto } from 'src/student/dto/student.dto';

describe('TeacherController', () => {
  let controller: TeacherController;
  beforeEach(async () => {
    const fackTeacherService: Partial<TeacherService> = {
      findTeacherByTeacherEmail: (email: string) => Promise.resolve({ id: 1, email: 'dhana@gmail.com' } as Teacher),
      findStudentByStudentEmail: (email: string) => Promise.resolve({ id: 10, email: 'dhanan@gmail.com', teacherId: 1, suspend: false } as Student),
      createStudent: ({ teacher: string, students: [] }) => Promise.resolve({ teacher: 'Dhana', students: ['sdfdsf'], message: "fdgfdg" } as TeacherStudentResponse),
      findStudentByTeacherEmail: (email: string[]) => Promise.resolve({ students: ['dhana@gmail.com'] } as StudentDto)
    };




    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherController],
      providers: [TeacherService,
        {
          provide: TeacherService,
          useValue: fackTeacherService
        }]
    }).compile();
    controller = module.get<TeacherController>(TeacherController);
  });




  it('Create Student', async () => {

    const teacherStudentResponse = controller.create({ teacher: 'Dhana', students: ['sdfdsf'] });
    expect((await teacherStudentResponse).teacher).toEqual('Dhana')

  })


  it('Find Student By Teacher Email', async () => {
    const studentDto = controller.findStudentByTeacherEmail(['dhana@gmail.com']);
    expect((await studentDto).students[0]).toEqual('dhana@gmail.com')
  })

});
