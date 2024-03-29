import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentService {

    constructor(
        @InjectRepository(Student)
        private readonly teacherRepository: Repository<Student>) {

    }

}
