'use client';

import { useState, useEffect } from 'react';
import { NetworkNode, NetworkLink } from '@/lib/types';
import { Shield, Zap, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

interface Props {
  nodes: NetworkNode[];
  links: NetworkLink[];
  healingEvents: { nodeId: string; action: string; timestamp: Date; success: boolean }[];
}

export default function AutoHealingPanel({ nodes, links, healingEvents }: Props) {
  const [activeHealings, setActiveHealings] = useState<Set<string>>(new Set());

  useEffect(() => {
    healingEvents.forEach(event => {
      if (!event.success) return;
      setActiveHealings(prev => new Set(prev).add(event.nodeId));
      setTimeout(() => {
        setActiveHealings(prev => {
          const next = new Set(prev);
          next.delete(event.nodeId);
          return next;
        });
      }, 5000);
    });
  }, [healingEvents]);

  const reroutedNodes = nodes.filter(n => activeHealings.has(n.id));

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <Shield className="w-4 h-4 text-neon-blue" />
        <h3 className="text-sm font-semibold">Auto-Healing Engine</h3>
        <div className="ml-auto flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-neon-green" />
          <span className="text-xs text-neon-green font-medium">ACTIVE</span>
        </div>
      </div>

      <div className="p-4">
        {/* Healing Pipeline */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Healing Pipeline</h4>
          <div className="flex items-center gap-2 text-xs">
            {['Detect', 'Analyze', 'Isolate', 'Reroute', 'Recover', 'Verify'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`px-2.5 py-1.5 rounded-lg border ${
                  i < 4 ? 'bg-neon-green/10 border-neon-green/20 text-neon-green' :
                  i === 4 ? 'bg-neon-blue/10 border-neon-blue/20 text-neon-blue animate-pulse' :
                  'bg-white/5 border-white/10 text-slate-400'
                }`}>
                  {step}
                </div>
                {i < 5 && <ArrowRight className="w-3 h-3 text-slate-600" />}
              </div>
            ))}
          </div>
        </div>

        {/* Active Rerouting */}
        {reroutedNodes.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-neon-blue uppercase tracking-wider mb-2">
              Live Rerouting ({reroutedNodes.length})
            </h4>
            {reroutedNodes.map(node => (
              <div key={node.id} className="flex items-center gap-2 p-2 rounded-lg bg-neon-blue/5 border border-neon-blue/10 mb-1">
                <Loader2 className="w-3.5 h-3.5 text-neon-blue animate-spin" />
                <span className="text-xs">{node.name}</span>
                <span className="text-[10px] text-slate-500 ml-auto">Traffic migrating...</span>
              </div>
            ))}
          </div>
        )}

        {/* Recent Healing Events */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent Actions</h4>
          <div className="max-h-[200px] overflow-y-auto space-y-1.5">
            {healingEvents.slice(-6).reverse().map((event, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 p-2 rounded-lg text-xs ${
                  event.success ? 'bg-neon-green/5 border border-neon-green/10' : 'bg-red-500/5 border border-red-500/10'
                }`}
              >
                {event.success ? (
                  <CheckCircle className="w-3.5 h-3.5 text-neon-green mt-0.5 shrink-0" />
                ) : (
                  <Shield className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className={event.success ? 'text-neon-green' : 'text-red-400'}>{event.action}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{event.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {healingEvents.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">No healing events yet. System monitoring...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
