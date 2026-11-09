import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  User
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useTranslation } from '../../i18n';
import { HABITATION_DATA, MANDAL_COVERAGE_DATA } from './adminData';
import type { HabitationDetail } from './adminData';
import { 
  getPanchayatsForMandal, 
  getVillagesForPanchayat, 
  TOTAL_ASR_VILLAGES_COUNT, 
  TOTAL_ASR_PANCHAYATS_COUNT 
} from '../../data/asrMandals';

export const CoverageMapPage: React.FC = () => {
  const { language } = useTranslation();

  const [selectedMandal, setSelectedMandal] = useState<string>('ALL');
  const [selectedPanchayat, setSelectedPanchayat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHabitation, setSelectedHabitation] = useState<HabitationDetail | null>(null);

  const selectedMandalPanchayats = selectedMandal !== 'ALL' ? getPanchayatsForMandal(selectedMandal) : [];
  const activePanchayatVillages = (selectedMandal !== 'ALL' && selectedPanchayat) 
    ? getVillagesForPanchayat(selectedPanchayat, selectedMandal) 
    : [];

  const filteredHabitations = HABITATION_DATA.filter((hab) => {
    const matchesSearch =
      hab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hab.mandal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hab.assignedWorker.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedMandal !== 'ALL' && hab.mandal !== selectedMandal) return false;

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-forest-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-forest-800 mb-1">
            <Link to="/admin" className="hover:underline">District Admin</Link>
            <span>/</span>
            <span className="text-forest-950 font-semibold">Coverage & Village Map</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-ink flex items-center gap-2">
            Tribal Habitation Screening Coverage Map
            <span className="text-xs font-mono font-semibold text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded-full">
              ITDA Paderu (ASR District) • 22 Mandals • {TOTAL_ASR_PANCHAYATS_COUNT} GPs • {TOTAL_ASR_VILLAGES_COUNT} Villages
            </span>
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Geographic monitoring of oral cancer screening saturation and frontline coverage across remote tribal hamlets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/reports">
            <Button variant="outline" size="sm">
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Coverage Status Legend & Filter Toolbar */}
      <Card padding="md" className="border-forest-200 bg-white space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Mandal Dropdown & Quick Selection Toolbar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label htmlFor="coverage-mandal-select" className="text-xs font-bold text-ink whitespace-nowrap">
                Select Mandal (మండలం):
              </label>
              <select
                id="coverage-mandal-select"
                value={selectedMandal}
                onChange={(e) => {
                  setSelectedMandal(e.target.value);
                  setSelectedPanchayat(null);
                }}
                className="px-3 py-2 rounded-xl border border-forest-300 bg-white text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-forest-600 shadow-sm min-w-[220px]"
              >
                <option value="ALL">All 22 Mandals (అన్ని 22 మండలాలు - ASR జిల్లా)</option>
                <optgroup label="Paderu Division (పాడేరు డివిజన్ - 11)">
                  {MANDAL_COVERAGE_DATA.filter((m) => m.division === 'Paderu').map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.nameTe}) {m.isPilot ? '★ Pilot' : ''} [{m.coveragePercentage}%]
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Rampachodavaram Division (రంపచోడవరం డివిజన్ - 7)">
                  {MANDAL_COVERAGE_DATA.filter((m) => m.division === 'Rampachodavaram').map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.nameTe}) [{m.coveragePercentage}%]
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Chintoor Division (చింతూరు డివిజన్ - 4)">
                  {MANDAL_COVERAGE_DATA.filter((m) => m.division === 'Chintoor').map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.nameTe}) [{m.coveragePercentage}%]
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Quick Filter Pill Buttons */}
            <div className="flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => { setSelectedMandal('ALL'); setSelectedPanchayat(null); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedMandal === 'ALL'
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
                }`}
              >
                All (22)
              </button>
              <button
                type="button"
                onClick={() => { setSelectedMandal('G. Madugula'); setSelectedPanchayat(null); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedMandal === 'G. Madugula'
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
                }`}
              >
                G. Madugula ★
              </button>
              <button
                type="button"
                onClick={() => { setSelectedMandal('Paderu'); setSelectedPanchayat(null); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedMandal === 'Paderu'
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
                }`}
              >
                Paderu
              </button>
              <button
                type="button"
                onClick={() => { setSelectedMandal('Rampachodavaram'); setSelectedPanchayat(null); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedMandal === 'Rampachodavaram'
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
                }`}
              >
                Rampachodavaram
              </button>
              <button
                type="button"
                onClick={() => { setSelectedMandal('Chintoor'); setSelectedPanchayat(null); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedMandal === 'Chintoor'
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
                }`}
              >
                Chintoor
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-forest-800 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search habitation or ASHA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-forest-200 rounded-lg text-xs bg-forest-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>

        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 pt-2 border-t border-forest-100 text-xs text-ink-muted flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600" />
            <span>High Saturation (&gt;75% Screened)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Moderate Progress (50% - 75%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span>Lagging Area (&lt;50% Screened)</span>
          </div>
        </div>
      </Card>

      {/* Official Gram Panchayats & Villages Panel (When Mandal is selected) */}
      {selectedMandal !== 'ALL' && selectedMandalPanchayats.length > 0 && (
        <Card padding="md" className="bg-gradient-to-r from-forest-50/80 via-emerald-50/50 to-white border-forest-200 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-forest-100 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-forest-700 animate-pulse" />
              <h3 className="text-xs font-bold text-forest-950 uppercase tracking-wider">
                Official Gram Panchayats in {selectedMandal} Mandal ({selectedMandalPanchayats.length} GPs — Click any GP to inspect Villages)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-forest-800 font-semibold bg-white px-2.5 py-0.5 rounded-md border border-forest-200 shadow-2xs">
              Alluri Sitharama Raju District
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 scrollbar-thin">
            {selectedMandalPanchayats.map((gp, idx) => {
              const isSelected = selectedPanchayat === gp.nameEn;
              return (
                <button
                  type="button"
                  key={gp.nameEn}
                  onClick={() => setSelectedPanchayat(isSelected ? null : gp.nameEn)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-forest-800 text-white border-forest-950 shadow-sm'
                      : 'bg-white border-forest-200/90 text-forest-950 hover:border-forest-400'
                  }`}
                >
                  <span className={`font-mono text-[10px] font-bold shrink-0 ${isSelected ? 'text-forest-200' : 'text-forest-700'}`}>
                    {idx + 1}.
                  </span>
                  <div className="truncate">
                    <span className={`font-semibold block truncate ${isSelected ? 'text-white' : 'text-ink'}`}>
                      {gp.nameEn} GP
                    </span>
                    <span className={`font-telugu text-[10px] block truncate ${isSelected ? 'text-forest-200' : 'text-forest-700'}`}>
                      {gp.nameTe}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Constituent Villages & Habitations for Selected Gram Panchayat */}
          {selectedPanchayat && activePanchayatVillages.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-forest-200 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="text-xs font-bold text-forest-900">
                    Constituent Villages & Habitations in {selectedPanchayat} GP ({activePanchayatVillages.length} Villages):
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPanchayat(null)}
                  className="text-[11px] text-forest-700 hover:underline font-semibold"
                >
                  ✕ Close Villages
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                {activePanchayatVillages.map((v, vIdx) => (
                  <div
                    key={v.nameEn}
                    className="p-2.5 rounded-xl bg-white border border-forest-200 text-xs shadow-2xs hover:border-forest-300 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-ink">{vIdx + 1}. {v.nameEn}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-forest-100 text-forest-800">
                        {v.type || 'Village'}
                      </span>
                    </div>
                    <span className="text-forest-700 font-telugu text-[11px] block">{v.nameTe}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Visual Habitation Map Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredHabitations.map((hab) => {
          const isPilotVillage = hab.mandal === 'G. Madugula';

          return (
            <div
              key={hab.id}
              onClick={() => setSelectedHabitation(hab)}
              className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                hab.status === 'HIGH'
                  ? 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-500'
                  : hab.status === 'MODERATE'
                  ? 'bg-amber-50/40 border-amber-300 hover:border-amber-500'
                  : 'bg-red-50/40 border-red-300 hover:border-red-500'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      hab.status === 'HIGH' ? 'bg-emerald-600' : hab.status === 'MODERATE' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <h3 className="text-base font-bold text-ink">
                      {hab.name}
                    </h3>
                  </div>
                  {language === 'te' && (
                    <span className="text-xs font-telugu text-forest-800">
                      {hab.nameTe}
                    </span>
                  )}
                  <span className="text-[11px] text-ink-muted block mt-0.5">
                    Mandal: <strong>{hab.mandal}</strong> {isPilotVillage && '• Pilot Zone'}
                  </span>
                </div>

                <Badge
                  label={`${hab.coveragePercentage}%`}
                  variant={hab.status === 'HIGH' ? 'success' : hab.status === 'MODERATE' ? 'warning' : 'danger'}
                  size="sm"
                />
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-[11px] text-ink-muted">
                  <span>Coverage Saturation</span>
                  <span className="font-mono font-bold text-ink">{hab.screenedCount} / {hab.targetPopulation}</span>
                </div>
                <div className="w-full bg-forest-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      hab.status === 'HIGH' ? 'bg-emerald-600' : hab.status === 'MODERATE' ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${hab.coveragePercentage}%` }}
                  />
                </div>
              </div>

              {/* High Risk & ASHA Worker */}
              <div className="pt-2 border-t border-forest-200/60 text-xs space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-ink-muted">High-Risk Lesions:</span>
                  <span className="font-mono font-bold text-amber-900">{hab.highRiskCount} Flagged</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-ink-muted">Primary Worker:</span>
                  <span className="font-medium text-ink truncate max-w-[130px]">{hab.assignedWorker}</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-forest-200/60 flex items-center justify-between text-[10px] text-ink-muted font-mono">
                <span>Sync: {hab.lastSyncTime}</span>
                <span className="text-forest-800 font-bold hover:underline">Details →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL FOR SELECTED HABITATION */}
      <Modal
        isOpen={selectedHabitation !== null}
        onClose={() => setSelectedHabitation(null)}
        title="Habitation Demographic & Saturation Profile"
        titleTe="గ్రామ జనాభా & స్క్రీనింగ్ వివరాలు"
        maxWidth="md"
      >
        {selectedHabitation && (
          <div className="space-y-4 py-2 text-xs">
            <div className="p-4 bg-forest-50 rounded-xl border border-forest-200 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-ink">
                  {selectedHabitation.name}
                </h3>
                <Badge
                  label={`${selectedHabitation.coveragePercentage}% SATURATED`}
                  variant={selectedHabitation.status === 'HIGH' ? 'success' : 'warning'}
                  size="md"
                />
              </div>
              <p className="text-xs text-ink-muted">
                Mandal: <strong>{selectedHabitation.mandal}</strong> • Alluri Sitharama Raju District
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-forest-200">
                <span className="text-ink-muted block text-[11px]">Target Population (Adults 30+)</span>
                <span className="text-base font-mono font-bold text-ink">{selectedHabitation.targetPopulation}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-forest-200">
                <span className="text-ink-muted block text-[11px]">Screenings Completed</span>
                <span className="text-base font-mono font-bold text-forest-900">{selectedHabitation.screenedCount}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-forest-200">
                <span className="text-ink-muted block text-[11px]">Suspicious Lesions Flagged</span>
                <span className="text-base font-mono font-bold text-amber-900">{selectedHabitation.highRiskCount}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-forest-200">
                <span className="text-ink-muted block text-[11px]">Last Offline Sync</span>
                <span className="text-sm font-mono font-bold text-ink">{selectedHabitation.lastSyncTime}</span>
              </div>
            </div>

            <div className="p-3 bg-forest-50 rounded-xl border border-forest-200 space-y-1">
              <span className="text-ink-muted block text-[11px]">Frontline Healthcare Team</span>
              <p className="font-bold text-ink flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-forest-700" />
                {selectedHabitation.assignedWorker}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => setSelectedHabitation(null)}
              >
                Close
              </Button>
              <Link to="/admin/reports" className="w-full">
                <Button variant="primary" size="md" fullWidth>
                  View Analytical Trends
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
