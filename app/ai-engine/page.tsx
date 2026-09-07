'use client';

import { useState, useEffect, useCallback } from 'react';
import { NetworkSimulator } from '@/lib/network-simulator';
import { AIEngine } from '@/lib/ai-engine';
import { AIPrediction, NetworkNode, FaultEvent } from '@/lib/types';
import { Brain, Target, Zap, Shield, Activity, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

const simulator = new NetworkSimulator();
const aiEngine = new AIEngine();

export default function AIEnginePage() {
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [healingPlans, setHealingPlans] = useState<{
    fault: FaultEvent;
    steps: string[];
    estimatedRecoveryTime: number;
    impactScore: number;
  }[]>([]);
  const [modelStats, setModelStats] = useState({
    totalPredictions: 0,
    correctPredictions: 0,
    accuracy: 95.7,
    avgResponseTime: 120,
  });
  const [tick, setTick] = useState(0);

  const runTick = useCallback(() => {
    const result = simulator.simulateTick();

    // Run AI analysis on all nodes
    const newPredictions: AIPrediction[] = [];
    simulator.nodes.forEach(node => {
      if (node.status !== 'offline' && Math.random() < 0.15) {
        const pred = aiEngine.analyzeNode(node);
        if (pred) newPredictions.push(pred);
      }
    });

    if (newPredictions.length > 0) {
      setPredictions(prev => [...prev.slice(-30), ...newPredictions]);
      setModelStats(prev => ({
        ...prev,
        totalPredictions: prev.totalPredictions + newPredictions.length,
        correctPredictions: prev.correctPredictions + Math.floor(newPredictions.length * 0.95),
        accuracy: aiEngine.getAccuracy(),
      }));
    }

    // Generate healing plans for new faults
    result.newFaults.forEach(fault => {
      const plan = aiEngine.generateHealingPlan(fault, simulator.nodes);
      setHealingPlans(prev => [...prev.slice(-10), { fault, ...plan }]);
    });

    setTick(t => t + 1);
  }, []);

  useEffect(() => {
    runTick();
    const interval = setInterval(runTick, 3000);
    return () => clearInterval(interval);
  }, [runTick]);

  const criticalPredictions = predictions.filter(p => p.probability > 0.8);
  const recentPlans = healingPlans.slice(-5).reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">AI Engine Control Center</h1>
        <p className="text-sm text-slate-400 mt-0.5">Predictive analytics, fault detection, and autonomous healing intelligence</p>
      </div>

      {/* Model Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: Brain,
            label: 'Model Accuracy',
            value: `${modelStats.accuracy}%`,
            color: 'text-neon-purple',
            bg: 'bg-purple-500/10',
          },
          {
            icon: Target,
            label: 'Total Predictions',
            value: modelStats.totalPredictions.toString(),
            color: 'text-neon-blue',
            bg: 'bg-neon-blue/10',
          },
          {
            icon: Zap,
            label: 'Avg Response',
            value: `${modelStats.avgResponseTime}ms`,
            color: 'text-neon-green',
            bg: 'bg-neon-green/10',
          },
          {
            icon: Shield,
            label: 'Critical Alerts',
            value: criticalPredictions.length.toString(),
            color: 'text-red-400',
            bg: 'bg-red-400/10',
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className={`${stat.bg} p-2.5 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Predictions */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <Brain className="w-4 h-4 text-neon-purple" />
            <h3 className="text-sm font-semibold">Real-time Predictions</h3>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-neon-purple pulse-dot" />
              <span className="text-[10px] text-slate-400">ANALYZING</span>
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {predictions.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Brain className="w-10 h-10 mx-auto mb-2 text-neon-purple/30" />
                <p className="text-sm">Awaiting network data...</p>
              </div>
            ) : (
              predictions.slice(-15).reverse().map((pred, i) => {
                const node = simulator.getNodeById(pred.nodeId);
                return (
                  <div
                    key={i}
                    className={`px-4 py-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                      pred.probability > 0.8 ? 'bg-red-500/[0.03]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-3.5 h-3.5 ${
                          pred.probability > 0.8 ? 'text-red-400' : 'text-yellow-400'
                        }`} />
                        <span className="text-xs font-medium">{pred.faultType}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        pred.probability > 0.8
                          ? 'bg-red-400/10 text-red-400'
                          : 'bg-yellow-400/10 text-yellow-400'
                      }`}>
                        {(pred.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 ml-5 mb-1">{node?.name || pred.nodeId}</p>
                    <div className="flex items-center gap-4 ml-5 text-[10px]">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {pred.timeToFailure}min to failure
                      </span>
                      <span className="text-neon-green">{pred.recommendedAction}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Healing Plans */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-neon-green" />
            <h3 className="text-sm font-semibold">Auto-Healing Plans</h3>
          </div>
          <div className="max-h-[500px] overflow-y-auto p-4 space-y-4">
            {recentPlans.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Shield className="w-10 h-10 mx-auto mb-2 text-neon-green/30" />
                <p className="text-sm">No faults detected. All systems nominal.</p>
              </div>
            ) : (
              recentPlans.map((plan, i) => (
                <div key={i} className="rounded-lg border border-white/5 overflow-hidden">
                  <div className="px-3 py-2 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="text-xs font-medium">{plan.fault.type.replace('-', ' ').toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        plan.impactScore > 0.8
                          ? 'bg-red-400/10 text-red-400'
                          : 'bg-yellow-400/10 text-yellow-400'
                      }`}>
                        Impact: {(plan.impactScore * 100).toFixed(0)}%
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ETA: {plan.estimatedRecoveryTime}s
                      </span>
                    </div>
                  </div>
                  <div className="p-3 space-y-1.5">
                    {plan.steps.map((step, j) => (
                      <div key={j} className="flex items-start gap-2 text-[11px]">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                          j < plan.steps.length - 1 ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-blue/20 text-neon-blue'
                        }`}>
                          {j + 1}
                        </span>
                        <span className="text-slate-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Model Performance */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-neon-green" />
          Model Performance Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Precision', value: '96.2%', desc: 'True positives / Predicted positives' },
            { label: 'Recall', value: '93.8%', desc: 'True positives / Actual positives' },
            { label: 'F1 Score', value: '95.0%', desc: 'Harmonic mean of precision & recall' },
            { label: 'Latency', value: '<120ms', desc: 'Average inference time' },
          ].map((metric, i) => (
            <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <p className="text-xs text-slate-400 mb-1">{metric.label}</p>
              <p className="text-lg font-bold text-neon-green">{metric.value}</p>
              <p className="text-[10px] text-slate-500 mt-1">{metric.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
