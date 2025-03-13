
import { SolanaAgentKit, type BaseWallet } from "solana-agent-kit";
import bs58 from 'bs58'
import {Keypair,Connection, VersionedTransaction,Transaction} from '@solana/web3.js'
const keyPair = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY as string))
export const baseWallet= {
  publicKey: keyPair.publicKey,
  sendTransaction: async (tx: VersionedTransaction | Transaction) => {
    const connection = new Connection(process.env.RPC_URL as string);
    if (tx instanceof VersionedTransaction) tx.sign([keyPair]);
    else tx.sign(keyPair);
    return await connection.sendRawTransaction(tx.serialize());
  },
  signTransaction: async (tx: VersionedTransaction | Transaction) => {
    if (tx instanceof VersionedTransaction) tx.sign([keyPair]);
    else tx.sign(keyPair);
    return tx;
  },
  signAllTransactions: async (txs: VersionedTransaction[] | Transaction[]) => {
    txs.forEach((tx) => {
      if (tx instanceof VersionedTransaction) tx.sign([keyPair]);
      else tx.sign(keyPair);
    });
    return txs;
  },
}
export const solanaAgent = new SolanaAgentKit(
 baseWallet as BaseWallet,
  process.env.RPC_URL as string,
  {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
  }
) 
 
  
 