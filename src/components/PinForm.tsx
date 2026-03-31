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
    if (res.ok) {
      router.push(from);
    } else {
      setError('Incorrect PIN. Try again.');
      setPin('');
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
        className="text-center text-3xl tracking-widest border border-neutral-300 rounded-lg p-4 w-32 focus:outline-none focus:ring-2 focus:ring-neutral-800"
        autoFocus
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={pin.length !== 4 || loading}
        className="bg-neutral-900 text-white rounded-lg py-2 px-8 disabled:opacity-40 transition-opacity"
      >
        {loading ? 'Checking…' : 'Enter'}
      </button>
    </form>
  );
}
