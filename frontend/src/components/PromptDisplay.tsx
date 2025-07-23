import React from 'react';

const PromptDisplay = () => {
  return (
    <div className="w-1/2 bg-white p-4">
      <h2 className="text-lg font-bold mb-4 text-black">Selected Prompt</h2>
      <p className="text-black">This is where the selected system prompt will be displayed.</p>
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
