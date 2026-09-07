'use client';

import StressTestingTool from '@/components/StressTestingTool';

export default function StressTestPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Stress Testing Lab</h1>
        <p className="text-sm text-slate-400 mt-0.5">Simulate network attacks and measure auto-healing response</p>
      </div>
      <StressTestingTool />
    </div>
  );
}
