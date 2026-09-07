'use client';

import { NetworkNode } from '@/lib/types';
import { Cpu, HardDrive, Wifi, Clock, MapPin, Layers } from 'lucide-react';

interface Props {
  nodes: NetworkNode[];
}

const SLICE_COLORS = {
  'enhanced-mbb': { label: 'eMBB', color: 'text-neon-blue', bg: 'bg-neon-blue/10' },
  'ultra-reliable': { label: 'URLLC', color: 'text-neon-green', bg: 'bg-neon-green/10' },
  'massive-iot': { label: 'mMTC', color: 'text-neon-purple', bg: 'bg-purple-500/10' },
};

export default function DigitalTwin({ nodes }: Props) {
  const sliceGroups = nodes.reduce((acc, node) => {
    if (!acc[node.slice]) acc[node.slice] = [];
    acc[node.slice].push(node);
    return acc;
  }, {} as Record<string, NetworkNode[]>);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <Layers className="w-4 h-4 text-neon-purple" />
        <h3 className="text-sm font-semibold">Digital Twin</h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20 ml-auto">
          MIRROR ACTIVE
        </span>
      </div>

      <div className="p-4 space-y-4">
        {Object.entries(sliceGroups).map(([sliceType, sliceNodes]) => {
          const config = SLICE_COLORS[sliceType as keyof typeof SLICE_COLORS];
          const healthy = sliceNodes.filter(n => n.status === 'healthy').length;
          const avgCpu = sliceNodes.reduce((s, n) => s + n.cpu, 0) / sliceNodes.length;
          const avgMem = sliceNodes.reduce((s, n) => s + n.memory, 0) / sliceNodes.length;
          const avgLatency = sliceNodes.reduce((s, n) => s + n.latency, 0) / sliceNodes.length;

          return (
            <div key={sliceType} className="rounded-lg border border-white/5 overflow-hidden">
              <div className="px-3 py-2 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${config.color}`}>{config.label}</span>
                  <span className="text-[10px] text-slate-500">
                    {sliceType === 'enhanced-mbb' && 'Enhanced Mobile Broadband'}
                    {sliceType === 'ultra-reliable' && 'Ultra-Reliable Low Latency'}
                    {sliceType === 'massive-iot' && 'Massive Machine-Type Comm'}
                  </span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                  {healthy}/{sliceNodes.length} nodes
                </span>
              </div>

              <div className="p-3 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-slate-500 mb-1">Avg CPU</p>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        avgCpu > 80 ? 'bg-red-400' : avgCpu > 60 ? 'bg-yellow-400' : 'bg-neon-green'
                      }`}
                      style={{ width: `${avgCpu}%` }}
                    />
                  </div>
                  <p className="text-[10px] mt-0.5">{avgCpu.toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Memory</p>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        avgMem > 80 ? 'bg-red-400' : avgMem > 60 ? 'bg-yellow-400' : 'bg-neon-green'
                      }`}
                      style={{ width: `${avgMem}%` }}
                    />
                  </div>
                  <p className="text-[10px] mt-0.5">{avgMem.toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Latency</p>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        avgLatency > 30 ? 'bg-red-400' : avgLatency > 15 ? 'bg-yellow-400' : 'bg-neon-green'
                      }`}
                      style={{ width: `${Math.min(100, avgLatency * 2.5)}%` }}
                    />
                  </div>
                  <p className="text-[10px] mt-0.5">{avgLatency.toFixed(1)}ms</p>
                </div>
              </div>

              {/* Node list */}
              <div className="px-3 pb-3 flex flex-wrap gap-1">
                {sliceNodes.map(node => (
                  <div
                    key={node.id}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      node.status === 'healthy' ? 'bg-neon-green' :
                      node.status === 'warning' ? 'bg-yellow-400' :
                      node.status === 'critical' ? 'bg-red-400' :
                      node.status === 'healing' ? 'bg-neon-blue animate-pulse' :
                      'bg-slate-600'
                    }`}
                    title={node.name}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
