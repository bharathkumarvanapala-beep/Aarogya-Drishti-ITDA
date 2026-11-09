import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Info
} from 'lucide-react';
import { useTranslation } from '../../i18n';

export interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  titleTe?: string;
  posterUrl?: string;
  videoSrc?: string;
}

interface Scene {
  id: number;
  timeRange: [number, number];
  titleEn: string;
  titleTe: string;
  descEn: string;
  descTe: string;
  imageUrl: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  title = 'AAROGYA DRISHTI — Frontline Assisted Oral Screening & Tele-Triage',
  titleTe = 'ఆరోగ్య దృష్టి — క్షేత్రస్థాయి నోటి స్క్రీనింగ్ & టెలి-ట్రయాజ్ ప్రదర్శన',
  posterUrl = '/images/rural_health_hero.jpg',
  videoSrc,
}) => {
  const { language } = useTranslation();
  
  // Interactive player state for field demonstration
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSeconds, setCurrentSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const totalDuration = 120; // 2 minutes orientation

  const scenes: Scene[] = [
    {
      id: 1,
      timeRange: [0, 30],
      titleEn: '1. Village Doorstep Outreach & Verbal Consent',
      titleTe: '1. గ్రామ సందర్శన & మౌఖిక సమ్మతి సేకరణ',
      descEn: 'Authorized ASHA workers visit remote habitations in G. Madugula. Patients are registered through assisted access without needing a smartphone or phone number.',
      descTe: 'ఆశా కార్యకర్తలు గిరిజన ప్రాంతాల్లో ఇంటింటికీ వెళ్లి స్మార్ట్‌ఫోన్ లేదా ఓటీపీ అవసరం లేకుండా రోగుల వివరాలను స్వయంగా నమోదు చేస్తారు.',
      imageUrl: '/images/rural_health_hero.jpg',
    },
    {
      id: 2,
      timeRange: [30, 60],
      titleEn: '2. Standardized 5-View Guided Oral Photography',
      titleTe: '2. 5-కోణాల ప్రామాణిక నోటి ఫోటోగ్రఫీ',
      descEn: 'Using the guided camera, 5 standardized oral mucosal regions are photographed with on-device illumination and blur detection.',
      descTe: 'గైడెడ్ కెమెరా ద్వారా వెలుతురు మరియు స్పష్టతను తనిఖీ చేస్తూ నోటిలోని 5 ముఖ్య భాగాల ఫోటోలను సురక్షితంగా రికార్డ్ చేస్తారు.',
      imageUrl: '/images/oral_anatomy_guide.jpg',
    },
    {
      id: 3,
      timeRange: [60, 90],
      titleEn: '3. Primary Health Centre Doctor Independent Review',
      titleTe: '3. పీహెచ్‌సీ వైద్యాధికారి స్వతంత్ర పరిశీలన',
      descEn: 'Medical Officer Dr. K. Suresh MBBS evaluates clinical histories, zooms high-definition photographs, and signs the clinical recommendation.',
      descTe: 'పీహెచ్‌సీ వైద్యాధికారి డాక్టర్ కె. సురేష్ ఎంబీబీఎస్ ఫోటోలను పరిశీలించి స్వతంత్ర నిర్ధారణను సంతకం చేస్తారు.',
      imageUrl: '/images/doctor_screening.jpg',
    },
    {
      id: 4,
      timeRange: [90, 120],
      titleEn: '4. District Hospital Specialist Referral & Navigation',
      titleTe: '4. జిల్లా ఆసుపత్రి స్పెషలిస్ట్ రిఫరల్ & నావిగేషన్',
      descEn: 'Coordinated specialist care at District Hospital Paderu and KGH Visakhapatnam with biopsy tracking and patient navigation assistance.',
      descTe: 'పాడేరు జిల్లా ఆసుపత్రి మరియు కేజీహెచ్ విశాఖపట్నంలో నిపుణులైన డాక్టర్ల వద్దకు రిఫరల్ మరియు బయాప్సీ పర్యవేక్షణ.',
      imageUrl: '/images/sample_oral_patch.jpg',
    },
  ];

  // Active scene based on playback position
  const activeScene = scenes.find(
    (s) => currentSeconds >= s.timeRange[0] && currentSeconds < s.timeRange[1]
  ) || scenes[0];

  // Playback timer ticker
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSeconds((prev) => {
          if (prev >= totalDuration - 1) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalDuration]);

  // Handle Escape key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setIsPlaying(true);
    } else {
      document.body.style.overflow = '';
      setIsPlaying(false);
      setCurrentSeconds(0);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-[#B6CFC4]/60 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="bg-[#064B40] text-white px-5 sm:px-7 py-4 flex items-center justify-between shrink-0">
          <div className="space-y-0.5 pr-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 font-mono">
                {language === 'te' ? 'ఐటీడీఏ పాడేరు వీడియో ప్రదర్శన' : 'ITDA Paderu Field Orientation'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold leading-tight line-clamp-1">
              {title}
            </h3>
            <p className="text-xs font-telugu text-emerald-200 line-clamp-1">
              {titleTe}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 shrink-0 cursor-pointer"
            aria-label="Close video player"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player / Interactive Demonstration Presentation */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden shrink-0 group">
          {videoSrc ? (
            <video
              src={videoSrc}
              poster={posterUrl}
              controls
              autoPlay={false}
              className="w-full h-full object-cover"
            >
              <track kind="captions" />
              Your browser does not support HTML5 video.
            </video>
          ) : (
            <div className="relative w-full h-full">
              {/* Scene Display Image */}
              <img
                src={activeScene.imageUrl}
                alt={activeScene.titleEn}
                className="w-full h-full object-cover filter brightness-[0.78] transition-all duration-700"
              />

              {/* Top Vignette Tag Bar */}
              <div className="absolute top-0 inset-x-0 p-4 sm:p-5 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-center justify-between text-xs text-white">
                <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 font-mono text-[11px]">
                  {language === 'te' ? 'రంగస్థల దశ:' : 'Care Phase:'} {activeScene.id} / 4
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Clinical Standard Workflow</span>
                </div>
              </div>

              {/* Center Play / Pause Big Trigger */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#075E4E]/90 hover:bg-[#075E4E] text-white flex items-center justify-center shadow-2xl border-2 border-white/70 transition-all duration-200 hover:scale-110 pointer-events-auto cursor-pointer"
                  aria-label={isPlaying ? 'Pause video overview' : 'Play video overview'}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 fill-current" />
                  )}
                </button>
              </div>

              {/* Bottom Subtitles & Description Overlay */}
              <div className="absolute bottom-14 inset-x-0 px-4 sm:px-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-6 pb-2 text-white">
                <div className="max-w-2xl mx-auto text-center space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono block">
                    {language === 'te' ? activeScene.titleTe : activeScene.titleEn}
                  </span>
                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                    {language === 'te' ? activeScene.descTe : activeScene.descEn}
                  </p>
                </div>
              </div>

              {/* Bottom Player Scrub Bar & Controls */}
              <div className="absolute bottom-0 inset-x-0 h-14 bg-black/90 px-4 sm:px-6 flex items-center justify-between gap-4 border-t border-white/15">
                {/* Play / Pause / Replay Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentSeconds(0);
                      setIsPlaying(true);
                    }}
                    className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Restart playback"
                    title="Restart from beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <span className="text-xs text-white/80 font-mono ml-1">
                    {formatTime(currentSeconds)} / {formatTime(totalDuration)}
                  </span>
                </div>

                {/* Progress Scrub Bar */}
                <div 
                  className="flex-1 max-w-md mx-2 h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer relative"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newPct = Math.max(0, Math.min(1, clickX / rect.width));
                    setCurrentSeconds(Math.floor(newPct * totalDuration));
                  }}
                  title="Click to jump to time"
                >
                  <div 
                    className="h-full bg-emerald-400 transition-all duration-300 rounded-full"
                    style={{ width: `${(currentSeconds / totalDuration) * 100}%` }}
                  />
                </div>

                {/* Audio & Screen Toggles */}
                <div className="flex items-center gap-2 text-white/80">
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    title={isMuted ? 'Audio muted (Government safety standard)' : 'Audio unmuted'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-emerald-300" /> : <Volume2 className="w-4 h-4 text-white" />}
                  </button>

                  <span className="hidden sm:inline text-[11px] text-white/60 font-mono">
                    {isMuted ? 'Muted' : 'Sound On'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scene Selection Tabs Below Player */}
        <div className="p-4 sm:p-5 bg-[#F7F8F5] border-t border-[#B6CFC4]/40 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#064B40] font-mono flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#075E4E]" />
              <span>{language === 'te' ? '4 ప్రధాన దశల క్లినికల్ విధానం' : '4-Stage Clinical Continuum'}</span>
            </span>
            <span className="text-xs text-[#5F736C]">
              {language === 'te' ? 'దశపై క్లిక్ చేసి నేరుగా చూడండి' : 'Click any stage to view'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {scenes.map((scene) => {
              const isActive = activeScene.id === scene.id;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => {
                    setCurrentSeconds(scene.timeRange[0]);
                    setIsPlaying(true);
                  }}
                  className={`p-2.5 sm:p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white border-[#075E4E] shadow-sm ring-2 ring-[#075E4E]/20'
                      : 'bg-white/60 border-[#B6CFC4]/50 hover:bg-white hover:border-[#075E4E]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-[#E7F2EF] text-[#064B40]' : 'bg-gray-100 text-gray-600'
                    }`}>
                      Phase {scene.id}
                    </span>
                    {isActive && isPlaying && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-[#064B40] line-clamp-1">
                    {language === 'te' ? scene.titleTe.split('. ')[1] : scene.titleEn.split('. ')[1]}
                  </h4>
                  <span className="text-[10px] text-[#5F736C] font-mono block mt-0.5">
                    {formatTime(scene.timeRange[0])} - {formatTime(scene.timeRange[1])}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
