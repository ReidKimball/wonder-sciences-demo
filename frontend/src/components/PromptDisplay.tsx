'use client';

import React, { useState, useEffect } from 'react';

interface PromptDisplayProps {
  selectedPrompt: string | null;
  onPromptContentLoaded: (content: string) => void;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ selectedPrompt, onPromptContentLoaded }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (selectedPrompt) {
      const fetchPromptContent = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/prompts/${selectedPrompt}`);
          const data = await response.json();
          setContent(data.content);
          onPromptContentLoaded(data.content);
        } catch (error) {
          console.error('Error fetching prompt content:', error);
          const errorContent = 'Error loading prompt.';
          setContent(errorContent);
          onPromptContentLoaded(errorContent);
        }
      };

      fetchPromptContent();
    } else {
      setContent('');
      onPromptContentLoaded('');
    }
  }, [selectedPrompt, onPromptContentLoaded]);

  return (
    <div className="w-1/2 bg-white p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-4 text-black">
        {selectedPrompt ? `Selected Prompt: ${selectedPrompt}` : 'Selected Prompt'}
      </h2>
      <div className="w-full flex-grow p-4 bg-gray-100 rounded-lg overflow-y-auto">
        <p className="text-black whitespace-pre-wrap break-words">{content || 'Select a prompt from the list to see its content.'}</p>
      </div>

      <div className="mt-4 border rounded-lg">
        <details className="p-4">
          <summary className="font-bold cursor-pointer text-black">AI Analysis</summary>
          <p className="mt-2 text-black">This is where the AI analysis of the user's thoughts will be displayed.</p>
        </details>
      </div>
    </div>
  );
};

export default PromptDisplay;
