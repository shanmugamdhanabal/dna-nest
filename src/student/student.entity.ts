import { Teacher } from "../teacher/teacher.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity('students')
export class Student {


    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200, nullable: false })
    email: string;

    @Column({ nullable: false })
    teacherId: number;

    @Column({ default: false, nullable: false })
    suspend: boolean;

    @ManyToOne(() => Teacher, (teacher) => teacher.student)
    teacher: Teacher

}