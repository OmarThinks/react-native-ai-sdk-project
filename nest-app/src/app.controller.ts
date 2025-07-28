import { google } from '@ai-sdk/google';
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('api/chat')
  example(
    @Res() res: Response,
    @Body() { messages }: { messages: UIMessage[] },
  ) {
    //console.log(messages, 'MESSAGES');

    const result = streamText({
      model: google('models/gemini-2.0-flash-exp'),
      messages: convertToModelMessages(messages),
      system: "I'm a a doctor AI assistant.",
      experimental_telemetry: { isEnabled: false },
      onFinish: ({ usage }) => {
        console.log('Usage:', usage);
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return result.pipeUIMessageStreamToResponse(res as unknown as any);
    //return result.pipeUIMessageStreamToResponse(res as unknown as any);
  }
}
