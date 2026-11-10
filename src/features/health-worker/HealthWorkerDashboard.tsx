import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus,
  Camera, 
  RotateCw, 
  MapPin, 
  ArrowRight,
  Wifi,
  Send,
  AlertCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip
} from 'recharts';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth, useSync } from '../../context';
import { useTranslation } from '../../i18n';
import { careApi, type CareRecord } from '../../services/careApi';

export const HealthWorkerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { language } = useTranslation();
  const { pendingCount } = useSync();
  const navigate = useNavigate();

  const [cases, setCases] = useState<CareRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await careApi<CareRecord[]>('/cases');
      setCases(records || []);
    } catch (err: any) {
      console.warn('Failed to load cases from server:', err);
      setError(err?.message || 'Unable to connect to healthcare server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCases();
  }, []);

  // Compute real counts from actual patient records
  const totalAssigned = cases.length;
  const pendingScreenings = cases.filter((c) =>
    ['REGISTERED', 'SCREENING_IN_PROGRESS', 'RECAPTURE'].includes(c.status)
  ).length;
  const activeReferrals = cases.filter((c) =>
    ['REFERRED', 'APPOINTMENT', 'ATTENDED', 'INVESTIGATION', 'REPORT_RECEIVED'].includes(c.status)
  ).length;
  const dueFollowUps = cases.filter((c) =>
    c.status === 'FOLLOW_UP_DUE' ||
    c.events?.some((e) => e.action === 'FOLLOW_UP' && !e.data?.completed)
  ).length;
  const unsyncedRecords = pendingCount;

  // Real habitations summary based on authenticated worker's jurisdiction & cases
  const assignedVillages = currentUser?.assignedVillages && currentUser.assignedVillages.length > 0
    ? currentUser.assignedVillages
    : [currentUser?.village || 'Kothapalli'];

  const habitationsBreakdown = assignedVillages.map((vilName) => {
    const vilCases = cases.filter(
      (c) => c.village?.toLowerCase().trim() === vilName.toLowerCase().trim()
    );
    const screened = vilCases.filter((c) => c.status !== 'REGISTERED').length;
    const highRisk = vilCases.filter((c) =>
      ['REFERRED', 'INVESTIGATION', 'REPORT_RECEIVED'].includes(c.status)
    ).length;
    const coverage = vilCases.length > 0 ? Math.round((screened / vilCases.length) * 100) : 0;
    return {
      name: vilName,
      casesCount: vilCases.length,
      screened,
      coverage,
      highRisk,
      status: coverage >= 75 ? 'ACTIVE' : coverage > 0 ? 'IN_PROGRESS' : 'PENDING',
    };
  });

  // Actionable immediate tasks from actual records
  const immediateTasks = cases
    .filter((c) => ['REFERRED', 'RECAPTURE', 'FOLLOW_UP_DUE'].includes(c.status) || c.status === 'REGISTERED')
    .slice(0, 4);

  // Weekly output computation based on actual events in the last 7 days
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  const weeklyData = [6, 5, 4, 3, 2, 1, 0].map((daysAgo) => {
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const dayStr = daysOfWeek[d.getDay()];
    const datePrefix = d.toISOString().slice(0, 10);
    
    let screenings = 0;
    let followUps = 0;
    cases.forEach((c) => {
      c.events?.forEach((e) => {
        if (e.at && e.at.startsWith(datePrefix)) {
          if (['IMAGE', 'SUBMIT', 'AI_DEMO'].includes(e.action)) screenings++;
          if (e.action === 'FOLLOW_UP') followUps++;
        }
      });
    });
    return { day: dayStr, screenings, followUps };
  });

  const workerName = currentUser
    ? (language === 'te' && currentUser.nameTe ? currentUser.nameTe : (currentUser.fullName || currentUser.name))
    : (language === 'te' ? 'ఆరోగ్య కార్యకర్త' : 'Health Worker');
  const workerRole = currentUser
    ? (language === 'te' && currentUser.roleTitleTe ? currentUser.roleTitleTe : (currentUser.roleTitle || 'Frontline Health Worker'))
    : 'Frontline Health Worker (ASHA)';
  const facility = currentUser?.facilityName || currentUser?.assignedHealthCentre || 'Sub Centre Kothapalli';
  const mandal = currentUser?.mandal || 'Paderu';

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <Card variant="nature" padding="lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
                {workerRole}
              </span>
              <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
                {facility}
              </span>
              <span className="text-xs text-forest-700 bg-white/80 border border-forest-200 px-2 py-0.5 rounded-full font-medium">
                {mandal} Mandal • ITDA Paderu
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
              {language === 'te' ? `స్వాగతం, ${workerName}` : `Welcome back, ${workerName}`}
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              {language === 'te' ? 'కేటాయించిన ఆవాసాలు:' : 'Assigned habitations:'}{' '}
              <strong className="text-forest-900 font-semibold">{assignedVillages.join(', ')}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={fetchCases}
              disabled={loading}
            >
              {loading ? (language === 'te' ? 'నవీకరిస్తోంది...' : 'Refreshing...') : (language === 'te' ? 'రిఫ్రెష్' : 'Refresh')}
            </Button>
            <Link to="/health-worker/patients">
              <Button variant="outline" size="md" icon={Users}>
                {language === 'te' ? 'రోగుల రిజిస్టర్' : 'Patient Directory'}
              </Button>
            </Link>
            <Link to="/health-worker/register">
              <Button variant="primary" size="md" icon={UserPlus}>
                {language === 'te' ? 'కొత్త రోగి నమోదు' : 'Register Patient'}
              </Button>
            </Link>
            <Link to="/health-worker/screening/new">
              <Button variant="secondary" size="md" icon={Camera}>
                {language === 'te' ? 'ఓరల్ స్క్రీనింగ్' : 'Screening'}
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Error state with retry */}
      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4 text-amber-900">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-700" />
            <p className="text-sm">
              {language === 'te' ? 'సర్వర్ కనెక్షన్ సమస్య. ఆఫ్‌లైన్ రికార్డులు సురక్షితంగా ఉన్నాయి.' : error}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchCases}>
            {language === 'te' ? 'మళ్ళీ ప్రయత్నించండి' : 'Retry'}
          </Button>
        </div>
      )}

      {/* Primary Field Stats - Real Live Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div 
          onClick={() => navigate('/health-worker/patients')} 
          className="cursor-pointer transition-transform hover:-translate-y-0.5"
          title="View all assigned patients"
        >
          <StatCard
            label="Assigned Patients"
            labelTe="కేటాయించిన రోగులు"
            value={loading ? '...' : String(totalAssigned)}
            icon={Users}
            subtext={language === 'te' ? 'మొత్తం నమోదైన వారు' : `${totalAssigned} registered citizens`}
            variant="forest"
          />
        </div>

        <div 
          onClick={() => navigate('/health-worker/patients?filter=pending')} 
          className="cursor-pointer transition-transform hover:-translate-y-0.5"
          title="View pending screenings"
        >
          <StatCard
            label="Pending Screening"
            labelTe="స్క్రీనింగ్ పెండింగ్"
            value={loading ? '...' : String(pendingScreenings)}
            icon={Camera}
            subtext={language === 'te' ? 'పరిశీలించాల్సిన వారు' : 'Doorstep check required'}
            variant="default"
          />
        </div>

        <div 
          onClick={() => navigate('/health-worker/referrals')} 
          className="cursor-pointer transition-transform hover:-translate-y-0.5"
          title="Track hospital referrals"
        >
          <StatCard
            label="Active Referrals"
            labelTe="ఆసుపత్రి రిఫరల్స్"
            value={loading ? '...' : String(activeReferrals)}
            icon={Send}
            subtext={language === 'te' ? 'పాడేరు జిల్లా ఆసుపత్రికి' : 'DH Paderu & CHC'}
            variant="emerald"
          />
        </div>

        <div 
          onClick={() => navigate('/health-worker/follow-ups')} 
          className="cursor-pointer transition-transform hover:-translate-y-0.5"
          title="View due follow-up visits"
        >
          <StatCard
            label="Due Follow-ups"
            labelTe="తక్షణ పర్యవేక్షణ"
            value={loading ? '...' : String(dueFollowUps)}
            icon={RotateCw}
            subtext={language === 'te' ? 'ఇంటింటి సందర్శనలు' : 'Routine & post-referral'}
            variant="amber"
          />
        </div>

        <div 
          onClick={() => navigate('/health-worker/sync')} 
          className="cursor-pointer transition-transform hover:-translate-y-0.5"
          title="Open Offline Synchronization Hub"
        >
          <StatCard
            label="Unsynced Records"
            labelTe="ఆఫ్‌లైన్ డ్రాఫ్ట్‌లు"
            value={String(unsyncedRecords)}
            icon={Wifi}
            subtext={unsyncedRecords > 0 ? (language === 'te' ? 'సింక్ కావాల్సినవి' : 'Ready to sync') : (language === 'te' ? 'అన్నీ సింక్ అయ్యాయి' : 'Fully synced')}
            variant={unsyncedRecords > 0 ? 'amber' : 'default'}
          />
        </div>
      </div>

      {/* Grid: Habitations Activity + Weekly Output */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Village Habitations Activity Map Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card 
            title="Assigned Habitations Coverage" 
            titleTe="కేటాయించిన గిరిజన గ్రామాల కవరేజ్ స్థితి"
            subtitle="Real-time screening progress across your primary cluster"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {habitationsBreakdown.map((hab) => (
                  <div 
                    key={hab.name}
                    className="p-4 rounded-2xl border border-forest-100 bg-white hover:border-forest-300 transition-all shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-ink text-base">
                          {hab.name}
                        </h4>
                        <span className="text-xs font-mono text-forest-800 font-semibold block">
                          {hab.casesCount} {language === 'te' ? 'రోగులు' : 'enrolled'}
                        </span>
                      </div>
                      <StatusBadge status={hab.coverage > 0 ? 'COMPLETED' : 'PENDING'} />
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-ink-muted">
                        <span>{language === 'te' ? 'స్క్రీనింగ్ శాతం' : 'Screening Coverage'}</span>
                        <span className="font-mono font-bold text-forest-900">{hab.coverage}%</span>
                      </div>
                      <div className="w-full bg-forest-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full ${
                            hab.coverage >= 75 ? 'bg-emerald-600' : hab.coverage > 25 ? 'bg-forest-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.max(hab.coverage, 8)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-forest-100 flex items-center justify-between text-[11px] text-ink-muted font-mono">
                      <span>Screened: <strong>{hab.screened}/{hab.casesCount}</strong></span>
                      {hab.highRisk > 0 ? (
                        <span className="text-red-600 font-bold">{hab.highRisk} High Risk</span>
                      ) : (
                        <span className="text-emerald-700">Stable</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Habitation Visual Geography Representation */}
              <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-100 flex items-center justify-between flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-forest-800" />
                  <span className="font-semibold text-ink">
                    {language === 'te' ? 'స్థానిక సబ్‌సెంటర్ నోడ్:' : 'Primary Health Node:'} {facility}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-ink-muted font-mono">
                  <span>Cluster: <strong>{mandal}</strong></span>
                  <span>District: <strong>Alluri Sitharama Raju</strong></span>
                </div>
              </div>
            </div>
          </Card>

          {/* Immediate Community Tasks from Real Cases */}
          <Card 
            title="Immediate Community Action Queue" 
            titleTe="తక్షణ క్షేత్రస్థాయి విధులు" 
            subtitle="Prioritized doorstep visits and follow-ups based on actual clinical status"
          >
            {immediateTasks.length === 0 ? (
              <div className="p-8 text-center bg-forest-50/50 rounded-2xl border border-dashed border-forest-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-ink">
                  {language === 'te' ? 'అన్ని విధులు పూర్తయ్యాయి' : 'All Action Items Complete'}
                </h4>
                <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
                  {language === 'te' 
                    ? 'ఈ సమయంలో పెండింగ్ రిఫరల్ లేదా రీక్యాప్చర్ విధులు ఏవీ లేవు. కొత్త రోగుల నమోదును కొనసాగించండి.' 
                    : 'No pending urgent referrals or recaptures right now. Use the buttons above to register new patients.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {immediateTasks.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-xl bg-forest-50 border border-forest-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-forest-300 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2 py-0.5 rounded">
                          {item.patientId || item.id.slice(0, 16)}
                        </span>
                        <StatusBadge status={item.status as any} />
                        <span className="text-xs text-ink-muted">
                          {item.village} • {item.age} yrs • {item.sex}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-ink">{item.name}</h4>
                      <p className="text-xs text-ink-muted line-clamp-1">
                        {item.status === 'REFERRED'
                          ? (language === 'te' ? 'జిల్లా ఆసుపత్రి స్పెషలిస్ట్ అపాయింట్‌మెంట్ రిమైండర్ మరియు రవాణా సమన్వయం.' : 'Specialist oncology consultation referral active. Assist patient with transport and appointment navigation.')
                          : item.status === 'RECAPTURE'
                          ? (language === 'te' ? 'చిత్రం స్పష్టంగా లేదు. సరైన వెలుతురులో ఫోటో మళ్ళీ తీయాలి.' : 'Image quality insufficient. Retake 5 oral cavity views with proper focus.')
                          : (language === 'te' ? 'నమోదు పూర్తయింది. మార్గదర్శక ఓరల్ స్క్రీనింగ్ నిర్వహించండి.' : 'Registration complete. Conduct guided oral examination.')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === 'REFERRED' ? (
                        <Link to="/health-worker/referrals">
                          <Button variant="primary" size="sm" icon={Send}>
                            {language === 'te' ? 'రిఫరల్ వివరాలు' : 'View Referral'}
                          </Button>
                        </Link>
                      ) : item.status === 'REGISTERED' || item.status === 'RECAPTURE' ? (
                        <Link to="/health-worker/screening/new" state={{ patient: item }}>
                          <Button variant="primary" size="sm" icon={Camera}>
                            {language === 'te' ? 'స్క్రీనింగ్ ప్రారంభించండి' : 'Start Screening'}
                          </Button>
                        </Link>
                      ) : (
                        <Link to="/health-worker/follow-ups">
                          <Button variant="outline" size="sm" icon={RotateCw}>
                            {language === 'te' ? 'పర్యవేక్షణ' : 'Follow-up'}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Weekly Screenings Chart + Quick Hub Links */}
        <div className="space-y-6">
          <Card 
            title="Weekly Screening Output" 
            titleTe="ఈ వారం స్క్రీనింగ్ గణాంకాలు"
            subtitle="Verified clinical checks recorded this week"
          >
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#075B4D', 
                      color: '#ffffff', 
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '12px' 
                    }} 
                  />
                  <Bar dataKey="screenings" fill="#087653" radius={[4, 4, 0, 0]} name={language === 'te' ? 'స్క్రీనింగ్‌లు' : 'Screenings'} />
                  <Bar dataKey="followUps" fill="#398F72" radius={[4, 4, 0, 0]} name={language === 'te' ? 'పర్యవేక్షణలు' : 'Follow-ups'} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-3 border-t border-forest-100 flex items-center justify-between text-xs text-ink-muted">
              <span>{language === 'te' ? 'ఈ వారం మొత్తం:' : 'Weekly Active Total:'}</span>
              <strong className="text-forest-900 font-bold font-mono">
                {weeklyData.reduce((acc, curr) => acc + curr.screenings + curr.followUps, 0)} {language === 'te' ? 'సేవలు' : 'Actions'}
              </strong>
            </div>
          </Card>

          {/* Frontline Tools Quick Links */}
          <Card title="Frontline Tools" titleTe="ఫీల్డ్ టూల్స్">
            <div className="space-y-2">
              <Link to="/health-worker/register" className="block">
                <div className="p-3 rounded-xl border border-forest-100 hover:border-forest-300 hover:bg-forest-50/50 transition-colors flex items-center justify-between text-xs font-semibold text-ink">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-forest-800" />
                    <span>{language === 'te' ? 'కొత్త పౌరుడి నమోదు (ఫోన్ తప్పనిసరి కాదు)' : 'Register New Citizen (No Phone Required)'}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-forest-800" />
                </div>
              </Link>

              <Link to="/health-worker/screening/new" className="block">
                <div className="p-3 rounded-xl border border-forest-100 hover:border-forest-300 hover:bg-forest-50/50 transition-colors flex items-center justify-between text-xs font-semibold text-ink">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-forest-800" />
                    <span>{language === 'te' ? 'గైడెడ్ ఓరల్ స్క్రీనింగ్ నిర్వహించండి' : 'Start Guided Oral Screening'}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-forest-800" />
                </div>
              </Link>

              <Link to="/health-worker/sync" className="block">
                <div className="p-3 rounded-xl border border-forest-100 hover:border-forest-300 hover:bg-forest-50/50 transition-colors flex items-center justify-between text-xs font-semibold text-ink">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-forest-800" />
                    <span>
                      {language === 'te' ? 'ఆఫ్‌లైన్ సింక్ హబ్' : 'Check Offline Sync Hub'}{' '}
                      ({unsyncedRecords} {language === 'te' ? 'పెండింగ్' : 'Pending'})
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-forest-800" />
                </div>
              </Link>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};
