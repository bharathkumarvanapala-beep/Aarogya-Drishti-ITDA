import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Calendar, 
  Ambulance, 
  Phone, 
  ArrowRight,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../context';
import { careApi, type CareRecord } from '../../services/careApi';
import { Link } from 'react-router-dom';

export const ReferralTrackingPage: React.FC = () => {
  const { language } = useTranslation();
  const { currentUser } = useAuth();

  const [cases, setCases] = useState<CareRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'attended'>('all');

  // Transport note update modal
  const [updatingCase, setUpdatingCase] = useState<CareRecord | null>(null);
  const [transportNote, setTransportNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadReferrals = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await careApi<CareRecord[]>('/cases');
      setCases(records || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch referral records from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReferrals();
  }, []);

  // Filter cases with actual referral activity
  const referralCases = cases.filter((c) =>
    ['REFERRED', 'APPOINTMENT', 'ATTENDED', 'INVESTIGATION', 'REPORT_RECEIVED', 'DIAGNOSIS'].includes(c.status) ||
    c.events?.some((e) => ['APPOINTMENT', 'INVESTIGATION', 'REPORT'].includes(e.action))
  );

  const filteredReferrals = referralCases.filter((c) => {
    if (filter === 'active') return ['REFERRED', 'APPOINTMENT'].includes(c.status);
    if (filter === 'attended') return ['ATTENDED', 'INVESTIGATION', 'REPORT_RECEIVED', 'COMPLETED'].includes(c.status);
    return true;
  });

  const handleSaveTransportNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingCase) return;
    setSavingNote(true);
    try {
      await careApi(`/cases/${updatingCase.id}/actions`, {
        action: 'FOLLOW_UP',
        version: updatingCase.version,
        notes: `Transport & Referral Navigation: ${transportNote}`,
        completed: false,
      });
      setSuccessMsg(language === 'te' ? 'రవాణా సమన్వయ గమనిక సేవ్ చేయబడింది.' : 'Transport coordination note saved.');
      await loadReferrals();
      setUpdatingCase(null);
      setTransportNote('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to update transport note.');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
              Care Coordination
            </span>
            <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
              {currentUser?.facilityName || 'G. Madugula Sub-Centre'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            {language === 'te' ? 'ఆసుపత్రి రిఫరల్స్ ట్రాకింగ్' : 'Outbound Specialist Referral Tracking'}
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            {language === 'te'
              ? 'గ్రామాల నుండి ప్రాథమిక ఆరోగ్య కేంద్రాలు మరియు పాడేరు జిల్లా ఆసుపత్రికి సిఫార్సు చేయబడిన రోగుల పర్యవేక్షణ.'
              : 'Track patients referred from your tribal habitations to Primary Health Centres and District Hospital Paderu.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadReferrals} disabled={loading}>
            {loading ? (language === 'te' ? 'నవీకరిస్తోంది...' : 'Refreshing...') : (language === 'te' ? 'రిఫ్రెష్' : 'Refresh')}
          </Button>
          <div className="flex items-center gap-1 bg-forest-100 p-1 rounded-xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-forest-900 text-white shadow-sm' : 'text-forest-900 hover:bg-forest-200'}`}
            >
              All ({referralCases.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filter === 'active' ? 'bg-forest-900 text-white shadow-sm' : 'text-forest-900 hover:bg-forest-200'}`}
            >
              Active ({referralCases.filter(c => ['REFERRED', 'APPOINTMENT'].includes(c.status)).length})
            </button>
            <button
              onClick={() => setFilter('attended')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filter === 'attended' ? 'bg-forest-900 text-white shadow-sm' : 'text-forest-900 hover:bg-forest-200'}`}
            >
              Attended ({referralCases.filter(c => ['ATTENDED', 'INVESTIGATION', 'REPORT_RECEIVED', 'COMPLETED'].includes(c.status)).length})
            </button>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={loadReferrals}>Retry</Button>
        </div>
      )}

      {/* Referral Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <RefreshCw className="w-8 h-8 text-forest-700 animate-spin mx-auto mb-3" />
            <p className="font-semibold text-ink">
              {language === 'te' ? 'రిఫరల్ రికార్డులు లోడ్ అవుతున్నాయి...' : 'Loading active referrals from server...'}
            </p>
          </div>
        ) : filteredReferrals.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-ink-muted">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-ink">
              {language === 'te' ? 'ప్రస్తుతం యాక్టివ్ రిఫరల్స్ ఏవీ లేవు.' : 'No active hospital referrals match the filter.'}
            </p>
            <p className="text-xs text-ink-muted mt-1">
              {language === 'te' 
                ? 'వైద్య అధికారి సమీక్ష తర్వాత రిఫర్ చేయబడిన రోగులు ఇక్కడ కనిపిస్తారు.' 
                : 'Patients referred by the Medical Officer for specialist tertiary care will automatically appear here.'}
            </p>
            <div className="mt-4">
              <Link to="/health-worker/patients">
                <Button variant="outline" size="sm">
                  {language === 'te' ? 'రోగుల రిజిస్టర్ చూడండి' : 'Check Patient Roster'}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          filteredReferrals.map((referral) => {
            const referralEvent = referral.events?.find((e) => ['APPOINTMENT', 'SUBMIT', 'REVIEW'].includes(e.action));
            const referredFacility = (referralEvent?.data as any)?.hospital || (referralEvent?.data as any)?.facility || 'District Hospital Paderu (Specialist Oral Oncology OPD)';
            const reason = referral.symptoms || (referralEvent?.data as any)?.reason || 'Clinical lesion evaluation and specialist investigation';

            return (
              <Card key={referral.id} variant="default" padding="lg" className="border-forest-100 hover:border-forest-300 transition-colors">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded">
                        {referral.patientId || referral.id.slice(0, 16)}
                      </span>
                      <StatusBadge status={referral.status as any} />
                      <span className="text-xs text-ink-muted">
                        Enrolled {new Date(referral.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-ink">
                        {referral.name} ({referral.age}y • {referral.sex}) — <span className="text-forest-800">{referral.village}</span>
                      </h3>
                      <p className="text-xs text-ink font-medium mt-0.5">
                        {reason}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-muted pt-1">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-forest-800 shrink-0" />
                        <span>Referred To: <strong className="text-ink">{referredFacility}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-forest-800 shrink-0" />
                        <span>Status: <strong className="text-forest-900">{referral.status}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Ambulance className="w-3.5 h-3.5 text-forest-800 shrink-0" />
                        <span>
                          Transport: <strong className="text-emerald-700">108 / Feeder Ambulance Support Available</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-forest-800 shrink-0" />
                        <span>Helpdesk: ITDA Paderu Health Cell (08935-250000)</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Ambulance}
                      onClick={() => setUpdatingCase(referral)}
                    >
                      {language === 'te' ? 'రవాణా గమనిక' : 'Log Transport Note'}
                    </Button>
                    <Link to="/patient/journey">
                      <Button variant="primary" size="sm" icon={ArrowRight}>
                        {language === 'te' ? 'ప్రయాణం చూడండి' : 'View Journey'}
                      </Button>
                    </Link>
                  </div>

                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Log Transport Note Modal */}
      {updatingCase && (
        <Modal
          isOpen={!!updatingCase}
          onClose={() => setUpdatingCase(null)}
          title={`Transport & Navigation: ${updatingCase.name}`}
          titleTe={`రవాణా మరియు సమన్వయం: ${updatingCase.name}`}
          size="md"
        >
          <form onSubmit={handleSaveTransportNote} className="space-y-4">
            <p className="text-xs text-ink-muted">
              {language === 'te'
                ? 'రోగి ఆసుపత్రికి చేరుకోవడానికి రవాణా వాహనం (108/104/గిరిజన వాహనం) మరియు సహాయకుడి వివరాలను నమోదు చేయండి.'
                : 'Document patient travel assistance, ambulance coordination, or family navigation support.'}
            </p>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Coordination Notes / రవాణా వివరాలు *
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. 108 tribal feeder vehicle scheduled from Kothapalli for 04 Nov appointment. Accompanied by son."
                value={transportNote}
                onChange={(e) => setTransportNote(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setUpdatingCase(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" disabled={savingNote}>
                {savingNote ? 'Saving...' : 'Save Transport Record'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
