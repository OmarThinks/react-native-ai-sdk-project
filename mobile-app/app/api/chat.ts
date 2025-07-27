import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";

console.log(
  "EXPO_PUBLIC_GOOGLE_API_KEY",
  process.env.EXPO_PUBLIC_GOOGLE_API_KEY
);

const google = createGoogleGenerativeAI({
  apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
});

async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("models/gemini-2.0-flash-exp"),
    messages: convertToModelMessages(messages),
    system: "You are a friend.",
    experimental_telemetry: { isEnabled: false },
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
