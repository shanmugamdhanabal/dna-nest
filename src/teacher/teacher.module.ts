import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { Student } from 'src/student/student.entity';
import { Teacher } from './teacher.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Student, Teacher])],
  providers: [TeacherService],
  controllers: [TeacherController]
})
export class TeacherModule { }
