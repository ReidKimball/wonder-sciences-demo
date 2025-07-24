/**
 * @file Chat.tsx
 * @description This file defines the Chat component, which handles the display
 * of the conversation and the user input for sending messages.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';

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
 * @interface ChatProps
 * @description Defines the props for the Chat component.
 */
interface ChatProps {
  /** The history of messages in the current chat session. */
  chatHistory: ChatMessage[];
  /** Function to call when a new message is sent. */
  onSendMessage: (message: string) => void;
  /** Boolean indicating if the app is waiting for a response from the AI. */
  isLoading: boolean;
  /** Function to call to start a new chat session. */
  onNewChatSession: () => void;
}

/**
 * The main chat component.
 * @param {ChatProps} props - The props for the component.
 * @returns {JSX.Element} The rendered chat interface.
 */
const Chat: React.FC<ChatProps> = ({ chatHistory, onSendMessage, isLoading, onNewChatSession }) => {
  const [input, setInput] = useState(''); // State for the user's message input.
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref to the chat container for auto-scrolling.

  /**
   * @effect
   * @description Scrolls the chat container to the bottom whenever a new message is added.
   */
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  /**
   * @function handleSend
   * @description Handles the logic for sending a message when the send button is clicked.
   */
  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  /**
   * @function handleKeyPress
   * @description Allows sending a message by pressing the 'Enter' key.
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event.
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="w-1/3 bg-white p-4 flex flex-col h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-black">Chat</h2>
        <button 
          className="bg-gray-200 text-black text-sm py-1 px-3 rounded-lg hover:bg-gray-300"
          onClick={onNewChatSession}
        >
          New Chat Session
        </button>
      </div>
      <div ref={chatContainerRef} className="flex-grow border rounded-lg p-4 mb-4 overflow-y-auto bg-gray-50">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`mb-3 p-3 rounded-lg max-w-xs break-words ${
            msg.role === 'user' 
              ? 'bg-blue-500 text-white ml-auto'
              : 'bg-gray-300 text-black mr-auto'
          }`}>
            <p className="text-sm">{msg.content}</p>
          </div>
        ))}
        {/* Display a thinking indicator when waiting for a response */}
        {isLoading && (
            <div className="mb-3 p-3 rounded-lg max-w-xs break-words bg-gray-300 text-black mr-auto">
                <p className="text-sm">...</p>
            </div>
        )}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow border rounded-l-lg p-2 text-black bg-white"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button 
          className="bg-blue-500 text-white p-2 rounded-r-lg disabled:bg-blue-300"
          onClick={handleSend}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
