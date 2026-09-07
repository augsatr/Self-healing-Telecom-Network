import { NetworkNode, NetworkLink, FaultEvent, MetricsSnapshot, NetworkSlice } from './types';

const REGIONS = ['Delhi-NCR', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];

const SLICES: NetworkSlice[] = [
  { id: 'slice-1', name: 'Enhanced Mobile Broadband', type: 'enhanced-mbb', bandwidth: 10000, latency: 10, nodes: [] },
  { id: 'slice-2', name: 'Ultra-Reliable Low Latency', type: 'ultra-reliable', bandwidth: 5000, latency: 1, nodes: [] },
  { id: 'slice-3', name: 'Massive IoT', type: 'massive-iot', bandwidth: 2000, latency: 50, nodes: [] },
];

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateNodes(): NetworkNode[] {
  const nodes: NetworkNode[] = [];
  const types: NetworkNode['type'][] = ['tower', 'edge-server', 'core-router', 'base-station', 'gateway'];

  const positions: { [key: string]: { x: number; y: number } } = {
    'Delhi-NCR': { x: 400, y: 120 },
    'Mumbai': { x: 250, y: 320 },
    'Bangalore': { x: 350, y: 480 },
    'Chennai': { x: 500, y: 450 },
    'Kolkata': { x: 600, y: 180 },
    'Hyderabad': { x: 420, y: 380 },
    'Pune': { x: 300, y: 380 },
    'Ahmedabad': { x: 220, y: 200 },
  };

  let id = 0;
  for (const region of REGIONS) {
    const basePos = positions[region];
    for (let i = 0; i < 4; i++) {
      const type = types[i % types.length];
      const slice = SLICES[i % SLICES.length];
      nodes.push({
        id: `node-${id}`,
        name: `${region} ${type.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())} ${i + 1}`,
        type,
        status: 'healthy',
        x: basePos.x + randomBetween(-60, 60),
        y: basePos.y + randomBetween(-60, 60),
        cpu: randomBetween(20, 70),
        memory: randomBetween(30, 80),
        bandwidth: randomBetween(500, 9500),
        latency: randomBetween(1, 45),
        connections: [],
        slice: slice.type,
        region,
      });
      slice.nodes.push(`node-${id}`);
      id++;
    }
  }
  return nodes;
}

function generateLinks(nodes: NetworkNode[]): NetworkLink[] {
  const links: NetworkLink[] = [];
  const linkSet = new Set<string>();

  nodes.forEach(node => {
    const nearby = nodes
      .filter(n => n.id !== node.id)
      .sort((a, b) => {
        const distA = Math.hypot(a.x - node.x, a.y - node.y);
        const distB = Math.hypot(b.x - node.x, b.y - node.y);
        return distA - distB;
      })
      .slice(0, 3);

    nearby.forEach(target => {
      const key = [node.id, target.id].sort().join('-');
      if (!linkSet.has(key)) {
        linkSet.add(key);
        node.connections.push(target.id);
        target.connections.push(node.id);
        links.push({
          source: node.id,
          target: target.id,
          bandwidth: randomBetween(1000, 10000),
          latency: randomBetween(1, 30),
          status: 'active',
          traffic: randomBetween(100, 5000),
        });
      }
    });
  });

  return links;
}

export class NetworkSimulator {
  nodes: NetworkNode[];
  links: NetworkLink[];
  faults: FaultEvent[];
  metrics: MetricsSnapshot[];
  slices: NetworkSlice[];
  private faultCounter: number = 0;

  constructor() {
    this.nodes = generateNodes();
    this.links = generateLinks(this.nodes);
    this.faults = [];
    this.metrics = [];
    this.slices = SLICES;
  }

  getNodeById(id: string): NetworkNode | undefined {
    return this.nodes.find(n => n.id === id);
  }

  getLinksForNode(nodeId: string): NetworkLink[] {
    return this.links.filter(l => l.source === nodeId || l.target === nodeId);
  }

