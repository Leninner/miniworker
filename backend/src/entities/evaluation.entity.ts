import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { User } from './user.entity';

export enum EvaluationStatus {
  DRAFT = 'draft',
  COMPLETED = 'completed',
}

export enum EvaluationType {
  INDIVIDUAL = 'individual',
  GROUP = 'group',
}

@Entity('evaluations')
export class Evaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'uuid', nullable: true })
  studentId: string;

  @Column({
    type: 'enum',
    enum: EvaluationType,
    default: EvaluationType.INDIVIDUAL,
  })
  type: EvaluationType;

  @Column({ type: 'jsonb' })
  criteria: {
    // Common criteria for both individual and group projects
    technicalSkills: number;
    problemSolving: number;
    creativity: number;
    deliveryQuality: number;

    // Individual-specific criteria
    communication?: number;
    projectManagement?: number;
    adaptability?: number;

    // Group-specific criteria
    teamwork?: number;
    collaboration?: number;
    rolePerformance?: number;
    conflictResolution?: number;
    leadershipContribution?: number;
  };

  @Column({ type: 'text' })
  comments: string;

  @Column({ type: 'text', nullable: true })
  recommendationsForImprovement: string;

  // For group evaluations, can store individual contributions
  @Column({ type: 'jsonb', nullable: true })
  memberContributions?: {
    [memberId: string]: {
      contribution: number; // Percentage 0-100
      notes: string;
    };
  };

  @Column({
    type: 'enum',
    enum: EvaluationStatus,
    default: EvaluationStatus.DRAFT,
  })
  status: EvaluationStatus;

  @Column({ nullable: true })
  evaluator: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Project, (project) => project.evaluations)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => User, (user) => user.evaluations)
  @JoinColumn({ name: 'studentId' })
  student: User;
}
