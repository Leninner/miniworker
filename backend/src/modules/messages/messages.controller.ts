import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { MessagesService, MessageWithSenderInfo } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessageSender } from '../../entities/conversation.entity';
import { Conversation } from '../../entities/conversation.entity';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@Controller('projects/:projectId/messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async findAll(
    @Param('projectId') projectId: string,
  ): Promise<MessageWithSenderInfo[]> {
    return this.messagesService.findByProject(projectId);
  }

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() createMessageDto: { message: string },
    @Req() req: RequestWithUser,
  ): Promise<Conversation> {
    // Get the current user's ID from the JWT token
    const userId = req.user.userId;

    // Create the message with the user ID
    return this.messagesService.create(
      projectId,
      userId,
      createMessageDto.message,
      MessageSender.STUDENT,
    );
  }
}
