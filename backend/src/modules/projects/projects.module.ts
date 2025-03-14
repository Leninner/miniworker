import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';
import { Agent } from '../../entities/agent.entity';
import { Milestone } from '../../entities/milestone.entity';
import { ProjectGroup } from '../../entities/project-group.entity';
import { ProjectGroupsService } from './project-groups.service';
import { ProjectGroupsController } from './project-groups.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User, Agent, Milestone, ProjectGroup]),
  ],
  controllers: [ProjectsController, ProjectGroupsController],
  providers: [ProjectsService, ProjectGroupsService],
  exports: [ProjectsService, ProjectGroupsService],
})
export class ProjectsModule {}
