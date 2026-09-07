'use client';

import { useState } from 'react';
import { FileText, Download, Calendar, Clock, Shield, Activity, AlertTriangle, CheckCircle, Filter } from 'lucide-react';

interface IncidentReport {
  id: string;
  date: string;
  time: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  region: string;
  nodesAffected: number;
  recoveryTime: number;
  autoHealed: boolean;
  aiPrediction: boolean;
  description: string;
  actions: string[];
}

const SAMPLE_REPORTS: IncidentReport[] = [
  {
    id: 'RPT-001',
    date: '2026-09-07',
    time: '14:23:45',
    type: 'Hardware Failure',
    severity: 'critical',
    region: 'Delhi-NCR',
    nodesAffected: 3,
    recoveryTime: 45,
    autoHealed: true,
    aiPrediction: true,
    description: 'Tower processor overload detected by AI 15 minutes before failure. Auto-healing initiated traffic rerouting to adjacent base stations.',
    actions: ['AI predicted fault 15min early', 'Isolated affected tower', 'Rerouted 8,500 users to backup stations', 'Activated redundant hardware', 'Completed recovery in 45 seconds'],
  },
  {
    id: 'RPT-002',
    date: '2026-09-07',
    time: '11:05:12',
    type: 'Congestion',
    severity: 'high',
    region: 'Mumbai',
    nodesAffected: 5,
    recoveryTime: 30,
    autoHealed: true,
    aiPrediction: true,
    description: 'Network congestion from unexpected traffic surge in Western region. AI detected anomaly pattern and pre-emptively scaled edge computing resources.',
    actions: ['Detected unusual traffic pattern', 'Scaled edge server capacity by 40%', 'Load balanced across 5 nodes', 'Prioritized URLLC traffic slice', 'Full recovery achieved'],
  },
  {
    id: 'RPT-003',
    date: '2026-09-06',
    time: '22:15:33',
    type: 'Link Failure',
    severity: 'medium',
    region: 'Bangalore',
    nodesAffected: 2,
    recoveryTime: 18,
    autoHealed: true,
    aiPrediction: false,
    description: 'Fiber link degradation between Bangalore and Chennai backbone. Digital twin detected anomaly and rerouted through Hyderabad path.',
    actions: ['Digital twin detected link degradation', 'Switched to backup fiber path', 'Maintained zero packet loss', 'Notified NOC for physical inspection'],
  },
  {
    id: 'RPT-004',
    date: '2026-09-06',
    time: '08:42:18',
    type: 'Power Outage',
    severity: 'critical',
    region: 'Kolkata',
    nodesAffected: 4,
    recoveryTime: 120,
    autoHealed: true,
    aiPrediction: true,
    description: 'Regional power grid failure affecting 4 base stations. AI predicted outage 8 minutes early based on power grid telemetry data.',
    actions: ['Predicted power failure 8min early', 'Activated UPS on all 4 nodes', 'Seamless handover to battery power', 'Coordinated with power utility', 'Restored after grid recovery'],
  },
  {
    id: 'RPT-005',
    date: '2026-09-05',
    time: '16:55:01',
    type: 'DDoS Attack',
    severity: 'high',
    region: 'Pune',
    nodesAffected: 6,
    recoveryTime: 22,
    autoHealed: true,
    aiPrediction: true,
    description: 'Coordinated DDoS attack targeting Pune edge servers. AI firewall detected and mitigated attack within 22 seconds.',
    actions: ['AI firewall detected attack pattern', 'Activated DDoS mitigation', 'Blackholed attack traffic', 'Protected legitimate user traffic', 'Forensics logged for analysis'],
  },
];

