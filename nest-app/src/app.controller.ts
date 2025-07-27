import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { AppService } from './app.service';

console.log(
  'Using Google Generative AI with API Key:',
  process.env.GOOGLE_API_KEY,
);

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/api/chat')
  example(@Res() res: Response, @Body() messages: UIMessage[]) {
    const result = streamText({
      model: google('gpt-4o'),
      messages: convertToModelMessages(messages),
      system: 'You are a friend.',
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    result.pipeTextStreamToResponse(res as unknown as any);
  }
}
