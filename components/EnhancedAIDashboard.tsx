'use client';

import { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Zap, Activity, Clock, Target, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface Props {
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    predictions: number;
    avgResponseTime: number;
  };
  anomalies: { time: number; value: number; type: string }[];
}

export default function EnhancedAIDashboard({ metrics, anomalies }: Props) {
  const [accuracyHistory, setAccuracyHistory] = useState(
    Array.from({ length: 30 }, (_, i) => ({
      time: i,
      accuracy: 94 + Math.random() * 4,
      precision: 93 + Math.random() * 5,
      recall: 91 + Math.random() * 6,
    }))
  );

  const [heatmapData] = useState(
    Array.from({ length: 7 }, (_, day) =>
      Array.from({ length: 24 }, (_, hour) => ({
        day,
        hour,
        value: Math.random() * 100,
        anomalies: Math.floor(Math.random() * 5),
      }))
    ).flat()
  );

  const radarData = [
    { metric: 'CPU Prediction', value: 96, fullMark: 100 },
    { metric: 'Memory Forecast', value: 94, fullMark: 100 },
    { metric: 'Latency Detect', value: 98, fullMark: 100 },
    { metric: 'Traffic Analyze', value: 92, fullMark: 100 },
    { metric: 'Fault Predict', value: 97, fullMark: 100 },
    { metric: 'Heal Optimize', value: 95, fullMark: 100 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAccuracyHistory(prev => [
        ...prev.slice(1),
        {
          time: prev[prev.length - 1].time + 1,
          accuracy: 94 + Math.random() * 4,
          precision: 93 + Math.random() * 5,
          recall: 91 + Math.random() * 6,
        },
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Model Accuracy', value: `${metrics.accuracy}%`, icon: Brain, color: 'text-neon-purple', bg: 'bg-purple-500/10' },
          { label: 'Precision', value: `${metrics.precision}%`, icon: Target, color: 'text-neon-green', bg: 'bg-neon-green/10' },
          { label: 'Recall', value: `${metrics.recall}%`, icon: Activity, color: 'text-neon-blue', bg: 'bg-neon-blue/10' },
          { label: 'F1 Score', value: `${metrics.f1Score}%`, icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
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
        {/* Accuracy Trend */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-neon-green" />
            <h3 className="text-sm font-semibold">Model Accuracy Trend</h3>
          </div>
          <div className="p-4">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={accuracyHistory}>
                  <defs>
                    <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="precGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ccff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00ccff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[85, 100]} stroke="rgba(255,255,255,0.2)" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#1a1f35', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="accuracy" stroke="#00ff88" fill="url(#accGrad)" strokeWidth={2} name="Accuracy %" />
                  <Area type="monotone" dataKey="precision" stroke="#00ccff" fill="url(#precGrad)" strokeWidth={2} name="Precision %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-1 rounded-full bg-neon-green" />
                <span className="text-slate-400">Accuracy</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-1 rounded-full bg-neon-blue" />
                <span className="text-slate-400">Precision</span>
              </div>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <Brain className="w-4 h-4 text-neon-purple" />
            <h3 className="text-sm font-semibold">AI Model Capabilities</h3>
          </div>
          <div className="p-4">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
                  <Radar name="AI Model" dataKey="value" stroke="#cc66ff" fill="#cc66ff" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Anomaly Heatmap */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          <h3 className="text-sm font-semibold">Anomaly Detection Heatmap (Last 7 Days)</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 ml-auto">
            {heatmapData.reduce((s, d) => s + d.anomalies, 0)} ANOMALIES DETECTED
          </span>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-2">
            {days.map((day, dayIdx) => (
              <div key={day} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 w-8">{day}</span>
                <div className="flex gap-1 flex-1">
                  {Array.from({ length: 24 }, (_, hour) => {
                    const cell = heatmapData.find(d => d.day === dayIdx && d.hour === hour);
                    const value = cell?.value || 0;
                    const anomalies = cell?.anomalies || 0;
                    const intensity = value / 100;
                    return (
                      <div
                        key={hour}
                        className="flex-1 h-5 rounded-sm cursor-pointer transition-all hover:scale-150 hover:z-10"
                        style={{
                          backgroundColor: anomalies > 3
                            ? `rgba(255, 51, 102, ${0.3 + intensity * 0.7})`
                            : anomalies > 1
                            ? `rgba(255, 204, 0, ${0.2 + intensity * 0.5})`
                            : `rgba(0, 255, 136, ${0.05 + intensity * 0.15})`,
                        }}
                        title={`${day} ${hour}:00 - ${anomalies} anomalies`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[10px] text-slate-500">00:00</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-neon-green/30" />
                <span className="text-[10px] text-slate-500">Normal</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-yellow-400/50" />
                <span className="text-[10px] text-slate-500">Elevated</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-red-400/70" />
                <span className="text-[10px] text-slate-500">Critical</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-500">23:00</span>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Predictions Made', value: metrics.predictions.toLocaleString(), icon: Zap, color: 'text-neon-green' },
          { label: 'Avg Response Time', value: `${metrics.avgResponseTime}ms`, icon: Clock, color: 'text-neon-blue' },
          { label: 'True Positives', value: Math.floor(metrics.predictions * 0.95).toLocaleString(), icon: Target, color: 'text-neon-green' },
          { label: 'False Positives', value: Math.floor(metrics.predictions * 0.05).toLocaleString(), icon: AlertTriangle, color: 'text-yellow-400' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card rounded-xl p-3 flex items-center gap-3">
              <Icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-[10px] text-slate-400 uppercase">{stat.label}</p>
                <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
