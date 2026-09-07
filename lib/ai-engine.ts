import { NetworkNode, AIPrediction, FaultEvent } from './types';

export class AIEngine {
  private predictions: AIPrediction[] = [];
  private modelAccuracy: number = 95.7;
  private totalPredictions: number = 0;
  private correctPredictions: number = 0;

  analyzeNode(node: NetworkNode): AIPrediction | null {
    const riskScore = this.calculateRiskScore(node);

    if (riskScore > 0.6) {
      const prediction: AIPrediction = {
        nodeId: node.id,
        faultType: this.predictFaultType(node, riskScore),
        probability: riskScore,
        timeToFailure: this.estimateTimeToFailure(riskScore),
        recommendedAction: this.recommendAction(node, riskScore),
      };
      this.predictions.push(prediction);
      this.totalPredictions++;
      return prediction;
    }
    return null;
  }

  private calculateRiskScore(node: NetworkNode): number {
    let score = 0;

    if (node.cpu > 85) score += 0.3;
    else if (node.cpu > 70) score += 0.15;

    if (node.memory > 90) score += 0.3;
    else if (node.memory > 75) score += 0.15;

    if (node.latency > 30) score += 0.25;
    else if (node.latency > 20) score += 0.1;

    if (node.status === 'warning') score += 0.2;
    if (node.status === 'critical') score += 0.4;

    score = Math.min(1, score);
    return score;
  }

  private predictFaultType(node: NetworkNode, riskScore: number): string {
    if (node.cpu > 85) return 'CPU Overload';
    if (node.memory > 90) return 'Memory Exhaustion';
    if (node.latency > 30) return 'Network Congestion';
    if (node.type === 'tower' && riskScore > 0.8) return 'Hardware Failure';
    if (node.type === 'edge-server') return 'Service Degradation';
    return 'Potential Link Failure';
  }

  private estimateTimeToFailure(riskScore: number): number {
    if (riskScore > 0.9) return Math.floor(Math.random() * 5) + 1;
    if (riskScore > 0.8) return Math.floor(Math.random() * 15) + 5;
    if (riskScore > 0.7) return Math.floor(Math.random() * 30) + 15;
    return Math.floor(Math.random() * 60) + 30;
  }

  private recommendAction(node: NetworkNode, riskScore: number): string {
    if (riskScore > 0.9) return 'IMMEDIATE: Migrate traffic and isolate node';
    if (riskScore > 0.8) return 'Schedule proactive failover within 10 minutes';
    if (node.cpu > 85) return 'Scale up compute resources or redistribute load';
    if (node.memory > 90) return 'Clear cache and optimize memory allocation';
    if (node.latency > 30) return 'Reroute traffic through lower-latency path';
    return 'Monitor closely, prepare backup routing';
  }

  validatePrediction(prediction: AIPrediction, wasCorrect: boolean): void {
    if (wasCorrect) this.correctPredictions++;
    this.modelAccuracy = Math.round((this.correctPredictions / this.totalPredictions) * 10000) / 100;
  }

  getAccuracy(): number {
    return this.totalPredictions > 0 ? this.modelAccuracy : 95.7;
  }

  getRecentPredictions(count: number = 10): AIPrediction[] {
    return this.predictions.slice(-count);
  }

  generateHealingPlan(fault: FaultEvent, nodes: NetworkNode[]): {
    steps: string[];
    estimatedRecoveryTime: number;
    impactScore: number;
  } {
    const affectedNode = nodes.find(n => n.id === fault.nodeId);
    const steps: string[] = [];
    let estimatedTime = 0;

    steps.push(`Detected ${fault.type} fault on ${affectedNode?.name || 'unknown node'}`);

    if (fault.severity === 'critical') {
      steps.push('Immediately isolating affected node from network');
      steps.push('Activating redundant path for all connected traffic');
      steps.push('Spinning up backup edge server in adjacent region');
      estimatedTime = 30;
    } else if (fault.severity === 'high') {
      steps.push('Initiating graceful traffic migration');
      steps.push('Configuring alternate routing paths');
      estimatedTime = 60;
    } else {
      steps.push('Adjusting load balancing parameters');
      steps.push('Increasing monitoring frequency');
      estimatedTime = 120;
    }

    steps.push('Running post-healing health check');
    steps.push('Updating digital twin with new network state');

    const impactScore = fault.severity === 'critical' ? 0.95 : fault.severity === 'high' ? 0.7 : 0.4;

    return { steps, estimatedRecoveryTime: estimatedTime, impactScore };
  }
}
