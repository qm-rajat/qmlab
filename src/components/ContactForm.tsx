import React, { useState } from 'react';
import { Mail, User, MessageSquare, Send, CheckCircle2, AlertCircle, Briefcase, MessageCircle } from 'lucide-react';

type InquiryType = 'freelance_project' | 'general';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [inquiryType, setInquiryType] = useState<InquiryType>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [smtpStatusMsg, setSmtpStatusMsg] = useState('');

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('idle');
    setErrorMessage('');

    // Field Valildation
    if (!name.trim()) {
      setSubmitStatus('error');
      setErrorMessage('Full name is required.');
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      setSubmitStatus('error');
      setErrorMessage('A valid email address is required.');
      return;
    }
    if (message.trim().length < 50) {
      setSubmitStatus('error');
      setErrorMessage(`Please elaborate further. Your message must be at least 50 characters (Current: ${message.trim().length}/50).`);
      return;
    }

    setIsSubmitting(true);

    // Call server-side API to log contact and trigger SMTP emails
    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        inquiry_type: inquiryType
      })
    })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server processing error.');
      }
      return data;
    })
    .then((data) => {
      setSmtpStatusMsg(data.message || 'Logged in CRM.');
      setSubmitStatus('success');
      // Clear fields
      setName('');
      setEmail('');
      setMessage('');
      setInquiryType('general');
    })
    .catch((err: any) => {
      setSubmitStatus('error');
      setErrorMessage(err.message || 'Connecting failure. Failed to save lead.');
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40 p-6 md:p-8 no-print">
      <h3 className="text-xl font-bold text-slate-800 mb-6">
        Forward a Message
      </h3>

      {submitStatus === 'success' ? (
        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center text-center space-y-4 animate-[fade-in_0.4s_ease-out]">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-[scale_0.3s_cubic-bezier(0.34,1.56,0.64,1)]" />
          <div>
            <h4 className="font-bold text-emerald-900 text-base">Message Logged & Sent!</h4>
            <p className="text-sm text-emerald-700 mt-1.5 leading-relaxed">
              {smtpStatusMsg || "Thanks! Your inquiry has been logged securely in Rajat's CRM database."}
            </p>
          </div>
          <button
            onClick={() => setSubmitStatus('idle')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Validation Banner */}
          {submitStatus === 'error' && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-slide-up">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Inquiry Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              What's this about?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInquiryType('freelance_project')}
                className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  inquiryType === 'freelance_project'
                    ? 'bg-primary text-white border-primary shadow-sm shadow-blue-500/10'
                    : 'bg-slate-50 text-slate-500 border-slate-200/80 hover:bg-slate-100/60'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" /> Freelance / Project
              </button>
              <button
                type="button"
                onClick={() => setInquiryType('general')}
                className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  inquiryType === 'general'
                    ? 'bg-primary text-white border-primary shadow-sm shadow-blue-500/10'
                    : 'bg-slate-50 text-slate-500 border-slate-200/80 hover:bg-slate-100/60'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" /> General
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="user-name-input" className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                id="user-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rishabh Sen"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200/80 focus:border-primary focus:ring-4 focus:ring-blue-500/5 rounded-xl text-sm transition-all focus:outline-hidden"
              />
            </div>
          </div>

          {/* Email Coordinates */}
          <div className="space-y-2">
            <label htmlFor="user-email-input" className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              Email Coordinates
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="user-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rishabh.sen@corporate.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200/80 focus:border-primary focus:ring-4 focus:ring-blue-500/5 rounded-xl text-sm transition-all focus:outline-hidden"
              />
            </div>
          </div>

          {/* Message Elaborator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="user-message-input" className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                Describe Proposal
              </label>
              <span className={`text-[10px] font-mono ${message.trim().length >= 50 ? 'text-emerald-500' : 'text-slate-400'}`}>
                {message.trim().length} / 50 characters min
              </span>
            </div>
            <div className="relative">
              <span className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                <MessageSquare className="w-4 h-4" />
              </span>
              <textarea
                id="user-message-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi Rajat! I've been reviewing your automated QA test suites on SauceDemo and we would love to schedule a technical chat about our team's active pipeline..."
                rows={5}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200/80 focus:border-primary focus:ring-4 focus:ring-blue-500/5 rounded-xl text-sm transition-all focus:outline-hidden resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-white bg-primary hover:bg-primary-dark transition-all cursor-pointer select-none active:scale-98 shadow-md shadow-blue-500/10 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Synchronizing Client State...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Send Message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
