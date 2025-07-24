'use client';

import React, { useState } from 'react';
import PromptList from '@/components/PromptList';
import PromptDisplay from '@/components/PromptDisplay';
import Chat from '@/components/Chat';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [promptContent, setPromptContent] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewChatSession = () => {
    setChatHistory([]);
    setAiAnalysis([]);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedPrompt || !promptContent) {
      alert('Please select a system prompt first.');
      return;
    }

    const newUserMessage: ChatMessage = { role: 'user', content: message };
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_prompt: promptContent,
          system_prompt_filename: selectedPrompt,
          history: chatHistory, // Send history before the new user message
          user_message: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const aiMessage: ChatMessage = { role: 'assistant', content: data.reply };
      setChatHistory([...updatedHistory, aiMessage]);
      if (data.analysis) {
        setAiAnalysis(prev => [...prev, data.analysis]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = { role: 'assistant', content: 'Sorry, something went wrong.' };
      setChatHistory([...updatedHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen bg-gray-200">
      <PromptList selectedPrompt={selectedPrompt} onSelectPrompt={setSelectedPrompt} />
      <PromptDisplay 
        selectedPrompt={selectedPrompt} 
        onPromptContentLoaded={setPromptContent}
        aiAnalysis={aiAnalysis}
      />
      <Chat 
        chatHistory={chatHistory} 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
        onNewChatSession={handleNewChatSession} 
      />
    </main>
  );
}
