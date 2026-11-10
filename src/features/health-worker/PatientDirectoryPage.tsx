import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  Filter,
  RefreshCw
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useTranslation } from '../../i18n';
import { useAuth, useSync } from '../../context';
import { careApi, type CareRecord } from '../../services/careApi';
import { ASR_DIVISIONS, getMandalsByDivision } from '../../data/asrMandals';

export const PatientDirectoryPage: React.FC = () => {
  const { language } = useTranslation();
  const { currentUser } = useAuth();
  const { drafts } = useSync();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [cases, setCases] = useState<CareRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [mandalFilter, setMandalFilter] = useState('ALL');
  const [villageFilter, setVillageFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('filter') === 'pending' ? 'REGISTERED' : 'ALL');
  
  // Patient details modal
  const [selectedCase, setSelectedCase] = useState<CareRecord | null>(null);
  // Digital card modal
  const [cardCase, setCardCase] = useState<CareRecord | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const loadPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await careApi<CareRecord[]>('/cases');
      setCases(records || []);
    } catch (err: any) {
      console.warn('Failed to load patient cases:', err);
      setError(err?.message || 'Failed to fetch patients from clinical server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPatients();
  }, []);

  // Merge server cases with any pending offline enrollment drafts so they appear immediately
  const combinedList = [
    ...cases,
    ...drafts
      .filter((d) => d.type === 'Citizen Enrollment' && d.payload)
      .map((d) => {
        const p = d.payload as any;
        return {
          id: d.id,
          version: 1,
          name: p.name || d.patientName || 'Offline Citizen',
          age: Number(p.age) || 35,
          sex: p.sex || 'Male',
          village: p.village || d.habitation || 'Kothapalli',
          mandal: p.mandal || 'G. Madugula',
          history: p.history || 'Pending offline synchronization',
          symptoms: p.symptoms || 'None recorded',
          status: 'OFFLINE_DRAFT',
          createdAt: new Date().toISOString(),
          patientId: `DRAFT-${d.id.slice(0, 8)}`,
          images: [],
          events: [
            {
              id: d.id,
              action: 'OFFLINE_SAVED',
              actor: currentUser?.fullName || 'ASHA Worker',
              at: new Date().toISOString(),
              data: { note: 'Record stored securely in local device database' },
            },
          ],
        } as CareRecord;
      }),
  ];

  // Derived options
  const uniqueVillages = Array.from(new Set(combinedList.map((c) => c.village).filter(Boolean)));

  // Filtered
  const filteredPatients = combinedList.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      p.name?.toLowerCase().includes(q) ||
      p.patientId?.toLowerCase().includes(q) ||
      p.village?.toLowerCase().includes(q) ||
      p.mandal?.toLowerCase().includes(q) ||
      p.symptoms?.toLowerCase().includes(q);

    const matchesMandal = mandalFilter === 'ALL' || p.mandal === mandalFilter;
    const matchesVillage = villageFilter === 'ALL' || p.village?.toLowerCase() === villageFilter.toLowerCase();
    
    let matchesStatus = true;
    if (statusFilter === 'REGISTERED') {
      matchesStatus = ['REGISTERED', 'SCREENING_IN_PROGRESS', 'RECAPTURE'].includes(p.status);
    } else if (statusFilter === 'SCREENED') {
      matchesStatus = ['AWAITING_REVIEW', 'REVIEWED', 'SUBMITTED'].includes(p.status);
    } else if (statusFilter === 'REFERRED') {
      matchesStatus = ['REFERRED', 'APPOINTMENT', 'ATTENDED', 'INVESTIGATION', 'REPORT_RECEIVED'].includes(p.status);
    } else if (statusFilter === 'FOLLOW_UP') {
      matchesStatus = p.status === 'FOLLOW_UP_DUE' || p.events?.some((e) => e.action === 'FOLLOW_UP' && !e.data?.completed);
    } else if (statusFilter === 'COMPLETED') {
      matchesStatus = p.status === 'COMPLETED';
    }

    return matchesSearch && matchesMandal && matchesVillage && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / pageSize));
  const paginatedPatients = filteredPatients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Dynamic aggregates
  const totalCount = combinedList.length;
  const screenedCount = combinedList.filter((c) => c.status !== 'REGISTERED' && c.status !== 'OFFLINE_DRAFT').length;
  const referredCount = combinedList.filter((c) => ['REFERRED', 'APPOINTMENT', 'INVESTIGATION', 'REPORT_RECEIVED'].includes(c.status)).length;
  const pendingCount = combinedList.filter((c) => ['REGISTERED', 'SCREENING_IN_PROGRESS', 'RECAPTURE'].includes(c.status)).length;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'OFFLINE_DRAFT':
        return <Badge variant="warning" size="sm" icon={Clock} label={language === 'te' ? 'ఆఫ్‌లైన్ డ్రాఫ్ట్' : 'Offline Draft'} />;
      case 'REGISTERED':
      case 'SCREENING_IN_PROGRESS':
        return <Badge variant="warning" size="sm" icon={Activity} label={language === 'te' ? 'స్క్రీనింగ్ పెండింగ్' : 'Screening Due'} />;
      case 'AWAITING_REVIEW':
        return <Badge variant="info" size="sm" icon={Clock} label={language === 'te' ? 'వైద్యుల పరిశీలనలో' : 'Under MO Review'} />;
      case 'REFERRED':
      case 'APPOINTMENT':
      case 'INVESTIGATION':
      case 'REPORT_RECEIVED':
        return <Badge variant="danger" size="sm" icon={ShieldAlert} label={language === 'te' ? 'ఆసుపత్రి రిఫరల్' : 'Referred to Hospital'} />;
      case 'COMPLETED':
      case 'REVIEWED':
        return <Badge variant="success" size="sm" icon={CheckCircle2} label={language === 'te' ? 'పూర్తయింది' : 'Reviewed & Safe'} />;
      default:
        return <Badge variant="default" size="sm" label={status} />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
              Frontline Directory
            </span>
            <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
              {currentUser?.facilityName || currentUser?.assignedHealthCentre || 'G. Madugula Sub-Centre'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            {language === 'te' ? 'గ్రామ రోగుల రిజిస్టర్' : 'Village Patient Directory'}
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            {language === 'te'
              ? 'కేటాయించిన ఆవాసాల రోగుల జాబితా, డిజిటల్ హెల్త్ కార్డ్‌లు మరియు స్క్రీనింగ్ చరిత్ర.'
              : 'Assigned tribal habitation roster, digital health credentials, and oral care status.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadPatients} disabled={loading}>
            {loading ? (language === 'te' ? 'నవీకరిస్తోంది...' : 'Refreshing...') : (language === 'te' ? 'రిఫ్రెష్' : 'Refresh')}
          </Button>
          <Link to="/health-worker/register">
            <Button variant="primary" size="md" icon={Plus}>
              {language === 'te' ? 'కొత్త రోగి నమోదు' : 'Register New Patient'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Aggregate Real Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Registered"
          labelTe="మొత్తం నమోదైన రోగులు"
          value={loading ? '...' : String(totalCount)}
          subtext={language === 'te' ? 'కేటాయించిన ఆవాసాలలో' : 'Across assigned villages'}
          variant="forest"
          icon={Users}
        />
        <StatCard
          label="Screenings Completed"
          labelTe="పూర్తయిన స్క్రీనింగ్‌లు"
          value={loading ? '...' : String(screenedCount)}
          subtext={totalCount > 0 ? `${Math.round((screenedCount / totalCount) * 100)}% coverage` : '0%'}
          variant="emerald"
          icon={Activity}
        />
        <StatCard
          label="Hospital Referrals"
          labelTe="ఆసుపత్రి రిఫరల్స్"
          value={loading ? '...' : String(referredCount)}
          subtext={language === 'te' ? 'పాడేరు జిల్లా ఆసుపత్రికి' : 'DH Paderu Oncology OPD'}
          variant="amber"
          icon={ShieldAlert}
        />
        <StatCard
          label="Screenings Due"
          labelTe="పెండింగ్ స్క్రీనింగ్‌లు"
          value={loading ? '...' : String(pendingCount)}
          subtext={language === 'te' ? 'ఇంటింటి పరీక్ష అవసరం' : 'Doorstep visits required'}
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
              placeholder={language === 'te' ? 'పేరు, రోగి సంఖ్య లేదా గ్రామం ద్వారా వెతకండి...' : 'Search by patient name, ID, village, or symptoms...'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 bg-white"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Mandal Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-forest-700" />
              <select
                value={mandalFilter}
                onChange={(e) => {
                  setMandalFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-semibold text-ink focus:outline-none max-w-[150px] truncate"
              >
                <option value="ALL">{language === 'te' ? 'అన్ని మండలాలు' : 'All Mandals'}</option>
                {ASR_DIVISIONS.flatMap((d) => getMandalsByDivision(d.id)).map((m) => (
                  <option key={m.id} value={m.nameEn}>
                    {m.nameEn} ({m.nameTe})
                  </option>
                ))}
              </select>
            </div>

            {/* Village Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-forest-800">Vil:</span>
              <select
                value={villageFilter}
                onChange={(e) => {
                  setVillageFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-semibold text-ink focus:outline-none max-w-[150px] truncate"
              >
                <option value="ALL">{language === 'te' ? 'అన్ని గ్రామాలు' : 'All Villages'}</option>
                {uniqueVillages.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-forest-700" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-semibold text-ink focus:outline-none"
              >
                <option value="ALL">{language === 'te' ? 'అన్ని కేటగిరీలు' : 'All Statuses'}</option>
                <option value="REGISTERED">{language === 'te' ? 'స్క్రీనింగ్ పెండింగ్' : 'Screening Due'}</option>
                <option value="SCREENED">{language === 'te' ? 'పరిశీలనలో' : 'Under Review'}</option>
                <option value="REFERRED">{language === 'te' ? 'ఆసుపత్రి రిఫరల్' : 'Referred to Hospital'}</option>
                <option value="FOLLOW_UP">{language === 'te' ? 'పర్యవేక్షణ' : 'Follow-up Due'}</option>
                <option value="COMPLETED">{language === 'te' ? 'పూర్తయింది' : 'Completed'}</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-red-900 text-sm">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={loadPatients}>
            {language === 'te' ? 'మళ్ళీ ప్రయత్నించండి' : 'Retry'}
          </Button>
        </div>
      )}

      {/* Patient List Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <RefreshCw className="w-8 h-8 text-forest-700 animate-spin mx-auto mb-3" />
            <p className="font-semibold text-ink">
              {language === 'te' ? 'రోగుల వివరాలు లోడ్ అవుతున్నాయి...' : 'Loading patient records from server...'}
            </p>
          </div>
        ) : paginatedPatients.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-ink-muted">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-ink">
              {language === 'te' ? 'శోధన ప్రమాణాలకు సరిపోలే రోగులు ఎవరూ లేరు.' : 'No patients match your search or filter.'}
            </p>
            <p className="text-xs text-ink-muted mt-1">
              {language === 'te' ? 'ఫిల్టర్‌లను రీసెట్ చేయండి లేదా కొత్త రోగిని నమోదు చేయండి.' : 'Try adjusting the filters above or register a new patient.'}
            </p>
            <div className="mt-4">
              <Link to="/health-worker/register">
                <Button variant="primary" size="sm" icon={Plus}>
                  {language === 'te' ? 'రోగిని నమోదు చేయండి' : 'Register New Patient'}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          paginatedPatients.map((patient) => (
            <Card key={patient.id} variant="default" padding="md" className="hover:border-forest-400 transition-colors">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Primary Details */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center font-bold font-mono text-sm shrink-0 shadow-sm">
                    {patient.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-ink text-base hover:text-forest-800 cursor-pointer" onClick={() => setSelectedCase(patient)}>
                        {patient.name}
                      </h3>
                      <span className="text-xs font-medium text-ink-muted">
                        ({patient.age}y • {patient.sex || 'Unknown'})
                      </span>
                      {renderStatusBadge(patient.status)}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-ink-muted mt-1 flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-forest-700" />
                        {patient.village}, {patient.mandal} Mandal
                      </span>
                      <span>•</span>
                      <span className="font-mono text-forest-900 font-semibold bg-forest-50 px-2 py-0.5 rounded border border-forest-100">
                        {patient.patientId || patient.id.slice(0, 16)}
                      </span>
                      {patient.history && (
                        <>
                          <span>•</span>
                          <span className="text-slate-600 line-clamp-1 max-w-xs">
                            {patient.history}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end lg:self-center flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={CreditCard}
                    onClick={() => setCardCase(patient)}
                  >
                    {language === 'te' ? 'కార్డ్' : 'Health Card'}
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={Camera}
                    onClick={() => navigate('/health-worker/screening/new', { state: { patient } })}
                  >
                    {language === 'te' ? 'స్క్రీనింగ్' : 'Screening'}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    icon={ArrowRight}
                    onClick={() => setSelectedCase(patient)}
                  >
                    {language === 'te' ? 'పూర్తి చరిత్ర' : 'Details & History'}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-forest-100 text-sm">
          <span className="text-xs text-ink-muted">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredPatients.length)} of {filteredPatients.length} patients
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-xs font-mono font-bold px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Patient Details & Clinical History Modal */}
      {selectedCase && (
        <Modal
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          title={selectedCase.name}
          titleTe={selectedCase.name}
          size="lg"
        >
          <div className="space-y-6">
            {/* Header summary */}
            <div className="p-4 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="font-mono text-xs font-bold text-forest-900 bg-white px-2 py-0.5 rounded border border-forest-200">
                  {selectedCase.patientId || selectedCase.id}
                </span>
                <div className="text-xs text-ink-muted mt-1">
                  {selectedCase.age} years • {selectedCase.sex} • Habitation: <strong>{selectedCase.village}</strong>, {selectedCase.mandal} Mandal
                </div>
              </div>
              <div>{renderStatusBadge(selectedCase.status)}</div>
            </div>

            {/* Medical / Habit History & Symptoms */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="text-xs font-bold text-forest-900 uppercase tracking-wider block">
                  Habit & Medical Background
                </span>
                <p className="text-xs text-slate-700">
                  {selectedCase.history || 'No chronic tobacco/alcohol habits recorded.'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                <span className="text-xs font-bold text-forest-900 uppercase tracking-wider block">
                  Chief Complaints / Symptoms
                </span>
                <p className="text-xs text-slate-700">
                  {selectedCase.symptoms || 'Routine preventive screening check.'}
                </p>
              </div>
            </div>

            {/* Clinical Care Timeline & History */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-ink flex items-center gap-2">
                <Clock className="w-4 h-4 text-forest-800" />
                {language === 'te' ? 'కేర్ ప్రయాణం మరియు చరిత్ర' : 'Clinical Care Journey & History'}
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedCase.events && selectedCase.events.length > 0 ? (
                  selectedCase.events.map((evt, idx) => (
                    <div key={evt.id || idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-forest-900 uppercase font-mono text-[11px]">
                            {evt.action}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            by {evt.actor}
                          </span>
                        </div>
                        {evt.data && Object.keys(evt.data).length > 0 && (
                          <p className="text-slate-600 mt-1">
                            {typeof evt.data.reason === 'string'
                              ? evt.data.reason
                              : typeof evt.data.notes === 'string'
                              ? evt.data.notes
                              : typeof evt.data.rationale === 'string'
                              ? evt.data.rationale
                              : JSON.stringify(evt.data)}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] text-ink-muted whitespace-nowrap">
                        {evt.at ? new Date(evt.at).toLocaleDateString() : 'Recorded'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-ink-muted italic">No prior clinical events recorded.</p>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                icon={CreditCard}
                onClick={() => {
                  setCardCase(selectedCase);
                  setSelectedCase(null);
                }}
              >
                {language === 'te' ? 'డిజిటల్ హెల్త్ కార్డ్' : 'View Health Card'}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Camera}
                  onClick={() => {
                    navigate('/health-worker/screening/new', { state: { patient: selectedCase } });
                  }}
                >
                  {language === 'te' ? 'ఓరల్ స్క్రీనింగ్ నిర్వహించండి' : 'Proceed to Screening'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCase(null)}>
                  {language === 'te' ? 'మూసివేయి' : 'Close'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Digital Patient Health Card Preview Modal */}
      {cardCase && (
        <Modal
          isOpen={!!cardCase}
          onClose={() => setCardCase(null)}
          title="Digital Patient Health Card"
          titleTe="డిజిటల్ పేషెంట్ హెల్త్ కార్డ్"
          size="md"
        >
          <div className="space-y-5">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 text-white shadow-xl relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-forest-200 block">
                    AAROGYA DRISHTI • ITDA PADERU
                  </span>
                  <h3 className="text-xl font-extrabold mt-1">{cardCase.name}</h3>
                  <p className="text-xs text-forest-200">
                    {cardCase.age}y • {cardCase.sex} • {cardCase.village}, {cardCase.mandal}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-mono font-bold text-xs">
                  QR
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/20 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-forest-300 block uppercase font-mono">Unique Patient ID</span>
                  <span className="font-mono font-bold tracking-wider text-sm">
                    {cardCase.patientId || cardCase.id}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-forest-300 block uppercase font-mono">Status</span>
                  <span className="font-bold text-xs uppercase bg-white/20 px-2 py-0.5 rounded">
                    {cardCase.status}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-ink-muted text-center">
              {language === 'te' 
                ? 'ఈ డిజిటల్ కార్డును భద్రపరచండి. ఆసుపత్రి మరియు టెలిమెడిసిన్ కన్సల్టేషన్‌లలో ఈ ఐడీని ఉపయోగించండి.'
                : 'Digital health credential for rural community access. Show this card at the Sub-Centre or District Hospital.'}
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                {language === 'te' ? 'కార్డ్ ముద్రించండి' : 'Print Physical Card'}
              </Button>
              <Button variant="primary" size="sm" onClick={() => setCardCase(null)}>
                {language === 'te' ? 'పూర్తయింది' : 'Done'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
