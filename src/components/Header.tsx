'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur">
      <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/today" className="font-serif text-sm font-semibold">Morning Briefing</Link>
        <nav className="flex gap-5 text-xs text-neutral-500">
          <Link href="/archive" className="hover:text-neutral-900 transition-colors">Archive</Link>
          <button onClick={logout} className="hover:text-neutral-900 transition-colors">Logout</button>
        </nav>
      </div>
    </header>
  );
}
