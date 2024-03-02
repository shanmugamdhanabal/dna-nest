import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from './teacher.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';
import { StudentService } from '../student/student.service';
import { Student } from '../student/student.entity';
describe('TeacherService', () => {
  let service: TeacherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherService, {
        provide: getRepositoryToken(Teacher),
        useValue: { get: jest.fn().mockResolvedValue(new Teacher()) }
      }, StudentService, {
          provide: getRepositoryToken(Student),
          useValue: { get: jest.fn().mockReturnValue(new Student()) }
        },],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
