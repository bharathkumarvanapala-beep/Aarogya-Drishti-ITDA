import React, { useState } from 'react';
import { 
  BarChart3, 
  Map, 
  Server, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Download
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context';
import { useTranslation } from '../../i18n';
import { Link } from 'react-router-dom';
import { MANDAL_COVERAGE_DATA } from './adminData';
import { ASR_DIVISIONS, getMandalsByDivision } from '../../data/asrMandals';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { language } = useTranslation();
  const [selectedMandal, setSelectedMandal] = useState('ALL');

  const displayedMandals = selectedMandal === 'ALL'
    ? MANDAL_COVERAGE_DATA
    : MANDAL_COVERAGE_DATA.filter((m) => m.name === selectedMandal);

  return (
    <div className="space-y-8">
      {/* Welcome & Programme Banner */}
      <Card variant="nature" padding="lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
                ITDA District Administration
              </span>
              <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
                Alluri Sitharama Raju District
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
              District Oral Health Mission — {currentUser ? (language === 'te' ? currentUser.nameTe : currentUser.name) : (language === 'te' ? 'జిల్లా నిర్వాహకుడు' : 'District Administrator')}
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              {language === 'te' ? 'జిల్లా ఆరోగ్య నిర్వాహకుడు • గిరిజన ప్రాంతాల స్క్రీనింగ్ & రిఫరల్ పాలన' : 'District Health Administrator • Tribal Habitation Screening Coverage & Referral Governance'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/admin/map">
              <Button variant="primary" size="md" icon={Map}>
                Coverage Map
              </Button>
            </Link>
            <Button variant="outline" size="md" icon={Download}>
              Export Summary
            </Button>
          </div>
        </div>
      </Card>

      {/* Aggregate District KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Screenings Completed"
          labelTe="పూర్తయిన మొత్తం స్క్రీనింగ్‌లు"
          value="4,820"
          icon={TrendingUp}
          trend={{ value: '+14.2% this month', isPositive: true }}
          variant="forest"
        />
        <StatCard
          label="Habitation Coverage"
          labelTe="గ్రామ కవరేజ్ శాతం"
          value="78.4%"
          icon={Map}
          subtext="142 of 181 habitations active"
          variant="emerald"
        />
        <StatCard
          label="High-Risk Cases Identified"
          labelTe="గుర్తించిన అధిక ప్రమాద కేసులు"
          value="186"
          icon={AlertTriangle}
          subtext="3.8% positivity triage rate"
          variant="amber"
        />
        <StatCard
          label="Active Field Health Workers"
          labelTe="క్రియాశీల ఆశా కార్యకర్తలు"
          value="94"
          icon={Users}
          subtext="100% synced within 48h"
          variant="blue"
        />
      </div>

      {/* Mandal Screening Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card 
            title="Mandal-Level Screening Progress (ASR District - 22 Mandals)" 
            titleTe="మండలాల వారీగా స్క్రీనింగ్ పురోగతి (22 మండలాలు)"
            subtitle="Real-time aggregation across Paderu, Rampachodavaram & Chintoor divisions"
            action={
              <div className="flex items-center gap-2">
                <label htmlFor="admin-mandal-select" className="text-xs font-bold text-ink hidden sm:inline">
                  Mandal:
                </label>
                <select
                  id="admin-mandal-select"
                  value={selectedMandal}
                  onChange={(e) => setSelectedMandal(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-forest-300 bg-white text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 shadow-sm"
                >
                  <option value="ALL">All 22 Mandals (అన్ని 22 మండలాలు)</option>
                  {ASR_DIVISIONS.map((div) => {
                    const mandals = getMandalsByDivision(div.id);
                    return (
                      <optgroup key={div.id} label={`${div.nameEn} (${div.nameTe})`}>
                        {mandals.map((m) => (
                          <option key={m.id} value={m.nameEn}>
                            {m.nameEn} ({m.nameTe})
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-forest-100 text-xs text-ink-muted uppercase font-mono">
                    <th className="pb-3 font-semibold">Mandal (మండలం)</th>
                    <th className="pb-3 font-semibold">Target Pop.</th>
                    <th className="pb-3 font-semibold">Screened</th>
                    <th className="pb-3 font-semibold">Coverage</th>
                    <th className="pb-3 font-semibold">High Risk</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-100">
                  {displayedMandals.slice(0, selectedMandal === 'ALL' ? 7 : displayedMandals.length).map((m) => (
                    <tr key={m.id} className="hover:bg-forest-50/50">
                      <td className="py-3 font-bold text-ink">
                        {m.name} ({m.nameTe}) {m.isPilot && '★ Pilot'}
                      </td>
                      <td className="py-3 text-ink-muted">{m.targetPopulation.toLocaleString()}</td>
                      <td className="py-3 font-semibold text-forest-900">{m.screenedCount.toLocaleString()}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-forest-100 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                m.status === 'TARGET_MET' ? 'bg-emerald-600' :
                                m.status === 'ON_TRACK' ? 'bg-forest-600' : 'bg-amber-500'
                              }`} 
                              style={{ width: `${Math.min(100, m.coveragePercentage)}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono font-bold">{m.coveragePercentage}%</span>
                        </div>
                      </td>
                      <td className="py-3 font-mono font-bold text-amber-700">{m.highRiskCount}</td>
                      <td className="py-3">
                        <StatusBadge 
                          status={m.status === 'TARGET_MET' ? 'COMPLETED' : m.status === 'ON_TRACK' ? 'IN_PROGRESS' : 'NEEDS_ATTENTION'} 
                          label={m.status === 'TARGET_MET' ? 'Target Met' : m.status === 'ON_TRACK' ? 'Active' : 'Lagging'} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {selectedMandal === 'ALL' && (
                <div className="pt-3 pb-1 border-t border-forest-100 flex items-center justify-between text-xs">
                  <span className="text-ink-muted">Showing 7 of 22 Mandals across all 3 divisions</span>
                  <Link to="/admin/coverage" className="font-bold text-forest-800 hover:text-forest-950 hover:underline">
                    View Complete 22 Mandals Coverage Map →
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sync & Connectivity Health */}
        <div className="space-y-6">
          <Card 
            title="System & Sync Health" 
            titleTe="సిస్టమ్ మరియు సింక్ స్థితి"
            subtitle="Tribal offline data pipeline"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-forest-50 border border-forest-100">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div>
                    <span className="text-sm font-bold text-ink block">Paderu District Gateway</span>
                    <span className="text-xs text-ink-muted">All services operational</span>
                  </div>
                </div>
                <StatusBadge status="COMPLETED" label="Healthy" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-forest-50 border border-forest-100">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <div>
                    <span className="text-sm font-bold text-ink block">Offline Queue Health</span>
                    <span className="text-xs text-ink-muted">0 conflict errors reported</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-forest-900 bg-forest-100 px-2 py-0.5 rounded">
                  0 Errors
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-forest-50 border border-forest-100">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div>
                    <span className="text-sm font-bold text-ink block">Sub-Centres Pending Sync</span>
                    <span className="text-xs text-ink-muted">Network unavailable habitations</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  6 Sub-Centres
                </span>
              </div>

              <Link to="/admin/system" className="block pt-2">
                <Button variant="outline" size="sm" fullWidth icon={Server}>
                  Open System Telemetry
                </Button>
              </Link>
            </div>
          </Card>

          {/* Quick Action Navigation */}
          <Card title="Quick Management Links" titleTe="త్వరిత లింకులు">
            <div className="grid grid-cols-1 gap-2">
              <Link to="/admin/reports">
                <div className="p-3 rounded-xl border border-forest-100 hover:border-forest-300 hover:bg-forest-50/50 transition-colors flex items-center justify-between text-sm font-semibold text-ink">
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4 text-forest-800" />
                    <span>Download Analytical Reports</span>
                  </div>
                  <span className="text-xs text-forest-800">→</span>
                </div>
              </Link>
              <Link to="/admin/users">
                <div className="p-3 rounded-xl border border-forest-100 hover:border-forest-300 hover:bg-forest-50/50 transition-colors flex items-center justify-between text-sm font-semibold text-ink">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-forest-800" />
                    <span>Field Staff Allocation (ASHA/PHC)</span>
                  </div>
                  <span className="text-xs text-forest-800">→</span>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
