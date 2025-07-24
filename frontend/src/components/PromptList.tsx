/**
 * @file PromptList.tsx
 * @description This file defines the PromptList component, which fetches and displays
 * a list of available system prompts from the backend and allows model selection.
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
  /** The currently selected AI model. */
  selectedModel: string;
  /** Callback function to be called when a model is selected. */
  onSelectModel: (modelName: string) => void;
}

/**
 * A component that displays a list of selectable system prompts.
 * @param {PromptListProps} props - The props for the component.
 * @returns {JSX.Element} The rendered list of prompts.
 */
const PromptList: React.FC<PromptListProps> = ({ selectedPrompt, onSelectPrompt, selectedModel, onSelectModel }) => {
  const [prompts, setPrompts] = useState<string[]>([]); // State to store the list of prompt filenames.
  const [models, setModels] = useState<string[]>([]); // State to store the list of available models.
  const [isLoading, setIsLoading] = useState(true); // State to track loading status.
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility.

  /**
   * @effect
   * @description Fetches the list of available prompts and models from the API on component mount.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch prompts
        const promptsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompts`);
        const promptsData = await promptsResponse.json();
        setPrompts(promptsData);

        // Fetch models
        const modelsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/models`);
        const modelsData = await modelsResponse.json();
        setModels(modelsData.models);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount.

  const handleModelSelect = (model: string) => {
    onSelectModel(model);
    setIsModalOpen(false);
  };

  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-black">System Prompts</h2>
        <button onClick={() => setIsModalOpen(true)} className="text-gray-500 hover:text-black">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl text-black">
            <h3 className="text-lg font-bold mb-4">Select Gemini Model</h3>
            <ul>
              {models.map(model => (
                <li 
                  key={model} 
                  className={`p-2 hover:bg-gray-200 cursor-pointer rounded-md ${
                    selectedModel === model ? 'bg-blue-500 text-white' : ''
                  }`}
                  onClick={() => handleModelSelect(model)}
                >
                  {model}
                </li>
              ))}
            </ul>
            <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center pt-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ul>
          {prompts.map((prompt) => (
            <li
              key={prompt}
              className={`p-2 rounded-lg cursor-pointer mb-2 text-black ${
                selectedPrompt === prompt ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
              onClick={() => onSelectPrompt(prompt)}
            >
              {prompt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PromptList;
