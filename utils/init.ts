'use client'
import { tool } from "ai";
import {solanaAgent} from "./solana";
import type{Action} from "solana-agent-kit"
import ParaWebPlugin from "@uratmangun/solana-plugin-para-web";



const solanaAgentWithPara = solanaAgent.use(ParaWebPlugin);
export const para = solanaAgentWithPara.methods.getParaInstance();
export function createParaToolsWeb() {
    const tools = {};
  const actions=solanaAgentWithPara.actions as Action[]
  //@ts-ignore
    for (const [index, action] of actions.entries()) {
        //@ts-ignore
      tools[index.toString()] = tool({
        id: action.name as `${string}.${string}`,
        description: `
        ${action.description}
  
        Similes: ${action.similes.map(
            //@ts-ignore
          (simile) => `
          ${simile}
        `,
        )}
        `.slice(0, 1023),
        parameters: action.schema,
        execute: async () =>
            action.name
      });
    }
  
    return tools;
  }
