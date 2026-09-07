'use client';

import { NetworkNode, AIPrediction } from '@/lib/types';
import { Cpu, HardDrive, Wifi, Clock, MapPin, Activity, Brain, X } from 'lucide-react';

interface Props {
  node: NetworkNode;
  prediction: AIPrediction | null;
  onClose: () => void;
}

const STATUS_CONFIG = {
  healthy: { label: 'Healthy', color: 'text-neon-green', bg: 'bg-neon-green/10', dot: 'bg-neon-green' },
  warning: { label: 'Warning', color: 'text-yellow-400', bg: 'bg-yellow-400/10', dot: 'bg-yellow-400' },
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-400/10', dot: 'bg-red-400' },
  offline: { label: 'Offline', color: 'text-slate-400', bg: 'bg-slate-400/10', dot: 'bg-slate-400' },
  healing: { label: 'Healing', color: 'text-neon-blue', bg: 'bg-neon-blue/10', dot: 'bg-neon-blue' },
};

export default function NodeDetails({ node, prediction, onClose }: Props) {
  const config = STATUS_CONFIG[node.status];

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-neon-green" />
          <h3 className="text-sm font-semibold">Node Details</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm">{node.name}</h4>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} ${config.color} flex items-center gap-1`}>
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              {config.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{node.region}</span>
            <span className="flex items-center gap-1"><Wifi className="w-3 h-3" />{node.type.replace('-', ' ')}</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Cpu, label: 'CPU', value: node.cpu, color: node.cpu > 80 ? 'text-red-400' : 'text-neon-green' },
            { icon: HardDrive, label: 'Memory', value: node.memory, color: node.memory > 80 ? 'text-red-400' : 'text-neon-green' },
            { icon: Wifi, label: 'Bandwidth', value: node.bandwidth / 100, color: 'text-neon-blue' },
            { icon: Clock, label: 'Latency', value: node.latency, color: node.latency > 25 ? 'text-yellow-400' : 'text-neon-green' },
          ].map(metric => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] text-slate-400 uppercase">{metric.label}</span>
                </div>
                <p className={`text-lg font-bold ${metric.color}`}>
                  {metric.label === 'Bandwidth' ? `${metric.value.toFixed(0)} Mbps` :
                   metric.label === 'Latency' ? `${metric.value.toFixed(1)} ms` :
                   `${metric.value.toFixed(0)}%`}
                </p>
                <div className="w-full h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      metric.value > 80 ? 'bg-red-400' : metric.value > 60 ? 'bg-yellow-400' : 'bg-neon-green'
                    }`}
                    style={{ width: `${Math.min(100, metric.label === 'Latency' ? metric.value * 2.5 : metric.value)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Prediction */}
        {prediction && (
          <div className="p-3 rounded-lg bg-neon-purple/5 border border-neon-purple/20">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-neon-purple" />
              <span className="text-xs font-semibold text-neon-purple">AI Prediction</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Fault Type:</span>
                <span className="text-white">{prediction.faultType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Probability:</span>
                <span className={prediction.probability > 0.8 ? 'text-red-400' : 'text-yellow-400'}>
                  {(prediction.probability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time to Failure:</span>
                <span className="text-white">{prediction.timeToFailure} min</span>
              </div>
              <div className="mt-2 p-2 rounded bg-white/[0.03]">
                <p className="text-[10px] text-slate-400 mb-0.5">Recommended Action:</p>
                <p className="text-neon-green">{prediction.recommendedAction}</p>
              </div>
            </div>
          </div>
        )}

        {/* Connections */}
        <div>
          <p className="text-xs text-slate-400 mb-2">Connected Nodes ({node.connections.length})</p>
          <div className="flex flex-wrap gap-1">
            {node.connections.map(connId => (
              <span key={connId} className="text-[10px] px-2 py-1 rounded bg-white/5 text-slate-300">
                {connId}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
