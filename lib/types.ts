export type NodeStatus = 'healthy' | 'warning' | 'critical' | 'offline' | 'healing';

export interface NetworkNode {
  id: string;
  name: string;
  type: 'tower' | 'edge-server' | 'core-router' | 'base-station' | 'gateway';
  status: NodeStatus;
  x: number;
  y: number;
  cpu: number;
  memory: number;
  bandwidth: number;
  latency: number;
  connections: string[];
  slice: 'enhanced-mbb' | 'ultra-reliable' | 'massive-iot';
  region: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  bandwidth: number;
  latency: number;
  status: 'active' | 'degraded' | 'down';
  traffic: number;
}

export interface FaultEvent {
  id: string;
  nodeId: string;
  type: 'hardware' | 'software' | 'congestion' | 'power' | 'link-failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  predicted: boolean;
  resolved: boolean;
  healingAction?: string;
}

export interface MetricsSnapshot {
  timestamp: number;
  totalNodes: number;
  healthyNodes: number;
  activeFaults: number;
  resolvedFaults: number;
  avgLatency: number;
  totalBandwidth: number;
  networkUptime: number;
  aiAccuracy: number;
  healingSuccessRate: number;
}

export interface AIPrediction {
  nodeId: string;
  faultType: string;
  probability: number;
  timeToFailure: number;
  recommendedAction: string;
}

export interface NetworkSlice {
  id: string;
  name: string;
  type: 'enhanced-mbb' | 'ultra-reliable' | 'massive-iot';
  bandwidth: number;
  latency: number;
  nodes: string[];
}
