import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from '../../entities/project.entity';
import { User, UserRole } from '../../entities/user.entity';
import { Agent } from '../../entities/agent.entity';
import { ProjectGroup } from '../../entities/project-group.entity';
import { In } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    @InjectRepository(ProjectGroup)
    private projectGroupRepository: Repository<ProjectGroup>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['student', 'professor', 'agent', 'milestones', 'group'],
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: [
        'student',
        'professor',
        'agent',
        'milestones',
        'group',
        'group.members',
      ],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async findByStudent(studentId: string): Promise<Project[]> {
    const user = await this.userRepository.findOne({
      where: { id: studentId },
      relations: ['groups'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${studentId} not found`);
    }

    // Get both individual projects and group projects for this student
    const individualProjects = await this.projectRepository.find({
      where: { studentId },
      relations: ['professor', 'agent', 'milestones'],
    });

    // If user is part of any groups, get those group projects too
    let groupProjects: Project[] = [];
    if (user.groups && user.groups.length > 0) {
      const groupIds = user.groups.map((group) => group.id);
      groupProjects = await this.projectRepository.find({
        where: {
          groupId: In(groupIds),
          isGroupProject: true,
        },
        relations: ['professor', 'agent', 'milestones', 'group'],
      });
    }

    return [...individualProjects, ...groupProjects];
  }

  async findByProfessor(professorId: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: { professorId },
      relations: ['student', 'agent', 'milestones', 'group', 'group.members'],
    });
  }

  async create(createProjectDto: {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    requirements?: Record<string, any>;
    studentId?: string;
    professorId: string;
    agentId: string;
    groupId?: string;
  }): Promise<Project> {
    // Check if we're creating a group project or individual project
    if (createProjectDto.groupId && createProjectDto.studentId) {
      throw new BadRequestException(
        'A project can be assigned to either a group or a student, not both',
      );
    }

    const agent = await this.agentRepository.findOne({
      where: { id: createProjectDto.agentId },
    });

    if (!agent) {
      throw new NotFoundException(
        `Agent with ID ${createProjectDto.agentId} not found`,
      );
    }

    const professor = await this.userRepository.findOne({
      where: { id: createProjectDto.professorId },
    });

    if (!professor) {
      throw new NotFoundException(
        `Professor with ID ${createProjectDto.professorId} not found`,
      );
    }

    if (professor.role !== UserRole.PROFESSOR) {
      throw new BadRequestException('The specified user is not a professor');
    }

    // If it's a group project
    if (createProjectDto.groupId) {
      const group = await this.projectGroupRepository.findOne({
        where: { id: createProjectDto.groupId },
      });

      if (!group) {
        throw new NotFoundException(
          `Group with ID ${createProjectDto.groupId} not found`,
        );
      }

      // Create a new project with proper type
      const projectData = {
        ...createProjectDto,
        isGroupProject: true,
        studentId: undefined as string | undefined,
      };

      const newProject = this.projectRepository.create(projectData);
      return this.projectRepository.save(newProject);
    }

    // It's an individual project
    if (createProjectDto.studentId) {
      const student = await this.userRepository.findOne({
        where: { id: createProjectDto.studentId },
      });

      if (!student) {
        throw new NotFoundException(
          `Student with ID ${createProjectDto.studentId} not found`,
        );
      }

      if (student.role !== UserRole.STUDENT) {
        throw new BadRequestException('The specified user is not a student');
      }

      const newProject = this.projectRepository.create({
        ...createProjectDto,
        isGroupProject: false,
      });

      return this.projectRepository.save(newProject);
    }

    // We need either a studentId or a groupId
    throw new BadRequestException(
      'Either studentId or groupId must be provided',
    );
  }

  async update(
    id: string,
    updateProjectDto: {
      title?: string;
      description?: string;
      status?: ProjectStatus;
      startDate?: Date;
      endDate?: Date;
      requirements?: Record<string, any>;
      feedback?: Record<string, any>;
      studentId?: string | undefined;
      professorId?: string;
      agentId?: string;
      groupId?: string | undefined;
      isGroupProject?: boolean;
    },
  ): Promise<Project> {
    let project = await this.findOne(id);

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Update basic properties
    if (updateProjectDto.title) project.title = updateProjectDto.title;
    if (updateProjectDto.description)
      project.description = updateProjectDto.description;
    if (updateProjectDto.status) project.status = updateProjectDto.status;
    if (updateProjectDto.startDate)
      project.startDate = updateProjectDto.startDate;
    if (updateProjectDto.endDate) project.endDate = updateProjectDto.endDate;
    if (updateProjectDto.requirements)
      project.requirements = updateProjectDto.requirements;
    if (updateProjectDto.feedback) project.feedback = updateProjectDto.feedback;

    // Handle changes to group/student assignment
    if (updateProjectDto.isGroupProject !== undefined) {
      project.isGroupProject = updateProjectDto.isGroupProject;

      // If converting from individual to group project
      if (
        updateProjectDto.isGroupProject === true &&
        updateProjectDto.groupId
      ) {
        const group = await this.projectGroupRepository.findOne({
          where: { id: updateProjectDto.groupId },
        });

        if (!group) {
          throw new NotFoundException(
            `Group with ID ${updateProjectDto.groupId} not found`,
          );
        }

        project.group = group;
        project.groupId = updateProjectDto.groupId;

        // Use a direct SQL query to set studentId to NULL
        await this.projectRepository.query(
          `UPDATE project SET "studentId" = NULL WHERE id = $1`,
          [id],
        );

        // Reload the project
        project = (await this.projectRepository.findOne({
          where: { id },
          relations: ['group', 'agent', 'professor'],
        })) as Project;

        if (!project) {
          throw new NotFoundException(
            `Project with ID ${id} not found after update`,
          );
        }
      }
      // If converting from group to individual project
      else if (
        updateProjectDto.isGroupProject === false &&
        updateProjectDto.studentId
      ) {
        const student = await this.userRepository.findOne({
          where: { id: updateProjectDto.studentId },
        });

        if (!student) {
          throw new NotFoundException(
            `Student with ID ${updateProjectDto.studentId} not found`,
          );
        }

        if (student.role !== UserRole.STUDENT) {
          throw new BadRequestException('The specified user is not a student');
        }

        project.student = student;
        project.studentId = updateProjectDto.studentId;

        // Use a direct SQL query to set groupId to NULL
        await this.projectRepository.query(
          `UPDATE project SET "groupId" = NULL WHERE id = $1`,
          [id],
        );

        // Reload the project
        project = (await this.projectRepository.findOne({
          where: { id },
          relations: ['student', 'agent', 'professor'],
        })) as Project;

        if (!project) {
          throw new NotFoundException(
            `Project with ID ${id} not found after update`,
          );
        }
      }
    }

    // Check if we're updating a professor assignment
    if (
      updateProjectDto.professorId &&
      updateProjectDto.professorId !== project.professorId
    ) {
      const professor = await this.userRepository.findOne({
        where: { id: updateProjectDto.professorId },
      });

      if (!professor) {
        throw new NotFoundException(
          `Professor with ID ${updateProjectDto.professorId} not found`,
        );
      }

      if (professor.role !== UserRole.PROFESSOR) {
        throw new BadRequestException('The specified user is not a professor');
      }

      project.professor = professor;
      project.professorId = updateProjectDto.professorId;
    }

    // Check if we're updating an agent assignment
    if (
      updateProjectDto.agentId &&
      updateProjectDto.agentId !== project.agentId
    ) {
      const agent = await this.agentRepository.findOne({
        where: { id: updateProjectDto.agentId },
      });

      if (!agent) {
        throw new NotFoundException(
          `Agent with ID ${updateProjectDto.agentId} not found`,
        );
      }

      project.agent = agent;
      project.agentId = updateProjectDto.agentId;
    }

    return this.projectRepository.save(project);
  }

  async delete(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }
}
