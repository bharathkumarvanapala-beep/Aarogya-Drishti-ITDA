import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  XCircle,
  Phone,
  MapPin,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Users
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../context';
import { STAFF_DIRECTORY } from './adminData';
import type { StaffMember } from './adminData';
import type { UserAccount, AccountStatus } from '../../types';
import { 
  ASR_DIVISIONS, 
  getMandalsByDivision, 
  getHabitationsForMandal, 
  getPanchayatsForMandal,
  getVillagesForPanchayat
} from '../../data/asrMandals';

type AdminTab = 'directory' | 'approvals';

export const StaffManagementPage: React.FC = () => {
  const { getRegisteredUsersList, approveUser, rejectUser, suspendUser } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('approvals');
  const [staff, setStaff] = useState<StaffMember[]>(STAFF_DIRECTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [mandalFilter, setMandalFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Allocation Modal State for Staff Directory
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedPanchayat, setSelectedPanchayat] = useState('');
  const [newVillage, setNewVillage] = useState('Boddaputtu');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Rejection Reason Modal State
  const [rejectingUser, setRejectingUser] = useState<UserAccount | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const registeredAccounts = getRegisteredUsersList();

  const pendingCount = registeredAccounts.filter(
    (u) => u.accountStatus === 'PENDING_VERIFICATION' && u.role !== 'admin' && u.role !== 'patient',
  ).length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApprove = (u: UserAccount) => {
    approveUser(u.id);
    showToast(`Account approved for ${u.name} (${u.roleTitle}). Portal access is now active.`);
  };

  const handleOpenReject = (u: UserAccount) => {
    setRejectingUser(u);
    setRejectionReason('Registration details could not be authenticated against the district professional registry.');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingUser) return;
    rejectUser(rejectingUser.id, rejectionReason);
    showToast(`Registration rejected for ${rejectingUser.name}.`);
    setRejectingUser(null);
  };

  const handleSuspend = (u: UserAccount) => {
    suspendUser(u.id);
    showToast(`Account access suspended for ${u.name}.`);
  };

  // Filtered Registered Approvals List
  const filteredRegistrations = registeredAccounts
    .filter((u) => u.role !== 'admin' && u.role !== 'patient')
    .filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.phone && u.phone.includes(searchQuery)) ||
        (u.registrationNumber && u.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.employeeId && u.employeeId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.ashaId && u.ashaId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.anmId && u.anmId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.facility && u.facility.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;

      const userStatus = u.accountStatus || 'APPROVED';
      if (statusFilter !== 'ALL' && userStatus !== statusFilter) return false;

      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;

      return true;
    });

  // Filtered Staff Directory
  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.mandal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.assignedAreas.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (roleFilter !== 'ALL' && member.role !== roleFilter) return false;
    if (mandalFilter !== 'ALL' && member.mandal.toLowerCase() !== mandalFilter.toLowerCase()) return false;

    return true;
  });

  const handleAssignVillage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    const areaLabel = selectedPanchayat ? `${newVillage} (${selectedPanchayat} GP)` : newVillage;
    setStaff((prev) =>
      prev.map((m) =>
        m.id === selectedStaff.id
          ? { ...m, assignedAreas: `${m.assignedAreas}, ${areaLabel}` }
          : m,
      ),
    );

    setSelectedStaff(null);
    showToast(`Habitation territory updated for ${selectedStaff.name}.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-forest-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-forest-800 mb-1">
            <Link to="/admin" className="hover:underline">District Admin</Link>
            <span>/</span>
            <span className="text-forest-950 font-semibold">Staff & Account Verification</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-ink flex items-center gap-2.5">
            Healthcare Workforce & Credential Verification Desk
            {pendingCount > 0 && (
              <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full animate-pulse">
                {pendingCount} Pending Verification
              </span>
            )}
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Verify medical licenses, council registration numbers, ASHA/ANM IDs, and grant authorized portal access across Alluri Sitharama Raju District.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/map">
            <Button variant="outline" size="sm">
              View Habitation Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <Alert type="success" title="Administrator Action Executed" titleTe="నిర్వాహక చర్య విజయవంతమైంది">
          {toastMessage}
        </Alert>
      )}

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-forest-200">
        <button
          type="button"
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-[2px] ${
            activeTab === 'approvals'
              ? 'border-forest-800 text-forest-950 bg-forest-50/50'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-forest-800" />
          <span>Registration Approvals Desk</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-forest-950">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-[2px] ${
            activeTab === 'directory'
              ? 'border-forest-800 text-forest-950 bg-forest-50/50'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          <Users className="w-4 h-4 text-forest-800" />
          <span>Active Workforce Roster ({staff.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: REGISTRATION APPROVALS & VERIFICATION DESK */}
      {/* ========================================================================= */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          {/* Verification Desk Explanatory Card */}
          <div className="p-3.5 bg-forest-50/60 rounded-2xl border border-forest-200 text-xs text-forest-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-forest-800 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Credential Verification & Role-Based Access Enforcement</p>
              <p className="text-[11px] text-ink-muted">
                Under ITDA Paderu healthcare governance rules, newly registered Doctors, ASHA workers, ANMs, and Hospital Coordinators cannot log in until verified. Ensure that medical council registration numbers match APMC records and that ASHA/ANM IDs correspond to official mandal rosters before clicking <strong>Approve</strong>.
              </p>
            </div>
          </div>

          {/* Verification Filter Toolbar */}
          <Card padding="md" className="border-forest-200 bg-white">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 flex-wrap w-full lg:w-auto">
                <span className="text-[11px] font-bold text-forest-900 mr-1">Status:</span>
                <button
                  type="button"
                  onClick={() => setStatusFilter('PENDING_VERIFICATION')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === 'PENDING_VERIFICATION'
                      ? 'bg-amber-500 text-forest-950 shadow-sm font-bold'
                      : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('APPROVED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === 'APPROVED'
                      ? 'bg-forest-800 text-white shadow-sm'
                      : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
                  }`}
                >
                  Approved
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('REJECTED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === 'REJECTED'
                      ? 'bg-rose-700 text-white shadow-sm'
                      : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
                  }`}
                >
                  Rejected
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('SUSPENDED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === 'SUSPENDED'
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
                  }`}
                >
                  Suspended
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === 'ALL'
                      ? 'bg-forest-800 text-white shadow-sm'
                      : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
                  }`}
                >
                  All ({registeredAccounts.length - 2})
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full lg:w-72">
                <Search className="w-4 h-4 text-forest-800 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, ID, council #, mobile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-forest-200 rounded-lg text-xs bg-forest-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
            </div>
          </Card>

          {/* Registrations Verification Table */}
          <div className="bg-white rounded-2xl border border-forest-200 overflow-hidden shadow-nature">
            {filteredRegistrations.length === 0 ? (
              <div className="p-12 text-center text-xs text-ink-muted space-y-2">
                <CheckCircle2 className="w-8 h-8 text-forest-400 mx-auto" />
                <p className="font-semibold text-ink">No registration accounts matching this status filter.</p>
                <p>New signups submitted via the portal gateway will appear here for administrator verification.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-forest-50/80 border-b border-forest-200 text-forest-900 font-bold">
                    <tr>
                      <th className="p-3.5">Professional Name</th>
                      <th className="p-3.5">Assigned Portal & Role</th>
                      <th className="p-3.5">Credentials & Official ID</th>
                      <th className="p-3.5">Qualifications / Specialty</th>
                      <th className="p-3.5">Facility / Centre</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest-100">
                    {filteredRegistrations.map((u) => {
                      const status: AccountStatus = u.accountStatus || 'APPROVED';
                      const isPending = status === 'PENDING_VERIFICATION';
                      const isApproved = status === 'APPROVED';
                      const isRejected = status === 'REJECTED';
                      const isSuspended = status === 'SUSPENDED';

                      return (
                        <tr key={u.id} className="hover:bg-forest-50/40 transition-colors">
                          <td className="p-3.5 font-medium text-ink">
                            <div className="font-bold text-xs">{u.name}</div>
                            {u.nameTe && <div className="text-[10px] font-telugu text-forest-800">{u.nameTe}</div>}
                            <div className="text-[11px] text-ink-muted flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-forest-700" />
                              <span>{u.phone || 'No phone'}</span>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="font-bold text-forest-950 uppercase text-[11px] block">
                              {u.role === 'doctor' ? 'Doctor Portal' : u.role === 'asha' ? 'ASHA Portal' : u.role === 'anm' ? 'ANM Portal' : u.role === 'hospital_coordinator' ? 'Hospital Portal' : u.roleTitle}
                            </span>
                            <span className="text-[11px] text-ink-muted block">{u.roleTitle}</span>
                          </td>

                          <td className="p-3.5 font-mono text-[11px]">
                            {u.registrationNumber && (
                              <div className="text-emerald-900 font-bold">
                                APMC: {u.registrationNumber}
                              </div>
                            )}
                            {u.ashaId && (
                              <div className="text-forest-900 font-bold">
                                ASHA ID: {u.ashaId}
                              </div>
                            )}
                            {u.anmId && (
                              <div className="text-teal-900 font-bold">
                                ANM ID: {u.anmId}
                              </div>
                            )}
                            {u.doctorId && (
                              <div className="text-blue-900 font-bold">
                                Doc ID: {u.doctorId}
                              </div>
                            )}
                            {u.employeeId && !u.ashaId && !u.anmId && (
                              <div className="text-ink-muted">
                                Emp ID: {u.employeeId}
                              </div>
                            )}
                          </td>

                          <td className="p-3.5 text-xs text-ink">
                            <div>{u.qualification || u.designation || 'Healthcare Staff'}</div>
                            {u.specialization && (
                              <div className="text-[10px] text-ink-muted font-medium">{u.specialization}</div>
                            )}
                          </td>

                          <td className="p-3.5 text-xs text-ink">
                            <div className="font-medium">{u.facility || u.subCentre || 'ASR Health Centre'}</div>
                            <div className="text-[10px] text-ink-muted">{u.district || 'Alluri Sitharama Raju'}</div>
                          </td>

                          <td className="p-3.5">
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                <Clock className="w-3 h-3 text-amber-700" />
                                Pending Verification
                              </span>
                            )}
                            {isApproved && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                Approved
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300" title={u.rejectionReason}>
                                <XCircle className="w-3 h-3 text-rose-700" />
                                Rejected
                              </span>
                            )}
                            {isSuspended && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800 border border-slate-300">
                                <AlertTriangle className="w-3 h-3 text-slate-700" />
                                Suspended
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isPending && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApprove(u)}
                                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm flex items-center gap-1 transition-colors"
                                    title="Approve this professional registration and enable portal login"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenReject(u)}
                                    className="px-2 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                                    title="Reject registration"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}

                              {isApproved && (
                                <button
                                  type="button"
                                  onClick={() => handleSuspend(u)}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 transition-colors"
                                  title="Suspend portal access"
                                >
                                  Suspend
                                </button>
                              )}

                              {(isRejected || isSuspended) && (
                                <button
                                  type="button"
                                  onClick={() => handleApprove(u)}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300 transition-colors"
                                  title="Re-approve and activate account"
                                >
                                  Re-Activate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ACTIVE WORKFORCE ROSTER (PRESERVED DIRECTORY) */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Toolbar: Role Filter & Search */}
          <Card padding="md" className="border-forest-200 bg-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setRoleFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    roleFilter === 'ALL'
                      ? 'bg-forest-800 text-white shadow-sm'
                      : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
                  }`}
                >
                  All Roles ({staff.length})
                </button>
                <button
                  type="button"
                  onClick={() => setRoleFilter('health_worker')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    roleFilter === 'health_worker'
                      ? 'bg-forest-800 text-white shadow-sm'
                      : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
                  }`}
                >
                  ASHA / ANMs
                </button>
                <button
                  type="button"
                  onClick={() => setRoleFilter('doctor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    roleFilter === 'doctor'
                      ? 'bg-forest-800 text-white shadow-sm'
                      : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
                  }`}
                >
                  Medical Officers
                </button>
                <button
                  type="button"
                  onClick={() => setRoleFilter('specialist')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    roleFilter === 'specialist'
                      ? 'bg-forest-800 text-white shadow-sm'
                      : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
                  }`}
                >
                  Specialist Surgeons
                </button>
                <button
                  type="button"
                  onClick={() => setRoleFilter('hospital_coordinator')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    roleFilter === 'hospital_coordinator'
                      ? 'bg-forest-800 text-white shadow-sm'
                      : 'bg-forest-50 text-forest-900 hover:bg-forest-100'
                  }`}
                >
                  Patient Navigators
                </button>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-1.5 bg-forest-50 px-3 py-1.5 rounded-xl border border-forest-200">
                  <MapPin className="w-3.5 h-3.5 text-forest-800 shrink-0" />
                  <select
                    value={mandalFilter}
                    onChange={(e) => setMandalFilter(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-forest-950 focus:outline-none max-w-[170px] truncate"
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

                <div className="relative w-full md:w-60">
                  <Search className="w-4 h-4 text-forest-800 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search staff, mandal, village..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-forest-200 rounded-lg text-xs bg-forest-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-forest-200 overflow-hidden shadow-nature">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-forest-50/80 border-b border-forest-200 text-forest-900 font-bold">
                  <tr>
                    <th className="p-3.5">Healthcare Personnel</th>
                    <th className="p-3.5">Mandal & Catchment</th>
                    <th className="p-3.5">Assigned Habitations / Wards</th>
                    <th className="p-3.5 text-center">Screenings Done</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-100">
                  {filteredStaff.map((member) => (
                    <tr key={member.id} className="hover:bg-forest-50/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-ink">{member.name}</div>
                        <div className="text-[11px] text-ink-muted">{member.title}</div>
                        <div className="text-[10px] text-forest-800 font-mono mt-0.5">{member.contactNumber}</div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-semibold text-forest-900 block">{member.mandal}</span>
                        <span className="text-[10px] text-ink-muted">{member.facility}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="text-xs text-ink font-medium line-clamp-2">{member.assignedAreas}</span>
                      </td>

                      <td className="p-3.5 text-center font-bold text-forest-900 font-mono">
                        {member.performanceCount}
                      </td>

                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          Active
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStaff(member);
                            const gps = getPanchayatsForMandal(member.mandal);
                            const firstGp = gps.length > 0 ? gps[0].nameEn : '';
                            if (firstGp) {
                              setSelectedPanchayat(firstGp);
                              const vils = getVillagesForPanchayat(firstGp, member.mandal);
                              if (vils.length > 0) setNewVillage(vils[0].nameEn);
                            }
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-forest-800 bg-forest-50 border border-forest-200 rounded-lg hover:bg-forest-100 transition-colors"
                        >
                          Assign Habitation
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REJECTION REASON MODAL */}
      {/* ========================================================================= */}
      {rejectingUser && (
        <Modal
          isOpen={!!rejectingUser}
          onClose={() => setRejectingUser(null)}
          title={`Reject Registration: ${rejectingUser.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
            <p className="text-ink-muted">
              Specify the administrative reason for rejecting this professional registration. The applicant will receive this explanation when attempting to access the portal.
            </p>

            <div className="space-y-1">
              <label className="block font-bold text-ink">Rejection Reason *</label>
              <textarea
                required
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2.5 border border-forest-200 rounded-xl text-xs bg-forest-50/30 text-ink focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setRejectingUser(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="danger" size="sm" icon={XCircle}>
                Confirm Rejection
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* HABITATION ALLOCATION MODAL (PRESERVED) */}
      {/* ========================================================================= */}
      <Modal
        isOpen={!!selectedStaff}
        onClose={() => setSelectedStaff(null)}
        title={`Territory Allocation: ${selectedStaff?.name || ''}`}
        maxWidth="md"
      >
        {selectedStaff && (
          <form onSubmit={handleAssignVillage} className="space-y-4 text-xs">
            <div>
              <span className="font-semibold text-ink">Designation:</span> {selectedStaff.title}
            </div>

            {getPanchayatsForMandal(selectedStaff.mandal).length > 0 && (
              <div>
                <label className="block font-bold text-ink mb-1">
                  Filter by Gram Panchayat:
                </label>
                <select
                  value={selectedPanchayat}
                  onChange={(e) => {
                    const nextGp = e.target.value;
                    setSelectedPanchayat(nextGp);
                    const vils = getVillagesForPanchayat(nextGp, selectedStaff.mandal);
                    if (vils.length > 0) setNewVillage(vils[0].nameEn);
                  }}
                  className="w-full p-2.5 border border-forest-300 rounded-lg text-xs font-semibold bg-white"
                >
                  {getPanchayatsForMandal(selectedStaff.mandal).map((gp, idx) => (
                    <option key={gp.nameEn} value={gp.nameEn}>
                      {idx + 1}. {gp.nameEn} GP ({gp.nameTe})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block font-bold text-ink mb-1">
                Assigned Village / Habitation Name *
              </label>
              <input
                type="text"
                required
                value={newVillage}
                onChange={(e) => setNewVillage(e.target.value)}
                placeholder="Write village name (e.g. Kothapalli)"
                className="w-full p-2.5 border border-forest-300 rounded-lg text-xs font-semibold bg-white text-ink focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
              {(() => {
                const vils = getVillagesForPanchayat(selectedPanchayat, selectedStaff.mandal);
                const displayList = vils.length > 0 ? vils : getHabitationsForMandal(selectedStaff.mandal);
                if (displayList.length === 0) return null;
                return (
                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] text-ink-muted block font-medium">
                      Quick fill from {selectedPanchayat || selectedStaff.mandal} (click to write in blank):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {displayList.slice(0, 6).map((h) => (
                        <button
                          key={h.nameEn}
                          type="button"
                          onClick={() => setNewVillage(h.nameEn)}
                          className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                            newVillage.toLowerCase() === h.nameEn.toLowerCase()
                              ? 'bg-forest-900 text-white border-forest-900 font-bold shadow-sm'
                              : 'bg-forest-50 hover:bg-forest-100 text-forest-900 border-forest-200'
                          }`}
                        >
                          {h.nameEn} ({h.nameTe})
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => setSelectedStaff(null)}
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
                Confirm Allocation
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
