import { Entity, PrimaryGeneratedColumn, Column, OneToMany, TableInheritance, JoinColumn } from "typeorm";
import { Student } from '../student/student.entity';

@Entity('teacher')
export class Teacher {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 200, nullable: false })
    email: string;


    @OneToMany(() => Student, (student) => student.teacher)
    @JoinColumn()
    student: Student[]

}