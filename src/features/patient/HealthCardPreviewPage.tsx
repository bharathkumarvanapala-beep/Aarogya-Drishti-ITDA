import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Printer, 
  RotateCw, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/common/Alert';
import { INITIAL_HEALTH_CARD } from './patientData';
import type { HealthCard } from '../../types';

export const HealthCardPreviewPage: React.FC = () => {
  const location = useLocation();
  const navPatient = (location.state as any)?.patient;

  const resolveInitialCard = (): HealthCard => {
    let p = navPatient;
    if (!p) {
      try {
        const stored = sessionStorage.getItem('active_screening_patient');
        if (stored) p = JSON.parse(stored);
      } catch (e) {}
    }
    if (p) {
      const name = p.fullName || `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.name || 'Registered Citizen';
      const pid = p.uniquePatientId || p.id || INITIAL_HEALTH_CARD.patientId;
      const serial = p.cardSerial || `ASR-CRD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        ...INITIAL_HEALTH_CARD,
        patientId: pid,
        patientName: name,
        patientNameTe: p.firstNameTe ? `${p.firstNameTe} ${p.lastNameTe || ''}`.trim() : (p.nameTe || name),
        age: p.age || 40,
        gender: typeof p.gender === 'string' ? (p.gender.toLowerCase() as any) : 'male',
        cardSerial: serial,
        habitation: p.village || p.habitation || INITIAL_HEALTH_CARD.habitation,
        mandal: p.mandal || INITIAL_HEALTH_CARD.mandal,
        qrReferenceCode: `AAROGYA-DRISHTI://CARD-REF/${pid}/VERIFY`,
      };
    }
    return INITIAL_HEALTH_CARD;
  };

  const [isFlipped, setIsFlipped] = useState(false);
  const [cardData, setCardData] = useState<HealthCard>(resolveInitialCard);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [replacementReason, setReplacementReason] = useState('lost');
  const [replacementSuccess, setReplacementSuccess] = useState(false);
  const [verifierName, setVerifierName] = useState('Lakshmi Devi (ASHA)');

  const handlePrint = () => {
    window.print();
  };

  const handleReplaceCard = () => {
    // Generate new card serial while preserving medical patient ID
    const newSerial = `ASR-CRD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setCardData({
      ...cardData,
      cardSerial: newSerial,
      issuedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      issuedBy: verifierName,
      status: 'ACTIVE',
    });
    setReplacementSuccess(true);
    setTimeout(() => {
      setShowReplaceModal(false);
      setReplacementSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Action Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-white font-mono">
              Physical Health Credential
            </span>
            <span className="text-xs text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full font-semibold">
              Permanent Token
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            Printable Patient Health Card
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            Durable double-sided physical card equipped with non-sensitive reference QR code for offline tribal continuity.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="md" 
            icon={RotateCw} 
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {isFlipped ? 'View Front Side' : 'View Back Side'}
          </Button>

          <Button 
            variant="primary" 
            size="md" 
            icon={Printer} 
            onClick={handlePrint}
          >
            Print Health Card
          </Button>

          <Button 
            variant="secondary" 
            size="md" 
            icon={RefreshCw} 
            onClick={() => setShowReplaceModal(true)}
          >
            Re-issue Lost Card
          </Button>
        </div>
      </div>

      {/* Non-Sensitive Security Notice */}
      <Alert 
        type="info" 
        title="Privacy & Non-Sensitive QR Code Protection" 
        titleTe="గోప్యతా భద్రత మరియు క్యూఆర్ కోడ్ విధానం"
        className="print:hidden"
      >
        <p>
          The QR code printed on this card contains <strong>only</strong> a cryptographically isolated reference token (<code>ASR-PAT-2026-0842</code>). It contains <strong>zero</strong> clinical disease labels, cancer diagnoses, or personal Aadhaar numbers. Scanning the card by authorized medical officers pulls clinical records securely from the healthcare server or verified local offline registry.
        </p>
      </Alert>

      {/* Physical Card Container (Screen & Print Optimized) */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-full max-w-xl mx-auto space-y-6">

          {/* FRONT OF CARD */}
          <div 
            className={`w-full rounded-3xl overflow-hidden border-2 border-forest-800 bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 text-white shadow-nature-xl transition-all duration-300 relative print:border-black print:text-black print:bg-white print:shadow-none ${
              isFlipped ? 'hidden' : 'block'
            }`}
            style={{ aspectRatio: '1.586 / 1' }} // Standard ID card ratio (CR80)
          >
            {/* Front Header */}
            <div className="p-4 sm:p-5 bg-white/10 backdrop-blur-sm border-b border-white/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-forest-900 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="w-5 h-5" fill="none">
                    <path d="M20 7C14 7 10 12 10 18C10 25 15 31 19 33.5C19.6 33.8 20.4 33.8 21 33.5C25 31 30 25 30 18C30 12 26 7 20 7Z" fill="#E8F5EF" stroke="#075B4D" strokeWidth="2.5" />
                    <path d="M15 20C17 23 23 23 25 20" stroke="#075B4D" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight uppercase leading-tight text-white print:text-black">
                    AAROGYA DRISHTI • ఆరోగ్య దృష్టి
                  </h3>
                  <span className="text-[10px] text-emerald-300 font-mono tracking-wider block print:text-gray-700">
                    GOVERNMENT OF ANDHRA PRADESH • ITDA PADERU
                  </span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 print:border-black print:text-black">
                {cardData.status}
              </span>
            </div>

            {/* Front Body */}
            <div className="p-4 sm:p-6 flex items-start justify-between gap-4">
              
              {/* Left Profile Info */}
              <div className="space-y-3 flex-1 min-w-0">
                <div>
                  <span className="text-[10px] font-mono uppercase text-forest-200 tracking-wider block print:text-gray-600">
                    Citizen Name / పౌరుడి పేరు
                  </span>
                  <h2 className="text-lg sm:text-2xl font-extrabold text-white truncate print:text-black">
                    {cardData.patientName} ({cardData.patientNameTe})
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[9px] uppercase font-mono text-forest-200 block print:text-gray-600">Age / Sex</span>
                    <span className="font-bold text-white print:text-black">{cardData.age} Yrs / {cardData.gender.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-mono text-forest-200 block print:text-gray-600">Habitation / గ్రామము</span>
                    <span className="font-bold text-white truncate block print:text-black">{cardData.habitation}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-mono text-forest-200 block print:text-gray-600">Mandal & District</span>
                    <span className="font-bold text-white truncate block print:text-black">{cardData.mandal}, ASR Dist</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-mono text-forest-200 block print:text-gray-600">Assigned ASHA</span>
                    <span className="font-bold text-white truncate block print:text-black">{cardData.issuedBy}</span>
                  </div>
                </div>

                {/* Unique ID Highlight */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-mono text-forest-200 block print:text-gray-600">Unique Patient ID</span>
                    <span className="font-mono text-xs sm:text-sm font-extrabold text-emerald-300 tracking-wider print:text-black">
                      {cardData.patientId}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-mono text-forest-200 block print:text-gray-600">Card Serial</span>
                    <span className="font-mono text-[11px] text-white/80 print:text-black">
                      {cardData.cardSerial}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: QR Code Simulation */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white p-2 rounded-2xl shadow-md border border-white/20 flex flex-col items-center justify-center">
                  {/* High Quality SVG QR Code Representation */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-forest-950">
                    <rect width="100" height="100" fill="white" />
                    {/* Corner 1 */}
                    <rect x="10" y="10" width="24" height="24" fill="#075B4D" />
                    <rect x="14" y="14" width="16" height="16" fill="white" />
                    <rect x="18" y="18" width="8" height="8" fill="#075B4D" />
                    {/* Corner 2 */}
                    <rect x="66" y="10" width="24" height="24" fill="#075B4D" />
                    <rect x="70" y="14" width="16" height="16" fill="white" />
                    <rect x="74" y="18" width="8" height="8" fill="#075B4D" />
                    {/* Corner 3 */}
                    <rect x="10" y="66" width="24" height="24" fill="#075B4D" />
                    <rect x="14" y="70" width="16" height="16" fill="white" />
                    <rect x="18" y="74" width="8" height="8" fill="#075B4D" />
                    {/* Data grid patterns */}
                    <rect x="42" y="14" width="6" height="6" fill="#075B4D" />
                    <rect x="52" y="14" width="6" height="6" fill="#075B4D" />
                    <rect x="42" y="24" width="6" height="6" fill="#075B4D" />
                    <rect x="48" y="32" width="6" height="6" fill="#075B4D" />
                    <rect x="14" y="44" width="6" height="6" fill="#075B4D" />
                    <rect x="24" y="48" width="6" height="6" fill="#075B4D" />
                    <rect x="36" y="44" width="6" height="6" fill="#075B4D" />
                    <rect x="46" y="46" width="8" height="8" fill="#075B4D" />
                    <rect x="60" y="44" width="6" height="6" fill="#075B4D" />
                    <rect x="72" y="44" width="6" height="6" fill="#075B4D" />
                    <rect x="80" y="52" width="6" height="6" fill="#075B4D" />
                    <rect x="42" y="66" width="6" height="6" fill="#075B4D" />
                    <rect x="52" y="72" width="6" height="6" fill="#075B4D" />
                    <rect x="66" y="68" width="6" height="6" fill="#075B4D" />
                    <rect x="78" y="74" width="6" height="6" fill="#075B4D" />
                    <rect x="82" y="82" width="6" height="6" fill="#075B4D" />
                  </svg>
                </div>
                <span className="text-[8px] font-mono uppercase tracking-wider text-forest-200 mt-1.5 print:text-gray-600">
                  SCAN FOR CLINICAL CARE
                </span>
              </div>
            </div>

            {/* Front Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-forest-950/60 border-t border-white/10 flex items-center justify-between text-[10px] text-forest-200 font-mono print:border-black print:text-black">
              <span>FACILITY: {cardData.facility}</span>
              <span>ISSUED: {cardData.issuedAt}</span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div 
            className={`w-full rounded-3xl overflow-hidden border-2 border-forest-800 bg-white text-ink shadow-nature-xl transition-all duration-300 relative print:border-black print:shadow-none ${
              isFlipped ? 'block' : 'hidden'
            }`}
            style={{ aspectRatio: '1.586 / 1' }}
          >
            {/* Back Header */}
            <div className="p-3.5 bg-forest-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  EMERGENCY & CLINICAL INSTRUCTIONS • అత్యవసర సూచనలు
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 font-bold">
                100% FREE CARE
              </span>
            </div>

            {/* Back Content */}
            <div className="p-4 sm:p-5 space-y-3">
              {/* 5 Cardinal Warning Signs Box */}
              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950">
                <span className="font-bold block text-[11px] text-amber-900 uppercase tracking-wider font-mono">
                  5 Cardinal Signs to Report Immediately (5 ప్రమాద సంకేతాలు):
                </span>
                <ul className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1 text-[10px] leading-tight font-medium list-disc list-inside">
                  <li>White/Red patch &gt; 3 weeks (తెల్లటి/ఎర్రటి మచ్చ)</li>
                  <li>Non-healing mouth ulcer (మానని పుండు)</li>
                  <li>Mouth opening difficulty (నోరు తెరవలేకపోవడం)</li>
                  <li>Lump in neck/cheek (మెడలో గడ్డ)</li>
                </ul>
              </div>

              {/* Instructions for Clinicians */}
              <div className="text-[10px] text-ink-muted leading-relaxed">
                <strong className="text-ink font-semibold">For PHC Doctors & Hospital Coordinators:</strong> Present this physical card to access the verified clinical screening history, high-resolution photographs, and specialist referral notes in Aarogya Drishti Portal.
              </div>

              {/* Free Government Helplines */}
              <div className="pt-2 border-t border-forest-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-1.5 rounded-lg bg-forest-50 border border-forest-100">
                  <span className="text-[9px] text-ink-muted block uppercase font-mono">Health Info</span>
                  <span className="font-bold font-mono text-forest-900">104</span>
                </div>
                <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-100">
                  <span className="text-[9px] text-rose-800 block uppercase font-mono">Ambulance</span>
                  <span className="font-bold font-mono text-rose-900">108</span>
                </div>
                <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-100">
                  <span className="text-[9px] text-blue-800 block uppercase font-mono">ITDA Paderu</span>
                  <span className="font-bold font-mono text-blue-900">08935-250000</span>
                </div>
              </div>
            </div>

            {/* Back Footer */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-1.5 bg-forest-50 border-t border-forest-100 flex items-center justify-between text-[9px] text-ink-muted font-mono">
              <span>Card Reference: {cardData.cardSerial}</span>
              <span>Alluri Sitharama Raju District • ITDA Paderu</span>
            </div>
          </div>

          {/* Toggle Instructions */}
          <div className="text-center print:hidden">
            <button 
              onClick={() => setIsFlipped(!isFlipped)}
              className="text-xs font-bold text-forest-900 hover:text-forest-700 hover:underline inline-flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isFlipped ? 'Click to Flip to Front of Card' : 'Click to Flip to Back of Card'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Lost Card Replacement Modal */}
      <Modal
        isOpen={showReplaceModal}
        onClose={() => setShowReplaceModal(false)}
        title="Re-issue Lost Physical Health Card"
        titleTe="పోగొట్టుకున్న హెల్త్ కార్డు పునరుద్ధరణ"
        maxWidth="md"
      >
        <div className="space-y-4">
          <Alert type="warning" title="Identity Verification Required" titleTe="గుర్తింపు ధృవీకరణ అవసరం">
            <p>
              Re-issuing a physical health card will invalidate the old physical card serial while keeping all clinical screening and referral records completely intact.
            </p>
          </Alert>

          {replacementSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-950">New Health Card Re-Issued!</h4>
              <p className="text-xs text-emerald-900">
                New Serial: <strong>{cardData.cardSerial}</strong> • Replaced on {cardData.issuedAt}.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">
                    Reason for Replacement
                  </label>
                  <select 
                    value={replacementReason}
                    onChange={(e) => setReplacementReason(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700"
                  >
                    <option value="lost">Lost / Misplaced by Citizen</option>
                    <option value="damaged">Damaged / Worn Out</option>
                    <option value="address_update">Habitation / Village Update</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">
                    Verified Frontline Personnel
                  </label>
                  <input 
                    type="text"
                    value={verifierName}
                    onChange={(e) => setVerifierName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-forest-200 bg-white text-ink focus:outline-none focus:border-forest-700"
                  />
                  <span className="text-[11px] text-ink-muted mt-1 block">
                    Health Worker or Hospital Navigator confirming patient identity.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-forest-100">
                <Button variant="outline" size="sm" onClick={() => setShowReplaceModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleReplaceCard} icon={RefreshCw}>
                  Confirm & Re-issue
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
