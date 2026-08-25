import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <motion.div
      key="not-found"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 text-center px-4"
    >
      <div className="space-y-4 max-w-md mx-auto">
        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">404</h2>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
          Page Not Found
        </p>
        <p className="text-xs text-slate-400">
          Oops! Looks like this page got eaten by a bug.
        </p>
      </div>

      {/* Video Container */}
      <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-sm border border-slate-100 bg-white p-2">
        <video 
          src="/404-bug.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-auto rounded-2xl pointer-events-none"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <Link 
        to="/"
        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm hover:shadow-md"
      >
        <Home className="w-4 h-4" />
        Return to Home
      </Link>
    </motion.div>
  );
};

export default NotFound;
