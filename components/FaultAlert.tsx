'use client';

import { FaultEvent, NetworkNode } from '@/lib/types';
import { AlertTriangle, CheckCircle, Clock, Radio } from 'lucide-react';

interface Props {
  faults: FaultEvent[];
  nodes: NetworkNode[];
}

const SEVERITY_CONFIG = {
  low: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  medium: { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  high: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  critical: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
};

export default function FaultAlert({ faults, nodes }: Props) {
  const recentFaults = faults.slice(-8).reverse();

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-neon-red" />
          <h3 className="text-sm font-semibold">Fault Monitor</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-red pulse-dot" />
          <span className="text-xs text-slate-400">{faults.filter(f => !f.resolved).length} active</span>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {recentFaults.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <CheckCircle className="w-10 h-10 mx-auto mb-2 text-neon-green/50" />
            <p className="text-sm">All systems healthy</p>
          </div>
        ) : (
          recentFaults.map(fault => {
            const config = SEVERITY_CONFIG[fault.severity];
            const node = nodes.find(n => n.id === fault.nodeId);
            return (
              <div
                key={fault.id}
                className={`px-4 py-3 border-b border-white/5 ${fault.resolved ? 'opacity-50' : ''} hover:bg-white/[0.02] transition-colors`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {fault.resolved ? (
                      <CheckCircle className="w-4 h-4 text-neon-green" />
                    ) : (
                      <AlertTriangle className={`w-4 h-4 ${config.color}`} />
                    )}
                    <span className="text-sm font-medium">{fault.type.replace('-', ' ').toUpperCase()}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} ${config.color} ${config.border} border`}>
                    {fault.severity.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-1 ml-6">
                  <span className="text-xs text-slate-400">{node?.name || 'Unknown'}</span>
                  <span className="text-[10px] text-slate-500">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {fault.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {fault.predicted && (
                  <div className="mt-1 ml-6">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                      AI PREDICTED
                    </span>
                  </div>
                )}

                {fault.resolved && fault.healingAction && (
                  <div className="mt-2 ml-6 p-2 rounded bg-neon-green/5 border border-neon-green/10">
                    <p className="text-[11px] text-neon-green">
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      {fault.healingAction}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
