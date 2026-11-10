import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle2,
  Plus,
  RefreshCw
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../context';
import { careApi, type CareRecord } from '../../services/careApi';

interface FollowUpItem {
  id: string;
  caseId: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  habitation: string;
  dueDate: string;
  type: string;
  notes: string;
  status: 'PENDING' | 'COMPLETED';
}

export const FollowUpQueuePage: React.FC = () => {
  const { language } = useTranslation();
  const { currentUser } = useAuth();

  const [cases, setCases] = useState<CareRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'due' | 'completed' | 'all'>('due');

  // Complete modal state
  const [activeTask, setActiveTask] = useState<FollowUpItem | null>(null);
  const [visitNotes, setVisitNotes] = useState('');
  const [habitStatus, setHabitStatus] = useState('Stopped tobacco use completely');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Schedule new follow-up modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPurpose, setNewPurpose] = useState('Routine 6-Month Oral Mucosa Check');

  const loadCases = async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await careApi<CareRecord[]>('/cases');
      setCases(records || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load follow-up records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCases();
  }, []);

  // Extract real follow-up items from patient cases
  const tasks: FollowUpItem[] = [];
  cases.forEach((c) => {
    // Check if there are explicit follow up events
    const followUpEvents = c.events?.filter((e) => e.action === 'FOLLOW_UP') || [];
    if (followUpEvents.length > 0) {
      followUpEvents.forEach((evt, idx) => {
        const isCompleted = Boolean(evt.data?.completed);
        tasks.push({
          id: `FUP-${c.id.slice(0, 6)}-${idx + 1}`,
          caseId: c.id,
          patientId: c.patientId || c.id,
          patientName: c.name,
          age: c.age,
          gender: c.sex || 'Male',
          habitation: c.village,
          dueDate: evt.at ? new Date(evt.at).toLocaleDateString() : 'Pending scheduled date',
          type: String(evt.data?.type || 'Post-Referral / Treatment Check'),
          notes: String(evt.data?.notes || 'Doorstep oral cavity review and habit cessation counseling'),
          status: isCompleted ? 'COMPLETED' : 'PENDING',
        });
      });
    } else {
      // Automatic baseline follow-up derived from patient status
      const isReferred = ['REFERRED', 'APPOINTMENT'].includes(c.status);
      tasks.push({
        id: `FUP-${c.id.slice(0, 8)}`,
        caseId: c.id,
        patientId: c.patientId || c.id,
        patientName: c.name,
        age: c.age,
        gender: c.sex || 'Male',
        habitation: c.village,
        dueDate: isReferred ? 'Immediate Pre-Appointment' : 'Scheduled recall',
        type: isReferred ? 'Referral Navigation Reminder' : 'Routine Oral Health Recall',
        notes: isReferred 
          ? 'Remind citizen about hospital appointment and verify travel coordination.'
          : 'Doorstep oral cavity check and tobacco-free household reinforcement.',
        status: c.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
      });
    }
  });

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'due') return t.status === 'PENDING';
    if (filter === 'completed') return t.status === 'COMPLETED';
    return true;
  });

  const handleCompleteFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;
    setSaving(true);
    try {
      const targetCase = cases.find((c) => c.id === activeTask.caseId);
      await careApi(`/cases/${activeTask.caseId}/actions`, {
        action: 'FOLLOW_UP',
        version: targetCase?.version || 1,
        notes: `Doorstep Visit Findings: ${visitNotes}. Tobacco habit status: ${habitStatus}.`,
        completed: true,
      });

      setSuccessMsg(language === 'te' ? 'పర్యవేక్షణ సందర్శన విజయవంతంగా నమోదు చేయబడింది.' : 'Doorstep follow-up visit successfully recorded.');
      await loadCases();
      setActiveTask(null);
      setVisitNotes('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to record follow-up.');
    } finally {
      setSaving(false);
    }
  };

  const handleScheduleNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) return;
    setSaving(true);
    try {
      const targetCase = cases.find((c) => c.id === selectedCaseId);
      await careApi(`/cases/${selectedCaseId}/actions`, {
        action: 'FOLLOW_UP',
        version: targetCase?.version || 1,
        notes: `Scheduled Follow-up: ${newPurpose}. Due on: ${newDueDate || 'Next month'}.`,
        completed: false,
      });

      setSuccessMsg(language === 'te' ? 'కొత్త పర్యవేక్షణ తేదీ షెడ్యూల్ చేయబడింది.' : 'New follow-up task scheduled.');
      await loadCases();
      setShowScheduleModal(false);
      setSelectedCaseId('');
      setNewDueDate('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to schedule follow-up.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
              Field Recall Queue
            </span>
            <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
              {currentUser?.facilityName || currentUser?.facility || 'Doorstep Visits'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            {language === 'te' ? 'కమ్యూనిటీ పర్యవేక్షణ క్యూ' : 'Community Follow-Up Queue'}
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            {language === 'te'
              ? 'పొగాకు మానుకునే కౌన్సెలింగ్, 6 నెలల సాధారణ తనిఖీలు మరియు ఆసుపత్రి అనంతర పర్యవేక్షణల షెడ్యూల్.'
              : 'Scheduled doorstep visits for habit cessation counseling, routine 6-month checks, and post-referral accompaniment.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadCases} disabled={loading}>
            {loading ? (language === 'te' ? 'నవీకరిస్తోంది...' : 'Refreshing...') : (language === 'te' ? 'రిఫ్రెష్' : 'Refresh')}
          </Button>
          <Button variant="primary" size="md" icon={Plus} onClick={() => setShowScheduleModal(true)}>
            {language === 'te' ? 'కొత్త పర్యవేక్షణ షెడ్యూల్' : 'Schedule Follow-up'}
          </Button>
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
          <Button variant="outline" size="sm" onClick={loadCases}>Retry</Button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-forest-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setFilter('due')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'due' ? 'bg-forest-900 text-white shadow-sm' : 'text-forest-900 hover:bg-forest-200'}`}
        >
          {language === 'te' ? 'తక్షణ పర్యవేక్షణ' : 'Due / Upcoming'} ({tasks.filter(t => t.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'completed' ? 'bg-forest-900 text-white shadow-sm' : 'text-forest-900 hover:bg-forest-200'}`}
        >
          {language === 'te' ? 'పూర్తయినవి' : 'Completed'} ({tasks.filter(t => t.status === 'COMPLETED').length})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-forest-900 text-white shadow-sm' : 'text-forest-900 hover:bg-forest-200'}`}
        >
          {language === 'te' ? 'అన్నీ' : 'All Tasks'} ({tasks.length})
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <RefreshCw className="w-8 h-8 text-forest-700 animate-spin mx-auto mb-3" />
            <p className="font-semibold text-ink">
              {language === 'te' ? 'పర్యవేక్షణ క్యూ లోడ్ అవుతోంది...' : 'Loading follow-up queue from server...'}
            </p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-ink-muted">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold text-ink">
              {language === 'te' ? 'ప్రస్తుతం ఎలాంటి పెండింగ్ పర్యవేక్షణలు లేవు.' : 'No follow-up visits pending in this filter.'}
            </p>
            <p className="text-xs text-ink-muted mt-1">
              {language === 'te'
                ? 'అన్ని షెడ్యూల్ చేయబడిన ఇంటింటి పర్యవేక్షణలు పూర్తయ్యాయి.'
                : 'All assigned doorstep checks are up to date. Click "Schedule Follow-up" to add a new check.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'COMPLETED';

            return (
              <Card 
                key={task.id} 
                variant="default" 
                padding="lg" 
                className={`border-forest-100 transition-colors ${
                  isDone ? 'opacity-70 bg-forest-50/40' : 'hover:border-forest-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded">
                        {task.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 font-mono">
                        {task.type}
                      </span>
                      <span className="text-xs text-ink-muted flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-forest-800" />
                        <span>Due: <strong>{task.dueDate}</strong></span>
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-ink">
                        {task.patientName} ({task.age}y • {task.gender}) — <span className="text-forest-800">{task.habitation}</span>
                      </h3>
                      <p className="text-xs text-ink-muted mt-0.5">
                        {task.notes}
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
                        <span>{language === 'te' ? 'సందర్శన నమోదైంది' : 'VISIT RECORDED'}</span>
                      </span>
                    ) : (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        icon={CheckCircle2} 
                        onClick={() => setActiveTask(task)}
                      >
                        {language === 'te' ? 'సందర్శన పూర్తి చేయండి' : 'Record Doorstep Visit'}
                      </Button>
                    )}
                  </div>

                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Record Visit Notes Modal */}
      {activeTask && (
        <Modal
          isOpen={!!activeTask}
          onClose={() => setActiveTask(null)}
          title={`Record Doorstep Visit: ${activeTask.patientName}`}
          titleTe={`ఇంటింటి సందర్శన నమోదు: ${activeTask.patientName}`}
          size="md"
        >
          <form onSubmit={handleCompleteFollowUp} className="space-y-4">
            <p className="text-xs text-ink-muted">
              {language === 'te'
                ? 'రోగి నోటి పరిశీలన, పొగాకు మానుకునే పురోగతి మరియు ఏవైనా నూతన లక్షణాలను నమోదు చేయండి.'
                : 'Document clinical observations from the doorstep visit, habit reduction, and current mucosal health.'}
            </p>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Tobacco / Habit Cessation Progress *
              </label>
              <select
                value={habitStatus}
                onChange={(e) => setHabitStatus(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none"
              >
                <option value="Stopped tobacco use completely">Stopped tobacco / gutkha use completely (పూర్తిగా మానేశారు)</option>
                <option value="Reduced consumption significantly">Reduced consumption significantly (వాడకం గణనీయంగా తగ్గించారు)</option>
                <option value="Counseling provided - agreed to taper">Counseling provided - agreed to taper (కౌన్సెలింగ్ ఇచ్చాము - తగ్గిస్తామని చెప్పారు)</option>
                <option value="No tobacco habit history">No tobacco habit history (పొగాకు అలవాటు లేదు)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Visit Notes & Oral Observations *
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Inspected right buccal mucosa; whitish patch has reduced in redness. Patient instructed on warm saline rinses and dietary precautions."
                value={visitNotes}
                onChange={(e) => setVisitNotes(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setActiveTask(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Mark Visit Completed'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Schedule New Follow-up Modal */}
      {showScheduleModal && (
        <Modal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          title="Schedule Doorstep Follow-up"
          titleTe="నూతన పర్యవేక్షణ షెడ్యూల్"
          size="md"
        >
          <form onSubmit={handleScheduleNew} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Select Citizen / Patient *
              </label>
              <select
                required
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none font-medium"
              >
                <option value="">-- Choose Patient from Roster --</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.patientId || c.id}) • {c.village}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Follow-up Purpose / Category *
              </label>
              <select
                value={newPurpose}
                onChange={(e) => setNewPurpose(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none"
              >
                <option value="Routine 6-Month Oral Mucosa Check">Routine 6-Month Oral Mucosa Check (6 నెలల సాధారణ తనిఖీ)</option>
                <option value="Gutkha & Tobacco Cessation Counseling">Gutkha & Tobacco Cessation Counseling (పొగాకు మానుకునే సమీక్ష)</option>
                <option value="Pre-Hospital Specialist Visit Reminder">Pre-Hospital Specialist Visit Reminder (ఆసుపత్రి రిమైండర్)</option>
                <option value="Post-Biopsy Wound Inspection">Post-Biopsy Wound Inspection (బయాప్సీ అనంతర పరిశీలన)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Due Date (తేదీ)
              </label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" disabled={saving || !selectedCaseId}>
                {saving ? 'Scheduling...' : 'Save Scheduled Follow-up'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
