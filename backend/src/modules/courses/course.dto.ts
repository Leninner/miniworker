import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDate,
  IsUUID,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}

export class CourseResponseDto {
  id: string;
  name: string;
  code: string;
  description: string;
  active: boolean;
  startDate: Date;
  endDate: Date;
  professorId: string;
  createdAt: Date;
  updatedAt: Date;
  studentCount: number;
}

export class CreateCourseGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsUUID()
  courseId: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  studentIds?: string[];
}

export class UpdateCourseGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  studentIds?: string[];
}

export class CourseGroupResponseDto {
  id: string;
  name: string;
  description: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  studentCount: number;
}

export class EnrollStudentDto {
  @IsNotEmpty()
  @IsUUID()
  studentId: string;
}

export class EnrollStudentsDto {
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  studentIds: string[];
}

export class QRCodeResponseDto {
  enrollmentUrl: string;
  qrCodeUrl: string;
}
