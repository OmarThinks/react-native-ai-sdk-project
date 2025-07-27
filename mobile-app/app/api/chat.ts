import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";

async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("models/gemini-2.0-flash-exp"),
    messages: convertToModelMessages(messages),
    system: "You are a friend.",
  });

  return result.toUIMessageStreamResponse({
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Encoding": "none",
    },
  });
}

export { POST };

export default POST;
