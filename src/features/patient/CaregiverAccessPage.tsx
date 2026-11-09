import React, { useState } from 'react';
import { 
  UserPlus, 
  Phone, 
  Trash2, 
  Eye, 
  MessageSquare, 
  Ambulance 
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog';
import { Alert } from '../../components/common/Alert';
import { INITIAL_CAREGIVERS } from './patientData';
import type { Caregiver } from '../../types';

export const CaregiverAccessPage: React.FC = () => {
  const [caregivers, setCaregivers] = useState<Caregiver[]>(INITIAL_CAREGIVERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [caregiverToRevoke, setCaregiverToRevoke] = useState<Caregiver | null>(null);

  // New Caregiver Form State
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('Son');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [canViewRecords, setCanViewRecords] = useState(true);
  const [canReceiveSms, setCanReceiveSms] = useState(true);
  const [canAssistHospital, setCanAssistHospital] = useState(true);
  const [consentConfirmed, setConsentConfirmed] = useState(false);

  const handleAddCaregiver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !consentConfirmed) return;

    const newCaregiver: Caregiver = {
      id: `CG-${Date.now().toString().slice(-4)}`,
      patientId: 'ASR-PAT-2026-0842',
      fullName,
      fullNameTe: fullName,
      relationship,
      relationshipTe: relationship,
      phoneNumber,
      canViewRecords,
      canReceiveSms,
      canAssistHospital,
      authorizedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'ACTIVE',
    };

    setCaregivers([...caregivers, newCaregiver]);
    setShowAddModal(false);
    // Reset form
    setFullName('');
    setPhoneNumber('');
    setConsentConfirmed(false);
  };

  const handleConfirmRevoke = () => {
    if (!caregiverToRevoke) return;
    setCaregivers(
      caregivers.map((cg: Caregiver) =>
        cg.id === caregiverToRevoke.id ? { ...cg, status: 'REVOKED' } : cg
      )
    );
    setCaregiverToRevoke(null);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
              Caregiver Governance
            </span>
            <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
              Kondala Rao (46M)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            Family Caregiver Access & Permissions
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Authorize trusted family members to receive SMS appointment alerts and assist during hospital referrals.
          </p>
        </div>

        <Button 
          variant="primary" 
          size="md" 
          icon={UserPlus} 
          onClick={() => setShowAddModal(true)}
        >
          Authorize New Caregiver
        </Button>
      </div>

      {/* Privacy Notice */}
      <Alert type="info" title="Patient Autonomy & Revocation Guarantee" titleTe="రోగి గోప్యత మరియు రద్దు హక్కు">
        <p>
          In accordance with Indian Digital Personal Data Protection (DPDP) principles, all caregiver authorizations require patient verbal or witnessed consent. The patient or health worker can instantly revoke caregiver access at any time.
        </p>
      </Alert>

      {/* Caregivers List */}
      <div className="space-y-4">
        {caregivers.map((cg: Caregiver) => {
          const isRevoked = cg.status === 'REVOKED';

          return (
            <Card 
              key={cg.id} 
              variant="default" 
              padding="lg" 
              className={`border-forest-100 transition-colors ${isRevoked ? 'opacity-60 bg-forest-50/30' : 'hover:border-forest-300'}`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs font-bold text-forest-900 bg-forest-100 px-2.5 py-0.5 rounded">
                      {cg.id}
                    </span>
                    <span 
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider ${
                        isRevoked ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {cg.status}
                    </span>
                    <span className="text-xs text-ink-muted font-mono">
                      Authorized: {cg.authorizedAt}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                      <span>{cg.fullName}</span>
                      <span className="text-xs font-telugu text-forest-800 font-normal">
                        ({cg.relationship})
                      </span>
                    </h3>
                    <p className="text-xs text-ink-muted flex items-center gap-1.5 mt-0.5 font-mono">
                      <Phone className="w-3.5 h-3.5 text-forest-800" />
                      <span>{cg.phoneNumber}</span>
                    </p>
                  </div>

                  {/* Permissions Badges */}
                  <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${cg.canViewRecords ? 'bg-forest-100 text-forest-900 font-semibold' : 'bg-gray-100 text-gray-400 line-through'}`}>
                      <Eye className="w-3 h-3" />
                      <span>View Records</span>
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${cg.canReceiveSms ? 'bg-forest-100 text-forest-900 font-semibold' : 'bg-gray-100 text-gray-400 line-through'}`}>
                      <MessageSquare className="w-3 h-3" />
                      <span>SMS Alerts</span>
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${cg.canAssistHospital ? 'bg-forest-100 text-forest-900 font-semibold' : 'bg-gray-100 text-gray-400 line-through'}`}>
                      <Ambulance className="w-3 h-3" />
                      <span>Hospital Navigator Contact</span>
                    </span>
                  </div>
                </div>

                {/* Revoke Action */}
                <div className="shrink-0">
                  {isRevoked ? (
                    <span className="text-xs font-mono font-bold text-rose-800 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                      Access Terminated
                    </span>
                  ) : (
                    <Button 
                      variant="danger" 
                      size="sm" 
                      icon={Trash2} 
                      onClick={() => setCaregiverToRevoke(cg)}
                    >
                      Revoke Access
                    </Button>
                  )}
                </div>

              </div>
            </Card>
          );
        })}
      </div>

      {/* Authorize New Caregiver Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Authorize Family Caregiver"
        titleTe="కుటుంబ సంరక్షకునికి అనుమతి మంజూరు"
        maxWidth="md"
      >
        <form onSubmit={handleAddCaregiver} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Caregiver Full Name (కుటుంబ సభ్యుని పేరు) *
              </label>
              <input 
                type="text"
                required
                placeholder="e.g., Somulu Rao"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Relationship (సంబంధం) *
                </label>
                <select 
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700"
                >
                  <option value="Son">Son (కుమారుడు)</option>
                  <option value="Daughter">Daughter (కుమార్తె)</option>
                  <option value="Spouse">Spouse (భార్య/భర్త)</option>
                  <option value="Sibling">Brother / Sister (తోబుట్టువు)</option>
                  <option value="Grandchild">Grandchild (మనవడు/మనవరాలు)</option>
                  <option value="Community Guardian">Community Guardian (సంరక్షకుడు)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  Mobile Number (ఫోన్ నంబర్) *
                </label>
                <input 
                  type="tel"
                  required
                  placeholder="+91 98480 00000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700"
                />
              </div>
            </div>

            {/* Permission Checkboxes */}
            <div className="p-3 rounded-xl bg-forest-50 border border-forest-100 space-y-2">
              <span className="text-xs font-bold text-ink block font-mono uppercase">
                Granted Care Permissions:
              </span>
              <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
                <input 
                  type="checkbox"
                  checked={canReceiveSms}
                  onChange={(e) => setCanReceiveSms(e.target.checked)}
                  className="rounded text-forest-800 focus:ring-forest-700"
                />
                <span>Receive SMS appointment reminders for District Hospital Paderu</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
                <input 
                  type="checkbox"
                  checked={canViewRecords}
                  onChange={(e) => setCanViewRecords(e.target.checked)}
                  className="rounded text-forest-800 focus:ring-forest-700"
                />
                <span>View screening history in the Family Portal</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
                <input 
                  type="checkbox"
                  checked={canAssistHospital}
                  onChange={(e) => setCanAssistHospital(e.target.checked)}
                  className="rounded text-forest-800 focus:ring-forest-700"
                />
                <span>Permit Hospital Navigators to call this number for transport coordination</span>
              </label>
            </div>

            {/* Verbal Consent Gate */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <label className="flex items-start gap-2.5 text-xs text-amber-950 font-medium cursor-pointer">
                <input 
                  type="checkbox"
                  required
                  checked={consentConfirmed}
                  onChange={(e) => setConsentConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-amber-800 focus:ring-amber-700"
                />
                <span>
                  <strong>Verbal Consent Confirmation:</strong> I confirm that the patient (Kondala Rao) has been clearly informed in Telugu and verbally consented to granting these care permissions.
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-forest-100">
            <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={!consentConfirmed}>
              Authorize Caregiver
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog for Revocation */}
      <ConfirmationDialog
        isOpen={!!caregiverToRevoke}
        onClose={() => setCaregiverToRevoke(null)}
        onConfirm={handleConfirmRevoke}
        title="Revoke Caregiver Permission?"
        titleTe="సంరక్షకునికి అనుమతి రద్దు చేయాలా?"
        message={`Are you sure you want to revoke care access for ${caregiverToRevoke?.fullName}? They will immediately cease receiving appointment SMS alerts and hospital transport updates.`}
        confirmText="Revoke Access Immediately"
        variant="danger"
      />
    </div>
  );
};
