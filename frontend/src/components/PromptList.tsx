/**
 * @file PromptList.tsx
 * @description This file defines the PromptList component, which fetches and displays
 * a list of available system prompts from the backend.
 */

'use client';

import React, { useState, useEffect } from 'react';

/**
 * @interface PromptListProps
 * @description Defines the props for the PromptList component.
 */
interface PromptListProps {
  /** The filename of the currently selected prompt. */
  selectedPrompt: string | null;
  /** Callback function to be called when a prompt is selected. */
  onSelectPrompt: (promptName: string) => void;
}

/**
 * A component that displays a list of selectable system prompts.
 * @param {PromptListProps} props - The props for the component.
 * @returns {JSX.Element} The rendered list of prompts.
 */
const PromptList: React.FC<PromptListProps> = ({ selectedPrompt, onSelectPrompt }) => {
  const [prompts, setPrompts] = useState<string[]>([]); // State to store the list of prompt filenames.

  /**
   * @effect
   * @description Fetches the list of available prompts from the API on component mount.
   */
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompts`);
        const data = await response.json();
        setPrompts(data);
      } catch (error) {
        console.error('Error fetching prompts:', error);
      }
    };

    fetchPrompts();
  }, []); // Empty dependency array ensures this runs only once on mount.

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
