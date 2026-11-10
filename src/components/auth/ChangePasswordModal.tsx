import React, { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, X, LoaderCircle } from 'lucide-react';
import { useAuth } from '../../context';
import { useTranslation } from '../../i18n';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { changePassword } = useAuth();
  const { language } = useTranslation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError(language === 'te' ? 'కొత్త పాస్‌వర్డ్‌లు సరిపోలడం లేదు.' : 'New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError(language === 'te' ? 'పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి.' : 'Password must be at least 8 characters.');
      return;
    }

    setBusy(true);
    try {
      if (changePassword) {
        const res = await changePassword(currentPassword, newPassword, confirmPassword);
        if (res.success) {
          setSuccess(language === 'te' ? 'పాస్‌వర్డ్ విజయవంతంగా మార్చబడింది.' : 'Password successfully updated.');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setTimeout(() => {
            onClose();
            setSuccess(null);
          }, 2000);
        } else {
          setError(res.error || 'Failed to update password.');
        }
      } else {
        setError('Change password service is unavailable.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error updating password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-forest-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-forest-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-900 flex items-center justify-center">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="font-bold text-forest-950 text-base">
                {language === 'te' ? 'పాస్‌వర్డ్ మార్చండి' : 'Change Account Password'}
              </h3>
              <p className="text-[11px] text-forest-700">
                {language === 'te' ? 'సురక్షిత ఖాతా రక్షణ' : 'Secure DPDPA-compliant credential update'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-forest-700 hover:bg-forest-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl flex items-start gap-2 border border-rose-200">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-start gap-2 border border-emerald-200">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-forest-900">
          <div>
            <label className="block mb-1">
              {language === 'te' ? 'ప్రస్తుత పాస్‌వర్డ్' : 'Current Password'}
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                className="w-full bg-forest-50/50 border border-forest-200 rounded-xl p-3 pr-10 text-sm font-normal focus:bg-white focus:outline-emerald-600 text-forest-950"
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-forest-600"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label="Toggle show password"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1">
              {language === 'te' ? 'కొత్త పాస్‌వర్డ్' : 'New Password'}
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                minLength={8}
                className="w-full bg-forest-50/50 border border-forest-200 rounded-xl p-3 pr-10 text-sm font-normal focus:bg-white focus:outline-emerald-600 text-forest-950"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-forest-600"
                onClick={() => setShowNew(!showNew)}
                aria-label="Toggle show password"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <span className="text-[10px] text-forest-600 font-normal mt-1 block">
              {language === 'te' ? 'కనీసం 8 అక్షరాలు ఉండాలి.' : 'Minimum 8 characters.'}
            </span>
          </div>

          <div>
            <label className="block mb-1">
              {language === 'te' ? 'కొత్త పాస్‌వర్డ్‌ను నిర్ధారించండి' : 'Confirm New Password'}
            </label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full bg-forest-50/50 border border-forest-200 rounded-xl p-3 text-sm font-normal focus:bg-white focus:outline-emerald-600 text-forest-950"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-forest-200 text-forest-800 hover:bg-forest-50 font-bold transition-colors"
            >
              {language === 'te' ? 'రద్దు' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 disabled:opacity-60 text-white font-bold transition-colors flex items-center gap-1.5"
            >
              {busy ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />
                  <span>{language === 'te' ? 'సేవ్ అవుతోంది…' : 'Saving…'}</span>
                </>
              ) : (
                <span>{language === 'te' ? 'నవీకరించండి' : 'Update Password'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

