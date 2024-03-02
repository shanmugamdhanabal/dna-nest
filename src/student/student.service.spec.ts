import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { TeacherService } from '../teacher/teacher.service';
import { Student } from './student.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
describe('StudentService', () => {
  let service: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentService,
        {
          provide: getRepositoryToken(Student),
          useValue: { get: jest.fn().mockReturnValue(new Student()) }
        },],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


});
