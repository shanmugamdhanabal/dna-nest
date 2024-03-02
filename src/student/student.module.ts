import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from './student.entity';
import { Teacher } from 'src/teacher/teacher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Teacher])],
  providers: [StudentService],
  controllers: [StudentController]
})
export class StudentModule { }
