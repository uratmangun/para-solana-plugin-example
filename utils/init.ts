'use client'
import {solanaAgent} from "./solana";
// import { Connection, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
// import { ParaSolanaWeb3Signer } from "@getpara/solana-web3.js-v1-integration";
import ParaWebPlugin from "@uratmangun/solana-plugin-para-web";



// Set up Solana connection
// const solanaConnection = new Connection(process.env.NEXT_PUBLIC_RPC_URL as string);

// Initialize Para instance
const solanaAgentWithPara = solanaAgent.use(ParaWebPlugin);
export const para = solanaAgentWithPara.methods.getParaInstance();

// Create the base wallet with initialized signer
// const solanaSigner = new ParaSolanaWeb3Signer(para, solanaConnection);

// const baseWallet = {
//   publicKey: solanaSigner.sender as PublicKey,
//   sendTransaction: async (tx: VersionedTransaction | Transaction) => {
//     if (tx instanceof VersionedTransaction) {
//       const signedTx = await solanaSigner.signVersionedTransaction(tx);
//       return await solanaConnection.sendRawTransaction(signedTx.serialize());
//     } else {
//       const signedTx = await solanaSigner.signTransaction(tx);
//       return await solanaConnection.sendRawTransaction(signedTx.serialize());
//     }
//   },
//   signTransaction: async <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
//     if (tx instanceof VersionedTransaction) {
//       return await solanaSigner.signVersionedTransaction(tx) as T;
//     } else {
//       return await solanaSigner.signTransaction(tx) as T;
//     }
//   },
//   signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> => {
//     const signedTxs = await Promise.all(txs.map(async (tx) => {
//       if (tx instanceof VersionedTransaction) {
//         return await solanaSigner.signVersionedTransaction(tx) as T;
//       } else {
//         return await solanaSigner.signTransaction(tx) as T;
//       }
//     }));
//     return signedTxs;
//   },
// };

// // Update the Solana Agent with the real wallet
// // solanaAgent.wallet = baseWallet as BaseWallet; 