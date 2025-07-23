'use client';

import React, { useState, useEffect } from 'react';

interface PromptListProps {
  selectedPrompt: string | null;
  onSelectPrompt: (promptName: string) => void;
}

const PromptList: React.FC<PromptListProps> = ({ selectedPrompt, onSelectPrompt }) => {
  const [prompts, setPrompts] = useState<string[]>([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/prompts');
        const data = await response.json();
        setPrompts(data);
      } catch (error) {
        console.error('Error fetching prompts:', error);
      }
    };

    fetchPrompts();
  }, []);

  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-black">System Prompts</h2>
      <ul>
        {prompts.map((prompt) => (
          <li key={prompt} 
              className={`p-2 rounded-lg cursor-pointer mb-2 text-black ${
                selectedPrompt === prompt ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
              onClick={() => onSelectPrompt(prompt)}>
            {prompt}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PromptList;
