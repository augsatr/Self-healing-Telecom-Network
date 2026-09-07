'use client';

import { AIPrediction, NetworkNode } from '@/lib/types';
import { Brain, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

interface Props {
  predictions: AIPrediction[];
  nodes: NetworkNode[];
}

export default function AIPredictions({ predictions, nodes }: Props) {
  const recent = predictions.slice(-6).reverse();

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <Brain className="w-4 h-4 text-neon-purple" />
        <h3 className="text-sm font-semibold">AI Predictions</h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20 ml-auto">
          {predictions.length} TOTAL
        </span>
      </div>

      <div className="p-4 space-y-2">
        {recent.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">
            Monitoring network for anomalies...
          </p>
        ) : (
          recent.map((pred, i) => {
            const node = nodes.find(n => n.id === pred.nodeId);
            return (
              <div
                key={i}
                className={`p-3 rounded-lg border ${
                  pred.probability > 0.8
                    ? 'bg-red-500/5 border-red-500/20'
                    : pred.probability > 0.6
                    ? 'bg-yellow-500/5 border-yellow-500/20'
                    : 'bg-white/[0.02] border-white/5'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-3.5 h-3.5 ${
                      pred.probability > 0.8 ? 'text-red-400' : 'text-yellow-400'
                    }`} />
                    <span className="text-xs font-medium">{pred.faultType}</span>
                  </div>
                  <span className={`text-[10px] font-bold ${
                    pred.probability > 0.8 ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {(pred.probability * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-2">
                  <span>{node?.name || pred.nodeId}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {pred.timeToFailure}m to failure
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px]">
                  <ArrowRight className="w-3 h-3 text-neon-green shrink-0" />
                  <span className="text-neon-green">{pred.recommendedAction}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
