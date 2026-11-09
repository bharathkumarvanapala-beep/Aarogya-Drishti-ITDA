import React from 'react';
import { 
  Users, 
  UserPlus,
  Camera, 
  RotateCw, 
  MapPin, 
  ArrowRight,
  Wifi,
  Send
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
import { useAuth } from '../../context';
import { useTranslation } from '../../i18n';
import { Link } from 'react-router-dom';

const WEEKLY_SCREENING_DATA = [
  { day: 'Mon', screenings: 6, followUps: 2 },
  { day: 'Tue', screenings: 9, followUps: 3 },
  { day: 'Wed', screenings: 14, followUps: 5 },
  { day: 'Thu', screenings: 8, followUps: 1 },
  { day: 'Fri', screenings: 12, followUps: 4 },
  { day: 'Sat', screenings: 5, followUps: 2 },
  { day: 'Sun', screenings: 2, followUps: 0 },
];

const HABITATIONS_DATA = [
  {
    name: 'Kothapalli',
    nameTe: 'కొత్తపల్లి',
    population: 110,
    screened: 94,
    coverage: 85.5,
    status: 'ACTIVE' as const,
    lastVisited: 'Today (నేడు)',
    highRiskCases: 2,
  },
  {
    name: 'Nurmati',
    nameTe: 'నూర్మతి',
    population: 85,
    screened: 52,
    coverage: 61.2,
    status: 'IN_PROGRESS' as const,
    lastVisited: '3 days ago',
    highRiskCases: 1,
  },
  {
    name: 'Solabham',
    nameTe: 'సొలభం',
    population: 95,
    screened: 36,
    coverage: 37.9,
    status: 'NEEDS_ATTENTION' as const,
    lastVisited: '5 days ago',
    highRiskCases: 0,
  },
];

export const HealthWorkerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { language, t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <Card variant="nature" padding="lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
                Field Health Worker (ASHA)
              </span>
              <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
                G. Madugula Sub-Centre
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
              Welcome back, {currentUser ? (language === 'te' ? currentUser.nameTe : currentUser.name) : 'Lakshmi Devi'}
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              Assigned habitations: <strong className="text-forest-900 font-semibold">Kothapalli, Nurmati, Solabham</strong> • ITDA Paderu
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/health-worker/patients">
              <Button variant="outline" size="md" icon={Users}>
                {language === 'te' ? 'రోగుల రిజిస్టర్' : 'Patient Roster'}
              </Button>
            </Link>
            <Link to="/health-worker/register">
              <Button variant="primary" size="md" icon={UserPlus}>
                {t('registerPatient')}
              </Button>
            </Link>
            <Link to="/health-worker/screening/new">
              <Button variant="secondary" size="md" icon={Camera}>
                {t('screening')}
              </Button>
            </Link>
            <Link to="/health-worker/sync">
              <Button variant="outline" size="md" icon={Wifi}>
                Sync Hub
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Primary Field Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Assigned Villages"
          labelTe="కేటాయించిన గ్రామాలు"
          value="3"
          icon={MapPin}
          subtext="Kothapalli, Nurmati, Solabham"
          variant="forest"
        />
        <StatCard
          label="Registered People"
          labelTe="నమోదైన ప్రజలు"
          value="248"
          icon={Users}
          trend={{ value: '+12 this week', isPositive: true }}
          variant="default"
        />
        <StatCard
          label="Screenings Completed"
          labelTe="పూర్తయిన స్క్రీనింగ్‌లు"
          value="182"
          icon={Camera}
          variant="emerald"
        />
        <StatCard
          label="Follow-ups Due"
          labelTe="తక్షణ పర్యవేక్షణ"
          value="3"
          icon={RotateCw}
          variant="amber"
        />
      </div>

      {/* Grid: Habitations Activity Map + Weekly Screening Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Village Habitations Activity Map Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card 
            title="Assigned Tribal Habitations Coverage Map" 
            titleTe="కేటాయించిన గిరిజన గ్రామాల కవరేజ్ స్థితి"
            subtitle="Real-time screening progress across your primary cluster"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {HABITATIONS_DATA.map((hab) => (
                  <div 
                    key={hab.name}
                    className="p-4 rounded-2xl border border-forest-100 bg-white hover:border-forest-300 transition-all shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-ink text-base">
                          {hab.name}
                        </h4>
                        <span className="text-xs font-telugu text-forest-800 font-semibold block">
                          {hab.nameTe}
                        </span>
                      </div>
                      <StatusBadge status={hab.status === 'ACTIVE' ? 'COMPLETED' : hab.status} />
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-ink-muted">
                        <span>Screening Coverage</span>
                        <span className="font-mono font-bold text-forest-900">{hab.coverage}%</span>
                      </div>
                      <div className="w-full bg-forest-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full ${
                            hab.coverage > 75 ? 'bg-emerald-600' : hab.coverage > 50 ? 'bg-forest-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${hab.coverage}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-forest-100 flex items-center justify-between text-[11px] text-ink-muted font-mono">
                      <span>Screened: <strong>{hab.screened}/{hab.population}</strong></span>
                      <span>Last: {hab.lastVisited}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Habitation Visual Geography Representation */}
              <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-100 flex items-center justify-between flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="font-medium text-ink">Kothapalli: High Coverage (85.5%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-forest-600"></div>
                  <span className="font-medium text-ink">Nurmati: Ongoing Routine (61.2%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="font-medium text-ink">Solabham: High-Priority Recall (37.9%)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Immediate Community Tasks */}
          <Card 
            title="Immediate Community Tasks" 
            titleTe="తక్షణ విధులు" 
            subtitle="Frontline actions requiring doorstep visits today"
          >
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-forest-50 border border-forest-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2 py-0.5 rounded">
                      ASR-PAT-2026-0842
                    </span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      Referral Reminder
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-ink">Kondala Rao (46M) — Kothapalli</h4>
                  <p className="text-xs text-ink-muted">
                    Remind patient of upcoming District Hospital Paderu specialist appointment on 04 Nov 2026.
                  </p>
                </div>
                <Link to="/health-worker/referrals">
                  <Button variant="primary" size="sm" icon={Send}>
                    View Referral
                  </Button>
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-forest-50 border border-forest-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2 py-0.5 rounded">
                      ASR-PAT-2026-0843
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Routine Follow-up
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-ink">Somamma Pangi (34F) — Nurmati</h4>
                  <p className="text-xs text-ink-muted">
                    6-month periodic oral hygiene review and tobacco-free household reinforcement.
                  </p>
                </div>
                <Link to="/health-worker/follow-ups">
                  <Button variant="outline" size="sm" icon={RotateCw}>
                    Open Follow-up
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Weekly Screenings Chart (Recharts) */}
        <div className="space-y-6">
          <Card 
            title="Weekly Screening Output" 
            titleTe="ఈ వారం స్క్రీనింగ్ గణాంకాలు"
            subtitle="Total frontline checks in last 7 days"
          >
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_SCREENING_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#075B4D', 
                      color: '#ffffff', 
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '12px' 
                    }} 
                  />
                  <Bar dataKey="screenings" fill="#087653" radius={[4, 4, 0, 0]} name="Screenings" />
                  <Bar dataKey="followUps" fill="#398F72" radius={[4, 4, 0, 0]} name="Follow-ups" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-3 border-t border-forest-100 flex items-center justify-between text-xs text-ink-muted">
              <span>Weekly Target: <strong>50 Screenings</strong></span>
              <span className="text-emerald-700 font-bold">56 Screenings (112% Met)</span>
            </div>
          </Card>

          {/* Quick Hub Links */}
          <Card title="Frontline Tools" titleTe="ఫీల్డ్ టూల్స్">
            <div className="space-y-2">
              <Link to="/health-worker/register" className="block">
                <div className="p-3 rounded-xl border border-forest-100 hover:border-forest-300 hover:bg-forest-50/50 transition-colors flex items-center justify-between text-xs font-semibold text-ink">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-forest-800" />
                    <span>Register New Citizen (No Phone Required)</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-forest-800" />
                </div>
              </Link>

              <Link to="/health-worker/screening/new" className="block">
                <div className="p-3 rounded-xl border border-forest-100 hover:border-forest-300 hover:bg-forest-50/50 transition-colors flex items-center justify-between text-xs font-semibold text-ink">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-forest-800" />
                    <span>Start Guided Oral Screening</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-forest-800" />
                </div>
              </Link>

              <Link to="/health-worker/sync" className="block">
                <div className="p-3 rounded-xl border border-forest-100 hover:border-forest-300 hover:bg-forest-50/50 transition-colors flex items-center justify-between text-xs font-semibold text-ink">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-forest-800" />
                    <span>Check Offline Sync Status (2 Pending)</span>
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
