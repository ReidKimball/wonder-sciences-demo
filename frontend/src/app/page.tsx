'use client';

import { useState } from 'react';
import PromptList from '@/components/PromptList';
import PromptDisplay from '@/components/PromptDisplay';
import Chat from '@/components/Chat';

export default function Home() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  return (
    <main className="flex h-screen">
      <PromptList onSelectPrompt={setSelectedPrompt} />
      <PromptDisplay selectedPrompt={selectedPrompt} />
      <Chat />
    </main>
  );
}
