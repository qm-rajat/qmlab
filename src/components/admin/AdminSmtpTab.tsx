import React, { useState } from 'react';
import { Mail, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';

interface AdminSmtpTabProps {
  smtpStatus: { configured: boolean; host?: string; user?: string; toEmail?: string } | null;
  setSmtpStatus: (status: any) => void;
}

export const AdminSmtpTab: React.FC<AdminSmtpTabProps> = ({
  smtpStatus,
  setSmtpStatus,
}) => {
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestSmtp = () => {
    setIsTestingSmtp(true);
    setSmtpTestResult(null);
    fetch('/api/test-smtp', { method: 'POST' })
      .then(r => r.json())
      .then(data => setSmtpTestResult(data))
      .catch(err => setSmtpTestResult({ success: false, message: err.message }))
      .finally(() => setIsTestingSmtp(false));
  };

  const handleRefreshStatus = () => {
    setSmtpStatus(null);
    fetch('/api/smtp-status')
      .then(res => res.json())
      .then(data => setSmtpStatus(data));
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">SMTP Outbound Connection Lab</h3>
        <p className="text-xs text-slate-400 mt-0.5">Diagnose, authenticate, and run test transmissions on your portfolio mailers.</p>
      </div>

      {/* Status Indicator Card */}
      {smtpStatus ? (
        <div className={`p-6 rounded-3xl border ${smtpStatus.configured ? 'bg-emerald-50/40 border-emerald-100/80 text-emerald-900' : 'bg-rose-50/40 border-rose-100/80 text-rose-900'} space-y-4`}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${smtpStatus.configured ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <h4 className="font-extrabold text-sm uppercase tracking-wider">
                  {smtpStatus.configured ? 'Outbound SMTP Connection Active' : 'SMTP Server Offline / Unconfigured'}
                </h4>
              </div>
              <p className="text-xs opacity-80 max-w-xl leading-relaxed">
                {smtpStatus.configured 
                  ? 'Your full-stack Node server has successfully loaded valid credentials. Real-time lead notifications and polished recruiter confirmations are online!' 
                  : 'Your portfolio emailers are currently running in local fallback mode. Fill out the .env instructions below to activate direct auto-replies.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefreshStatus}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold rounded-xl cursor-pointer select-none active:scale-95 transition-all"
            >
              Refresh Check
            </button>
          </div>

          {smtpStatus.configured && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-200/55 text-xs">
              <div>
                <span className="block font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-0.5">SMTP Host Address</span>
                <span className="font-mono text-slate-700 font-semibold">{smtpStatus.host}</span>
              </div>
              <div>
                <span className="block font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-0.5">Authenticated User</span>
                <span className="font-mono text-slate-700 font-semibold">{smtpStatus.user}</span>
              </div>
              <div>
                <span className="block font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-0.5">Receiving Inbox (TO)</span>
                <span className="font-mono text-slate-700 font-semibold select-all">{smtpStatus.toEmail}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 bg-slate-50 border border-slate-100 rounded-3xl">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
          Querying mail server configurations...
        </div>
      )}

      {/* Guide card on configuring Google SMTP */}
      <div className="bg-white border border-slate-150 rounded-3xl p-6 space-y-4">
        <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#0084ff]" />
          How to link Google/Gmail SMTP Credentials Securely
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          Due to Google's strict security regulations, you cannot use your regular Gmail password. You must generate a secure 16-character <strong>Google App Password</strong>:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-2">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">1</span>
            <h5 className="font-bold text-slate-800 text-xs">Activate 2FA</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Visit <a href="https://myaccount.google.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google My Account</a>. Go to Security and verify 2-Step Verification is active.
            </p>
          </div>
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-2">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">2</span>
            <h5 className="font-bold text-slate-800 text-xs">App Password</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Search "App Passwords" in the top bar. Enter a custom name like "QM Labs Portfolio" and click Create.
            </p>
          </div>
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-2">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">3</span>
            <h5 className="font-bold text-slate-800 text-xs">Configure Env</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Open your portfolio secrets settings/secrets panel or <code>.env</code> file and save the 16-digit key under <code>SMTP_PASS</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Action: Send Test Email */}
      <div className="bg-slate-50/40 border border-slate-150 rounded-3xl p-6 space-y-4">
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900 text-sm">Transmitter Integration Test</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Trigger a secure SMTP ping from your Cloud Run container using your active credentials. This will dispatch a diagnostic test report email directly to your inbox.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={handleTestSmtp}
            disabled={isTestingSmtp}
            className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-white bg-primary hover:bg-primary-dark transition-all cursor-pointer ${isTestingSmtp ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isTestingSmtp ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Transmitting Diagnostic Mail...
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5" />
                Send Test Email Alert
              </>
            )}
          </button>

          <span className="text-[10px] text-slate-400 italic sm:max-w-xs">
            * Make sure to specify <code>SMTP_PASS</code> and <code>SMTP_USER</code> in your environment parameters.
          </span>
        </div>

        {smtpTestResult && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs animate-slide-up ${smtpTestResult.success ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
            {smtpTestResult.success ? (
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-bold">{smtpTestResult.success ? 'Outbound SMTP Test Passed!' : 'Connection Handshake Failed'}</p>
              <p className="opacity-90 font-mono text-[11px] leading-relaxed select-text">{smtpTestResult.message || (smtpTestResult as any).error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
