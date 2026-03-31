/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Download, Lock, AlertTriangle, FileBox, Clock, Cpu, Zap, Terminal, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

const DOWNLOAD_ITEMS = [
  { id: 'ronix-vn-32', name: 'Ronix VN', type: 'ronix', version: '32-bit', size: '124 MB', date: 'Updated Today' },
  { id: 'ronix-window', name: 'Ronix Window', type: 'ronix', version: 'Windows', size: '156 MB', date: 'Updated Today' },
  { id: 'ronix-vn-64', name: 'Ronix VN', type: 'ronix', version: '64-bit', size: '132 MB', date: 'Updated Today' },
  { id: 'ronix-global-32', name: 'Ronix Global', type: 'ronix', version: '32-bit', size: '125 MB', date: 'Updated Yesterday' },
  { id: 'ronix-global-64', name: 'Ronix Global', type: 'ronix', version: '64-bit', size: '133 MB', date: 'Updated Yesterday' },
  { id: 'jjsploit-global-32', name: 'JJSploit Global', type: 'jjsploit', version: '32-bit', size: '89 MB', date: 'Stable' },
  { id: 'jjsploit-global-64', name: 'JJSploit Global', type: 'jjsploit', version: '64-bit', size: '94 MB', date: 'Stable' },
  { id: 'jjsploit-vn-32', name: 'JJSploit VN', type: 'jjsploit', version: '32-bit', size: '88 MB', date: 'Stable' },
  { id: 'jjsploit-vn-64', name: 'JJSploit VN', type: 'jjsploit', version: '64-bit', size: '93 MB', date: 'Stable' },
  { id: 'delta-vn', name: 'Delta VN', type: 'other', version: 'Latest', size: '112 MB', date: 'New' },
  { id: 'delta-global', name: 'Delta Global', type: 'other', version: 'Latest', size: '115 MB', date: 'New' },
  { id: 'codex-global', name: 'Codex Global', type: 'other', version: 'Latest', size: '140 MB', date: 'Stable' },
  { id: 'vega-x-global', name: 'Vega X Global', type: 'other', version: 'Latest', size: '105 MB', date: 'Stable' }
];

