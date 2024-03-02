import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModule } from './student/student.module';
import { Student } from './student/student.entity';
import { TeacherModule } from './teacher/teacher.module';
import { Teacher } from './teacher/teacher.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/sql',
      synchronize: true,
      entities: [Student, Teacher]
    }),
    StudentModule,
    TeacherModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
