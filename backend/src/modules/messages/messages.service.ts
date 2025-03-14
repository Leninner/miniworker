import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Conversation,
  MessageSender,
} from '../../entities/conversation.entity';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';

export interface MessageWithSenderInfo extends Conversation {
  senderName?: string;
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByProject(projectId: string): Promise<MessageWithSenderInfo[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['group', 'group.members'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Get all messages for this project with sender information
    const messages = await this.conversationRepository.find({
      where: { projectId },
      order: { createdAt: 'ASC' },
      relations: ['senderUser'],
    });

    // For group projects, enhance the messages with sender information
    if (project.isGroupProject && project.group) {
      return messages.map((message) => {
        const enhancedMessage: MessageWithSenderInfo = { ...message };
        if (message.sender === MessageSender.STUDENT && message.senderId) {
          const sender = project.group.members.find(
            (m) => m.id === message.senderId,
          );
          if (sender) {
            enhancedMessage.senderName = `${sender.firstName} ${sender.lastName}`;
          }
        }
        return enhancedMessage;
      });
    }

    return messages;
  }

  async create(
    projectId: string,
    userId: string,
    message: string,
    sender: MessageSender,
  ): Promise<Conversation> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    // Create a new conversation entry with sender information
    const newMessage = this.conversationRepository.create({
      message,
      sender,
      projectId,
      senderId: sender === MessageSender.STUDENT ? userId : undefined,
    });

    return this.conversationRepository.save(newMessage);
  }
}
