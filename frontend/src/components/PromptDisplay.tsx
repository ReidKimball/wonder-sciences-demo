'use client';

import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface PromptDisplayProps {
  selectedPrompt: string | null;
  onPromptContentLoaded: (content: string) => void;
  aiAnalysis: string[];
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ selectedPrompt, onPromptContentLoaded, aiAnalysis }) => {
  const [content, setContent] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const [analysisHtml, setAnalysisHtml] = useState('');
  const analysisEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    analysisEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fullAnalysis = aiAnalysis.length > 0
        ? aiAnalysis.map((analysis, index) => `<h3>Analysis #${index + 1}</h3>\n\n${analysis}`).join('<hr class="my-4"/>')
        : 'No analysis available. Start a chat to generate one.';

      const sanitizedHtml = DOMPurify.sanitize(marked.parse(fullAnalysis) as string);
      setAnalysisHtml(sanitizedHtml);
      scrollToBottom();
    }
  }, [aiAnalysis]);

  const handleCopy = () => {
    const fullAnalysisText = aiAnalysis.map((analysis, index) => `--- Analysis #${index + 1} ---\n\n${analysis}`).join('\n\n');
    navigator.clipboard.writeText(fullAnalysisText).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy'), 2000);
    });
  };

  return (
    <div className="w-1/2 bg-white p-4 flex flex-col h-full">
      <h2 className="text-lg font-bold mb-4 text-black flex-shrink-0">
        {selectedPrompt ? `Selected Prompt: ${selectedPrompt}` : 'Selected Prompt'}
      </h2>
      <div className="w-full p-4 bg-gray-100 rounded-lg overflow-y-auto mb-4 flex-grow">
        <p className="text-black whitespace-pre-wrap break-words">{content || 'Select a prompt from the list to see its content.'}</p>
      </div>

      <div className="border rounded-lg overflow-hidden flex flex-col flex-grow">
        <details className="p-4 flex flex-col overflow-hidden h-full" open>
          <summary className="font-bold cursor-pointer text-black flex justify-between items-center mb-4 flex-shrink-0">
            <span>AI Analysis</span>
            {aiAnalysis.length > 0 && (
              <button 
                className="bg-gray-200 text-black text-xs py-1 px-2 rounded-md hover:bg-gray-300"
                onClick={(e) => {
                  e.preventDefault(); // prevent details from toggling
                  handleCopy();
                }}
              >
                {copyButtonText}
              </button>
            )}
          </summary>
          <div 
            className="prose max-w-none text-black overflow-y-auto flex-grow"
            dangerouslySetInnerHTML={{ __html: analysisHtml }}
          />
          <div ref={analysisEndRef} />
        </details>
      </div>
    </div>
  );
};

export default PromptDisplay;
