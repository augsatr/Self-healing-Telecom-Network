import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import ParticleBackground from '@/components/ParticleBackground';

export const metadata: Metadata = {
  title: 'AI Self-Healing Telecom Network',
  description: 'Next-gen telecom network with AI-driven fault prediction and autonomous healing',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0e1a]">
        <ParticleBackground />
        <Navbar />
        <main className="pt-16 relative z-10">{children}</main>
      </body>
    </html>
  );
}
