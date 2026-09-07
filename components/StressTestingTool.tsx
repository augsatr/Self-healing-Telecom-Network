'use client';

import { useState, useEffect, useRef } from 'react';
import { Zap, Shield, Activity, TrendingDown, PlayCircle, Square, BarChart3 } from 'lucide-react';

interface StressTestResult {
  timestamp: number;
  type: string;
  intensity: number;
  nodesAffected: number;
  recoveryTime: number;
  healingSuccess: boolean;
  trafficBefore: number;
  trafficAfter: number;
  latencySpike: number;
}

interface Props {
  onStressComplete?: (result: StressTestResult) => void;
}

const ATTACK_TYPES = [
  { id: 'ddos', name: 'DDoS Attack', icon: '🛡️', description: 'Simulates distributed denial-of-service flood', color: 'text-red-400' },
  { id: 'traffic-spike', name: 'Traffic Spike', icon: '📈', description: 'Sudden 10x bandwidth demand surge', color: 'text-yellow-400' },
  { id: 'node-failure', name: 'Mass Node Failure', icon: '💥', description: 'Multiple simultaneous node crashes', color: 'text-red-500' },
  { id: 'link-cut', name: 'Fiber Cut', icon: '✂️', description: 'Simulates backbone fiber cable cut', color: 'text-orange-400' },
  { id: 'power-outage', name: 'Power Outage', icon: '⚡', description: 'Regional power grid failure scenario', color: 'text-purple-400' },
  { id: 'cyber-attack', name: 'Cyber Attack', icon: '🔒', description: 'Malware infiltration attempt', color: 'text-red-400' },
];

