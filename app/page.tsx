'use client';

import { ChatWindow } from "../components/ChatWindow";

export default function ChatbotPage() {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">
        Solana Agent Chatbot 🤖
      </h1>
      <ul>
        <li className="text-l">
          🔧
          <span className="ml-2">
            This chatbot can interact with Solana blockchain using various tools.
          </span>
        </li>
        <li className="text-l">
          💡
          <span className="ml-2">
            Try asking e.g. <code>create pregen wallet with this email  dev@test.getpara.com</code> or <code>claim pregen wallet with this email  dev@test.getpara.com</code>
          </span>
        </li>
      </ul>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <ChatWindow
        endpoint="/api/chat"
        emoji="🤖"
        titleText="Solana Agent Chatbot"
        placeholder="Ask me anything about Solana..."
        emptyStateComponent={InfoCard}
      />
    </div>
  );
} 