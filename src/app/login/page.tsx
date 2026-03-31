import { PinForm } from '@/components/PinForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const safeTo = from?.startsWith('/') && !from.startsWith('//') ? from : '/today';
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
      <h1 className="font-serif text-2xl mb-8 text-neutral-800">Morning Briefing</h1>
      <PinForm from={safeTo} />
    </main>
  );
}
