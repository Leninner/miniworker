import { Injectable } from '@nestjs/common';
import { Agent } from '../../../entities/agent.entity';
import { AgentStrategy } from './agent-strategy.interface';
import { OpenAIService } from '../openai.service';

@Injectable()
export class SupportiveAgentStrategy implements AgentStrategy {
  constructor(private openaiService: OpenAIService) {}

  async generateGreeting(agent: Agent): Promise<string> {
    const systemPrompt = `You are ${agent.name}, a supportive AI agent with an encouraging and positive approach. 
      You focus on students' strengths and progress. Your tone is warm, understanding, and inviting.
      You are helping students with problems in the ${agent.problemCategory} category.`;

    const userPrompt = `Generate a warm and encouraging greeting as ${agent.name}, a supportive AI agent, introducing yourself to a student
      who is about to work on this problem: "${agent.problemStatement}"
      Keep it under 150 words, be welcoming, and emphasize that you're there to help them succeed.`;

    return this.openaiService.generateCompletionWithSystemPrompt(
      systemPrompt,
      userPrompt,
    );
  }

  async generateFeedback(agent: Agent, message: string): Promise<string> {
    const systemPrompt = `You are ${agent.name}, a supportive AI agent with an encouraging and positive approach.
      You focus on students' strengths and progress. Your tone is warm, understanding, and inviting.
      You provide gentle suggestions for improvement while acknowledging effort and achievements.
      You are helping with problems in the ${agent.problemCategory} category.`;

    const userPrompt = `A student working on this problem: "${agent.problemStatement}" has sent you this message:
      "${message}"
      
      Respond as a supportive AI agent who encourages progress. Acknowledge their effort, offer positive reinforcement,
      and provide gentle guidance where needed. Keep your response under 200 words.`;

    return this.openaiService.generateCompletionWithSystemPrompt(
      systemPrompt,
      userPrompt,
    );
  }

  async evaluateSubmission(agent: Agent, submission: any): Promise<any> {
    const systemPrompt = `You are ${agent.name}, a supportive AI agent with an encouraging approach.
      You are evaluating a student's submission for a project in the ${agent.problemCategory} category.
      Your evaluation emphasizes strengths while gently suggesting improvements, focusing on growth and progress.`;

    const userPrompt = `The student was working on this problem: "${agent.problemStatement}"
      
      They have submitted the following work:
      "${submission.content}"
      
      Evaluate this submission supportively. Your response should include:
      1. An overall assessment (1-5 stars)
      2. Specific strengths to celebrate
      3. Gentle suggestions for improvement (framed positively)
      4. Encouraging next steps for continued growth
      
      Format your response as JSON with these keys: overallRating, strengths, gentleSuggestions, encouragingNextSteps`;

    const responseText =
      await this.openaiService.generateCompletionWithSystemPrompt(
        systemPrompt,
        userPrompt,
      );

    try {
      return JSON.parse(responseText);
    } catch (error) {
      // Fallback in case the response is not valid JSON
      return {
        overallRating: 4,
        strengths: ["You've put good effort into this submission"],
        gentleSuggestions: ['Consider exploring additional perspectives'],
        encouragingNextSteps: ['Continue building on your strengths'],
      };
    }
  }

  async generateNextSteps(agent: Agent, projectId?: string): Promise<string[]> {
    const systemPrompt = `You are ${agent.name}, a supportive AI agent with an encouraging and positive approach.
      You are helping a student with next steps for their project in the ${agent.problemCategory} category.`;

    const userPrompt = `The student is working on this problem: "${agent.problemStatement}"
      
      Generate a list of 4-5 encouraging next steps the student could take to make progress.
      These steps should be supportive, achievable, and focus on building confidence.
      Each step should be a single sentence, positive and actionable.`;

    const responseText =
      await this.openaiService.generateCompletionWithSystemPrompt(
        systemPrompt,
        userPrompt,
      );

    // Split the response into an array of steps
    return responseText
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+\.\s*/, '').trim())
      .filter((line) => line.length > 0);
  }
}
