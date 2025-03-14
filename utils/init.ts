'use client'
import ParaWebPlugin from "@uratmangun/solana-plugin-para-web";
import {solanaAgent} from "./solana";
export const solanaAgentWithPara = solanaAgent.use(ParaWebPlugin);
export const para = solanaAgentWithPara.methods.getParaInstance();


