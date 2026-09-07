'use client';

import { MetricsSnapshot } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface Props {
  metrics: MetricsSnapshot[];
}

export default function NetworkStatsChart({ metrics }: Props) {
  const data = metrics.slice(-20).map((m, i) => ({
    time: i,
    uptime: m.networkUptime,
    latency: m.avgLatency,
    faults: m.activeFaults,
    aiAccuracy: m.aiAccuracy,
  }));

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-neon-green" />
        <h3 className="text-sm font-semibold">Network Performance</h3>
      </div>

      <div className="p-4">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ccff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ccff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" hide />
              <YAxis
                yAxisId="left"
                stroke="rgba(255,255,255,0.2)"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                domain={[80, 100]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="rgba(255,255,255,0.2)"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1f35',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="uptime"
                stroke="#00ff88"
                fill="url(#uptimeGrad)"
                strokeWidth={2}
                name="Uptime %"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="latency"
                stroke="#00ccff"
                fill="url(#latencyGrad)"
                strokeWidth={2}
                name="Latency ms"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-1 rounded-full bg-neon-green" />
            <span className="text-slate-400">Uptime %</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-1 rounded-full bg-neon-blue" />
            <span className="text-slate-400">Latency ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
