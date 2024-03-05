import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from './teacher.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';
import { StudentService } from '../student/student.service';
import { Student } from '../student/student.entity';
import { StudentDto } from '../student/dto/student.dto';
import { TeacherStudentResponse } from './dto/teacher.student.response.dto';
import { mockRepositoryFactory } from './test-helpers';
import { Repository } from 'typeorm';
import { distinct } from 'rxjs';

describe('TeacherService', () => {
  let service: TeacherService;

  let teacherRepository: Repository<Teacher>;
  let studentRepositoty: Repository<Student>;

  var students = JSON.stringify([{ "model": "app.mdl", "pk": 1, "fields": { "name": "test", "rank": 1 } }]);
  beforeEach(async () => {

    const fackTeacherService: Partial<TeacherService> = {

      findTeacherByTeacherEmail: (email: string) => Promise.resolve({ id: 1, email: 'dhana@gmail.com' } as Teacher),
      findStudentByStudentEmail: (email: string) => Promise.resolve({ id: 10, email: 'dhanan@gmail.com', teacherId: 1, suspend: false } as Student),
      createStudent: ({ teacher: string, students: [] }) => Promise.resolve({ teacher: 'Dhana', students: ['sdfdsf'], message: "fdgfdg" } as TeacherStudentResponse),
      findStudentByTeacherEmail: (email: string[]) => Promise.resolve({ students: ['dhana@gmail.com'] } as StudentDto)
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherService, {
        provide: getRepositoryToken(Teacher),
        useValue: {
          create: jest.fn(),
          save: jest.fn(),
          findOne: jest.fn(),
          createQueryBuilder: jest.fn(() => ({
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            distinct: jest.fn().mockReturnThis(),
            setParameter: jest.fn().mockReturnThis(),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockReturnThis(),
            getSql: jest.fn().mockReturnThis(),
            success: function (data) {
              console.log(data);
              data.forEach(function (element) {
                console.log(element);
              });
            }
          })),
        },
        useFactory: mockRepositoryFactory,
      }, StudentService, {
          provide: getRepositoryToken(Student),
          useValue: { get: jest.fn().mockReturnValue(new Student()) },
          useFactory: mockRepositoryFactory,
        },],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
    teacherRepository = module.get<Repository<Teacher>>(getRepositoryToken(Teacher));
    studentRepositoty = module.get<Repository<Student>>(getRepositoryToken(Student));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Create Student', async () => {

    const expectedStudentResult = new TeacherStudentResponse();
    expectedStudentResult.message = 'Student created ';
    expectedStudentResult.students = ['dhana@gmail.com'];
    expectedStudentResult.teacher = 'teacher@gmail.com';

    jest.spyOn(service, "createStudent").mockResolvedValue(expectedStudentResult);

    const teacherStudentResponse = service.createStudent({ teacher: 'eacher@gmail.com', students: ['dhana@gmail.com'] });

    expect((await teacherStudentResponse).teacher).toEqual('teacher@gmail.com')

  })


  it('Find Student By Teacher Email', async () => {
    const expectedStudentResult = new StudentDto();
    expectedStudentResult.students = ['dhana@gmail.com'];
    const expectedResult = [{ id: 1, email: 'dhana@gmail.com', students: [] }];

    jest.spyOn(service, "findStudentByTeacherEmail").mockResolvedValue(expectedStudentResult);


    const studentDto = service.findStudentByTeacherEmail(['dhana@gmail.com']);

    expect((await studentDto).students[0]).toEqual('dhana@gmail.com')


  });
});