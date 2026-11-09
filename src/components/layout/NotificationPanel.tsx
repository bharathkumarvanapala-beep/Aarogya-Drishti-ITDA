import React, { useState } from 'react';
import { Bell, Check, Clock, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface NotificationItem {
  id: string;
  title: string;
  titleTe: string;
  time: string;
  unread: boolean;
  type: 'info' | 'warning' | 'success';
}

export const NotificationPanel: React.FC = () => {
  const { language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'New screening case from Kothapalli awaiting review',
      titleTe: 'కొత్తపల్లి నుండి కొత్త స్క్రీనింగ్ కేస్ పరిశీలనకు వచ్చింది',
      time: '10 min ago',
      unread: true,
      type: 'info',
    },
    {
      id: 'notif-2',
      title: 'Referral appointment confirmed at District Hospital Paderu',
      titleTe: 'పాడేరు జిల్లా ఆసుపత్రిలో అపాయింట్‌మెంట్ ఖరారైంది',
      time: '1 hour ago',
      unread: true,
      type: 'success',
    },
    {
      id: 'notif-3',
      title: 'Offline sync: 3 records backed up to device storage',
      titleTe: 'ఆఫ్‌లైన్ సింక్: 3 రికార్డులు పరికరంలో భద్రపరచబడ్డాయి',
      time: '3 hours ago',
      unread: false,
      type: 'warning',
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl text-forest-900 hover:bg-forest-100/70 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-status-danger text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-nature-lg border border-forest-100 z-50 overflow-hidden animate-fadeIn">
            <div className="p-4 bg-forest-50/80 border-b border-forest-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-ink">
                  Notifications
                </h4>
                <p className="text-xs font-telugu text-forest-800">
                  నోటిఫికేషన్లు
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-forest-800 hover:underline flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            <div className="divide-y divide-forest-50 max-h-80 overflow-y-auto">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 hover:bg-forest-50/50 transition-colors flex items-start gap-3 ${
                    item.unread ? 'bg-forest-50/30 font-medium' : 'opacity-80'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.type === 'info' && <Bell className="w-4 h-4 text-status-info" />}
                    {item.type === 'success' && <ShieldCheck className="w-4 h-4 text-status-success" />}
                    {item.type === 'warning' && <Clock className="w-4 h-4 text-status-warning" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-ink leading-snug">
                      {language === 'te' ? item.titleTe : item.title}
                    </p>
                    <span className="text-[10px] text-ink-muted mt-1 block">
                      {item.time}
                    </span>
                  </div>

                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-forest-700 shrink-0 mt-1" />
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 bg-forest-50/40 border-t border-forest-100 text-center">
              <span className="text-xs text-ink-muted">
                Demonstration notifications • ITDA Paderu
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
