import { PinForm } from '@/components/PinForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const safeTo = from?.startsWith('/') && !from.startsWith('//') ? from : '/today';
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a]">
      <p className="text-xs tracking-[0.25em] uppercase text-[#444] mb-3">Morning Briefing</p>
      <h1 className="text-2xl font-semibold text-[#e0ddd8] mb-10">Enter PIN</h1>
      <PinForm from={safeTo} />
    </main>
  );
}
