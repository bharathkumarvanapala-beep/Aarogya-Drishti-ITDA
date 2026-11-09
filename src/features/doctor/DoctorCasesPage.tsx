import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Search,
  Filter,
  Eye,
  Video,
  ShieldAlert,
  Calendar,
  User,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useTranslation } from '../../i18n';
import { INITIAL_DOCTOR_CASES } from './doctorData';
import type { DoctorCase } from './doctorData';
import { getCustomDoctorCases } from '../../services/clinicalDataService';
import { ASR_DIVISIONS, getMandalsByDivision, getPanchayatsForMandal } from '../../data/asrMandals';

export const DoctorCasesPage: React.FC = () => {
  const { language } = useTranslation();

  const [cases] = useState<DoctorCase[]>(() => {
    const custom = getCustomDoctorCases();
    return [...custom, ...INITIAL_DOCTOR_CASES];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMandal, setSelectedMandal] = useState('ALL');
  const [selectedPanchayat, setSelectedPanchayat] = useState('ALL');
  const [filterTab, setFilterTab] = useState<'ALL' | 'HIGH_PRIORITY' | 'ROUTINE' | 'COMPLETED'>('ALL');

  const availablePanchayats = selectedMandal !== 'ALL' ? getPanchayatsForMandal(selectedMandal) : [];

  const handleMandalChange = (val: string) => {
    setSelectedMandal(val);
    setSelectedPanchayat('ALL');
  };

  // Filtered cases
  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.habitation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.gramPanchayat && c.gramPanchayat.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.mandal.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedMandal !== 'ALL' && c.mandal.toLowerCase() !== selectedMandal.toLowerCase()) return false;
    if (selectedPanchayat !== 'ALL' && c.gramPanchayat && c.gramPanchayat.toLowerCase() !== selectedPanchayat.toLowerCase()) return false;

    if (filterTab === 'HIGH_PRIORITY') return c.triagePriority === 'HIGH_PRIORITY';
    if (filterTab === 'ROUTINE') return c.triagePriority === 'ROUTINE' || c.triagePriority === 'MODERATE';
    if (filterTab === 'COMPLETED') return c.status === 'COMPLETED';

    return true;
  });

  const highPriorityCount = cases.filter((c) => c.triagePriority === 'HIGH_PRIORITY' && c.status !== 'COMPLETED').length;
  const pendingCount = cases.filter((c) => c.status === 'PENDING' || c.status === 'NEW').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-forest-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-forest-800 mb-1">
            <Link to="/doctor" className="hover:underline">Clinical Workstation</Link>
            <span>/</span>
            <span className="text-forest-950 font-semibold">Case Triage Queue</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-ink flex items-center gap-2">
            Doctor Clinical Review Queue
            <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {pendingCount} Awaiting Review
            </span>
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Frontline screenings submitted by ASHA workers across G. Madugula Mandal awaiting independent clinical assessment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/doctor/telemedicine">
            <Button variant="outline" size="sm" icon={Video}>
              Open Telemedicine Hub
            </Button>
          </Link>
        </div>
      </div>

      {/* Triage Alert for High Priority Suspicious Lesions */}
      {highPriorityCount > 0 && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 shadow-sm flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-200 text-red-900 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-950 uppercase tracking-wide">
                High-Priority Triage Alert ({highPriorityCount} Cases)
              </h4>
              <p className="text-xs text-red-900/90 mt-0.5 leading-relaxed">
                Cases with non-healing white/red patches (&gt; 3 weeks duration) and long-term tobacco/gutkha exposure require priority clinical assessment within 48-72 hours.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFilterTab('HIGH_PRIORITY')}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-700 text-white hover:bg-red-800 transition-colors"
          >
            Filter High Priority
          </button>
        </div>
      )}

      {/* Search and Filters Toolbar */}
      <Card padding="md" className="border-forest-200 bg-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <button
              type="button"
              onClick={() => setFilterTab('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'ALL'
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
              }`}
            >
              All Cases ({cases.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('HIGH_PRIORITY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'HIGH_PRIORITY'
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'bg-red-50 text-red-900 hover:bg-red-100'
              }`}
            >
              Priority Suspicious ({cases.filter((c) => c.triagePriority === 'HIGH_PRIORITY').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('ROUTINE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'ROUTINE'
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
              }`}
            >
              Routine / Moderate ({cases.filter((c) => c.triagePriority !== 'HIGH_PRIORITY').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('COMPLETED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'COMPLETED'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              Reviewed ({cases.filter((c) => c.status === 'COMPLETED').length})
            </button>
          </div>

          {/* Mandal Filter & Search Box */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-1.5 bg-forest-50 px-3 py-1.5 rounded-xl border border-forest-200">
              <MapPin className="w-3.5 h-3.5 text-forest-800 shrink-0" />
              <select
                value={selectedMandal}
                onChange={(e) => handleMandalChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-forest-950 focus:outline-none max-w-[170px] truncate"
              >
                <option value="ALL">All 22 Mandals (అన్ని మండలాలు)</option>
                {ASR_DIVISIONS.map((div) => {
                  const divMandals = getMandalsByDivision(div.id);
                  return (
                    <optgroup key={div.id} label={`${div.nameEn} (${div.nameTe})`}>
                      {divMandals.map((m) => (
                        <option key={m.id} value={m.nameEn}>
                          {m.nameEn} ({m.nameTe})
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>

            {/* Gram Panchayat Filter (When Mandal is selected) */}
            {selectedMandal !== 'ALL' && availablePanchayats.length > 0 && (
              <div className="flex items-center gap-1.5 bg-forest-50 px-3 py-1.5 rounded-xl border border-forest-200 animate-fadeIn">
                <span className="text-[10px] font-bold text-forest-800">GP:</span>
                <select
                  value={selectedPanchayat}
                  onChange={(e) => setSelectedPanchayat(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-forest-950 focus:outline-none max-w-[170px] truncate"
                >
                  <option value="ALL">All {availablePanchayats.length} GPs ({selectedMandal})</option>
                  {availablePanchayats.map((gp, idx) => (
                    <option key={gp.nameEn} value={gp.nameEn}>
                      {idx + 1}. {gp.nameEn} GP ({gp.nameTe})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="relative w-full md:w-60">
              <Search className="w-4 h-4 text-forest-800 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, ID, village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-forest-200 rounded-lg text-xs bg-forest-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>

        </div>
      </Card>

      {/* Case Triage Cards List */}
      <div className="space-y-3">
        {filteredCases.length === 0 ? (
          <Card padding="lg" className="text-center py-12 text-ink-muted">
            <Filter className="w-10 h-10 mx-auto text-forest-400 mb-2" />
            <p className="text-sm font-medium">No clinical cases match your filter criteria.</p>
            <p className="text-xs mt-1">Try resetting the search query or switching to All Cases.</p>
          </Card>
        ) : (
          filteredCases.map((c) => {
            const isKondalaRao = c.id === 'SCR-2026-0042';

            return (
              <Card
                key={c.id}
                padding="md"
                className={`border transition-all hover:shadow-md ${
                  isKondalaRao ? 'border-amber-300 ring-2 ring-amber-200/50 bg-amber-50/20' : 'border-forest-200 bg-white'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  
                  {/* Left Column: Patient Profile & Identification */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded border border-forest-200">
                        {c.id}
                      </span>
                      <span className="font-mono text-xs text-ink-muted">
                        Ref: {c.patientId}
                      </span>
                      <StatusBadge status={c.status} size="sm" />
                      {c.triagePriority === 'HIGH_PRIORITY' && (
                        <Badge
                          label="PRIORITY TRIAGE"
                          labelTe="ప్రాధాన్యత కేసు"
                          variant="danger"
                          size="sm"
                        />
                      )}
                      {isKondalaRao && (
                        <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded uppercase">
                          Standard Synthetic Scenario
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2">
                      <h3 className="text-base font-bold text-ink">
                        {c.patientName}
                      </h3>
                      {language === 'te' && (
                        <span className="text-sm font-telugu text-forest-800">
                          ({c.patientNameTe})
                        </span>
                      )}
                      <span className="text-xs text-ink-muted">
                        • {c.age} Y / {c.gender === 'male' ? 'Male' : 'Female'} • Habitation: <strong className="text-forest-950">{c.habitation}</strong>{c.gramPanchayat ? `, ${c.gramPanchayat} GP` : ''}, {c.mandal}
                      </span>
                    </div>

                    {/* Complaint & Symptoms */}
                    <div className="text-xs text-ink-muted space-y-1">
                      <p>
                        <strong className="text-ink">Chief Complaint:</strong> {c.complaint}
                      </p>
                      <div className="flex items-center gap-4 flex-wrap text-[11px]">
                        <span><strong>Duration:</strong> {c.duration}</span>
                        <span>•</span>
                        <span><strong>Habits:</strong> {c.tobaccoHistory}</span>
                        {c.reverseSmoking && (
                          <>
                            <span>•</span>
                            <span className="text-red-700 font-bold">Reverse Smoking Active</span>
                          </>
                        )}
                        <span>•</span>
                        <span><strong>Mouth Opening:</strong> {c.trismusFingers}</span>
                      </div>
                    </div>

                    {/* Submission Metadata */}
                    <div className="flex items-center gap-3 text-[11px] text-forest-800 pt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        Screened by: {c.healthWorkerName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Date: {c.screeningDate}
                      </span>
                    </div>
                  </div>

                  {/* Middle Column: Visual Thumbnail & AI Research Badge */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-forest-200 bg-forest-950 shrink-0 shadow-sm">
                      <img
                        src={c.images[0]?.url || '/images/sample_oral_patch.jpg'}
                        alt={c.patientName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] text-white font-mono">
                        {c.images.length} Views
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-mono text-ink-muted uppercase block">
                        Non-Clinical AI Flag
                      </span>
                      <Badge
                        label={c.aiDemoOutput.researchLabel === 'suspicious_example' ? 'SUSPICIOUS_DEMO' : 'BENIGN_DEMO'}
                        variant={c.aiDemoOutput.researchLabel === 'suspicious_example' ? 'warning' : 'neutral'}
                        size="sm"
                      />
                      <span className="text-[10px] text-ink-muted block italic">
                        Not a diagnosis
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Review Action */}
                  <div className="shrink-0 flex flex-col gap-2 w-full lg:w-auto">
                    <Link to={`/doctor/cases/${c.id}`} className="w-full">
                      <Button
                        variant={c.status === 'COMPLETED' ? 'outline' : 'primary'}
                        size="md"
                        icon={c.status === 'COMPLETED' ? Eye : Stethoscope}
                        fullWidth
                      >
                        {c.status === 'COMPLETED' ? 'View Assessment' : 'Open Review Console'}
                      </Button>
                    </Link>

                    {c.triagePriority === 'HIGH_PRIORITY' && c.status !== 'COMPLETED' && (
                      <Link to="/doctor/telemedicine" className="w-full">
                        <Button variant="ghost" size="sm" icon={Video} fullWidth>
                          Start Teleconsult
                        </Button>
                      </Link>
                    )}
                  </div>

                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Bottom Summary Bar */}
      <Card padding="md" className="border-forest-200 bg-forest-50/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-forest-950">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-700" />
            <span>
              Primary Health Centre: <strong>G. Madugula PHC</strong> • Medical Officer in Charge: <strong>Dr. K. Suresh, MBBS</strong>
            </span>
          </div>
          <Link to="/doctor/telemedicine" className="inline-flex items-center gap-1 font-bold text-forest-800 hover:underline">
            <span>Telemedicine Virtual Consultation Suite</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Card>

    </div>
  );
};
