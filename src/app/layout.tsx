import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Morning Briefing',
  description: 'Your personal daily news briefing',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body className="bg-[#080808] text-[#ece9e4] antialiased min-h-screen">
        {/* Radial glow — top-center indigo/violet */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ background: 'radial-gradient(ellipse 80% 70% at 50% -10%, rgba(99,102,241,0.20) 0%, rgba(139,92,246,0.09) 40%, transparent 70%)' }}
        />
        {/* Radial glow — bottom-right blue accent */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ background: 'radial-gradient(ellipse 45% 55% at 95% 110%, rgba(59,130,246,0.11) 0%, transparent 65%)' }}
        />
        {/* Dot grid at 45% opacity */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ opacity: 0.45, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.13) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
