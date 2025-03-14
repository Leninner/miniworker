import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Project } from './project.entity';
import { Evaluation } from './evaluation.entity';
import { ProjectGroup } from './project-group.entity';
import { Course } from './course.entity';

export enum UserRole {
  ADMIN = 'admin',
  PROFESSOR = 'professor',
  STUDENT = 'student',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Project, (project) => project.student)
  studentProjects: Project[];

  @OneToMany(() => Project, (project) => project.professor)
  professorProjects: Project[];

  @OneToMany(() => Evaluation, (evaluation) => evaluation.studentId)
  evaluations: Evaluation[];

  // New relationship with ProjectGroup
  @ManyToMany(() => ProjectGroup, (group) => group.members)
  groups: ProjectGroup[];

  // Projects where user is a member via groups
  @ManyToMany(() => Project)
  @JoinTable({
    name: 'user_group_projects',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'projectId', referencedColumnName: 'id' },
  })
  groupProjects: Project[];

  // New relation for groups managed by this user (if professor)
  @OneToMany(() => ProjectGroup, (group) => group.manager)
  managedGroups: ProjectGroup[];

  // Courses created by this user (if professor)
  @OneToMany(() => Course, (course) => course.professor)
  createdCourses: Course[];

  // Courses where this user is enrolled (if student)
  @ManyToMany(() => Course, (course) => course.students)
  enrolledCourses: Course[];

  // Helper properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
