import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useTranslation } from '../../i18n';

interface FollowUpTask {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  habitation: string;
  dueDate: string;
  type: 'ROUTINE_6_MONTH' | 'POST_REFERRAL_CHECK' | 'HABIT_CESSATION';
  typeLabel: string;
  typeLabelTe: string;
  notes: string;
  notesTe: string;
  status: 'PENDING' | 'COMPLETED';
}

const INITIAL_FOLLOW_UPS: FollowUpTask[] = [
  {
    id: 'FUP-2026-001',
    patientId: 'ASR-PAT-2026-0842',
    patientName: 'Kondala Rao',
    age: 46,
    gender: 'Male',
    habitation: 'Kothapalli',
    dueDate: 'Today (30 Oct 2026)',
    type: 'POST_REFERRAL_CHECK',
    typeLabel: 'Pre-Appointment Reminder',
    typeLabelTe: 'ఆసుపత్రి సందర్శన రిమైండర్',
    notes: 'Remind patient of upcoming District Hospital Paderu specialist appointment on 04 Nov 2026.',
    notesTe: 'నవంబర్ 4న పాడేరు ఆసుపత్రి అపాయింట్‌మెంట్ గుర్తుచేయడం.',
    status: 'PENDING',
  },
  {
    id: 'FUP-2026-002',
    patientId: 'ASR-PAT-2026-0843',
    patientName: 'Somamma Pangi',
    age: 34,
    gender: 'Female',
    habitation: 'Nurmati',
    dueDate: 'Tomorrow (31 Oct 2026)',
    type: 'ROUTINE_6_MONTH',
    typeLabel: '6-Month Routine Recall',
    typeLabelTe: '6 నెలల సాధారణ పునఃపరిశీలన',
    notes: 'Periodic checkup to inspect gum health and provide oral hygiene advice.',
    notesTe: 'చిగుళ్ళ ఆరోగ్యం మరియు సాధారణ నోటి పరిశీలన.',
    status: 'PENDING',
  },
  {
    id: 'FUP-2026-003',
    patientId: 'ASR-PAT-2026-0799',
    patientName: 'Chitti Babu',
    age: 58,
    gender: 'Male',
    habitation: 'Solabham',
    dueDate: '02 Nov 2026',
    type: 'HABIT_CESSATION',
    typeLabel: 'Gutkha Cessation Follow-up',
    typeLabelTe: 'గుట్కా మానుకునే కౌన్సెలింగ్',
    notes: 'Check gutkha tapering progress; verify mouth burning sensations.',
    notesTe: 'గుట్కా వాడకం తగ్గింపు మరియు నోటి మంట పరిస్థితి సమీక్ష.',
    status: 'PENDING',
  },
];

export const FollowUpQueuePage: React.FC = () => {
  const { language } = useTranslation();
  const [tasks, setTasks] = useState<FollowUpTask[]>(INITIAL_FOLLOW_UPS);

  const handleMarkDone = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: 'COMPLETED' } : task
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
              Field Recall Queue
            </span>
            <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
              Doorstep Visits
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            Community Follow-Up Queue
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Scheduled doorstep visits for habit cessation, routine 6-month checks, and post-referral accompaniment.
          </p>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => {
          const isDone = task.status === 'COMPLETED';

          return (
            <Card 
              key={task.id} 
              variant="default" 
              padding="lg" 
              className={`border-forest-100 transition-colors ${
                isDone ? 'opacity-60 bg-forest-50/40' : 'hover:border-forest-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded">
                      {task.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 font-mono">
                      {task.typeLabel}
                    </span>
                    <span className="text-xs text-ink-muted flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-forest-800" />
                      <span>Due: <strong>{task.dueDate}</strong></span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-ink">
                      {task.patientName} ({task.age}{task.gender[0]}) — <span className="text-forest-800">{task.habitation}</span>
                    </h3>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {language === 'te' ? task.notesTe : task.notes}
                    </p>
                  </div>

                  <div className="text-xs text-ink-muted font-mono">
                    Citizen ID: <strong>{task.patientId}</strong>
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0">
                  {isDone ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs font-mono">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>VISIT RECORDED</span>
                    </span>
                  ) : (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      icon={CheckCircle2} 
                      onClick={() => handleMarkDone(task.id)}
                    >
                      Mark Visit Completed
                    </Button>
                  )}
                </div>

              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
