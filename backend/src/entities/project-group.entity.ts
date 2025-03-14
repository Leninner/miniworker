import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

export enum GroupType {
  INDIVIDUAL = 'individual',
  TEAM = 'team',
}

@Entity()
export class ProjectGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: GroupType,
    default: GroupType.TEAM,
  })
  type: GroupType;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable({
    name: 'group_members',
    joinColumn: { name: 'groupId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  members: User[];

  // Manager/owner of the group (typically a professor)
  @ManyToOne(() => User, (user) => user.managedGroups)
  @JoinColumn({ name: 'managerId' })
  manager: User;

  @Column()
  managerId: string;

  // Projects associated with this group
  @OneToMany(() => Project, (project) => project.group)
  projects: Project[];
}
