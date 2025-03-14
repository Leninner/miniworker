import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import {
  CreateCourseDto,
  UpdateCourseDto,
  CreateCourseGroupDto,
  UpdateCourseGroupDto,
  EnrollStudentDto,
  EnrollStudentsDto,
} from './course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async create(@Request() req, @Body() createCourseDto: CreateCourseDto) {
    // Use the authenticated user's ID as the professor ID
    return this.courseService.create(createCourseDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req, @Query('role') role?: string) {
    if (role === 'professor' && req.user.role === UserRole.PROFESSOR) {
      return this.courseService.findByProfessor(req.user.id);
    } else if (role === 'student' && req.user.role === UserRole.STUDENT) {
      return this.courseService.findByStudent(req.user.id);
    } else if (req.user.role === UserRole.ADMIN) {
      return this.courseService.findAll();
    } else {
      // Default behavior based on user role
      if (req.user.role === UserRole.PROFESSOR) {
        return this.courseService.findByProfessor(req.user.id);
      } else if (req.user.role === UserRole.STUDENT) {
        return this.courseService.findByStudent(req.user.id);
      } else {
        return this.courseService.findAll();
      }
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Request() req) {
    const course = await this.courseService.findOne(id);

    // Check if the user has access to this course
    if (
      req.user.role !== UserRole.ADMIN &&
      req.user.role === UserRole.PROFESSOR &&
      course.professorId !== req.user.id &&
      req.user.role === UserRole.STUDENT &&
      !course.students.some((s) => s.id === req.user.id)
    ) {
      throw new BadRequestException('You do not have access to this course');
    }

    return course;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    // Check if the user is the professor of this course or an admin
    const course = await this.courseService.findOne(id);
    if (
      req.user.role === UserRole.PROFESSOR &&
      course.professorId !== req.user.id
    ) {
      throw new BadRequestException('You can only update your own courses');
    }

    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async remove(@Request() req, @Param('id') id: string) {
    // Check if the user is the professor of this course or an admin
    const course = await this.courseService.findOne(id);
    if (
      req.user.role === UserRole.PROFESSOR &&
      course.professorId !== req.user.id
    ) {
      throw new BadRequestException('You can only delete your own courses');
    }

    return this.courseService.remove(id);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async enrollSelf(@Request() req, @Param('id') id: string) {
    // Enroll the authenticated student
    return this.courseService.enrollStudent(id, req.user.id);
  }

  @Post(':id/enroll-student')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async enrollStudent(
    @Request() req,
    @Param('id') id: string,
    @Body() enrollStudentDto: EnrollStudentDto,
  ) {
    // Check if the user is the professor of this course or an admin
    const course = await this.courseService.findOne(id);
    if (
      req.user.role === UserRole.PROFESSOR &&
      course.professorId !== req.user.id
    ) {
      throw new BadRequestException(
        'You can only enroll students in your own courses',
      );
    }

    return this.courseService.enrollStudent(id, enrollStudentDto.studentId);
  }

  @Post(':id/enroll-students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async enrollStudents(
    @Request() req,
    @Param('id') id: string,
    @Body() enrollStudentsDto: EnrollStudentsDto,
  ) {
    // Check if the user is the professor of this course or an admin
    const course = await this.courseService.findOne(id);
    if (
      req.user.role === UserRole.PROFESSOR &&
      course.professorId !== req.user.id
    ) {
      throw new BadRequestException(
        'You can only enroll students in your own courses',
      );
    }

    return this.courseService.enrollStudents(id, enrollStudentsDto.studentIds);
  }

  @Delete(':id/students/:studentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async removeStudent(
    @Request() req,
    @Param('id') id: string,
    @Param('studentId') studentId: string,
  ) {
    // Check if the user is the professor of this course or an admin
    const course = await this.courseService.findOne(id);
    if (
      req.user.role === UserRole.PROFESSOR &&
      course.professorId !== req.user.id
    ) {
      throw new BadRequestException(
        'You can only remove students from your own courses',
      );
    }

    return this.courseService.removeStudent(id, studentId);
  }

  @Get(':id/qr-code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async generateQRCode(@Request() req, @Param('id') id: string) {
    // Check if the user is the professor of this course or an admin
    const course = await this.courseService.findOne(id);
    if (
      req.user.role === UserRole.PROFESSOR &&
      course.professorId !== req.user.id
    ) {
      throw new BadRequestException(
        'You can only generate QR codes for your own courses',
      );
    }

    return this.courseService.generateQRCode(id);
  }

  // Group endpoints
  @Post('groups')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async createGroup(
    @Request() req,
    @Body() createGroupDto: CreateCourseGroupDto,
  ) {
    // Check if the user is the professor of this course or an admin
    const course = await this.courseService.findOne(createGroupDto.courseId);
    if (
      req.user.role === UserRole.PROFESSOR &&
      course.professorId !== req.user.id
    ) {
      throw new BadRequestException(
        'You can only create groups in your own courses',
      );
    }

    return this.courseService.createGroup(createGroupDto);
  }

  @Get(':id/groups')
  @UseGuards(JwtAuthGuard)
  async findAllGroups(@Request() req, @Param('id') id: string) {
    const course = await this.courseService.findOne(id);

    // Check if the user has access to this course
    if (
      req.user.role !== UserRole.ADMIN &&
      req.user.role === UserRole.PROFESSOR &&
      course.professorId !== req.user.id &&
      req.user.role === UserRole.STUDENT &&
      !course.students.some((s) => s.id === req.user.id)
    ) {
      throw new BadRequestException('You do not have access to this course');
    }

    return this.courseService.findAllGroups(id);
  }

  @Get('groups/:id')
  @UseGuards(JwtAuthGuard)
  async findOneGroup(@Request() req, @Param('id') id: string) {
    const group = await this.courseService.findOneGroup(id);
    const course = await this.courseService.findOne(group.courseId);

    // Check if the user has access to this course
    if (
      req.user.role !== UserRole.ADMIN &&
      req.user.role === UserRole.PROFESSOR &&
      course.professorId !== req.user.id &&
      req.user.role === UserRole.STUDENT &&
      !course.students.some((s) => s.id === req.user.id)
    ) {
      throw new BadRequestException('You do not have access to this group');
    }

    return group;
  }

  @Patch('groups/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async updateGroup(
    @Request() req,
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateCourseGroupDto,
  ) {
    const group = await this.courseService.findOneGroup(id);
    const course = await this.courseService.findOne(group.courseId);

    // Check if the user is the professor of this course or an admin
    if (
      req.user.role === UserRole.PROFESSOR &&
      course.professorId !== req.user.id
    ) {
      throw new BadRequestException(
        'You can only update groups in your own courses',
      );
    }

    return this.courseService.updateGroup(id, updateGroupDto);
  }

  @Delete('groups/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async removeGroup(@Request() req, @Param('id') id: string) {
    const group = await this.courseService.findOneGroup(id);
    const course = await this.courseService.findOne(group.courseId);

    // Check if the user is the professor of this course or an admin
    if (
      req.user.role === UserRole.PROFESSOR &&
      course.professorId !== req.user.id
    ) {
      throw new BadRequestException(
        'You can only delete groups in your own courses',
      );
    }

    return this.courseService.removeGroup(id);
  }

  @Delete('groups/:id/students/:studentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR, UserRole.ADMIN)
  async removeStudentFromGroup(
    @Request() req,
    @Param('id') id: string,
    @Param('studentId') studentId: string,
  ) {
    const group = await this.courseService.findOneGroup(id);
    const course = await this.courseService.findOne(group.courseId);

    // Check if the user is the professor of this course or an admin
    if (
      req.user.role === UserRole.PROFESSOR &&
      course.professorId !== req.user.id
    ) {
      throw new BadRequestException(
        'You can only remove students from groups in your own courses',
      );
    }

    return this.courseService.removeStudentFromGroup(id, studentId);
  }
}
