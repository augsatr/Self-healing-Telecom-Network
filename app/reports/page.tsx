'use client';

import ReportsExport from '@/components/ReportsExport';

export default function ReportsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Incident Reports</h1>
        <p className="text-sm text-slate-400 mt-0.5">View, analyze, and export network incident reports</p>
      </div>
      <ReportsExport />
    </div>
  );
}
