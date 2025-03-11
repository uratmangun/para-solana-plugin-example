import { NextRequest } from "next/server";
import { Message,LanguageModelV1,streamText,tool } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { createVercelAITools } from "solana-agent-kit";
import { solanaAgent } from "@/utils/config";
import { ParaSolanaWeb3Signer } from "@getpara/solana-web3.js-v1-integration";
import { Connection } from "@solana/web3.js";
import { Para as Paraserver,Environment } from "@getpara/server-sdk";
import { z } from "zod";
export const para = new Paraserver(process.env.PARA_ENV as Environment, process.env.PARA_API_KEY as string);

// Set up Solana connection
const solanaConnection = new Connection(process.env.RPC_URL as string);

// Create the Para Solana Signer
const solanaSigner = new ParaSolanaWeb3Signer(para, solanaConnection);

// Initialize Groq with the mixtral model
const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const vercelTools = createVercelAITools(solanaAgent, solanaAgent.actions);
const tools = {...vercelTools,
  para:tool({
    id:"para.para" as `${string}.${string}`,
    description:"Para",
    parameters: z.object({}),
    execute: async (args: any, options: { abortSignal?: AbortSignal }) => {
      return "Para"
    }
  })
}
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: Message[] };
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
