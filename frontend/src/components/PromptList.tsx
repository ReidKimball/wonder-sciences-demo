import React from 'react';

const PromptList = () => {
  return (
    <div className="w-1/4 bg-gray-100 p-4">
      <h2 className="text-lg font-bold mb-4 text-black">System Prompts</h2>
      <ul>
        <li className="p-2 hover:bg-gray-200 cursor-pointer text-black">Prompt 1</li>
        <li className="p-2 hover:bg-gray-200 cursor-pointer text-black">Prompt 2</li>
        <li className="p-2 hover:bg-gray-200 cursor-pointer text-black">Prompt 3</li>
      </ul>
    </div>
  );
};

export default PromptList;
