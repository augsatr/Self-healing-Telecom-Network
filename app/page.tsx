'use client';

import { useState, useEffect, useCallback } from 'react';
import { NetworkSimulator } from '@/lib/network-simulator';
import { AIEngine } from '@/lib/ai-engine';
import { FaultEvent, AIPrediction, NetworkNode } from '@/lib/types';
import MetricsPanel from '@/components/MetricsPanel';
import NetworkStatsChart from '@/components/NetworkStatsChart';
import FaultAlert from '@/components/FaultAlert';
import AutoHealingPanel from '@/components/AutoHealingPanel';
import AIPredictions from '@/components/AIPredictions';
import NodeDetails from '@/components/NodeDetails';
import EnhancedAIDashboard from '@/components/EnhancedAIDashboard';

const simulator = new NetworkSimulator();
const aiEngine = new AIEngine();

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(simulator.metrics);
  const [faults, setFaults] = useState<FaultEvent[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [healingEvents, setHealingEvents] = useState<{
    nodeId: string;
    action: string;
    timestamp: Date;
    success: boolean;
  }[]>([]);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [nodePrediction, setNodePrediction] = useState<AIPrediction | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [aiMetrics, setAiMetrics] = useState({
    accuracy: 96.2,
    precision: 95.8,
    recall: 94.1,
    f1Score: 94.9,
    predictions: 0,
    avgResponseTime: 118,
  });
  const [anomalies, setAnomalies] = useState<{ time: number; value: number; type: string }[]>([]);

  const tick = useCallback(() => {
    const { newFaults, healedFaults, updatedMetrics } = simulator.simulateTick();

    if (newFaults.length > 0) {
      setFaults(prev => [...prev, ...newFaults]);
      newFaults.forEach(fault => {
        const node = simulator.getNodeById(fault.nodeId);
        if (node) {
          const pred = aiEngine.analyzeNode(node);
          if (pred) setPredictions(prev => [...prev.slice(-20), pred]);
        }
      });
      setAnomalies(prev => [...prev.slice(-50), {
        time: Date.now(),
        value: Math.random() * 100,
        type: newFaults[0].type,
      }]);
    }

    if (healedFaults.length > 0) {
      setFaults(prev => [...prev]);
      healedFaults.forEach(fault => {
        setHealingEvents(prev => [...prev, {
          nodeId: fault.nodeId,
          action: fault.healingAction || 'Auto-healing completed',
          timestamp: new Date(),
          success: true,
        }]);
      });
    }

    simulator.nodes.forEach(node => {
      if (node.status !== 'offline' && Math.random() < 0.1) {
        const pred = aiEngine.analyzeNode(node);
        if (pred) {
          setPredictions(prev => {
            const exists = prev.some(p => p.nodeId === pred.nodeId && p.faultType === pred.faultType);
            if (exists) return prev;
            return [...prev.slice(-20), pred];
          });
        }
      }
    });

    setAiMetrics(prev => ({
      ...prev,
      predictions: prev.predictions + newFaults.length + Math.floor(Math.random() * 3),
      accuracy: 94 + Math.random() * 4,
      precision: 93 + Math.random() * 5,
      recall: 91 + Math.random() * 6,
      f1Score: 92 + Math.random() * 5,
      avgResponseTime: 100 + Math.floor(Math.random() * 40),
    }));

    setMetrics(prev => [...prev.slice(-30), updatedMetrics]);
  }, []);

  useEffect(() => {
    tick();
    const interval = setInterval(() => {
      if (isRunning) tick();
    }, 2000);
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const handleNodeSelect = (nodeId: string | null) => {
    if (!nodeId) {
      setSelectedNode(null);
      setNodePrediction(null);
      return;
    }
    const node = simulator.getNodeById(nodeId);
    if (node) {
      setSelectedNode(node);
      const pred = aiEngine.analyzeNode(node);
      setNodePrediction(pred);
    }
  };

  const latestMetrics = metrics[metrics.length - 1] || {
    timestamp: 0, totalNodes: 32, healthyNodes: 32, activeFaults: 0, resolvedFaults: 0,
    avgLatency: 0, totalBandwidth: 0, networkUptime: 100, aiAccuracy: 95.7, healingSuccessRate: 100,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Network Operations Center</h1>
          <p className="text-sm text-slate-400 mt-0.5">AI-powered self-healing telecom infrastructure</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isRunning
                ? 'bg-neon-green/10 text-neon-green border border-neon-green/20 hover:bg-neon-green/20'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {isRunning ? '⏸ Pause' : '▶ Resume'}
          </button>
          <button
            onClick={() => {
              const node = simulator.nodes[Math.floor(Math.random() * simulator.nodes.length)];
              node.status = 'critical';
              const fault: FaultEvent = {
                id: `fault-manual-${Date.now()}`,
                nodeId: node.id,
                type: 'hardware',
                severity: 'critical',
                timestamp: new Date(),
                predicted: false,
                resolved: false,
              };
              setFaults(prev => [...prev, fault]);
              simulator.faults.push(fault);
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
          >
            ⚡ Inject Fault
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <MetricsPanel metrics={latestMetrics} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts & Predictions */}
        <div className="lg:col-span-2 space-y-6">
          <NetworkStatsChart metrics={metrics} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AIPredictions predictions={predictions} nodes={simulator.nodes} />
            <AutoHealingPanel
              nodes={simulator.nodes}
              links={simulator.links}
              healingEvents={healingEvents}
            />
          </div>
        </div>

        {/* Right Column - Faults & Node Details */}
        <div className="space-y-6">
          {selectedNode ? (
            <NodeDetails
              node={selectedNode}
              prediction={nodePrediction}
              onClose={() => { setSelectedNode(null); setNodePrediction(null); }}
            />
          ) : (
            <FaultAlert faults={faults} nodes={simulator.nodes} />
          )}
        </div>
      </div>

      {/* Enhanced AI Dashboard */}
      <EnhancedAIDashboard metrics={aiMetrics} anomalies={anomalies} />
    </div>
  );
}