const CATEGORIES = [
  { id: 'ronix', name: 'Ronix Series', icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', glow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)]' },
  { id: 'jjsploit', name: 'JJSploit Editions', icon: Zap, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', glow: 'shadow-[0_0_30px_rgba(139,92,246,0.15)]' },
  { id: 'other', name: 'Executors & Others', icon: Terminal, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]' }
];

export default function App() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleDownload = async (id: string) => {
    // Open tab immediately to bypass popup blockers
    const newTab = window.open('about:blank', '_blank');
    if (newTab) {
      newTab.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Secure Download</title>
          <style>
            body { background: #030712; color: #f8fafc; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; overflow: hidden; }
            .container { text-align: center; position: relative; z-index: 10; }
            .spinner { width: 48px; height: 48px; border: 3px solid rgba(34, 211, 238, 0.1); border-top-color: #22d3ee; border-radius: 50%; animation: spin 1s cubic-bezier(0.55, 0.085, 0.68, 0.53) infinite; margin: 0 auto 24px; box-shadow: 0 0 20px rgba(34, 211, 238, 0.2); }
            h2 { margin: 0 0 8px; font-weight: 600; font-size: 24px; letter-spacing: -0.02em; }
            p { color: #94a3b8; font-size: 15px; margin: 0; }
            .glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 200px; background: radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%); z-index: -1; }
            @keyframes spin { to { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="glow"></div>
          <div class="container">
            <div class="spinner"></div>
            <h2>Decrypting Secure Link</h2>
            <p>Bypassing restrictions and preparing your download...</p>
          </div>
        </body>
        </html>
      `);
    }

    try {
      setDownloadingId(id);
      setErrorId(null);
      setSuccessId(null);

      const tokenRes = await fetch('/api/generate-token', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (!tokenRes.ok) throw new Error('Failed to generate secure token');
      const { token } = await tokenRes.json();

      const downloadUrl = `/api/download?token=${encodeURIComponent(token)}`;
      
      if (newTab) {
        newTab.location.href = downloadUrl;
      } else {
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      
      setSuccessId(id);
      setTimeout(() => {
        setDownloadingId(null);
        setTimeout(() => setSuccessId(null), 3000);
      }, 1000);
      
    } catch (err: any) {
      if (newTab) newTab.close();
      setErrorId(id);
      setDownloadingId(null);
      setTimeout(() => setErrorId(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans relative overflow-hidden selection:bg-cyan-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <motion.div 
          className="absolute w-[800px] h-[800px] rounded-full bg-cyan-600/10 blur-[120px] mix-blend-screen"
          animate={{ 
            x: mousePosition.x - 400, 
            y: mousePosition.y - 400,
          }}
          transition={{ type: "spring", damping: 50, stiffness: 50, mass: 1 }}
        />
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/15 blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-24 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-900/80 border border-slate-700/50 backdrop-blur-xl mb-8 shadow-2xl shadow-cyan-900/20"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent uppercase tracking-wider">
              Premium Exploit Hub
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-[1.1]"
          >
            Made game easily <br className="hidden md:block" />
            <span className="relative inline-block">
              <span className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 blur-2xl opacity-40"></span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400">by exploiting</span>
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-light"
          >
            Access the latest executors securely. Our stateless AES-256 encrypted links bypass restrictions and expire in 30 seconds.
          </motion.p>
        </div>

        {/* Categories & Grids */}
        <div className="space-y-24">
          {CATEGORIES.map((cat, catIndex) => {
            const items = DOWNLOAD_ITEMS.filter(item => item.type === cat.id);
            if (items.length === 0) return null;

            return (
              <div key={cat.id} className="relative">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex items-center gap-4 mb-8"
                >
                  <div className={`p-3 rounded-2xl ${cat.bg} ${cat.border} border backdrop-blur-md shadow-lg`}>
                    <cat.icon className={`w-6 h-6 ${cat.color}`} />
                  </div>
                  <div>
                    <h2 className="font-display text-3xl font-bold text-white tracking-tight">{cat.name}</h2>
                    <p className="text-slate-500 text-sm mt-1">{items.length} premium files available</p>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      className={`group glass-card rounded-3xl p-1 transition-all duration-300 hover:${cat.glow}`}
                    >
                      <div className="bg-slate-900/80 rounded-[22px] p-6 h-full flex flex-col relative overflow-hidden">
                        {/* Hover Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-${cat.color.replace('text-', '')}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        
                        <div className="relative z-10 flex flex-col h-full">
                          <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.bg} ${cat.border} border shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500`}>
                                <FileBox className={`w-7 h-7 ${cat.color}`} />
                              </div>
                              <div>
                                <h3 className="font-display font-bold text-slate-100 text-xl leading-tight mb-1.5 group-hover:text-white transition-colors">{item.name}</h3>
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center text-[10px] uppercase tracking-widest font-mono text-slate-300 bg-slate-800 px-2 py-1 rounded-md border border-slate-700/50">
                                    {item.version}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 mb-8">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">File Size</span>
                              <span className="text-slate-300 font-medium">{item.size}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-500">Status</span>
                              <span className="text-emerald-400 font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                {item.date}
                              </span>
                            </div>
                          </div>

                          <div className="mt-auto relative">
                            <button
                              onClick={() => handleDownload(item.id)}
                              disabled={downloadingId === item.id || successId === item.id}
                              className={`w-full relative overflow-hidden flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl transition-all duration-300 disabled:opacity-90 disabled:cursor-not-allowed text-sm font-semibold border border-slate-700 hover:border-slate-500 group/btn shadow-lg`}
                            >
                              <AnimatePresence mode="wait">
                                {downloadingId === item.id ? (
                                  <motion.div 
                                    key="downloading"
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center gap-2"
                                  >
                                    <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${cat.color.replace('text-', 'border-')}`} />
                                    <span className={cat.color}>Decrypting...</span>
                                  </motion.div>
                                ) : successId === item.id ? (
                                  <motion.div 
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-2 text-emerald-400"
                                  >
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Started!</span>
                                  </motion.div>
                                ) : (
                                  <motion.div 
                                    key="idle"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                  >
                                    <Download className="w-4 h-4 text-slate-400 group-hover/btn:text-white transition-colors" />
                                    <span>Download Now</span>
                                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              
                              {/* Button Hover Effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                            </button>
                            
                            <AnimatePresence>
                              {errorId === item.id && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                  className="absolute -bottom-14 left-0 right-0 text-red-400 text-xs text-center flex items-center justify-center gap-1.5 bg-red-500/10 py-2.5 rounded-xl border border-red-500/20 backdrop-blur-md shadow-xl z-20"
                                >
                                  <AlertTriangle className="w-4 h-4" /> 
                                  <span className="font-medium">Bypass failed. Try again.</span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-32 pt-12 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Secure Infrastructure</h4>
              <p className="text-slate-500 text-sm">Enterprise-grade protection</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 bg-slate-900/80 px-5 py-2.5 rounded-xl border border-slate-800 shadow-sm backdrop-blur-sm">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300">AES-256 Encrypted</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/80 px-5 py-2.5 rounded-xl border border-slate-800 shadow-sm backdrop-blur-sm">
              <Clock className="w-4 h-4 text-violet-400" />
              <span className="text-slate-300">30s Auto-Expiry</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/80 px-5 py-2.5 rounded-xl border border-slate-800 shadow-sm backdrop-blur-sm">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Anti-Hook Active</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

