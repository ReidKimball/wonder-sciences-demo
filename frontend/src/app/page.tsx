import PromptList from '@/components/PromptList';
import PromptDisplay from '@/components/PromptDisplay';
import Chat from '@/components/Chat';

export default function Home() {
  return (
    <main className="flex h-screen">
      <PromptList />
      <PromptDisplay />
      <Chat />
    </main>
  );
}