const SEVERITY_CONFIG = {
  low: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  medium: { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  high: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  critical: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
};

export default function ReportsExport() {
  const [reports] = useState(SAMPLE_REPORTS);
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.severity === filter);

  const generatePDF = (report: IncidentReport) => {
    const severity = SEVERITY_CONFIG[report.severity];
    const content = `
╔══════════════════════════════════════════════════════════════╗
║           AI SELF-HEALING TELECOM NETWORK                   ║
║              INCIDENT REPORT ${report.id}                     ║
╚══════════════════════════════════════════════════════════════╝

Date: ${report.date}
Time: ${report.time}
Region: ${report.region}
Severity: ${report.severity.toUpperCase()}
Type: ${report.type}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESCRIPTION:
${report.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

METRICS:
• Nodes Affected: ${report.nodesAffected}
• Recovery Time: ${report.recoveryTime} seconds
• Auto-Healed: ${report.autoHealed ? 'YES' : 'NO'}
• AI Predicted: ${report.aiPrediction ? 'YES' : 'NO'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HEALING ACTIONS:
${report.actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated by: AI Self-Healing Telecom Network v1.0
Report Date: ${new Date().toISOString()}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Incident-Report-${report.id}-${report.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateSummary = () => {
    const totalIncidents = reports.length;
    const autoHealed = reports.filter(r => r.autoHealed).length;
    const aiPredicted = reports.filter(r => r.aiPrediction).length;
    const avgRecovery = Math.round(reports.reduce((s, r) => s + r.recoveryTime, 0) / reports.length);

    const content = `
╔══════════════════════════════════════════════════════════════╗
║        WEEKLY INCIDENT SUMMARY REPORT                        ║
║        AI Self-Healing Telecom Network                       ║
╚══════════════════════════════════════════════════════════════╝

Period: ${new Date(Date.now() - 7 * 86400000).toLocaleDateString()} - ${new Date().toLocaleDateString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OVERVIEW:
• Total Incidents: ${totalIncidents}
• Auto-Healed: ${autoHealed} (${Math.round(autoHealed / totalIncidents * 100)}%)
• AI Predicted: ${aiPredicted} (${Math.round(aiPredicted / totalIncidents * 100)}%)
• Avg Recovery Time: ${avgRecovery} seconds
• Network Uptime: 99.97%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INCIDENTS BY SEVERITY:
• Critical: ${reports.filter(r => r.severity === 'critical').length}
• High: ${reports.filter(r => r.severity === 'high').length}
• Medium: ${reports.filter(r => r.severity === 'medium').length}
• Low: ${reports.filter(r => r.severity === 'low').length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AI ENGINE PERFORMANCE:
• Prediction Accuracy: 96.2%
• False Positive Rate: 3.8%
• Average Detection Time: 8.2 seconds
• Model Version: v2.1.0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated: ${new Date().toISOString()}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Weekly-Summary-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Incidents', value: reports.length.toString(), icon: AlertTriangle, color: 'text-white' },
          { label: 'Auto-Healed', value: `${Math.round(reports.filter(r => r.autoHealed).length / reports.length * 100)}%`, icon: CheckCircle, color: 'text-neon-green' },
          { label: 'AI Predicted', value: `${Math.round(reports.filter(r => r.aiPrediction).length / reports.length * 100)}%`, icon: Activity, color: 'text-neon-purple' },
          { label: 'Avg Recovery', value: `${Math.round(reports.reduce((s, r) => s + r.recoveryTime, 0) / reports.length)}s`, icon: Clock, color: 'text-neon-blue' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                <span className="text-[10px] text-slate-400 uppercase">{stat.label}</span>
              </div>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Export Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {['all', 'critical', 'high', 'medium', 'low'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filter === f ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={generateSummary}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-green/10 text-neon-green border border-neon-green/20 text-sm hover:bg-neon-green/20 transition-all"
        >
          <Download className="w-4 h-4" />
          Export Summary
        </button>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <FileText className="w-4 h-4 text-neon-blue" />
            <h3 className="text-sm font-semibold">Incident Reports</h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {filteredReports.map(report => {
              const severity = SEVERITY_CONFIG[report.severity];
              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`px-4 py-3 border-b border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors ${
                    selectedReport?.id === report.id ? 'bg-white/[0.03]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${report.autoHealed ? 'bg-neon-green' : 'bg-red-400'}`} />
                      <span className="text-xs font-medium">{report.id}</span>
                      <span className="text-xs text-slate-400">{report.type}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${severity.bg} ${severity.color} ${severity.border} border`}>
                      {report.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 ml-4">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{report.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{report.time}</span>
                    <span>{report.region}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Report Detail */}
        {selectedReport ? (
          <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-neon-green" />
                <h3 className="text-sm font-semibold">Report {selectedReport.id}</h3>
              </div>
              <button
                onClick={() => generatePDF(selectedReport)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-blue/10 text-neon-blue text-xs hover:bg-neon-blue/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-400"><Calendar className="w-3.5 h-3.5" />{selectedReport.date}</span>
                <span className="flex items-center gap-1 text-slate-400"><Clock className="w-3.5 h-3.5" />{selectedReport.time}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] text-slate-500">Region</p>
                  <p className="text-sm font-medium">{selectedReport.region}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] text-slate-500">Type</p>
                  <p className="text-sm font-medium">{selectedReport.type}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] text-slate-500">Nodes Affected</p>
                  <p className="text-sm font-medium">{selectedReport.nodesAffected}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] text-slate-500">Recovery Time</p>
                  <p className="text-sm font-medium text-neon-green">{selectedReport.recoveryTime}s</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-2">Description</p>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedReport.description}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-2">Healing Actions</p>
                <div className="space-y-1.5">
                  {selectedReport.actions.map((action, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold bg-neon-green/20 text-neon-green shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-slate-300">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div className={`flex items-center gap-1.5 text-xs ${selectedReport.autoHealed ? 'text-neon-green' : 'text-red-400'}`}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  {selectedReport.autoHealed ? 'Auto-Healed' : 'Manual Intervention'}
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${selectedReport.aiPrediction ? 'text-neon-purple' : 'text-slate-400'}`}>
                  <Activity className="w-3.5 h-3.5" />
                  {selectedReport.aiPrediction ? 'AI Predicted' : 'Unpredicted'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-xl flex items-center justify-center min-h-[400px]">
            <div className="text-center text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-600/50" />
              <p className="text-sm">Select a report to view details</p>
              <p className="text-[10px] text-slate-600 mt-1">Click any incident from the list</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
