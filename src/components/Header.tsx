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
    <header className="sticky top-0 z-10 border-b border-[#1e1e1e] bg-[#0a0a0a]/95 backdrop-blur">
      <div className="max-w-[90rem] mx-auto px-8 py-4 flex items-center justify-between">
        <Link href="/today" className="text-sm font-semibold tracking-widest uppercase text-[#e0ddd8] hover:text-white transition-colors">
          Morning Briefing
        </Link>
        <nav className="flex gap-6 text-xs text-[#555] tracking-wider uppercase">
          <Link href="/archive" className="hover:text-[#e0ddd8] transition-colors">Archive</Link>
          <button onClick={logout} className="hover:text-[#e0ddd8] transition-colors">Logout</button>
        </nav>
      </div>
    </header>
  );
}
