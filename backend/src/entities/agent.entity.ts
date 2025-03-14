import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';

export enum AgentPersonality {
  DEMANDING = 'demanding',
  SUPPORTIVE = 'supportive',
  ANALYTICAL = 'analytical',
  CREATIVE = 'creative',
  CHALLENGING = 'challenging',
}

export enum ProblemCategory {
  TECHNOLOGY = 'technology',
  AUTOMATION = 'automation',
  PROCESS_IMPROVEMENT = 'process_improvement',
  INNOVATION = 'innovation',
  SOCIAL = 'social',
}

@Entity()
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: AgentPersonality,
    default: AgentPersonality.SUPPORTIVE,
  })
  personality: AgentPersonality;

  @Column({
    type: 'enum',
    enum: ProblemCategory,
    default: ProblemCategory.TECHNOLOGY,
  })
  problemCategory: ProblemCategory;

  @Column({ type: 'text' })
  problemStatement: string;

  @Column({ type: 'text', array: true, default: '{}' })
  requiredDeliverables: string[];

  @Column({ type: 'json', default: '{}' })
  personalityTraits: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Project, (project) => project.agent)
  projects: Project[];
}
