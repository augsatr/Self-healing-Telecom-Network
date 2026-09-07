'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Network, Brain, Globe, Zap, FileText, BarChart3 } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Activity },
  { href: '/globe', label: '3D Globe', icon: Globe },
  { href: '/topology', label: 'Network Map', icon: Network },
  { href: '/ai-engine', label: 'AI Engine', icon: Brain },
  { href: '/stress-test', label: 'Stress Test', icon: Zap },
  { href: '/reports', label: 'Reports', icon: FileText },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-green/20 to-neon-blue/20 border border-neon-green/30 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-neon-green" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide">SELF-HEALING</span>
              <span className="text-[10px] block text-slate-400 -mt-0.5">TELECOM NETWORK</span>
            </div>
          </Link>

          <div className="flex items-center gap-1 overflow-x-auto">
            {navItems.map(item => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-neon-green/10 text-neon-green border border-neon-green/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20">
              <div className="w-2 h-2 rounded-full bg-neon-green pulse-dot" />
              <span className="text-xs font-medium text-neon-green">LIVE</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
