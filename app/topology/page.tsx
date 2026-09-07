'use client';

import { useState, useEffect, useCallback } from 'react';
import { NetworkSimulator } from '@/lib/network-simulator';
import { AIEngine } from '@/lib/ai-engine';
import { FaultEvent, AIPrediction, NetworkNode } from '@/lib/types';
import NetworkTopology from '@/components/NetworkTopology';
import NodeDetails from '@/components/NodeDetails';
import DigitalTwin from '@/components/DigitalTwin';
import { Layers, RefreshCw } from 'lucide-react';

const simulator = new NetworkSimulator();
const aiEngine = new AIEngine();

export default function TopologyPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodeDetails, setNodeDetails] = useState<NetworkNode | null>(null);
  const [nodePrediction, setNodePrediction] = useState<AIPrediction | null>(null);
  const [, setTick] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const tick = useCallback(() => {
    simulator.simulateTick();
    setTick(t => t + 1);
  }, []);

  useEffect(() => {
    tick();
    const interval = setInterval(() => {
      if (isRunning) tick();
    }, 2000);
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const handleNodeSelect = (nodeId: string | null) => {
    setSelectedNode(nodeId);
    if (nodeId) {
      const node = simulator.getNodeById(nodeId);
      setNodeDetails(node || null);
      const pred = aiEngine.analyzeNode(node!);
      setNodePrediction(pred);
    } else {
      setNodeDetails(null);
      setNodePrediction(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Network Topology</h1>
          <p className="text-sm text-slate-400 mt-0.5">Interactive map of 5G network infrastructure across India</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isRunning
                ? 'bg-neon-green/10 text-neon-green border border-neon-green/20'
                : 'bg-white/5 text-slate-400 border border-white/10'
            }`}
          >
            {isRunning ? '⏸ Pause' : '▶ Resume'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main topology view */}
        <div className="lg:col-span-3 glass-card rounded-xl overflow-hidden" style={{ height: '70vh' }}>
          <NetworkTopology
            nodes={simulator.nodes}
            links={simulator.links}
            selectedNode={selectedNode}
            onNodeSelect={handleNodeSelect}
          />
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {nodeDetails ? (
            <NodeDetails
              node={nodeDetails}
              prediction={nodePrediction}
              onClose={() => handleNodeSelect(null)}
            />
          ) : (
            <DigitalTwin nodes={simulator.nodes} />
          )}

          {/* Legend */}
          <div className="glass-card rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Legend</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-neon-green" />
                <span className="text-slate-300">Healthy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="text-slate-300">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-slate-300">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-neon-blue" />
                <span className="text-slate-300">Healing</span>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-[10px] text-slate-500 mb-2">Node Types</p>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-[10px] text-slate-400">◆ Tower</span>
                  <span className="text-[10px] text-slate-400">■ Edge Server</span>
                  <span className="text-[10px] text-slate-400">⬡ Core Router</span>
                  <span className="text-[10px] text-slate-400">● Base Station</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
