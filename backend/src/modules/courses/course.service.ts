import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Course, CourseGroup } from '../../entities/course.entity';
import { User, UserRole } from '../../entities/user.entity';
import {
  CreateCourseDto,
  UpdateCourseDto,
  CreateCourseGroupDto,
  UpdateCourseGroupDto,
  QRCodeResponseDto,
} from './course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(CourseGroup)
    private courseGroupRepository: Repository<CourseGroup>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    professorId: string,
  ): Promise<Course> {
    // Check if course with this code already exists
    const existingCourse = await this.courseRepository.findOne({
      where: { code: createCourseDto.code },
    });

    if (existingCourse) {
      throw new ConflictException('Course with this code already exists');
    }

    // Check if the professor exists
    const professor = await this.userRepository.findOne({
      where: { id: professorId, role: UserRole.PROFESSOR },
    });

    if (!professor) {
      throw new NotFoundException(
        `Professor with ID "${professorId}" not found`,
      );
    }

    // Create the course
    const course = this.courseRepository.create({
      ...createCourseDto,
      professorId,
    });

    return this.courseRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find({
      relations: ['professor', 'students'],
    });
  }

  async findByProfessor(professorId: string): Promise<Course[]> {
    return this.courseRepository.find({
      where: { professorId },
      relations: ['students'],
    });
  }

  async findByStudent(studentId: string): Promise<Course[]> {
    const student = await this.userRepository.findOne({
      where: { id: studentId },
      relations: ['enrolledCourses'],
    });

    if (!student) {
      throw new NotFoundException(`Student with ID "${studentId}" not found`);
    }

    return student.enrolledCourses;
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['professor', 'students', 'groups', 'groups.students'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);

    // If code is being updated, check if it's unique
    if (updateCourseDto.code && updateCourseDto.code !== course.code) {
      const existingCourse = await this.courseRepository.findOne({
        where: { code: updateCourseDto.code },
      });

      if (existingCourse) {
        throw new ConflictException('Course with this code already exists');
      }
    }

    // Update the fields
    Object.assign(course, updateCourseDto);

    return this.courseRepository.save(course);
  }

  async remove(id: string): Promise<void> {
    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }
  }

  async enrollStudent(courseId: string, studentId: string): Promise<Course> {
    const course = await this.findOne(courseId);

    // Check if the student exists
    const student = await this.userRepository.findOne({
      where: { id: studentId, role: UserRole.STUDENT },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID "${studentId}" not found`);
    }

    // Check if the student is already enrolled
    const isEnrolled = course.students.some((s) => s.id === studentId);
    if (isEnrolled) {
      throw new ConflictException('Student is already enrolled in this course');
    }

    // Enroll the student
    course.students.push(student);
    return this.courseRepository.save(course);
  }

  async enrollStudents(
    courseId: string,
    studentIds: string[],
  ): Promise<Course> {
    const course = await this.findOne(courseId);

    // Check if the students exist
    const students = await this.userRepository.find({
      where: { id: In(studentIds), role: UserRole.STUDENT },
    });

    if (students.length !== studentIds.length) {
      throw new NotFoundException('One or more students not found');
    }

    // Filter out students who are already enrolled
    const enrolledStudentIds = course.students.map((s) => s.id);
    const newStudents = students.filter(
      (s) => !enrolledStudentIds.includes(s.id),
    );

    // Enroll the students
    course.students = [...course.students, ...newStudents];
    return this.courseRepository.save(course);
  }

  async removeStudent(courseId: string, studentId: string): Promise<Course> {
    const course = await this.findOne(courseId);

    // Check if the student is enrolled
    const studentIndex = course.students.findIndex((s) => s.id === studentId);
    if (studentIndex === -1) {
      throw new NotFoundException('Student is not enrolled in this course');
    }

    // Remove the student from the course
    course.students.splice(studentIndex, 1);

    // Also remove the student from any groups in this course
    for (const group of course.groups) {
      const groupStudentIndex = group.students.findIndex(
        (s) => s.id === studentId,
      );
      if (groupStudentIndex !== -1) {
        group.students.splice(groupStudentIndex, 1);
        await this.courseGroupRepository.save(group);
      }
    }

    return this.courseRepository.save(course);
  }

  async createGroup(
    createGroupDto: CreateCourseGroupDto,
  ): Promise<CourseGroup> {
    // Check if the course exists
    await this.findOne(createGroupDto.courseId);

    // Create the group
    const group = this.courseGroupRepository.create({
      name: createGroupDto.name,
      description: createGroupDto.description,
      courseId: createGroupDto.courseId,
    });

    const savedGroup = await this.courseGroupRepository.save(group);

    // Add students to the group if provided
    if (createGroupDto.studentIds && createGroupDto.studentIds.length > 0) {
      await this.addStudentsToGroup(savedGroup.id, createGroupDto.studentIds);
    }

    return this.findOneGroup(savedGroup.id);
  }

  async findAllGroups(courseId: string): Promise<CourseGroup[]> {
    return this.courseGroupRepository.find({
      where: { courseId },
      relations: ['students'],
    });
  }

  async findOneGroup(id: string): Promise<CourseGroup> {
    const group = await this.courseGroupRepository.findOne({
      where: { id },
      relations: ['students', 'course'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID "${id}" not found`);
    }

    return group;
  }

  async updateGroup(
    id: string,
    updateGroupDto: UpdateCourseGroupDto,
  ): Promise<CourseGroup> {
    const group = await this.findOneGroup(id);

    // Update basic fields
    if (updateGroupDto.name) group.name = updateGroupDto.name;
    if (updateGroupDto.description !== undefined)
      group.description = updateGroupDto.description;

    await this.courseGroupRepository.save(group);

    // Update students if provided
    if (updateGroupDto.studentIds) {
      // First, remove all students
      group.students = [];
      await this.courseGroupRepository.save(group);

      // Then add the new students
      await this.addStudentsToGroup(id, updateGroupDto.studentIds);
    }

    return this.findOneGroup(id);
  }

  async removeGroup(id: string): Promise<void> {
    const result = await this.courseGroupRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Group with ID "${id}" not found`);
    }
  }

  async addStudentsToGroup(
    groupId: string,
    studentIds: string[],
  ): Promise<CourseGroup> {
    const group = await this.findOneGroup(groupId);

    // Check if all students are enrolled in the course
    const course = await this.findOne(group.courseId);
    const enrolledStudentIds = course.students.map((s) => s.id);

    const notEnrolledStudents = studentIds.filter(
      (id) => !enrolledStudentIds.includes(id),
    );
    if (notEnrolledStudents.length > 0) {
      throw new BadRequestException(
        'Some students are not enrolled in the course',
      );
    }

    // Get the students
    const students = await this.userRepository.find({
      where: { id: In(studentIds) },
    });

    // Add students to the group
    group.students = students;
    return this.courseGroupRepository.save(group);
  }

  async removeStudentFromGroup(
    groupId: string,
    studentId: string,
  ): Promise<CourseGroup> {
    const group = await this.findOneGroup(groupId);

    // Check if the student is in the group
    const studentIndex = group.students.findIndex((s) => s.id === studentId);
    if (studentIndex === -1) {
      throw new NotFoundException('Student is not in this group');
    }

    // Remove the student from the group
    group.students.splice(studentIndex, 1);
    return this.courseGroupRepository.save(group);
  }

  async generateQRCode(courseId: string): Promise<QRCodeResponseDto> {
    // Check if the course exists
    await this.findOne(courseId);

    // In a real implementation, you would generate a QR code here
    // For this example, we'll just return the enrollment URL
    const enrollmentUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/enroll/${courseId}`;

    // In a real implementation, you would generate a QR code image
    // For this example, we'll use a placeholder QR code service
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(enrollmentUrl)}`;

    return {
      enrollmentUrl,
      qrCodeUrl,
    };
  }
}
