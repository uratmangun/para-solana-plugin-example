import { NextRequest } from "next/server";
import { Message,LanguageModelV1,streamText,tool } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { createVercelAITools } from "solana-agent-kit";
import { solanaAgent } from "@/utils/solana";
import { z } from "zod";
import ParaServerPlugin from "@uratmangun/solana-plugin-para-server";
import {createParaToolsWeb} from "@/utils/init"
// Initialize Groq with the mixtral model
const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: Message[] };
    
    const solanaAgentWithPara = solanaAgent.use(ParaServerPlugin);
    const vercelTools = createVercelAITools(solanaAgentWithPara, solanaAgentWithPara.actions);
    const tools = {...vercelTools,
      ...createParaToolsWeb()
    }
    const result = await streamText({
      model: groq("deepseek-r1-distill-llama-70b") as LanguageModelV1,
      tools:tools as any,
      system: `
      You are a helpful agent that can interact onchain using the Solana Agent Kit. You are
      empowered to interact onchain using your tools. If you ever need funds, you can request them from the
      faucet. If not, you can provide your wallet details and request funds from the user. If there is a 5XX
      (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you
      can't do with your currently available tools, you must say so, and encourage them to implement it
      themselves using the Solana Agent Kit, recommend they go to https://www.solanaagentkit.xyz for more information. Be
      concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.
    `,
      messages
    });
  

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Error in chat route:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.status || 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
