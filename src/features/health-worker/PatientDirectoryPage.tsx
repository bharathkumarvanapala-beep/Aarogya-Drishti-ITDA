import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  CreditCard, 
  Camera, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Activity,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useTranslation } from '../../i18n';
import { 
  ASR_DIVISIONS, 
  getMandalsByDivision, 
  getPanchayatsForMandal,
  getVillagesForPanchayat,
  getVillagesForMandal
} from '../../data/asrMandals';
import { getCustomPatients } from '../../services/clinicalDataService';

interface VillagePatient {
  id: string;
  name: string;
  nameTe: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  mandal: string;
  gramPanchayat: string;
  habitation: string;
  cardSerial: string;
  habit: string;
  habitTe: string;
  screeningStatus: 'SUSPICIOUS' | 'NORMAL' | 'UNDER_REVIEW' | 'PENDING';
  lastScreened: string;
  assignedAsha: string;
}

const VILLAGE_PATIENTS: VillagePatient[] = [
  {
    id: 'ASR-PAT-2026-0842',
    name: 'Kondala Rao',
    nameTe: 'కొండల రావు',
    age: 46,
    gender: 'male',
    mandal: 'G. Madugula',
    gramPanchayat: 'Kothapalli',
    habitation: 'Kothapalli',
    cardSerial: 'ASR-CRD-2026-0842',
    habit: 'Gutkha / Chewing Tobacco (22 yrs)',
    habitTe: 'గుట్కా / పొగాకు నమలడం (22 సం.)',
    screeningStatus: 'SUSPICIOUS',
    lastScreened: '28 Oct 2026',
    assignedAsha: 'Lakshmi Devi',
  },
  {
    id: 'ASR-PAT-2026-0843',
    name: 'Somamma Pangi',
    nameTe: 'సోమమ్మ పంగి',
    age: 34,
    gender: 'female',
    mandal: 'G. Madugula',
    gramPanchayat: 'Nurmathi',
    habitation: 'Nurmati',
    cardSerial: 'ASR-CRD-2026-0843',
    habit: 'Non-tobacco user',
    habitTe: 'పొగాకు అలవాటు లేదు',
    screeningStatus: 'NORMAL',
    lastScreened: '25 Oct 2026',
    assignedAsha: 'Lakshmi Devi',
  },
  {
    id: 'ASR-PAT-2026-0844',
    name: 'Appala Swamy',
    nameTe: 'అప్పల స్వామి',
    age: 62,
    gender: 'male',
    mandal: 'G. Madugula',
    gramPanchayat: 'Solabham',
    habitation: 'Solabham',
    cardSerial: 'ASR-CRD-2026-0844',
    habit: 'Reverse Smoking (Chutta) 40 yrs',
    habitTe: 'అడ్డా చుట్ట కాల్చడం (40 సం.)',
    screeningStatus: 'SUSPICIOUS',
    lastScreened: '22 Oct 2026',
    assignedAsha: 'Lakshmi Devi',
  },
  {
    id: 'ASR-PAT-2026-0845',
    name: 'Pangi Parvathi',
    nameTe: 'పంగి పార్వతి',
    age: 28,
    gender: 'female',
    mandal: 'G. Madugula',
    gramPanchayat: 'Kothapalli',
    habitation: 'Kothapalli',
    cardSerial: 'ASR-CRD-2026-0845',
    habit: 'Occasional Betel Nut',
    habitTe: 'అప్పుడప్పుడు తమలపాకు/వక్క',
    screeningStatus: 'NORMAL',
    lastScreened: '18 Oct 2026',
    assignedAsha: 'Lakshmi Devi',
  },
  {
    id: 'ASR-PAT-2026-0846',
    name: 'Korra Ramu',
    nameTe: 'కొర్ర రాము',
    age: 51,
    gender: 'male',
    mandal: 'Paderu',
    gramPanchayat: 'Minumuluru',
    habitation: 'Minumuluru',
    cardSerial: 'ASR-CRD-2026-0846',
    habit: 'Bidi Smoking (30 yrs)',
    habitTe: 'బీడీ కాల్చడం (30 సం.)',
    screeningStatus: 'UNDER_REVIEW',
    lastScreened: '29 Oct 2026',
    assignedAsha: 'P. Sitamma',
  },
  {
    id: 'ASR-PAT-2026-0847',
    name: 'Chetti Venkata Rao',
    nameTe: 'చెట్టి వెంకటరావు',
    age: 39,
    gender: 'male',
    mandal: 'Araku Valley',
    gramPanchayat: 'Padmapuram',
    habitation: 'Padmapuram',
    cardSerial: 'ASR-CRD-2026-0847',
    habit: 'Khaini chewer (12 yrs)',
    habitTe: 'ఖైనీ అలవాటు (12 సం.)',
    screeningStatus: 'PENDING',
    lastScreened: 'Never Screened',
    assignedAsha: 'K. Mary',
  },
  {
    id: 'ASR-PAT-2026-0848',
    name: 'Madakam Somulu',
    nameTe: 'మడకం సోములు',
    age: 55,
    gender: 'male',
    mandal: 'Chintoor',
    gramPanchayat: 'Mothe',
    habitation: 'Mothe',
    cardSerial: 'ASR-CRD-2026-0848',
    habit: 'Chutta / Tobacco Leaf Chewing',
    habitTe: 'చుట్ట / పొగాకు ఆకు నమలడం',
    screeningStatus: 'SUSPICIOUS',
    lastScreened: '30 Oct 2026',
    assignedAsha: 'V. Parvathi',
  },
  {
    id: 'ASR-PAT-2026-0849',
    name: 'Karam Gangamma',
    nameTe: 'కారం గంగమ్మ',
    age: 48,
    gender: 'female',
    mandal: 'Rampachodavaram',
    gramPanchayat: 'Bandapalli',
    habitation: 'Bandapalli',
    cardSerial: 'ASR-CRD-2026-0849',
    habit: 'Betel Quid with Slaked Lime',
    habitTe: 'సున్నం తాంబూలం నమలడం',
    screeningStatus: 'NORMAL',
    lastScreened: '27 Oct 2026',
    assignedAsha: 'S. Ratnam',
  },
];

