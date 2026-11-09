import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Camera,
  Signal,
  CheckCircle2,
  FileText,
  User,
  Stethoscope,
  Send,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { useTranslation } from '../../i18n';

export const DoctorTelemedicinePage: React.FC = () => {
  const { language } = useTranslation();

  // Call state
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeStream, setActiveStream] = useState<'patient_face' | 'macro_oral'>('macro_oral');
  const [callEnded, setCallEnded] = useState(false);

  // Live Clinical Scratchpad
  const [liveNotes, setLiveNotes] = useState(
    'Real-time Teleconsultation Note:\nPatient Kondala Rao examined via ASHA worker Lakshmi Devi\'s phone in Kothapalli. Direct visual inspection confirms persistent leukoplakia of right buccal mucosa. Spontaneous bleeding absent. Oral hygiene instructions reinforced. Patient instructed to avoid lime/chuna application.'
  );
  const [urgentReferralDispatched, setUrgentReferralDispatched] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-forest-100">
        <div>
          <div className="flex items-center gap-2 text-xs text-forest-800 mb-1">
            <Link to="/doctor" className="hover:underline">Clinical Workstation</Link>
            <span>/</span>
            <Link to="/doctor/cases" className="hover:underline">Case Review Queue</Link>
            <span>/</span>
            <span className="text-forest-950 font-semibold">Telemedicine Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-ink flex items-center gap-2">
            Telemedicine Consultation Suite
            <Badge label="ACTIVE ENCRYPTED SESSION" variant="success" size="sm" />
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Bilingual virtual clinical consultation connecting PHC G. Madugula with remote frontline health workers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/doctor/cases/SCR-2026-0042">
            <Button variant="outline" size="sm">
              View Case Records
            </Button>
          </Link>
        </div>
      </div>

      {callEnded ? (
        /* Call Summary Card if Ended */
        <Card padding="lg" className="border-forest-200 bg-white text-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink">
              Telemedicine Consultation Concluded
            </h2>
            <p className="text-xs text-ink-muted mt-1 max-w-md mx-auto">
              Call duration: 14 minutes, 22 seconds. Teleconsultation summary and clinical instructions have been synced to Kothapalli health worker tablet.
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Button variant="primary" size="md" onClick={() => setCallEnded(false)}>
              Restart Call Session
            </Button>
            <Link to="/doctor/cases">
              <Button variant="outline" size="md">
                Return to Review Queue
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        /* Active Video Call Interface */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Video Screen */}
          <div className="lg:col-span-8 space-y-3">
            <Card padding="none" className="border-forest-900 bg-forest-950 overflow-hidden shadow-2xl relative">
              
              {/* Telehealth Status Header Overlay */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold">Kondala Rao (46M)</span>
                  <span className="text-forest-300">•</span>
                  <span className="text-forest-200 text-[11px]">Kothapalli Habitation</span>
                </div>

                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-[11px] font-mono flex items-center gap-2">
                  <Signal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ASR-Rural-4G (720p @ 30fps)</span>
                  <Lock className="w-3 h-3 text-emerald-400 ml-1" />
                </div>
              </div>

              {/* Main Remote Video Stream Viewport */}
              <div className="relative aspect-16/10 flex items-center justify-center bg-forest-900">
                {activeStream === 'macro_oral' ? (
                  <img
                    src="/images/sample_oral_patch.jpg"
                    alt="Oral Lesion Macro Stream"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-white text-center space-y-2 bg-gradient-to-b from-forest-800 to-forest-950">
                    <User className="w-20 h-20 text-forest-300 mx-auto" />
                    <h3 className="text-base font-bold">Front-Facing Camera: Patient Video</h3>
                    <p className="text-xs text-forest-200">Patient seated with ASHA worker Lakshmi Devi.</p>
                  </div>
                )}

                {/* Macro Stream Indicator Overlay */}
                <div className="absolute top-16 left-4 bg-emerald-950/80 border border-emerald-400 text-emerald-300 px-2.5 py-1 rounded text-[10px] font-mono uppercase">
                  Feed: {activeStream === 'macro_oral' ? 'High-Res Oral Camera View' : 'Face Overview'}
                </div>

                {/* Self-View Picture-in-Picture (Doctor Suresh) */}
                <div className="absolute bottom-4 right-4 w-32 sm:w-44 aspect-4/3 rounded-xl overflow-hidden border-2 border-forest-600 bg-forest-950 shadow-2xl z-20">
                  {isVideoOff ? (
                    <div className="w-full h-full flex items-center justify-center text-forest-400 text-xs bg-forest-900">
                      Camera Off
                    </div>
                  ) : (
                    <div className="w-full h-full bg-forest-800 flex flex-col items-center justify-center text-white text-center p-2">
                      <Stethoscope className="w-8 h-8 text-emerald-400 mb-1" />
                      <span className="text-[10px] font-bold">Dr. K. Suresh</span>
                      <span className="text-[9px] text-forest-200">PHC Medical Officer</span>
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1.5 bg-black/60 px-1 rounded text-[8px] text-white font-mono">
                    You
                  </div>
                </div>
              </div>

              {/* Video Call Controls Toolbar */}
              <div className="p-4 bg-forest-900 border-t border-forest-800 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant={isMicMuted ? 'danger' : 'outline'}
                    size="sm"
                    icon={isMicMuted ? MicOff : Mic}
                    onClick={() => setIsMicMuted(!isMicMuted)}
                  >
                    {isMicMuted ? 'Unmute' : 'Mute'}
                  </Button>

                  <Button
                    variant={isVideoOff ? 'danger' : 'outline'}
                    size="sm"
                    icon={isVideoOff ? VideoOff : Video}
                    onClick={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? 'Start Video' : 'Stop Video'}
                  </Button>
                </div>

                {/* Stream Switcher */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveStream(activeStream === 'macro_oral' ? 'patient_face' : 'macro_oral')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-forest-800 text-white border border-forest-600 hover:bg-forest-700 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Switch to {activeStream === 'macro_oral' ? 'Face Camera' : 'Oral Camera'}</span>
                  </button>

                  <Button
                    variant="danger"
                    size="sm"
                    icon={PhoneOff}
                    onClick={() => setCallEnded(true)}
                  >
                    End Call
                  </Button>
                </div>
              </div>

            </Card>

            <Alert 
              type="info" 
              title="Encrypted Consultation Link" 
              titleTe="సురక్షిత వీడియో సంప్రదింపు"
            >
              Simulated encrypted WebRTC telemedicine link. Audio, video, and screen-sharing run locally inside your browser demo sandbox.
            </Alert>
          </div>

          {/* Right Column: Live Clinical Scratchpad */}
          <div className="lg:col-span-4 space-y-4">
            <Card padding="md" className="border-forest-200 bg-white space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-forest-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-forest-800" />
                  <h3 className="text-sm font-bold text-ink">
                    Live Teleconsultation Notes
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Auto-Saving
                </span>
              </div>

              <textarea
                rows={7}
                value={liveNotes}
                onChange={(e) => setLiveNotes(e.target.value)}
                className="w-full p-2.5 border border-forest-300 rounded-lg text-xs leading-relaxed text-ink focus:outline-none focus:ring-2 focus:ring-forest-500 font-sans"
                placeholder="Type synchronous clinical observations and advice..."
              />

              {/* Direct Emergency Action */}
              <div className="space-y-2 pt-2 border-t border-forest-100">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-forest-800">
                  Direct In-Call Action
                </span>

                {urgentReferralDispatched ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-950 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Emergency Priority Referral Dispatched to District Hospital Paderu.</span>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Send}
                    fullWidth
                    onClick={() => setUrgentReferralDispatched(true)}
                  >
                    Dispatch Emergency Hospital Referral
                  </Button>
                )}

                <Link to="/doctor/cases/SCR-2026-0042" className="block">
                  <Button variant="outline" size="sm" fullWidth icon={ArrowRight} iconPosition="right">
                    Open Full Assessment Form
                  </Button>
                </Link>
              </div>

            </Card>

            {/* Patient Context Quick Card */}
            <Card padding="md" className="border-forest-200 bg-forest-50/50 space-y-2 text-xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
                Patient Quick Reference
              </span>
              <div className="space-y-1 text-ink">
                <p><strong>Name:</strong> Kondala Rao (46M)</p>
                {language === 'te' && <p className="font-telugu"><strong>పేరు:</strong> కొండల రావు</p>}
                <p><strong>Habitation:</strong> Kothapalli, G. Madugula</p>
                <p><strong>History:</strong> 22-year gutkha chewing</p>
                <p><strong>Health Card:</strong> ASR-CRD-2026-0842</p>
              </div>
            </Card>
          </div>

        </div>
      )}

    </div>
  );
};
