'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onNewChatSession: () => void;
}

const Chat: React.FC<ChatProps> = ({ chatHistory, onSendMessage, isLoading, onNewChatSession }) => {
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

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
