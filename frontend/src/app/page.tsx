/**
 * @file page.tsx
 * @description This is the main page of the Wonder Sciences AI Demo application.
 * It orchestrates the main components: PromptList, PromptDisplay, and Chat,
 * and manages the application's core state.
 */

'use client';

import React, { useState } from 'react';
import PromptList from '@/components/PromptList';
import PromptDisplay from '@/components/PromptDisplay';
import Chat from '@/components/Chat';

/**
 * @interface ChatMessage
 * @description Defines the structure for a single chat message object.
 */
interface ChatMessage {
  /** The role of the message sender, either 'user' or 'assistant'. */
  role: 'user' | 'assistant';
  /** The text content of the message. */
  content: string;
}

/**
 * The main component for the home page.
 * @returns {JSX.Element} The rendered home page.
 */
export default function Home() {
  // --- State Management ---
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null); // Tracks the filename of the currently selected system prompt.
  const [promptContent, setPromptContent] = useState<string>(''); // Holds the actual content of the selected prompt.
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-pro'); // Tracks the selected AI model.
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]); // Stores the history of the current chat session.
  const [aiAnalysis, setAiAnalysis] = useState<string[]>([]); // Accumulates AI analysis strings from chat responses.
  const [isLoading, setIsLoading] = useState(false); // Tracks the loading state for the chat response.

  /**
   * @function handleNewChatSession
   * @description Resets the chat history and AI analysis to start a new session.
   */
  const handleNewChatSession = () => {
    setChatHistory([]);
    setAiAnalysis([]);
  };

  /**
   * @function handleSendMessage
   * @description Handles sending a new message to the backend API and updating the chat state.
   * @param {string} message - The message content from the user.
   */
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
      // Fetch response from the backend chat API
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
          model_name: selectedModel, // Pass the selected model to the backend
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const aiMessage: ChatMessage = { role: 'assistant', content: data.reply };
      setChatHistory([...updatedHistory, aiMessage]);
      
      // If the response contains an analysis, add it to the state
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
      <PromptList 
        selectedPrompt={selectedPrompt} 
        onSelectPrompt={setSelectedPrompt} 
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
      />
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
