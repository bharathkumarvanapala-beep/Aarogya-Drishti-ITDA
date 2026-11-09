import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Search,
  User,
  CheckCircle2,
  Send,
  Truck,
  MapPin
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/common/Alert';
import { useTranslation } from '../../i18n';
import { INITIAL_INBOUND_REFERRALS } from './hospitalData';
import type { InboundReferral } from './hospitalData';
import { getCustomInboundReferrals } from '../../services/clinicalDataService';
import { ASR_DIVISIONS, getMandalsByDivision, getPanchayatsForMandal } from '../../data/asrMandals';

export const InboundReferralsPage: React.FC = () => {
  const { language } = useTranslation();

  const [referrals, setReferrals] = useState<InboundReferral[]>(() => {
    const custom = getCustomInboundReferrals();
    return [...custom, ...INITIAL_INBOUND_REFERRALS];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMandal, setSelectedMandal] = useState('ALL');
  const [selectedPanchayat, setSelectedPanchayat] = useState('ALL');
  const [filterTab, setFilterTab] = useState<'ALL' | 'NEW' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  const availablePanchayats = selectedMandal !== 'ALL' ? getPanchayatsForMandal(selectedMandal) : [];

  const handleMandalChange = (val: string) => {
    setSelectedMandal(val);
    setSelectedPanchayat('ALL');
  };

  // Accept & Schedule Modal State
  const [selectedReferral, setSelectedReferral] = useState<InboundReferral | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('2026-11-04');
  const [appointmentTime, setAppointmentTime] = useState('10:30 AM');
  const [assignedSpecialist, setAssignedSpecialist] = useState('Dr. M. Anand, MDS (Oral Onco-Surgery)');
  const [transportConfirmed, setTransportConfirmed] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const filteredReferrals = referrals.filter((r) => {
    const matchesSearch =
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.mandal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.gramPanchayat && r.gramPanchayat.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.referringFacility.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedMandal !== 'ALL' && r.mandal.toLowerCase() !== selectedMandal.toLowerCase()) return false;
    if (selectedPanchayat !== 'ALL' && r.gramPanchayat && r.gramPanchayat.toLowerCase() !== selectedPanchayat.toLowerCase()) return false;

    if (filterTab === 'NEW') return r.status === 'NEW';
    if (filterTab === 'IN_PROGRESS') return r.status === 'IN_PROGRESS';
    if (filterTab === 'COMPLETED') return r.status === 'COMPLETED';

    return true;
  });

  const handleAcceptReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReferral) return;

    setReferrals((prev) =>
      prev.map((item) =>
        item.id === selectedReferral.id
          ? {
              ...item,
              status: 'IN_PROGRESS',
              assignedSpecialist,
              notes: `${item.notes} | OPD Clinic Scheduled: ${appointmentDate} at ${appointmentTime}. Transport: ${
                transportConfirmed ? 'ITDA Van Confirmed' : 'Self'
              }.`,
            }
          : item
      )
    );

    setSelectedReferral(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-forest-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-forest-800 mb-1">
            <Link to="/hospital" className="hover:underline">Hospital Hub</Link>
            <span>/</span>
            <span className="text-forest-950 font-semibold">Inbound Referrals</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-ink flex items-center gap-2">
            Inbound Specialist Referral Registry
            <span className="text-xs font-mono font-semibold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
              District Hospital Paderu
            </span>
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Incoming oral oncology referrals dispatched from Primary Health Centres and Area Hospitals across Alluri Sitharama Raju District.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/hospital/appointments">
            <Button variant="outline" size="sm" icon={Calendar}>
              View OPD Clinic Schedule
            </Button>
          </Link>
        </div>
      </div>

      {showSuccessToast && (
        <Alert 
          type="success" 
          title="Referral Accepted & Specialist Allocated" 
          titleTe="రిఫరల్ స్వీకరించబడింది & స్పెషలిస్ట్ కేటాయించబడ్డారు"
        >
          Appointment confirmed. Patient navigation team notified for ITDA tribal transport desk pickup.
        </Alert>
      )}

      {/* Toolbar: Filters & Search */}
      <Card padding="md" className="border-forest-200 bg-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <button
              type="button"
              onClick={() => setFilterTab('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'ALL'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
              }`}
            >
              All Referrals ({referrals.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('NEW')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'NEW'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              Awaiting Triage ({referrals.filter((r) => r.status === 'NEW').length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('IN_PROGRESS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterTab === 'IN_PROGRESS'
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
              }`}
            >
              Scheduled / In Progress ({referrals.filter((r) => r.status === 'IN_PROGRESS').length})
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
              Completed ({referrals.filter((r) => r.status === 'COMPLETED').length})
            </button>
          </div>

          {/* Mandal Filter & Search Box */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
              <MapPin className="w-3.5 h-3.5 text-blue-800 shrink-0" />
              <select
                value={selectedMandal}
                onChange={(e) => handleMandalChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-blue-950 focus:outline-none max-w-[170px] truncate"
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
              <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 animate-fadeIn">
                <span className="text-[10px] font-bold text-blue-800">GP:</span>
                <select
                  value={selectedPanchayat}
                  onChange={(e) => setSelectedPanchayat(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-blue-950 focus:outline-none max-w-[170px] truncate"
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
                placeholder="Search patient, token, PHC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-forest-200 rounded-lg text-xs bg-forest-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

        </div>
      </Card>

      {/* Referral Cards List */}
      <div className="space-y-3">
        {filteredReferrals.map((r) => {
          const isKondalaRao = r.id === 'REF-2026-0019';

          return (
            <Card
              key={r.id}
              padding="md"
              className={`border transition-all hover:shadow-md ${
                isKondalaRao
                  ? 'border-blue-400 ring-2 ring-blue-200/50 bg-blue-50/20'
                  : 'border-forest-200 bg-white'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                
                {/* Left Column: Patient & Referral Metadata */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-950 bg-blue-100 px-2.5 py-0.5 rounded border border-blue-200">
                      {r.id}
                    </span>
                    <span className="font-mono text-xs text-ink-muted">
                      Card: {r.patientId}
                    </span>
                    <StatusBadge status={r.status} size="sm" />
                    {r.priority === 'URGENT_72H' && (
                      <Badge label="URGENT (72H)" variant="danger" size="sm" />
                    )}
                    {r.priority === 'HIGH_2W' && (
                      <Badge label="HIGH PRIORITY (2W)" variant="warning" size="sm" />
                    )}
                    {isKondalaRao && (
                      <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded uppercase">
                        Kondala Rao (Phase 8 Referral)
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <h3 className="text-base font-bold text-ink">
                      {r.patientName} ({r.age}M)
                    </h3>
                    {language === 'te' && (
                      <span className="text-sm font-telugu text-forest-800">
                        ({r.patientNameTe})
                      </span>
                    )}
                    <span className="text-xs text-ink-muted">
                      • Habitation: <strong>{r.habitation}</strong>{r.gramPanchayat ? `, ${r.gramPanchayat} GP` : ''}, {r.mandal} Mandal
                    </span>
                  </div>

                  {/* Clinical Reason & Diagnosis */}
                  <div className="text-xs space-y-1">
                    <p className="text-ink">
                      <strong className="text-forest-950">Provisional Diagnosis:</strong> {r.provisionalDiagnosis}
                    </p>
                    <p className="text-ink-muted leading-relaxed">
                      <strong>Referral Clinical Notes:</strong> {r.notes}
                    </p>
                  </div>

                  {/* Referring Facility & Doctor */}
                  <div className="flex items-center gap-4 text-[11px] text-forest-800 pt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      Referred from: <strong>{r.referringFacility}</strong> ({r.referringDoctor})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Dispatched: {r.dateReferred}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                      <Truck className="w-3.5 h-3.5" />
                      {r.transportAssistance}
                    </span>
                  </div>
                </div>

                {/* Middle Column: Assigned Specialist */}
                <div className="space-y-1.5 p-3 rounded-xl bg-forest-50 border border-forest-200 text-xs shrink-0 min-w-[220px]">
                  <span className="text-[10px] font-mono text-ink-muted uppercase block font-bold">
                    Allocated Specialist Care
                  </span>
                  <div className="font-bold text-ink flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                    <span>{r.assignedSpecialist.split(' (')[0]}</span>
                  </div>
                  <span className="text-[11px] text-forest-800 block">
                    {r.assignedSpecialist.split(' (')[1]?.replace(')', '') || 'Specialist OPD Clinic'}
                  </span>
                </div>

                {/* Right Column: Triage Actions */}
                <div className="shrink-0 flex flex-col gap-2 w-full lg:w-auto">
                  {r.status === 'NEW' ? (
                    <Button
                      variant="primary"
                      size="md"
                      icon={CheckCircle2}
                      fullWidth
                      onClick={() => {
                        setSelectedReferral(r);
                        setAssignedSpecialist(r.assignedSpecialist);
                      }}
                    >
                      Accept & Schedule
                    </Button>
                  ) : (
                    <Link to="/hospital/appointments" className="w-full">
                      <Button variant="outline" size="md" icon={Calendar} fullWidth>
                        View Appointment
                      </Button>
                    </Link>
                  )}

                  <Link to={`/doctor/cases/${r.screeningId}`} className="w-full">
                    <Button variant="ghost" size="sm" icon={Send} fullWidth>
                      View PHC Clinical Dossier
                    </Button>
                  </Link>
                </div>

              </div>
            </Card>
          );
        })}
      </div>

      {/* ACCEPT & SCHEDULE MODAL */}
      <Modal
        isOpen={selectedReferral !== null}
        onClose={() => setSelectedReferral(null)}
        title="Triage & Schedule Specialist Appointment"
        titleTe="స్పెషలిస్ట్ అపాయింట్‌మెంట్ షెడ్యూల్"
        maxWidth="lg"
      >
        {selectedReferral && (
          <form onSubmit={handleAcceptReferral} className="space-y-4 py-2">
            <div className="p-3 bg-forest-50 rounded-xl border border-forest-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-ink-muted">Patient:</span>
                <span className="font-bold text-ink">{selectedReferral.patientName} ({selectedReferral.age}M)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Referral ID:</span>
                <span className="font-mono font-bold text-blue-900">{selectedReferral.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Diagnosis:</span>
                <span className="font-bold text-forest-900">{selectedReferral.provisionalDiagnosis}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1">
                  Appointment Date:
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full p-2.5 border border-forest-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">
                  OPD Time Slot:
                </label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full p-2.5 border border-forest-300 rounded-lg text-xs"
                >
                  <option value="09:30 AM">09:30 AM - 10:00 AM (Morning Slot 1)</option>
                  <option value="10:30 AM">10:30 AM - 11:00 AM (Morning Slot 2)</option>
                  <option value="11:30 AM">11:30 AM - 12:00 PM (Midday Slot)</option>
                  <option value="02:30 PM">02:30 PM - 03:00 PM (Afternoon Slot)</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-ink mb-1">
                Assign Specialist Surgeon:
              </label>
              <select
                value={assignedSpecialist}
                onChange={(e) => setAssignedSpecialist(e.target.value)}
                className="w-full p-2.5 border border-forest-300 rounded-lg text-xs font-medium"
              >
                <option value="Dr. M. Anand, MDS (Oral & Maxillofacial Onco-Surgery)">
                  Dr. M. Anand, MDS (Oral & Maxillofacial Onco-Surgery) - Room 14
                </option>
                <option value="Dr. S. V. Rao, MS (ENT / Head & Neck Oncology)">
                  Dr. S. V. Rao, MS (ENT / Head & Neck Oncology) - Room 12
                </option>
                <option value="Dr. R. Madhavi, BDS (Dental Surgeon)">
                  Dr. R. Madhavi, BDS (Dental Surgeon) - Room 08
                </option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer bg-forest-50 p-3 rounded-lg border border-forest-200">
              <input
                type="checkbox"
                checked={transportConfirmed}
                onChange={(e) => setTransportConfirmed(e.target.checked)}
                className="w-4 h-4 text-forest-800 rounded focus:ring-forest-500"
              />
              <span>
                <strong>Assign ITDA Tribal Patient Transport Desk:</strong> Free pickup van arranged from {selectedReferral.habitation} to District Hospital Paderu.
              </span>
            </label>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => setSelectedReferral(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                icon={CheckCircle2}
              >
                Confirm Appointment & Notify Patient
              </Button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
