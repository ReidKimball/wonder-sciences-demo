'use client';

import React, { useState, useEffect } from 'react';

interface PromptDisplayProps {
  selectedPrompt: string | null;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ selectedPrompt }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (selectedPrompt) {
      const fetchPromptContent = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/prompts/${selectedPrompt}`);
          const data = await response.json();
          setContent(data.content);
        } catch (error) {
          console.error('Error fetching prompt content:', error);
          setContent('Error loading prompt.');
        }
      };

      fetchPromptContent();
    } else {
      setContent('');
    }
  }, [selectedPrompt]);

  return (
    <div className="w-1/2 bg-white p-4">
      <h2 className="text-lg font-bold mb-4 text-black">Selected Prompt</h2>
      <div className="w-full h-auto p-4 bg-gray-100 rounded-lg">
        <p className="text-black whitespace-pre-wrap">{content || 'Select a prompt from the list to see its content.'}</p>
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