  simulateTick(): { newFaults: FaultEvent[]; healedFaults: FaultEvent[]; updatedMetrics: MetricsSnapshot } {
    const newFaults: FaultEvent[] = [];
    const healedFaults: FaultEvent[] = [];

    // Randomly introduce faults (5% chance per tick)
    if (Math.random() < 0.05 && this.faults.filter(f => !f.resolved).length < 5) {
      const healthyNodes = this.nodes.filter(n => n.status === 'healthy' || n.status === 'warning');
      if (healthyNodes.length > 0) {
        const target = healthyNodes[Math.floor(Math.random() * healthyNodes.length)];
        const faultTypes: FaultEvent['type'][] = ['hardware', 'software', 'congestion', 'power', 'link-failure'];
        const severities: FaultEvent['severity'][] = ['low', 'medium', 'high', 'critical'];
        const fault: FaultEvent = {
          id: `fault-${++this.faultCounter}`,
          nodeId: target.id,
          type: faultTypes[Math.floor(Math.random() * faultTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          timestamp: new Date(),
          predicted: Math.random() > 0.4,
          resolved: false,
        };
        newFaults.push(fault);
        this.faults.push(fault);
        target.status = fault.severity === 'critical' ? 'critical' : 'warning';
      }
    }

    // Auto-heal faults (80% success rate)
    this.faults.filter(f => !f.resolved).forEach(fault => {
      if (Math.random() < 0.3) {
        fault.resolved = true;
        const healingActions = [
          'Traffic rerouted via alternate path',
          'Redundant system activated',
          'Edge node failover initiated',
          'Network slice reconfigured',
          'Load balanced across healthy nodes',
          'Power restored from backup',
        ];
        fault.healingAction = healingActions[Math.floor(Math.random() * healingActions.length)];
        healedFaults.push(fault);

        const node = this.getNodeById(fault.nodeId);
        if (node) {
          node.status = 'healing';
          setTimeout(() => {
            node.status = 'healthy';
          }, 3000);
        }
      }
    });

    // Update node metrics
    this.nodes.forEach(node => {
      if (node.status !== 'offline') {
        node.cpu = Math.min(100, Math.max(5, node.cpu + randomBetween(-10, 10)));
        node.memory = Math.min(100, Math.max(10, node.memory + randomBetween(-5, 5)));
        node.latency = Math.max(0.5, node.latency + randomBetween(-2, 2));
        node.bandwidth = Math.max(100, Math.min(10000, node.bandwidth + randomBetween(-500, 500)));
      }
    });

    // Update link traffic
    this.links.forEach(link => {
      link.traffic = Math.max(0, Math.min(link.bandwidth, link.traffic + randomBetween(-300, 300)));
    });

    // Calculate metrics
    const healthyCount = this.nodes.filter(n => n.status === 'healthy').length;
    const activeFaults = this.faults.filter(f => !f.resolved).length;
    const resolvedFaults = this.faults.filter(f => f.resolved).length;
    const avgLatency = this.nodes.reduce((sum, n) => sum + n.latency, 0) / this.nodes.length;
    const totalBw = this.nodes.reduce((sum, n) => sum + n.bandwidth, 0);

    const snapshot: MetricsSnapshot = {
      timestamp: Date.now(),
      totalNodes: this.nodes.length,
      healthyNodes: healthyCount,
      activeFaults,
      resolvedFaults,
      avgLatency: Math.round(avgLatency * 100) / 100,
      totalBandwidth: Math.round(totalBw),
      networkUptime: Math.round((healthyCount / this.nodes.length) * 10000) / 100,
      aiAccuracy: Math.round(randomBetween(92, 98) * 100) / 100,
      healingSuccessRate: resolvedFaults > 0 ? Math.round((resolvedFaults / (activeFaults + resolvedFaults)) * 100) : 100,
    };
    this.metrics.push(snapshot);

    return { newFaults, healedFaults, updatedMetrics: snapshot };
  }

  getTopologyData() {
    return {
      nodes: this.nodes.map(n => ({
        id: n.id,
        x: n.x,
        y: n.y,
        label: n.name,
        type: n.type,
        status: n.status,
      })),
      links: this.links.map(l => ({
        source: l.source,
        target: l.target,
        status: l.status,
        traffic: l.traffic,
        bandwidth: l.bandwidth,
      })),
    };
  }
}
