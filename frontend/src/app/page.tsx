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
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_prompt: promptContent,
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
      <PromptDisplay selectedPrompt={selectedPrompt} onPromptContentLoaded={setPromptContent} />
      <Chat chatHistory={chatHistory} onSendMessage={handleSendMessage} isLoading={isLoading} />
    </main>
  );
}
