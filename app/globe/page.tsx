'use client';

import { useState } from 'react';
import Globe3D from '@/components/Globe3D';
import { MapPin, Activity, Wifi, Clock } from 'lucide-react';

const CITY_DATA: Record<string, {
  nodes: number;
  uptime: number;
  bandwidth: string;
  latency: string;
  traffic: string;
  region: string;
}> = {
  'delhi': { nodes: 8, uptime: 99.98, bandwidth: '45 Gbps', latency: '8ms', traffic: '8.5 Tbps', region: 'North India HQ' },
  'mumbai': { nodes: 10, uptime: 99.99, bandwidth: '60 Gbps', latency: '6ms', traffic: '9.2 Tbps', region: 'West India HQ' },
  'bangalore': { nodes: 7, uptime: 99.97, bandwidth: '35 Gbps', latency: '10ms', traffic: '7.8 Tbps', region: 'South India Tech Hub' },
  'chennai': { nodes: 6, uptime: 99.95, bandwidth: '30 Gbps', latency: '12ms', traffic: '6.5 Tbps', region: 'South India Coastal' },
  'kolkata': { nodes: 5, uptime: 99.96, bandwidth: '25 Gbps', latency: '14ms', traffic: '5.8 Tbps', region: 'East India HQ' },
  'hyderabad': { nodes: 6, uptime: 99.98, bandwidth: '32 Gbps', latency: '9ms', traffic: '7.2 Tbps', region: 'South India IT Corridor' },
  'pune': { nodes: 5, uptime: 99.97, bandwidth: '28 Gbps', latency: '11ms', traffic: '6.1 Tbps', region: 'West India IT Hub' },
  'ahmedabad': { nodes: 4, uptime: 99.96, bandwidth: '22 Gbps', latency: '13ms', traffic: '5.4 Tbps', region: 'West India Industrial' },
  'jaipur': { nodes: 3, uptime: 99.95, bandwidth: '18 Gbps', latency: '15ms', traffic: '4.2 Tbps', region: 'North India' },
  'lucknow': { nodes: 3, uptime: 99.94, bandwidth: '16 Gbps', latency: '16ms', traffic: '3.8 Tbps', region: 'North India' },
  'singapore': { nodes: 12, uptime: 99.99, bandwidth: '80 Gbps', latency: '3ms', traffic: '12 Tbps', region: 'APAC Hub' },
  'tokyo': { nodes: 15, uptime: 99.99, bandwidth: '100 Gbps', latency: '2ms', traffic: '15 Tbps', region: 'East Asia Hub' },
  'london': { nodes: 10, uptime: 99.98, bandwidth: '70 Gbps', latency: '4ms', traffic: '11 Tbps', region: 'Europe Hub' },
  'newyork': { nodes: 14, uptime: 99.99, bandwidth: '90 Gbps', latency: '3ms', traffic: '13.5 Tbps', region: 'Americas Hub' },
  'dubai': { nodes: 8, uptime: 99.97, bandwidth: '50 Gbps', latency: '5ms', traffic: '8 Tbps', region: 'Middle East Hub' },
  'sydney': { nodes: 9, uptime: 99.98, bandwidth: '55 Gbps', latency: '4ms', traffic: '9.5 Tbps', region: 'Oceania Hub' },
};

export default function GlobePage() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const cityInfo = selectedCity ? CITY_DATA[selectedCity] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Global Network View</h1>
          <p className="text-sm text-slate-400 mt-0.5">Interactive 3D globe showing worldwide network infrastructure</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-neon-green" />
            <span>16 cities</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-neon-blue" />
            <span>113 nodes</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card rounded-xl overflow-hidden" style={{ height: '75vh' }}>
          <Globe3D />
        </div>

        <div className="space-y-4">
          {cityInfo && selectedCity ? (
            <div className="glass-card rounded-xl p-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-neon-green" />
                <h3 className="text-sm font-semibold">{selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Region</span>
                  <span className="text-white">{cityInfo.region}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Active Nodes</span>
                  <span className="text-neon-green font-medium">{cityInfo.nodes}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Uptime</span>
                  <span className="text-neon-green font-medium">{cityInfo.uptime}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Bandwidth</span>
                  <span className="text-neon-blue font-medium">{cityInfo.bandwidth}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Latency</span>
                  <span className="text-neon-green font-medium">{cityInfo.latency}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Traffic</span>
                  <span className="text-white font-medium">{cityInfo.traffic}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-xl p-6 text-center">
              <MapPin className="w-10 h-10 mx-auto mb-3 text-slate-600/50" />
              <p className="text-sm text-slate-400">Click a city on the globe</p>
              <p className="text-[10px] text-slate-500 mt-1">to view detailed stats</p>
            </div>
          )}

          <div className="glass-card rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Global Stats</h4>
            <div className="space-y-2.5">
              {[
                { label: 'Total Cities', value: '16', color: 'text-white' },
                { label: 'Total Nodes', value: '113', color: 'text-neon-green' },
                { label: 'Total Bandwidth', value: '780 Gbps', color: 'text-neon-blue' },
                { label: 'Avg Latency', value: '7.2ms', color: 'text-neon-green' },
                { label: 'Global Uptime', value: '99.97%', color: 'text-neon-green' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{stat.label}</span>
                  <span className={`font-medium ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
