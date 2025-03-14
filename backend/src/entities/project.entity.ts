import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Agent } from './agent.entity';
import { Milestone } from './milestone.entity';
import { Evaluation } from './evaluation.entity';
import { ProjectGroup } from './project-group.entity';

export enum ProjectStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PENDING,
  })
  status: ProjectStatus;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'json', default: '{}' })
  requirements: Record<string, any>;

  @Column({ type: 'json', default: '{}' })
  feedback: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.studentProjects, { nullable: true })
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Column({ nullable: true })
  studentId: string;

  @ManyToOne(() => User, (user) => user.professorProjects)
  @JoinColumn({ name: 'professorId' })
  professor: User;

  @Column()
  professorId: string;

  @ManyToOne(() => Agent, (agent) => agent.projects)
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @Column()
  agentId: string;

  @ManyToOne(() => ProjectGroup, (group) => group.projects, { nullable: true })
  @JoinColumn({ name: 'groupId' })
  group: ProjectGroup;

  @Column({ nullable: true })
  groupId: string;

  @Column({ default: false })
  isGroupProject: boolean;

  @OneToMany(() => Milestone, (milestone) => milestone.project, {
    cascade: true,
  })
  milestones: Milestone[];

  @OneToMany(() => Evaluation, (evaluation) => evaluation.project)
  evaluations: Evaluation[];
}
