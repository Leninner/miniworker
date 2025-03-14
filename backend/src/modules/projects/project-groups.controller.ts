import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { ProjectGroupsService } from './project-groups.service';
import { GroupType } from '../../entities/project-group.entity';

@Controller('project-groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectGroupsController {
  constructor(private readonly projectGroupsService: ProjectGroupsService) {}

  // Get all groups - only available to professors and admins
  @Get()
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async findAll() {
    return this.projectGroupsService.findAll();
  }

  // Get groups by manager id
  @Get('by-manager/:managerId')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async findByManager(@Param('managerId') managerId: string) {
    return this.projectGroupsService.findByManager(managerId);
  }

  // Get current user's managed groups
  @Get('my-managed-groups')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async findMyManagedGroups(@Request() req) {
    return this.projectGroupsService.findByManager(req.user.id);
  }

  // Get a specific group
  @Get(':id')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN, UserRole.STUDENT)
  async findOne(@Param('id') id: string, @Request() req) {
    const group = await this.projectGroupsService.findOne(id);

    // Check if user has access to this group
    const isManager = group.managerId === req.user.id;
    const isMember = group.members.some((member) => member.id === req.user.id);
    const isAdmin = req.user.role === UserRole.ADMIN;

    if (!isManager && !isMember && !isAdmin) {
      throw new ForbiddenException('You do not have access to this group');
    }

    return group;
  }

  // Create a new group
  @Post()
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async create(
    @Body()
    createGroupDto: {
      name: string;
      description?: string;
      type: GroupType;
      memberIds?: string[];
    },
    @Request() req,
  ) {
    return this.projectGroupsService.create(req.user.id, createGroupDto);
  }

  // Update a group
  @Put(':id')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body()
    updateGroupDto: {
      name?: string;
      description?: string;
      type?: GroupType;
      isActive?: boolean;
      memberIds?: string[];
    },
    @Request() req,
  ) {
    const group = await this.projectGroupsService.findOne(id);

    // Check if user is the manager of this group or an admin
    if (group.managerId !== req.user.id && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to update this group',
      );
    }

    return this.projectGroupsService.update(id, updateGroupDto);
  }

  // Add a member to a group
  @Put(':groupId/members/:userId')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async addMember(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Request() req,
  ) {
    const group = await this.projectGroupsService.findOne(groupId);

    // Check if user is the manager of this group or an admin
    if (group.managerId !== req.user.id && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to update this group',
      );
    }

    return this.projectGroupsService.addMember(groupId, userId);
  }

  // Remove a member from a group
  @Delete(':groupId/members/:userId')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async removeMember(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Request() req,
  ) {
    const group = await this.projectGroupsService.findOne(groupId);

    // Check if user is the manager of this group or an admin
    if (group.managerId !== req.user.id && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to update this group',
      );
    }

    return this.projectGroupsService.removeMember(groupId, userId);
  }

  // Assign a project to a group
  @Put(':groupId/projects/:projectId')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async assignProjectToGroup(
    @Param('groupId') groupId: string,
    @Param('projectId') projectId: string,
    @Request() req,
  ) {
    const group = await this.projectGroupsService.findOne(groupId);

    // Check if user is the manager of this group or an admin
    if (group.managerId !== req.user.id && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to update this group',
      );
    }

    return this.projectGroupsService.assignProjectToGroup(groupId, projectId);
  }

  // Delete a group
  @Delete(':id')
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async delete(@Param('id') id: string, @Request() req) {
    const group = await this.projectGroupsService.findOne(id);

    // Check if user is the manager of this group or an admin
    if (group.managerId !== req.user.id && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to delete this group',
      );
    }

    await this.projectGroupsService.delete(id);
    return { message: 'Group deleted successfully' };
  }
}
