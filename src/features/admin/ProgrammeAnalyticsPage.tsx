import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Download,
  CheckCircle2,
  AlertTriangle,
  Send,
  Microscope,
  Calendar
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import { MONTHLY_METRICS, MANDAL_COVERAGE_DATA } from './adminData';

export const ProgrammeAnalyticsPage: React.FC = () => {
  const [selectedMandal, setSelectedMandal] = useState('ALL');
  const [exportToast, setExportToast] = useState(false);

  const handleExport = () => {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-forest-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-forest-800 mb-1">
            <Link to="/admin" className="hover:underline">District Admin</Link>
            <span>/</span>
            <span className="text-forest-950 font-semibold">Programme Analytics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-ink flex items-center gap-2">
            Oral Health Mission Analytics & Epidemiological Trends
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Epidemiological indicators, screening rates, tobacco exposure prevalence, and hospital referral completion ratios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={Download}
            onClick={handleExport}
          >
            Export Mission Dataset (CSV)
          </Button>
        </div>
      </div>

      {exportToast && (
        <Alert 
          type="success" 
          title="Mission Dataset Exported" 
          titleTe="మిషన్ డేటాసెట్ డౌన్‌లోడ్ పూర్తయింది"
        >
          CSV file generated: `AAROGYA_DRISHTI_ITDA_PADERU_2026_METRICS.csv` containing anonymized epidemiological metrics.
        </Alert>
      )}

      {/* Filter Bar */}
      <Card padding="md" className="border-forest-200 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-forest-800" />
            <span className="font-bold text-ink">Reporting Window:</span>
            <span className="font-mono text-forest-900 bg-forest-100 px-2 py-0.5 rounded">
              01 May 2026 — 30 Oct 2026 (6 Months Active Mission)
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-bold text-ink">Filter Mandal:</span>
            <select
              value={selectedMandal}
              onChange={(e) => setSelectedMandal(e.target.value)}
              className="p-2 border border-forest-300 rounded-lg text-xs bg-white text-ink font-semibold"
            >
              <option value="ALL">All 22 Mandals (ASR District Aggregate)</option>
              {MANDAL_COVERAGE_DATA.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.nameTe}) {m.isPilot ? '★ (Pilot)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Main Bar Chart: Monthly Screening & Referral Trends */}
      <Card
        title="Monthly Screening Volume & Referral Conversion Trends"
        titleTe="నెలవారీ స్క్రీనింగ్ & రిఫరల్ పురోగతి"
        subtitle="Comparing total screenings completed vs. suspicious cases identified vs. specialist hospital referrals completed"
      >
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={MONTHLY_METRICS}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#075B4D',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="screenings" name="Screenings Completed" fill="#087653" radius={[4, 4, 0, 0]} />
              <Bar dataKey="suspiciousIdentified" name="High-Risk Lesions" fill="#D97706" radius={[4, 4, 0, 0]} />
              <Bar dataKey="referralsCompleted" name="Referrals Completed" fill="#0284C7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Two Column Grid: Habit Risk Breakdown & Care Continuum Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Risk Factor Prevalence Breakdown */}
        <Card
          title="Tobacco Exposure & High-Risk Habit Prevalence"
          titleTe="పొగాకు మరియు గుట్కా వినియోగ విశ్లేషణ"
          subtitle="Screened population exposure distribution across ASR District"
        >
          <div className="space-y-4 pt-2 text-xs">
            
            {/* Gutkha */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-bold text-ink">Chewing Gutkha / Areca Nut</span>
                <span className="font-mono font-bold text-forest-900">48.2% (2,323 Individuals)</span>
              </div>
              <div className="w-full bg-forest-100 rounded-full h-2.5">
                <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: '48.2%' }} />
              </div>
            </div>

            {/* Raw Tobacco / Khaini */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-bold text-ink">Raw Chewing Tobacco / Khaini</span>
                <span className="font-mono font-bold text-forest-900">22.4% (1,080 Individuals)</span>
              </div>
              <div className="w-full bg-forest-100 rounded-full h-2.5">
                <div className="bg-forest-700 h-2.5 rounded-full" style={{ width: '22.4%' }} />
              </div>
            </div>

            {/* Reverse Smoking */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-bold text-red-900">Reverse Chutta Smoking (High Risk for Palatal Malignancy)</span>
                <span className="font-mono font-bold text-red-800">17.8% (858 Individuals)</span>
              </div>
              <div className="w-full bg-forest-100 rounded-full h-2.5">
                <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '17.8%' }} />
              </div>
            </div>

            {/* Non-users */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-bold text-ink-muted">Non-Tobacco Users / Healthy Habits</span>
                <span className="font-mono font-bold text-emerald-800">11.6% (559 Individuals)</span>
              </div>
              <div className="w-full bg-forest-100 rounded-full h-2.5">
                <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '11.6%' }} />
              </div>
            </div>

          </div>
        </Card>

        {/* Screening-to-Biopsy Continuum Funnel */}
        <Card
          title="Screening-to-Biopsy Continuum Conversion"
          titleTe="స్క్రీనింగ్ నుండి బయాప్సీ వరకు ప్రయాణ విశ్లేషణ"
          subtitle="Patient retention along the multi-tier referral chain"
        >
          <div className="space-y-3 pt-1 text-xs">
            
            <div className="p-3 rounded-xl bg-forest-50 border border-forest-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <div>
                  <span className="font-bold text-ink block">Frontline Doorstep Screenings</span>
                  <span className="text-[11px] text-ink-muted">Recorded by ASHA workers in habitations</span>
                </div>
              </div>
              <span className="font-mono font-bold text-forest-900 text-sm">4,820 (100%)</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <div>
                  <span className="font-bold text-amber-950 block">Suspicious Lesions Identified</span>
                  <span className="text-[11px] text-amber-900/80">3.8% positivity rate across district</span>
                </div>
              </div>
              <span className="font-mono font-bold text-amber-900 text-sm">186 (3.8%)</span>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-blue-700" />
                <div>
                  <span className="font-bold text-blue-950 block">Specialist Hospital Referrals Issued</span>
                  <span className="text-[11px] text-blue-900/80">Triaged to District Hospital Paderu</span>
                </div>
              </div>
              <span className="font-mono font-bold text-blue-900 text-sm">82 (44.1%)</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Microscope className="w-4 h-4 text-emerald-700" />
                <div>
                  <span className="font-bold text-emerald-950 block">Diagnostic Biopsies Completed</span>
                  <span className="text-[11px] text-emerald-900/80">65.8% conversion of referred cases</span>
                </div>
              </div>
              <span className="font-mono font-bold text-emerald-900 text-sm">54 (65.8%)</span>
            </div>

          </div>
        </Card>

      </div>

    </div>
  );
};
