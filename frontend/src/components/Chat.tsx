import React from 'react';

const Chat = () => {
  return (
    <div className="w-1/4 bg-gray-100 p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-4 text-black">Chat</h2>
      <div className="flex-grow border rounded-lg p-2 mb-4 bg-white"></div>
      <div className="flex">
        <input type="text" className="flex-grow border rounded-l-lg p-2 text-black placeholder:text-gray-500" placeholder="Type your message..." />
        <button className="bg-blue-500 text-white p-2 rounded-r-lg">Send</button>
      </div>
    </div>
  );
};

export default Chat;
