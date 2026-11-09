import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '../../i18n';

export interface FAQItem {
  id: string;
  question: string;
  questionTe: string;
  answer: string;
  answerTe: string;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  defaultOpenId?: string;
  className?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  defaultOpenId = 'faq-1',
  className = '',
}) => {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);
  const { language } = useTranslation();

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const questionText = language === 'te' ? item.questionTe : item.question;
        const answerText = language === 'te' ? item.answerTe : item.answer;

        return (
          <div
            key={item.id}
            className={`border rounded-2xl transition-all duration-200 overflow-hidden bg-white ${
              isOpen
                ? 'border-[#075E4E] shadow-[0_4px_20px_-4px_rgba(7,94,78,0.08)] ring-1 ring-[#075E4E]/15'
                : 'border-[#B6CFC4]/60 hover:border-[#075E4E]/40 shadow-sm'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-[#075E4E] focus:ring-inset"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${item.id}`}
            >
              <div className="space-y-0.5 pr-2">
                <span className="text-base sm:text-lg font-bold text-[#064B40] block leading-snug">
                  {questionText}
                </span>
                {language === 'en' && item.questionTe && (
                  <span className="text-xs font-telugu text-[#5F736C] block font-medium">
                    {item.questionTe}
                  </span>
                )}
              </div>

              <div
                className={`p-2 rounded-xl transition-all duration-200 shrink-0 ${
                  isOpen ? 'bg-[#E7F2EF] text-[#075E4E] rotate-180' : 'bg-[#F7F8F5] text-[#5F736C]'
                }`}
              >
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>

            {isOpen && (
              <div
                id={`faq-answer-${item.id}`}
                className="px-5 sm:px-6 pb-5 pt-1 text-sm sm:text-base text-[#5F736C] leading-relaxed border-t border-[#B6CFC4]/30 animate-fade-in"
              >
                <p>{answerText}</p>
                {language === 'en' && item.answerTe && (
                  <p className="mt-2 text-xs sm:text-sm font-telugu text-[#064B40] pt-2 border-t border-[#B6CFC4]/20">
                    {item.answerTe}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

