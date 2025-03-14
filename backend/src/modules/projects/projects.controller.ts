import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request as NestRequest,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

// Define DTOs para una mejor verificación de tipos
interface CreateProjectDto {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  requirements?: Record<string, any>;
  studentId?: string;
  professorId?: string;
  agentId: string;
  groupId?: string;
}

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  @Get('student/:studentId')
  async findByStudent(@Param('studentId') studentId: string) {
    return this.projectsService.findByStudent(studentId);
  }

  @Get('professor/:professorId')
  async findByProfessor(@Param('professorId') professorId: string) {
    return this.projectsService.findByProfessor(professorId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findOne(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @NestRequest() req: RequestWithUser,
  ) {
    // Asegurarse de que todos los campos requeridos estén presentes
    if (
      !createProjectDto.title ||
      !createProjectDto.description ||
      !createProjectDto.startDate ||
      !createProjectDto.endDate ||
      !createProjectDto.agentId
    ) {
      throw new Error('Missing required project fields');
    }

    return this.projectsService.create({
      ...createProjectDto,
      professorId: createProjectDto.professorId || req.user.userId,
    });
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: Partial<CreateProjectDto>,
  ) {
    const updated = await this.projectsService.update(id, updateProjectDto);
    if (!updated) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.PROFESSOR)
  async remove(@Param('id') id: string) {
    await this.projectsService.delete(id);
    return { message: 'Project deleted successfully' };
  }
}
