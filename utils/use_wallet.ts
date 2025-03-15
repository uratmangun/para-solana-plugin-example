import { ParaSolanaWeb3Signer } from "@getpara/solana-web3.js-v1-integration";
import { ParaCore } from "@getpara/web-sdk";
import { Connection,VersionedTransaction, Transaction, PublicKey } from "@solana/web3.js";
import {solanaAgent} from "./solana";


// The first parameter is bound automatically by the plugin system
export async function useWallet(para:ParaCore, walletId: string) {
  try {
    if(!walletId){
      throw new Error("Provide `walletId` in the request body to use a wallet.");
    }
    const isLoggedIn = await para.isFullyLoggedIn();
    if(!isLoggedIn){
      throw new Error("Please login to Para to use a wallet.");
    }
    const solanaConnection = new Connection(process.env.NEXT_PUBLIC_RPC_URL as string);
    const panda=await para.getUserShare();
    console.log("panda",panda)
    // Create the Para Solana Signer
    const solanaSigner = new ParaSolanaWeb3Signer(para as any, solanaConnection, walletId);
    console.log("solanaSigner",solanaSigner.sender?.toBase58())
    solanaAgent.wallet = {
      publicKey: solanaSigner.sender as PublicKey,
      sendTransaction: async (tx: VersionedTransaction | Transaction) => {
        if (tx instanceof VersionedTransaction) {
          const signedTx = await solanaSigner.signVersionedTransaction(tx);
          return await solanaConnection.sendRawTransaction(signedTx.serialize());
        } else {
          const signedTx = await solanaSigner.signTransaction(tx);
          return await solanaConnection.sendRawTransaction(signedTx.serialize());
        }
      },
      signTransaction: async <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
        if (tx instanceof VersionedTransaction) {
          return await solanaSigner.signVersionedTransaction(tx) as T;
        } else {
          return await solanaSigner.signTransaction(tx) as T;
        }
      },
      signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> => {
        const signedTxs = await Promise.all(txs.map(async (tx) => {
          if (tx instanceof VersionedTransaction) {
            return await solanaSigner.signVersionedTransaction(tx) as T;
          } else {
            return await solanaSigner.signTransaction(tx) as T;
          }
        }));
        return signedTxs;
      },
    };

    return {
      message: "Wallet used successfully.",
      walletId
    };
  } catch (error: any) {
    throw new Error(`use wallet failed ${error.message}`);
  }
}
