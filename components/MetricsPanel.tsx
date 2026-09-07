'use client';

import { MetricsSnapshot } from '@/lib/types';
import { Activity, Cpu, Wifi, Clock, Shield, Zap, TrendingUp, Server } from 'lucide-react';

interface Props {
  metrics: MetricsSnapshot;
}

export default function MetricsPanel({ metrics }: Props) {
  const cards = [
    {
      label: 'Network Uptime',
      value: `${metrics.networkUptime}%`,
      icon: Activity,
      color: metrics.networkUptime > 95 ? 'text-neon-green' : metrics.networkUptime > 85 ? 'text-yellow-400' : 'text-red-400',
      bg: metrics.networkUptime > 95 ? 'bg-neon-green/10' : metrics.networkUptime > 85 ? 'bg-yellow-400/10' : 'bg-red-400/10',
    },
    {
      label: 'Active Nodes',
      value: `${metrics.healthyNodes}/${metrics.totalNodes}`,
      icon: Server,
      color: 'text-neon-blue',
      bg: 'bg-neon-blue/10',
    },
    {
      label: 'Avg Latency',
      value: `${metrics.avgLatency}ms`,
      icon: Clock,
      color: metrics.avgLatency < 15 ? 'text-neon-green' : metrics.avgLatency < 30 ? 'text-yellow-400' : 'text-red-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Active Faults',
      value: metrics.activeFaults.toString(),
      icon: Shield,
      color: metrics.activeFaults === 0 ? 'text-neon-green' : metrics.activeFaults < 3 ? 'text-yellow-400' : 'text-red-400',
      bg: metrics.activeFaults === 0 ? 'bg-neon-green/10' : 'bg-red-400/10',
    },
    {
      label: 'Resolved Faults',
      value: metrics.resolvedFaults.toString(),
      icon: Zap,
      color: 'text-neon-green',
      bg: 'bg-neon-green/10',
    },
    {
      label: 'AI Accuracy',
      value: `${metrics.aiAccuracy}%`,
      icon: TrendingUp,
      color: 'text-neon-purple',
      bg: 'bg-neon-purple/10',
    },
    {
      label: 'Heal Success',
      value: `${metrics.healingSuccessRate}%`,
      icon: Activity,
      color: 'text-neon-blue',
      bg: 'bg-neon-blue/10',
    },
    {
      label: 'Total Bandwidth',
      value: `${(metrics.totalBandwidth / 1000).toFixed(1)}G`,
      icon: Wifi,
      color: 'text-neon-green',
      bg: 'bg-neon-green/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="glass-card rounded-xl p-4 flex items-start gap-3 hover:border-white/10 transition-all"
          >
            <div className={`${card.bg} p-2 rounded-lg`}>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">{card.label}</p>
              <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
