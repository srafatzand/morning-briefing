'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function PinForm({ from }: { from: string }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    try {
      if (res.ok) {
        router.push(from);
      } else {
        setError('Incorrect PIN. Try again.');
        setPin('');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <input
        type="password"
        inputMode="numeric"
        maxLength={4}
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
        placeholder="••••"
        className="text-center text-3xl tracking-widest bg-[#111] border border-[#2a2a2a] text-[#e0ddd8] p-4 w-32 focus:outline-none focus:border-[#555] transition-colors"
        autoFocus
      />
      {error && <p className="text-[#c0392b] text-xs tracking-wide">{error}</p>}
      <button
        type="submit"
        disabled={pin.length !== 4 || loading}
        className="bg-[#e0ddd8] text-[#0a0a0a] text-xs tracking-widest uppercase py-2 px-8 font-semibold disabled:opacity-30 transition-opacity hover:bg-white"
      >
        {loading ? 'Checking…' : 'Enter'}
      </button>
    </form>
  );
}
