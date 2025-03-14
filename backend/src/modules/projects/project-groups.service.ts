import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectGroup, GroupType } from '../../entities/project-group.entity';
import { User, UserRole } from '../../entities/user.entity';
import { Project } from '../../entities/project.entity';

@Injectable()
export class ProjectGroupsService {
  constructor(
    @InjectRepository(ProjectGroup)
    private projectGroupRepository: Repository<ProjectGroup>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<ProjectGroup[]> {
    return this.projectGroupRepository.find({
      relations: ['members', 'manager', 'projects'],
    });
  }

  async findByManager(managerId: string): Promise<ProjectGroup[]> {
    return this.projectGroupRepository.find({
      where: { managerId },
      relations: ['members', 'projects'],
    });
  }

  async findOne(id: string): Promise<ProjectGroup> {
    const group = await this.projectGroupRepository.findOne({
      where: { id },
      relations: ['members', 'manager', 'projects'],
    });

    if (!group) {
      throw new NotFoundException(`Project group with ID ${id} not found`);
    }

    return group;
  }

  async create(
    managerId: string,
    createGroupDto: {
      name: string;
      description?: string;
      type: GroupType;
      memberIds?: string[];
    },
  ): Promise<ProjectGroup> {
    // Check if manager exists and is a professor or admin
    const manager = await this.userRepository.findOne({
      where: { id: managerId },
    });

    if (!manager) {
      throw new NotFoundException(`User with ID ${managerId} not found`);
    }

    if (
      manager.role !== UserRole.PROFESSOR &&
      manager.role !== UserRole.ADMIN
    ) {
      throw new BadRequestException(
        'Only professors and admins can create project groups',
      );
    }

    // Create new project group
    const newGroup = this.projectGroupRepository.create({
      ...createGroupDto,
      managerId,
    });

    // Add members if provided
    if (createGroupDto.memberIds && createGroupDto.memberIds.length > 0) {
      const members = await this.userRepository.findByIds(
        createGroupDto.memberIds,
      );
      newGroup.members = members;
    }

    return this.projectGroupRepository.save(newGroup);
  }

  async update(
    id: string,
    updateGroupDto: {
      name?: string;
      description?: string;
      type?: GroupType;
      isActive?: boolean;
      memberIds?: string[];
    },
  ): Promise<ProjectGroup> {
    const group = await this.findOne(id);

    // Update basic properties
    if (updateGroupDto.name) group.name = updateGroupDto.name;
    if (updateGroupDto.description !== undefined)
      group.description = updateGroupDto.description;
    if (updateGroupDto.type) group.type = updateGroupDto.type;
    if (updateGroupDto.isActive !== undefined)
      group.isActive = updateGroupDto.isActive;

    // Update members if provided
    if (updateGroupDto.memberIds) {
      const members = await this.userRepository.findByIds(
        updateGroupDto.memberIds,
      );
      group.members = members;
    }

    return this.projectGroupRepository.save(group);
  }

  async addMember(groupId: string, userId: string): Promise<ProjectGroup> {
    const group = await this.findOne(groupId);
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if user is already in the group
    const isAlreadyMember = group.members.some(
      (member) => member.id === userId,
    );

    if (!isAlreadyMember) {
      group.members.push(user);
      await this.projectGroupRepository.save(group);
    }

    return group;
  }

  async removeMember(groupId: string, userId: string): Promise<ProjectGroup> {
    const group = await this.findOne(groupId);

    group.members = group.members.filter((member) => member.id !== userId);
    return this.projectGroupRepository.save(group);
  }

  async assignProjectToGroup(
    groupId: string,
    projectId: string,
  ): Promise<Project> {
    const group = await this.findOne(groupId);
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Update project to be a group project
    project.isGroupProject = true;
    project.groupId = groupId;
    project.group = group;

    // If it was an individual project before, clear the student association
    if (project.studentId) {
      // Use SQL query to update directly to avoid TypeScript type issues
      await this.projectRepository.query(
        `UPDATE project SET "studentId" = NULL WHERE id = $1`,
        [projectId],
      );

      // Reload the project after the direct update
      const updatedProject = await this.projectRepository.findOne({
        where: { id: projectId },
        relations: ['group'],
      });

      if (!updatedProject) {
        throw new NotFoundException(
          `Project with ID ${projectId} not found after update`,
        );
      }

      return updatedProject;
    }

    return this.projectRepository.save(project);
  }

  async delete(id: string): Promise<void> {
    const group = await this.findOne(id);

    // Check if there are any active projects associated with this group
    if (group.projects && group.projects.length > 0) {
      throw new BadRequestException(
        'Cannot delete a group that has associated projects',
      );
    }

    await this.projectGroupRepository.remove(group);
  }
}
