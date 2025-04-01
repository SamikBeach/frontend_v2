import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Page() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <h1 className="bg-yellow-500 text-xl font-bold underline">
          Hello world!
        </h1>
        <Input placeholder="Hello" />
        <Button variant="outline">Click me</Button>
      </main>
    </>
  );
}
