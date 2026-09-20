import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, ExternalLink, Briefcase, FileText } from 'lucide-react';
import QMLogo from './QMLogo';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isAdminLoggedIn: boolean;
  isServicesDomain?: boolean;
}

export default function Header({ currentView, onViewChange, isAdminLoggedIn, isServicesDomain }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHomeHovered, setIsHomeHovered] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<any>(null);

  const handleMouseEnterHome = () => {
    if (hoverTimer) clearTimeout(hoverTimer);
    const timer = setTimeout(() => {
      setIsHomeHovered(true);
    }, 300);
    setHoverTimer(timer);
  };

  const handleMouseLeaveHome = () => {
    if (hoverTimer) clearTimeout(hoverTimer);
    const timer = setTimeout(() => {
      setIsHomeHovered(false);
    }, 600); // 600ms grace delay so user can easily move cursor and click
    setHoverTimer(timer);
  };

  const handleMouseEnterDropdown = () => {
    if (hoverTimer) clearTimeout(hoverTimer);
    setIsHomeHovered(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'Projects', value: 'projects' },
    { label: 'Blog', value: 'blog' },
    { label: 'Certifications', value: 'certificates' },
    { label: 'Contact', value: 'contact' },
  ];

  const handleNavClick = (val: string) => {
    onViewChange(val);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300 no-print bg-white shadow-sm"
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
        isScrolled ? 'py-2.5' : 'py-3.5'
      }`}>
        {/* Brand/Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 cursor-pointer focus:outline-hidden"
        >
          <QMLogo size="sm" interactive={true} />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50 border border-slate-100 p-1 rounded-2xl relative">
          {navItems.map((item) => {
            const isActive = currentView === item.value;
            if (item.value === 'home') {
              return (
                <div
                  key="home"
                  className="relative"
                  onMouseEnter={handleMouseEnterHome}
                  onMouseLeave={handleMouseLeaveHome}
                >
                  <button
                    onClick={() => handleNavClick('home')}
                    className={`relative px-4 py-2 text-xs font-semibold rounded-xl tracking-wide cursor-pointer transition-all ${
                      isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 bg-white border border-slate-100 rounded-lg shadow-xs -z-10 animate-fade-in" />
                    )}
                    {item.label}
                  </button>

                  {/* Small clean dropdown for Portfolio */}
                  {isHomeHovered && (
                    <div 
                      onMouseEnter={handleMouseEnterDropdown}
                      onMouseLeave={handleMouseLeaveHome}
                      className="absolute top-full left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 animate-fade-in"
                    >
                      <a
                        href="/?domain=portfolio"
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors group"
                      >
                        <span className="flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                          Rajat Portfolio
                        </span>
                      </a>
                    </div>
                  )}
                </div>
              );
            }
            return (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`relative px-4 py-2 text-xs font-semibold rounded-xl tracking-wide cursor-pointer transition-all ${
                  isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {/* Active Indicator Backdrop */}
                {isActive && (
                  <span className="absolute inset-0 bg-white border border-slate-100 rounded-lg shadow-xs -z-10 animate-fade-in" />
                )}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Admin Login link */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleNavClick('admin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border cursor-pointer transition-all ${
              currentView === 'admin'
                ? 'bg-slate-900 border-slate-900 text-white'
                : isAdminLoggedIn
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            {isAdminLoggedIn ? 'Console Panel' : 'CRM Dashboard'}
          </button>
          
          <button
            onClick={() => handleNavClick('resume')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all ${
              currentView === 'resume'
                ? 'bg-slate-900 text-white border border-slate-900'
                : 'bg-primary hover:bg-primary-dark text-white shadow-blue-500/10'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Resume Hub
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => handleNavClick('admin')}
            className={`p-2 rounded-xl border ${
              currentView === 'admin' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'
            }`}
            title="CRM Admin console login"
          >
            <Shield className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 focus:outline-hidden"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl px-4 py-6 space-y-3 flex flex-col z-50 animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => handleNavClick(item.value)}
              className={`w-full text-left px-4 py-2.5 font-semibold text-sm rounded-xl ${
                currentView === item.value ? 'bg-blue-50/50 text-primary' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full justify-center px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4" />
              {isAdminLoggedIn ? 'Enter CRM Panel' : 'CRM Dashboard Access'}
            </button>
            <button
              onClick={() => handleNavClick('resume')}
              className="w-full text-center py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Resume Hub
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