export const PatientDirectoryPage: React.FC = () => {
  const { language } = useTranslation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [mandalFilter, setMandalFilter] = useState('ALL');
  const [panchayatFilter, setPanchayatFilter] = useState('ALL');
  const [habitationFilter, setHabitationFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const availablePanchayats = mandalFilter !== 'ALL' ? getPanchayatsForMandal(mandalFilter) : [];
  const availableVillages = 
    panchayatFilter !== 'ALL'
      ? getVillagesForPanchayat(panchayatFilter, mandalFilter)
      : mandalFilter !== 'ALL'
      ? getVillagesForMandal(mandalFilter)
      : [];

  const handleMandalFilterChange = (mandal: string) => {
    setMandalFilter(mandal);
    setPanchayatFilter('ALL');
    setHabitationFilter('ALL');
  };

  const handlePanchayatFilterChange = (gp: string) => {
    setPanchayatFilter(gp);
    setHabitationFilter('ALL');
  };

  const customPatients = getCustomPatients();
  const customVillagePatients: VillagePatient[] = customPatients.map((p) => {
    const fullName = `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.id;
    const fullNameTe = `${p.firstNameTe || p.firstName || ''} ${p.lastNameTe || p.lastName || ''}`.trim() || fullName;
    const cardId = (p.uniquePatientId || p.id).replace(/[^\d]/g, '').slice(-4) || '8420';
    return {
      id: p.uniquePatientId || p.id,
      name: fullName,
      nameTe: fullNameTe,
      age: p.age || 30,
      gender: (p.gender || 'male') as 'male' | 'female' | 'other',
      mandal: p.mandal || 'G. Madugula',
      gramPanchayat: p.gramPanchayat || p.mandal || 'G. Madugula',
      habitation: p.village || 'Kothapalli',
      cardSerial: `ASR-CRD-${cardId}`,
      habit: p.contactPhone ? `Phone: ${p.contactPhone}` : 'Doorstep Registration',
      habitTe: 'నమోదైన రోగి',
      screeningStatus: 'PENDING' as const,
      lastScreened: 'Just Registered',
      assignedAsha: 'Lakshmi Devi (ASHA)',
    };
  });

  const allVillagePatients = [...customVillagePatients, ...VILLAGE_PATIENTS];

  const filteredPatients = allVillagePatients.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameTe.includes(searchQuery) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cardSerial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mandal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.gramPanchayat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.habitation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMandal = mandalFilter === 'ALL' || p.mandal === mandalFilter;
    const matchesPanchayat = panchayatFilter === 'ALL' || p.gramPanchayat.toLowerCase() === panchayatFilter.toLowerCase();
    const matchesHabitation = habitationFilter === 'ALL' || p.habitation === habitationFilter;
    const matchesStatus = statusFilter === 'ALL' || p.screeningStatus === statusFilter;

    return matchesSearch && matchesMandal && matchesPanchayat && matchesHabitation && matchesStatus;
  });

  const getStatusBadge = (status: VillagePatient['screeningStatus']) => {
    switch (status) {
      case 'SUSPICIOUS':
        return (
          <Badge 
            variant="danger" 
            size="sm" 
            icon={ShieldAlert}
            label={language === 'te' ? 'అనుమానాస్పద మచ్చ' : 'Suspicious Lesion'}
          />
        );
      case 'NORMAL':
        return (
          <Badge 
            variant="success" 
            size="sm" 
            icon={CheckCircle2}
            label={language === 'te' ? 'సాధారణం' : 'Normal Mucosa'}
          />
        );
      case 'UNDER_REVIEW':
        return (
          <Badge 
            variant="info" 
            size="sm" 
            icon={Clock}
            label={language === 'te' ? 'వైద్యుల పరిశీలనలో' : 'Under MO Review'}
          />
        );
      case 'PENDING':
        return (
          <Badge 
            variant="warning" 
            size="sm" 
            icon={Activity}
            label={language === 'te' ? 'స్క్రీనింగ్ పెండింగ్' : 'Screening Due'}
          />
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
              Frontline Directory
            </span>
            <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
              G. Madugula Sub-Centre
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            {language === 'te' ? 'గ్రామ రోగుల రిజిస్టర్' : 'Village Patient Directory'}
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            {language === 'te'
              ? 'కొత్తపల్లి, నూర్మతి మరియు సొలభం ఆవాసాల రోగుల జాబితా మరియు హెల్త్ కార్డ్ వివరాలు.'
              : 'Assigned habitation roster, physical health card credentials, and oral health statuses.'}
          </p>
        </div>

        <Link to="/health-worker/register">
          <Button variant="primary" size="md" icon={Plus}>
            {language === 'te' ? 'కొత్త రోగి నమోదు' : 'Register New Patient'}
          </Button>
        </Link>
      </div>

      {/* Aggregate Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Registered"
          labelTe="మొత్తం నమోదైన రోగులు"
          value="248"
          subtext="Across 3 habitations"
          subtextTe="3 ఆవాసాలలో"
          variant="forest"
          icon={Users}
        />
        <StatCard
          label="Screened This Month"
          labelTe="ఈ నెల స్క్రీనింగ్"
          value="182"
          subtext="73.3% saturation"
          subtextTe="73.3% పూర్తి"
          variant="emerald"
          icon={Activity}
        />
        <StatCard
          label="High-Risk Habits"
          labelTe="అధిక-ప్రమాద అలవాట్లు"
          value="58"
          subtext="Gutkha & Reverse smoking"
          subtextTe="పొగాకు / చుట్ట వినియోగం"
          variant="amber"
          icon={ShieldAlert}
        />
        <StatCard
          label="Screenings Due"
          labelTe="పెండింగ్ స్క్రీనింగ్‌లు"
          value="26"
          subtext="Doorstep visits required"
          subtextTe="ఈ వారం షెడ్యూల్"
          variant="default"
          icon={Clock}
        />
      </div>

      {/* Search & Filter Toolbar */}
      <Card variant="default" padding="md">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'te' ? 'పేరు, రోగి సంఖ్య లేదా కార్డ్ ద్వారా వెతకండి...' : 'Search by name, patient ID, or card serial...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 bg-white"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Mandal Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-forest-700" />
              <select
                value={mandalFilter}
                onChange={(e) => handleMandalFilterChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-ink focus:outline-none max-w-[160px] truncate"
              >
                <option value="ALL">{language === 'te' ? 'అన్ని 22 మండలాలు' : 'All 22 Mandals'}</option>
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

            {/* Gram Panchayat Filter Dropdown */}
            {mandalFilter !== 'ALL' && availablePanchayats.length > 0 && (
              <div className="flex items-center gap-1.5 bg-forest-50/80 px-3 py-1.5 rounded-xl border border-forest-200 animate-fadeIn">
                <span className="text-[10px] font-bold text-forest-800">GP:</span>
                <select
                  value={panchayatFilter}
                  onChange={(e) => handlePanchayatFilterChange(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-ink focus:outline-none max-w-[170px] truncate"
                >
                  <option value="ALL">All {availablePanchayats.length} GPs ({mandalFilter})</option>
                  {availablePanchayats.map((gp, idx) => (
                    <option key={gp.nameEn} value={gp.nameEn}>
                      {idx + 1}. {gp.nameEn} GP ({gp.nameTe})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Habitation / Village Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-forest-700" />
              <select
                value={habitationFilter}
                onChange={(e) => setHabitationFilter(e.target.value)}
                className="bg-transparent text-xs font-semibold text-ink focus:outline-none max-w-[170px] truncate"
              >
                <option value="ALL">
                  {availableVillages.length > 0 
                    ? `All ${availableVillages.length} Villages` 
                    : language === 'te' ? 'అన్ని ఆవాసాలు' : 'All Villages'}
                </option>
                {availableVillages.length > 0 ? (
                  availableVillages.map((v) => (
                    <option key={v.nameEn} value={v.nameEn}>
                      {v.nameEn} ({v.nameTe})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Kothapalli">Kothapalli (కొత్తపల్లి)</option>
                    <option value="Nurmathi">Nurmathi (నూర్మతి)</option>
                    <option value="Solabham">Solabham (సొలభం)</option>
                    <option value="Minumuluru">Minumuluru (మినుములూరు)</option>
                    <option value="Padmapuram">Padmapuram (పద్మాపురం)</option>
                    <option value="Bandapalli">Bandapalli (బండపల్లి)</option>
                  </>
                )}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-forest-700" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-semibold text-ink focus:outline-none"
              >
                <option value="ALL">{language === 'te' ? 'అన్ని కేటగిరీలు' : 'All Statuses'}</option>
                <option value="SUSPICIOUS">{language === 'te' ? 'అనుమానాస్పద' : 'Suspicious Lesion'}</option>
                <option value="NORMAL">{language === 'te' ? 'సాధారణం' : 'Normal Mucosa'}</option>
                <option value="UNDER_REVIEW">{language === 'te' ? 'పరిశీలనలో' : 'Under MO Review'}</option>
                <option value="PENDING">{language === 'te' ? 'పెండింగ్' : 'Screening Due'}</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Patient List Cards */}
      <div className="space-y-3">
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-ink-muted">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-ink">No villagers match your search or filters.</p>
            <p className="text-xs text-ink-muted mt-1">Try resetting the filter criteria or register a new patient.</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <Card key={patient.id} variant="default" padding="md" className="hover:border-forest-400 transition-colors">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Patient Primary Details */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center font-bold font-mono text-sm shrink-0 shadow-sm">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-ink text-base">
                        {language === 'te' ? patient.nameTe : patient.name}
                      </h3>
                      <span className="text-xs font-medium text-ink-muted">
                        ({patient.age}y • {patient.gender === 'male' ? 'M' : 'F'})
                      </span>
                      {getStatusBadge(patient.screeningStatus)}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-ink-muted mt-1 flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-forest-700" />
                        {patient.habitation}, {patient.gramPanchayat} GP, {patient.mandal}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-forest-900 font-semibold bg-forest-50 px-2 py-0.5 rounded border border-forest-100">
                        {patient.cardSerial}
                      </span>
                      <span>•</span>
                      <span className="text-slate-600">
                        {language === 'te' ? patient.habitTe : patient.habit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & Quick Actions */}
                <div className="flex items-center gap-2 self-end lg:self-center flex-wrap">
                  <Link to="/patient/card-preview">
                    <Button variant="outline" size="sm" icon={CreditCard}>
                      {language === 'te' ? 'కార్డ్' : 'Health Card'}
                    </Button>
                  </Link>

                  <Link to="/health-worker/screening/new">
                    <Button variant="primary" size="sm" icon={Camera}>
                      {language === 'te' ? 'స్క్రీనింగ్' : 'Screening'}
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    icon={ArrowRight}
                    onClick={() => navigate('/patient/journey')}
                  >
                    {language === 'te' ? 'వివరాలు' : 'Timeline'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
