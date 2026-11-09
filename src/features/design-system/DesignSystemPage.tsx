import React, { useState } from 'react';
import { 
  Heart, 
  Users, 
  Activity, 
  ShieldCheck, 
  Calendar, 
  Send, 
  AlertTriangle, 
  Search
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import { Alert } from '../../components/common/Alert';
import { Modal } from '../../components/common/Modal';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { Checkbox } from '../../components/forms/Checkbox';
import { Table } from '../../components/tables/Table';
import type { Column } from '../../components/tables/Table';
import { useTranslation } from '../../i18n';
import type { WorkflowStatus } from '../../types';
import { ASR_MANDALS } from '../../data/asrMandals';

interface SamplePatientRow {
  id: string;
  name: string;
  nameTe: string;
  age: number;
  village: string;
  status: WorkflowStatus;
}

export const DesignSystemPage: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'tokens' | 'components' | 'forms' | 'table'>('tokens');

  // Sample data for table demonstration
  const sampleData: SamplePatientRow[] = [
    { id: 'ASR-PAT-001', name: 'Kondala Rao', nameTe: 'కొండల రావు', age: 46, village: 'Kothapalli, G. Madugula', status: 'PENDING' },
    { id: 'ASR-PAT-002', name: 'Somamma Pangi', nameTe: 'సోమమ్మ పంగి', age: 34, village: 'Padmapuram, Araku', status: 'COMPLETED' },
    { id: 'ASR-PAT-003', name: 'Appala Swamy', nameTe: 'అప్పల స్వామి', age: 62, village: 'Lothugedda, Chintapalli', status: 'NEEDS_ATTENTION' },
    { id: 'ASR-PAT-004', name: 'Lakshmi Korra', nameTe: 'లక్ష్మి కొర్ర', age: 29, village: 'Nurmati, G. Madugula', status: 'NEW' },
    { id: 'ASR-PAT-005', name: 'Chitti Babu', nameTe: 'చిట్టి బాబు', age: 51, village: 'Solabham, Paderu', status: 'IN_PROGRESS' },
  ];

  const columns: Column<SamplePatientRow>[] = [
    {
      header: 'Patient Identifier',
      headerTe: 'రోగి గుర్తింపు సంఖ్య',
      accessorKey: 'id',
      className: 'font-mono text-xs font-semibold text-forest-900',
    },
    {
      header: 'Name',
      headerTe: 'పేరు',
      cell: (row) => (
        <div>
          <span className="font-semibold text-ink">{row.name}</span>
          <span className="block text-xs font-telugu text-forest-700 font-medium">{row.nameTe}</span>
        </div>
      ),
    },
    {
      header: 'Age',
      headerTe: 'వయస్సు',
      accessorKey: 'age',
    },
    {
      header: 'Village / Mandal',
      headerTe: 'గ్రామం / మండలం',
      accessorKey: 'village',
    },
    {
      header: 'Workflow Status',
      headerTe: 'ప్రస్తుత స్థితి',
      cell: (row) => <StatusBadge status={row.status} showBilingual={true} />,
    },
  ];

  return (
    <div className="min-h-screen bg-forest-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Header Card */}
        <Card variant="nature" padding="lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white">
                  Design System Showcase
                </span>
                <span className="text-xs font-semibold text-forest-800 bg-forest-100 px-2.5 py-0.5 rounded-full">
                  Phase 1 Baseline
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink">
                Nature-Inspired Community Healthcare Design System
              </h1>
              <p className="text-sm font-telugu text-forest-900 font-medium">
                ప్రకృతి సహజ ప్రామాణిక డిజైన్ వ్యవస్థ — అల్లూరి సీతారామరాజు జిల్లా ఆరోగ్య కార్యక్రమం
              </p>
              <p className="text-xs sm:text-sm text-ink-muted">
                Official design tokens, high-contrast Telugu typography, WCAG 2.1 AA accessible primitives, and workflow statuses.
              </p>
            </div>

            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
              <LanguageSwitcher variant="pill" />
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-forest-200/60 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('tokens')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'tokens'
                  ? 'bg-forest-900 text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink hover:bg-forest-100/60'
              }`}
            >
              Colors & Typography
            </button>
            <button
              onClick={() => setActiveTab('components')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'components'
                  ? 'bg-forest-900 text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink hover:bg-forest-100/60'
              }`}
            >
              Buttons, Badges & Stats
            </button>
            <button
              onClick={() => setActiveTab('forms')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'forms'
                  ? 'bg-forest-900 text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink hover:bg-forest-100/60'
              }`}
            >
              Form Controls & Feedback
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'table'
                  ? 'bg-forest-900 text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink hover:bg-forest-100/60'
              }`}
            >
              Responsive Tables
            </button>
          </div>
        </Card>

        {/* TAB 1: TOKENS & TYPOGRAPHY */}
        {activeTab === 'tokens' && (
          <div className="space-y-8">
            {/* Color Palette Grid */}
            <Card title="Official Nature Theme Palette" subtitle="Harmonious Eastern Ghats nature tones with WCAG AA compliance">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="p-4 rounded-xl bg-forest-900 text-white shadow-sm flex flex-col justify-between h-28">
                  <span className="text-xs font-semibold">Primary Forest</span>
                  <span className="font-mono text-xs">#075B4D</span>
                </div>
                <div className="p-4 rounded-xl bg-forest-800 text-white shadow-sm flex flex-col justify-between h-28">
                  <span className="text-xs font-semibold">Secondary Green</span>
                  <span className="font-mono text-xs">#087653</span>
                </div>
                <div className="p-4 rounded-xl bg-forest-700 text-white shadow-sm flex flex-col justify-between h-28">
                  <span className="text-xs font-semibold">Natural Accent</span>
                  <span className="font-mono text-xs">#398F72</span>
                </div>
                <div className="p-4 rounded-xl bg-forest-100 text-forest-900 border border-forest-200 shadow-sm flex flex-col justify-between h-28">
                  <span className="text-xs font-semibold">Soft Nature Accent</span>
                  <span className="font-mono text-xs">#DCEFEA</span>
                </div>
                <div className="p-4 rounded-xl bg-forest-50 text-forest-900 border border-forest-200 shadow-sm flex flex-col justify-between h-28">
                  <span className="text-xs font-semibold">Light Background</span>
                  <span className="font-mono text-xs">#E8F5EF</span>
                </div>
                <div className="p-4 rounded-xl bg-white text-ink border border-forest-200 shadow-sm flex flex-col justify-between h-28">
                  <span className="text-xs font-semibold">Card Surface</span>
                  <span className="font-mono text-xs">#FFFFFF</span>
                </div>
                <div className="p-4 rounded-xl bg-[#173B36] text-white shadow-sm flex flex-col justify-between h-28">
                  <span className="text-xs font-semibold">Main Text Ink</span>
                  <span className="font-mono text-xs">#173B36</span>
                </div>
                <div className="p-4 rounded-xl bg-[#64748B] text-white shadow-sm flex flex-col justify-between h-28">
                  <span className="text-xs font-semibold">Secondary Text</span>
                  <span className="font-mono text-xs">#64748B</span>
                </div>
                <div className="p-4 rounded-xl bg-status-info text-white shadow-sm flex flex-col justify-between h-28">
                  <span className="text-xs font-semibold">Information Blue</span>
                  <span className="font-mono text-xs">#2865A5</span>
                </div>
                <div className="p-4 rounded-xl bg-status-warning text-white shadow-sm flex flex-col justify-between h-28">
                  <span className="text-xs font-semibold">Warning Amber</span>
                  <span className="font-mono text-xs">#986000</span>
                </div>
                <div className="p-4 rounded-xl bg-status-danger text-white shadow-sm flex flex-col justify-between h-28">
                  <span className="text-xs font-semibold">Attention Red</span>
                  <span className="font-mono text-xs">#B44838</span>
                </div>
                <div className="p-4 rounded-xl bg-status-neutral text-white shadow-sm flex flex-col justify-between h-28">
                  <span className="text-xs font-semibold">Unavailable Grey</span>
                  <span className="font-mono text-xs">#94A3B8</span>
                </div>
              </div>
            </Card>

            {/* Typography Section */}
            <Card title="Bilingual Typography Pairing" subtitle="Outfit & Inter for Latin numerals paired with Google Noto Sans Telugu">
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-forest-50/70 border border-forest-100">
                  <p className="text-xs uppercase font-bold tracking-wider text-forest-800 mb-1">Display Hero (28px - 36px)</p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-ink">
                    Every Smile Deserves Care
                  </h2>
                  <h2 className="text-2xl sm:text-3xl font-bold font-telugu text-forest-900 mt-1">
                    ప్రతి చిరునవ్వుకు ఆరోగ్య సంరక్షణ అవసరం
                  </h2>
                </div>

                <div className="p-5 rounded-2xl bg-forest-50/70 border border-forest-100">
                  <p className="text-xs uppercase font-bold tracking-wider text-forest-800 mb-1">Body Text & Glyphs (16px, 1.6 line-height)</p>
                  <p className="text-base text-ink leading-relaxed">
                    Bringing community oral cancer awareness, early frontline photography screening, and direct specialist care to tribal villages in Paderu, Araku, Chintapalli, and G. Madugula.
                  </p>
                  <p className="text-base font-telugu text-ink leading-relaxed mt-2">
                    పాడేరు, అరకు, చింతపల్లి మరియు జి. మాడుగుల గిరిజన గ్రామాల్లో నోటి క్యాన్సర్ ప్రాథమిక అవగాహన, ఫోటోగ్రఫీ స్క్రీనింగ్ మరియు నిపుణుల వైద్య సేవలను ప్రజలకు చేరువ చేయడం.
                  </p>
                </div>
              </div>
            </Card>

            {/* Statuses Showcase */}
            <Card title="Workflow Status Badges" subtitle="Non-clinical process tracking indicators (Always visible text alongside color)">
              <div className="flex flex-wrap gap-3">
                <StatusBadge status="NEW" showBilingual={true} size="lg" />
                <StatusBadge status="PENDING" showBilingual={true} size="lg" />
                <StatusBadge status="IN_PROGRESS" showBilingual={true} size="lg" />
                <StatusBadge status="COMPLETED" showBilingual={true} size="lg" />
                <StatusBadge status="NEEDS_ATTENTION" showBilingual={true} size="lg" />
                <StatusBadge status="NOT_AVAILABLE" showBilingual={true} size="lg" />
              </div>
              <p className="text-xs text-ink-muted mt-3 italic">
                * Clinical Safety Note: These badges indicate case progress in the referral pipeline, NOT cancer stages or medical severity.
              </p>
            </Card>
          </div>
        )}

        {/* TAB 2: BUTTONS, BADGES & STATS */}
        {activeTab === 'components' && (
          <div className="space-y-8">
            <Card title="Button Primitives" subtitle="Accessible minimum 48px touch targets for budget Android smartphones">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Variants</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary" icon={Heart}>Primary Action</Button>
                    <Button variant="secondary" icon={Users}>Secondary Action</Button>
                    <Button variant="outline" icon={Calendar}>Outline Button</Button>
                    <Button variant="danger" icon={AlertTriangle}>Danger Action</Button>
                    <Button variant="ghost">Ghost Button</Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Sizes</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small (38px)</Button>
                    <Button size="md">Medium (46px)</Button>
                    <Button size="lg">Large Touch (52px)</Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">Loading State</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary" loading={true}>Processing...</Button>
                    <Button variant="outline" loading={true}>Saving Draft...</Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Stat Cards" subtitle="Used across frontline and clinical dashboards">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Registered People"
                  labelTe="నమోదైన ప్రజలు"
                  value="1,248"
                  icon={Users}
                  trend={{ value: '+14% this week', isPositive: true }}
                  variant="forest"
                />
                <StatCard
                  label="Completed Screenings"
                  labelTe="పూర్తయిన స్క్రీనింగ్‌లు"
                  value="864"
                  icon={ShieldCheck}
                  subtext="G. Madugula & Araku"
                  variant="emerald"
                />
                <StatCard
                  label="Pending Clinical Reviews"
                  labelTe="వైద్యుల పరిశీలనలో ఉన్నవి"
                  value="38"
                  icon={Activity}
                  subtext="Awaiting Medical Officer"
                  variant="amber"
                />
                <StatCard
                  label="Hospital Referrals"
                  labelTe="ఆసుపత్రి రిఫరల్స్"
                  value="12"
                  icon={Send}
                  subtext="District Hospital Paderu"
                  variant="blue"
                />
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3: FORMS & FEEDBACK */}
        {activeTab === 'forms' && (
          <div className="space-y-8">
            <Card title="Form Inputs & Selectors" subtitle="Accessible form controls with Telugu subtitles and validation states">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Patient Full Name"
                  labelTe="రోగి పూర్తి పేరు"
                  placeholder="e.g. Kondala Rao"
                  helperText="Enter name as spoken by patient"
                  helperTextTe="రోగి చెప్పిన విధంగా పేరు నమోదు చేయండి"
                  required={true}
                />

                <Input
                  label="Age"
                  labelTe="వయస్సు"
                  type="number"
                  placeholder="e.g. 46"
                  required={true}
                />

                <Select
                  label="Mandal Selection (All 22 ASR Mandals)"
                  labelTe="మండలం ఎంపిక (అన్ని 22 మండలాలు)"
                  options={[
                    { value: '', label: 'Select Mandal (మండలాన్ని ఎంచుకోండి)...' },
                    ...ASR_MANDALS.map((m) => ({
                      value: m.id,
                      label: `${m.nameEn} (${m.division} Division)`,
                      labelTe: `${m.nameTe} (${m.nameEn})`,
                    })),
                  ]}
                  required={true}
                />

                <Input
                  label="Search Village"
                  labelTe="గ్రామాన్ని వెతకండి"
                  placeholder="Type village name..."
                  icon={Search}
                />

                <div className="md:col-span-2">
                  <Checkbox
                    label="Informed Consent Granted"
                    labelTe="సమ్మతి తెలియజేయబడింది"
                    description="Patient has verbally consented to oral screening and secure photography."
                    descriptionTe="రోగి నోటి పరీక్ష మరియు ఫోటోగ్రఫీకి స్వచ్ఛందంగా సమ్మతించారు."
                    defaultChecked={true}
                  />
                </div>
              </div>
            </Card>

            <Card title="Alerts & User Feedback" subtitle="High-contrast humanized messages in English and Telugu">
              <div className="space-y-4">
                <Alert type="info" title="Offline Mode Active" titleTe="ఆఫ్‌లైన్ మోడ్ ప్రారంభమైంది">
                  Your screening records are safely preserved on this device. They will synchronize automatically when internet connectivity resumes.
                </Alert>

                <Alert type="warning" title="Image Quality Warning" titleTe="ఫోటో నాణ్యత సరిపోలేదు">
                  The photograph appears blurry. Please hold the phone steady and capture another image.
                </Alert>

                <Alert type="danger" title="Non-Clinical Research Notice" titleTe="పరిశోధన ప్రదర్శన మాత్రమే">
                  This AI research model is an experimental demonstration. It does NOT diagnose cancer, cannot rule out disease, and cannot replace a clinical oral examination by a qualified doctor.
                </Alert>

                <Alert type="success" title="Sync Completed" titleTe="డేటా విజయవంతంగా చేరింది">
                  3 screening drafts from Kothapalli village have been synced to the primary PHC queue.
                </Alert>
              </div>
            </Card>

            <Card title="Interactive Modals & Dialogs" subtitle="Dialog test triggers">
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                  Open Information Modal
                </Button>
                <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
                  Open Safety Confirmation Dialog
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 4: RESPONSIVE TABLE */}
        {activeTab === 'table' && (
          <div className="space-y-6">
            <Card title="Village Screening Queue Table" subtitle="Responsive data table with bilingual headers and status pills">
              <Table
                columns={columns}
                data={sampleData}
                keyExtractor={(item) => item.id}
                onRowClick={(row) => alert(`Selected Patient: ${row.name} (${row.id})`)}
              />
            </Card>
          </div>
        )}

      </div>

      {/* Demo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Guided Oral Photography Protocol"
        titleTe="నోటి ఫోటోల సేకరణ మార్గదర్శకాలు"
        subtitle="Standardized procedure for frontline health workers"
        footer={
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>
            {t('confirm')}
          </Button>
        }
      >
        <div className="space-y-3 text-sm text-ink leading-relaxed">
          <p>
            Please examine all 5 clinical anatomical regions: right cheek, left cheek, tongue (dorsal & lateral), palate, and floor of mouth.
          </p>
          <p className="font-telugu text-forest-900 font-medium">
            దయచేసి మొత్తం 5 భాగాలను క్షుణ్ణంగా పరిశీలించండి: కుడి బుగ్గ, ఎడమ బుగ్గ, నాలుక, అంగిలి మరియు చిగుళ్ళు/నోటి అడుగుభాగం.
          </p>
        </div>
      </Modal>

      {/* Demo Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          alert('Action Confirmed');
        }}
        variant="danger"
        title="Revoke Caregiver Access"
        titleTe="సంరక్షకుల యాక్సెస్ రద్దు"
        message="Are you sure you want to revoke portal access for this caregiver? They will no longer be able to view appointments or screening records."
        messageTe="ఈ సంరక్షకునికి పోర్టల్ అనుమతిని రద్దు చేయాలనుకుంటున్నారా? వారు ఇకపై వివరాలు చూడలేరు."
      />
    </div>
  );
};
