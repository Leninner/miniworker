import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import { User } from './entities/user.entity';
import { Agent } from './entities/agent.entity';
import { Project } from './entities/project.entity';
import { Milestone } from './entities/milestone.entity';
import { Evaluation } from './entities/evaluation.entity';
import { Conversation } from './entities/conversation.entity';
import { ProjectGroup } from './entities/project-group.entity';
import { Course, CourseGroup } from './entities/course.entity';

// Modules
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProjectsModule } from './modules/projects/projects.module';
import { CourseModule } from './modules/courses/course.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }) as any,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'miniworker'),
        entities: [
          User,
          Agent,
          Project,
          Milestone,
          Evaluation,
          Conversation,
          ProjectGroup,
          Course,
          CourseGroup,
        ],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    UserModule,
    AuthModule,
    ReportsModule,
    ProjectsModule,
    CourseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