export default function StressTestingTool({ onStressComplete }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAttack, setSelectedAttack] = useState<string>('ddos');
  const [intensity, setIntensity] = useState(50);
  const [duration, setDuration] = useState(30);
  const [results, setResults] = useState<StressTestResult[]>([]);
  const [currentPhase, setCurrentPhase] = useState('');
  const [liveMetrics, setLiveMetrics] = useState({
    traffic: 100,
    latency: 12,
    packetLoss: 0,
    activeNodes: 32,
    healingActive: false,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const runStressTest = async () => {
    setIsRunning(true);
    setCurrentPhase('Initializing attack simulation...');

    const attack = ATTACK_TYPES.find(a => a.id === selectedAttack)!;
    const startTime = Date.now();

    // Phase 1: Ramp up
    await new Promise(r => setTimeout(r, 1000));
    setCurrentPhase('⚡ Attack launched! Ramping up...');

    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 500));
      setLiveMetrics(prev => ({
        ...prev,
        traffic: prev.traffic + intensity * 3,
        latency: prev.latency + intensity * 0.5,
        packetLoss: Math.min(25, prev.packetLoss + intensity * 0.3),
        activeNodes: Math.max(10, prev.activeNodes - Math.floor(Math.random() * 3)),
      }));
    }

    // Phase 2: Peak attack
    setCurrentPhase('🔥 Peak attack - AI detecting anomalies...');
    await new Promise(r => setTimeout(r, 2000));
    setLiveMetrics(prev => ({
      ...prev,
      healingActive: true,
    }));

    // Phase 3: AI healing
    setCurrentPhase('🛡️ Auto-healing engaged! Rerouting traffic...');
    const recoverySteps = ['Isolating affected nodes', 'Activating redundant paths', 'Spinning up backup servers', 'Load balancing across healthy nodes'];

    for (const step of recoverySteps) {
      await new Promise(r => setTimeout(r, 1500));
      setCurrentPhase(`🛡️ ${step}...`);
      setLiveMetrics(prev => ({
        ...prev,
        traffic: Math.max(100, prev.traffic - intensity * 2),
        latency: Math.max(12, prev.latency - intensity * 0.3),
        packetLoss: Math.max(0, prev.packetLoss - intensity * 0.2),
        activeNodes: Math.min(32, prev.activeNodes + Math.floor(Math.random() * 2) + 1),
      }));
    }

    // Phase 4: Recovery
    setCurrentPhase('✅ Network recovered! Generating report...');
    await new Promise(r => setTimeout(r, 1000));

    const recoveryTime = Math.floor((Date.now() - startTime) / 1000);
    const result: StressTestResult = {
      timestamp: Date.now(),
      type: attack.name,
      intensity,
      nodesAffected: Math.floor(intensity / 5),
      recoveryTime,
      healingSuccess: Math.random() > 0.1,
      trafficBefore: 100,
      trafficAfter: 100 + intensity * 10,
      latencySpike: intensity * 2,
    };

    setResults(prev => [result, ...prev.slice(9)]);
    onStressComplete?.(result);

    setLiveMetrics({
      traffic: 100,
      latency: 12,
      packetLoss: 0,
      activeNodes: 32,
      healingActive: false,
    });

    setCurrentPhase('');
    setIsRunning(false);
  };

  const stopTest = () => {
    setIsRunning(false);
    setCurrentPhase('');
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLiveMetrics({
      traffic: 100,
      latency: 12,
      packetLoss: 0,
      activeNodes: 32,
      healingActive: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Live Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Traffic Load', value: `${liveMetrics.traffic.toFixed(0)}%`, color: liveMetrics.traffic > 200 ? 'text-red-400' : 'text-neon-green', icon: Activity },
          { label: 'Latency', value: `${liveMetrics.latency.toFixed(0)}ms`, color: liveMetrics.latency > 50 ? 'text-red-400' : 'text-neon-blue', icon: TrendingDown },
          { label: 'Packet Loss', value: `${liveMetrics.packetLoss.toFixed(1)}%`, color: liveMetrics.packetLoss > 5 ? 'text-red-400' : 'text-neon-green', icon: BarChart3 },
          { label: 'Active Nodes', value: `${liveMetrics.activeNodes}/32`, color: liveMetrics.activeNodes < 25 ? 'text-yellow-400' : 'text-neon-green', icon: Shield },
          { label: 'AI Healing', value: liveMetrics.healingActive ? 'ACTIVE' : 'STANDBY', color: liveMetrics.healingActive ? 'text-neon-green' : 'text-slate-400', icon: Zap },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="glass-card rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                <span className="text-[10px] text-slate-400 uppercase">{m.label}</span>
              </div>
              <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attack Configuration */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-400" />
            Stress Test Configuration
          </h3>

          {/* Attack Types */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {ATTACK_TYPES.map(attack => (
              <button
                key={attack.id}
                onClick={() => !isRunning && setSelectedAttack(attack.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedAttack === attack.id
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
                disabled={isRunning}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{attack.icon}</span>
                  <span className={`text-xs font-medium ${attack.color}`}>{attack.name}</span>
                </div>
                <p className="text-[10px] text-slate-500">{attack.description}</p>
              </button>
            ))}
          </div>

          {/* Intensity Slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Intensity</span>
              <span className={`text-xs font-bold ${intensity > 70 ? 'text-red-400' : intensity > 40 ? 'text-yellow-400' : 'text-neon-green'}`}>
                {intensity}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              disabled={isRunning}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-[10px] text-slate-600 mt-1">
              <span>Mild</span>
              <span>Moderate</span>
              <span>Severe</span>
              <span>Critical</span>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Duration (seconds)</span>
              <span className="text-xs font-bold text-white">{duration}s</span>
            </div>
            <input
              type="range"
              min={10}
              max={120}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              disabled={isRunning}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-neon-blue"
            />
          </div>

          {/* Run Button */}
          <div className="flex gap-3">
            <button
              onClick={isRunning ? stopTest : runStressTest}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm transition-all ${
                isRunning
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                  : 'bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green/20'
              }`}
            >
              {isRunning ? (
                <>
                  <Square className="w-4 h-4" />
                  Stop Test
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  Launch Stress Test
                </>
              )}
            </button>
          </div>

          {/* Current Phase */}
          {currentPhase && (
            <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/5 animate-pulse">
              <p className="text-xs text-white">{currentPhase}</p>
            </div>
          )}
        </div>

        {/* Results History */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-neon-blue" />
            <h3 className="text-sm font-semibold">Test Results History</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 ml-auto">
              {results.length} tests
            </span>
          </div>
          <div className="max-h-[450px] overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <BarChart3 className="w-10 h-10 mx-auto mb-2 text-slate-600/50" />
                <p className="text-sm">No test results yet</p>
                <p className="text-[10px] text-slate-600 mt-1">Run a stress test to see results</p>
              </div>
            ) : (
              results.map((result, i) => (
                <div key={i} className="px-4 py-3 border-b border-white/5 hover:bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${result.healingSuccess ? 'bg-neon-green' : 'bg-red-400'}`} />
                      <span className="text-xs font-medium">{result.type}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      result.healingSuccess ? 'bg-neon-green/10 text-neon-green' : 'bg-red-400/10 text-red-400'
                    }`}>
                      {result.healingSuccess ? 'HEALED' : 'FAILED'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div>
                      <span className="text-slate-500">Recovery</span>
                      <p className="text-white font-medium">{result.recoveryTime}s</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Nodes Hit</span>
                      <p className="text-white font-medium">{result.nodesAffected}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Intensity</span>
                      <p className="text-white font-medium">{result.intensity}%</p>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-500">
                    Peak latency spike: {result.latencySpike}ms | Traffic surge: {result.trafficAfter}%
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
