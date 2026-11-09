import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  User,
  CheckCircle2,
  Building2,
  Truck,
  RotateCcw
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/common/Alert';
import { useTranslation } from '../../i18n';
import { INITIAL_APPOINTMENTS } from './hospitalData';
import type { SpecialistAppointment } from './hospitalData';

export const SpecialistAppointmentsPage: React.FC = () => {
  const { language } = useTranslation();

  const [appointments, setAppointments] = useState<SpecialistAppointment[]>(INITIAL_APPOINTMENTS);
  const [filter, setFilter] = useState<'ALL' | 'CONFIRMED' | 'COMPLETED'>('ALL');

  // Reschedule Modal State
  const [reschedulingApt, setReschedulingApt] = useState<SpecialistAppointment | null>(null);
  const [newDate, setNewDate] = useState('2026-11-06');
  const [newTime, setNewTime] = useState('11:00 AM');
  const [rescheduleToast, setRescheduleToast] = useState(false);

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'CONFIRMED') return apt.status === 'CONFIRMED';
    if (filter === 'COMPLETED') return apt.status === 'COMPLETED';
    return true;
  });

  const handleMarkCompleted = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'COMPLETED' } : apt))
    );
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingApt) return;

    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === reschedulingApt.id
          ? {
              ...apt,
              date: newDate,
              timeSlot: `${newTime} - 11:30 AM`,
              status: 'CONFIRMED',
            }
          : apt
      )
    );

    setReschedulingApt(null);
    setRescheduleToast(true);
    setTimeout(() => setRescheduleToast(false), 3500);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-forest-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-forest-800 mb-1">
            <Link to="/hospital" className="hover:underline">Hospital Hub</Link>
            <span>/</span>
            <span className="text-forest-950 font-semibold">Specialist Clinic</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-ink flex items-center gap-2">
            Specialist Oral OPD Clinic Roster
            <span className="text-xs font-mono font-semibold text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded-full">
              Room 14 • District Hospital Paderu
            </span>
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Confirmed clinical appointments for referred oral cancer screening patients and biopsy procedures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/hospital/referrals">
            <Button variant="outline" size="sm" icon={Building2}>
              Inbound Referrals
            </Button>
          </Link>
        </div>
      </div>

      {rescheduleToast && (
        <Alert 
          type="success" 
          title="Appointment Rescheduled" 
          titleTe="అపాయింట్‌మెంట్ విజయవంతంగా మార్చబడింది"
        >
          New appointment confirmed. ITDA tribal patient navigator notified to update transportation schedule.
        </Alert>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'ALL'
              ? 'bg-forest-800 text-white shadow-sm'
              : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
          }`}
        >
          All Appointments ({appointments.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('CONFIRMED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'CONFIRMED'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
          }`}
        >
          Upcoming Confirmed ({appointments.filter((a) => a.status === 'CONFIRMED').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('COMPLETED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'COMPLETED'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
          }`}
        >
          Completed ({appointments.filter((a) => a.status === 'COMPLETED').length})
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.map((apt) => {
          const isKondalaRao = apt.patientId === 'ASR-PAT-2026-0842';

          return (
            <Card
              key={apt.id}
              padding="md"
              className={`border transition-all ${
                isKondalaRao
                  ? 'border-emerald-400 ring-2 ring-emerald-200/50 bg-emerald-50/20'
                  : 'border-forest-200 bg-white'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                
                {/* Time & Date Block */}
                <div className="p-3 bg-forest-50 rounded-xl border border-forest-200 text-center shrink-0 min-w-[130px]">
                  <span className="font-mono text-xs font-bold text-forest-900 block">
                    {apt.date}
                  </span>
                  <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-ink-muted mt-1">
                    <Clock className="w-3 h-3 text-forest-700" />
                    <span>{apt.timeSlot.split(' - ')[0]}</span>
                  </div>
                  <span className="text-[10px] text-ink-muted block mt-0.5">
                    {apt.clinicRoom.split(' (')[0]}
                  </span>
                </div>

                {/* Patient Information */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2 py-0.5 rounded border border-forest-200">
                      {apt.id}
                    </span>
                    <span className="font-mono text-xs text-ink-muted">
                      Card: {apt.patientId}
                    </span>
                    <Badge
                      label={apt.status}
                      variant={apt.status === 'COMPLETED' ? 'success' : 'info'}
                      size="sm"
                    />
                    {isKondalaRao && (
                      <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded uppercase">
                        Kondala Rao (Specialist OPD)
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <h3 className="text-base font-bold text-ink">
                      {apt.patientName} ({apt.age}M)
                    </h3>
                    {language === 'te' && (
                      <span className="text-sm font-telugu text-forest-800">
                        ({apt.patientNameTe})
                      </span>
                    )}
                  </div>

                  {/* Specialist & Room */}
                  <div className="text-xs text-ink-muted flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1 text-ink font-medium">
                      <User className="w-3.5 h-3.5 text-forest-700" />
                      Consultant: <strong>{apt.specialist}</strong> ({apt.specialistTitle})
                    </span>
                    <span>•</span>
                    <span className="text-forest-800">
                      Location: {apt.clinicRoom}
                    </span>
                  </div>

                  {/* Navigator and Transport */}
                  <div className="flex items-center gap-4 text-[11px] text-forest-800 pt-1 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-emerald-800">
                      <Truck className="w-3.5 h-3.5" />
                      Transport: ITDA Free Tribal Van Desk
                    </span>
                    <span>•</span>
                    <span>Assigned Navigator: <strong>{apt.navigatorName}</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto">
                  {apt.status === 'CONFIRMED' ? (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={CheckCircle2}
                        onClick={() => handleMarkCompleted(apt.id)}
                        fullWidth
                      >
                        Check-in & Complete Visit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={RotateCcw}
                        onClick={() => setReschedulingApt(apt)}
                        fullWidth
                      >
                        Reschedule
                      </Button>
                    </>
                  ) : (
                    <Link to="/hospital/investigations" className="w-full">
                      <Button variant="outline" size="sm" fullWidth>
                        View Biopsy Order
                      </Button>
                    </Link>
                  )}
                </div>

              </div>
            </Card>
          );
        })}
      </div>

      {/* RESCHEDULE MODAL */}
      <Modal
        isOpen={reschedulingApt !== null}
        onClose={() => setReschedulingApt(null)}
        title="Reschedule Specialist OPD Appointment"
        titleTe="స్పెషలిస్ట్ అపాయింట్‌మెంట్ మార్పు"
        maxWidth="md"
      >
        {reschedulingApt && (
          <form onSubmit={handleRescheduleSubmit} className="space-y-4 py-2 text-xs">
            <p className="text-ink-muted">
              Rescheduling appointment for <strong>{reschedulingApt.patientName}</strong> with {reschedulingApt.specialist}.
            </p>

            <div>
              <label className="block font-bold text-ink mb-1">New Date:</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2.5 border border-forest-300 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-ink mb-1">New Time Slot:</label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full p-2.5 border border-forest-300 rounded-lg text-xs"
              >
                <option value="09:30 AM">09:30 AM (Slot 1)</option>
                <option value="10:30 AM">10:30 AM (Slot 2)</option>
                <option value="11:30 AM">11:30 AM (Slot 3)</option>
                <option value="02:30 PM">02:30 PM (Slot 4)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => setReschedulingApt(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" fullWidth>
                Save New Schedule
              </Button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
