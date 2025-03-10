
import { SolanaAgentKit } from "solana-agent-kit";
// import ParaServerPlugin from "@uratmangun/solana-plugin-para-server";


// const keyPair = Keypair.fromSecretKey(bs58.decode("YOUR_SECRET_KEY"))

// Initialize with private key and optional RPC URL
export const solanaAgent = new SolanaAgentKit(
  {
    publicKey: "keyPair.publicKey" as any,
    sendTransaction: async (tx) => {
      // const connection = new Connection(process.env.RPC_URL as string);
      // if (tx instanceof VersionedTransaction) tx.sign([keyPair]);
      // else tx.sign(keyPair);
      // return await connection.sendRawTransaction(tx.serialize());
      return "tx"
    },
    signTransaction: async (tx) => {
      // if (tx instanceof VersionedTransaction) tx.sign([keyPair]);
      // else tx.sign(keyPair);
      return tx;
    },
    signAllTransactions: async (txs) => {
      // txs.forEach((tx) => {
      //   if (tx instanceof VersionedTransaction) tx.sign([keyPair]);
      //   else tx.sign(keyPair);
      // });
      return txs;
    },
  },
  "https://google.com",
  {
    OPENAI_API_KEY: "YOUR_OPENAI_API_KEY",
  }
) // Add the plugins you would like to use
  // .use(ParaServerPlugin);
  
 