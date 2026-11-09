import React, { useState } from 'react';
import { MapPin, Send, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { Button } from '../../components/common/Button';
import { BackButton } from '../../components/common/BackButton';
import { useTranslation } from '../../i18n';
import { ASR_MANDALS } from '../../data/asrMandals';

export const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [mandal, setMandal] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Top Go to Previous Navigation */}
      <div className="flex items-center justify-start">
        <BackButton fallbackPath="/" label="Go to Previous" labelTe="మునుపటి పేజీకి" variant="outline" size="sm" />
      </div>

      {/* Title & Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          {t('contactTitle')}
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold font-telugu text-forest-900">
          {t('contactSubtitle')}
        </h2>
        <p className="text-xs sm:text-base text-ink-muted leading-relaxed">
          Need information regarding oral screening dates, patient cards, or hospital navigation in Alluri Sitharama Raju district? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Helplines & Offices */}
        <div className="lg:col-span-5 space-y-6">
          <Card padding="lg" variant="nature" className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-ink">
                Official Helplines
              </h3>
              <p className="text-xs font-telugu text-forest-800 font-semibold mt-0.5">
                అధికారిక ఫోన్ నంబర్లు
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-white border border-forest-100 space-y-1 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-800 font-mono">
                  ITDA Paderu Tribal Helpline
                </span>
                <p className="text-xl font-bold text-ink">08935-250000</p>
                <p className="text-xs text-ink-muted font-telugu">గిరిజన ప్రాంతాల ప్రత్యేక సమాచార విభాగం</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-forest-100 space-y-1 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-800 font-mono">
                  Andhra Pradesh Health Helpline
                </span>
                <p className="text-xl font-bold text-ink">104 (Toll-Free)</p>
                <p className="text-xs text-ink-muted font-telugu">24 గంటల ఉచిత ఆరోగ్య సమాచార సేవ</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-forest-100 space-y-1 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-800 font-mono">
                  Emergency Medical Ambulance
                </span>
                <p className="text-xl font-bold text-ink">108 (Emergency)</p>
                <p className="text-xs text-ink-muted font-telugu">అత్యవసర అంబులెన్స్ సేవ</p>
              </div>
            </div>

            <div className="pt-4 border-t border-forest-200/60 space-y-3 text-xs sm:text-sm text-ink-muted">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-forest-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink block">ITDA Paderu Office:</strong>
                  <span>Integrated Tribal Development Agency, Paderu, ASR District, AP - 531024</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-forest-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink block">Field Coordination Hours:</strong>
                  <span>Monday to Saturday: 9:00 AM – 5:00 PM</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Community Feedback & Inquiry Form */}
        <div className="lg:col-span-7">
          <Card padding="lg" className="border-forest-200">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-status-success mx-auto flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-ink">
                  Thank You for Reaching Out
                </h3>
                <p className="text-sm font-telugu text-forest-800 font-semibold">
                  మీ సందేశం విజయవంతంగా అందింది
                </p>
                <p className="text-sm text-ink-muted max-w-md mx-auto">
                  Your inquiry has been submitted to the local health coordination team. If this is a medical emergency, please dial 108 or visit the nearest Primary Health Centre immediately.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-ink">
                    Community Inquiry & Assistance Form
                  </h3>
                  <p className="text-xs font-telugu text-forest-800 font-semibold mt-0.5">
                    ప్రశ్నలు లేదా సహాయం కొరకు వివరాలు పంపండి
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    labelTe="మీ పేరు"
                    placeholder="e.g. Kondala Rao"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <Input
                    label="Phone Number (Optional)"
                    labelTe="ఫోన్ నంబర్ (ఐచ్ఛికం)"
                    placeholder="10-digit number if available"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <Select
                  label="Mandal / Area (ASR District - 22 Mandals)"
                  labelTe="మండలం (అల్లూరి సీతారామరాజు జిల్లా - 22 మండలాలు)"
                  options={[
                    { value: '', label: 'Select your mandal (మీ మండలాన్ని ఎంచుకోండి)...' },
                    ...ASR_MANDALS.map((m) => ({
                      value: m.nameEn,
                      label: `${m.nameEn} (${m.nameTe} - ${m.division} Division)`,
                      labelTe: `${m.nameTe} (${m.nameEn})`,
                    })),
                    { value: 'other_itda', label: 'Other ITDA / Tribal Area', labelTe: 'ఇతర గిరిజన ప్రాంతం' },
                    { value: 'visakhapatnam', label: 'Visakhapatnam (Tertiary Referral / KGH)', labelTe: 'విశాఖపట్నం (కేజీహెచ్ రిఫరల్)' },
                  ]}
                  value={mandal}
                  onChange={(e) => setMandal(e.target.value)}
                />

                <div>
                  <label className="block text-sm font-semibold text-ink mb-1.5">
                    How Can We Assist You? (మీ సందేశం లేదా సమస్య) <span className="text-status-danger">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us your query regarding screening, clinic dates, or hospital appointments..."
                    className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-base text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-forest-700/30"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" icon={Send} fullWidth>
                  Submit Inquiry (సందేశం పంపండి)
                </Button>
              </form>
            )}
          </Card>
        </div>

      </div>

    </div>
  );
};
