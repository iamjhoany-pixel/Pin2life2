
import React, { useState, useEffect } from 'react';
import { AppState, User, ActionPlan } from './types';
import { LOADING_MESSAGES } from './constants';
import { generatePlanFromBoard } from './services/geminiService';
import { supabase, isPlaceholder } from './services/supabaseClient';

// --- Branding Component ---

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'sm' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32'
  };
  
  return (
    <div className={`${sizes[size]} relative flex items-center justify-center transition-transform hover:rotate-3 duration-500`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-md">
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A3B899" />
            <stop offset="100%" stopColor="#A794C7" />
          </linearGradient>
        </defs>
        <path d="M50 90C50 90 20 65 20 40C20 23.4315 33.4315 10 50 10C66.5685 10 80 23.4315 80 40C80 65 50 90 50 90Z" fill="url(#logo-gradient)" />
        <circle cx="50" cy="40" r="18" fill="white" fillOpacity="0.9" />
        <path d="M50 30C50 30 44 35 44 42C44 47 47 50 50 50C53 50 56 47 56 42C56 35 50 30 50 30Z" fill="url(#logo-gradient)" opacity="0.8" />
        <path d="M50 32C47 34 46 38 46 42M50 32C53 34 54 38 54 42" stroke="url(#logo-gradient)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M38 72C30 72 22 84 22 84C22 84 40 92 48 84C52 80 46 72 38 72Z" fill="url(#logo-gradient)" />
        <path d="M22 84L38 76" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
    </div>
  );
};

// --- Sub-components ---

const Header: React.FC<{ user: any; onLogout: () => void; onNavigate: (state: AppState) => void }> = ({ user, onLogout, onNavigate }) => (
  <header className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex justify-between items-center transition-all bg-white/40 backdrop-blur-lg border-b border-white/20">
    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate(user ? AppState.DASHBOARD : AppState.LANDING)}>
      <Logo size="sm" />
      <span className="text-xl font-bold tracking-tight text-indigo-950 group-hover:text-indigo-600 transition-colors">Pin2Life AI</span>
    </div>
    <div className="flex items-center gap-8">
      <button 
        onClick={() => onNavigate(AppState.PRICING)}
        className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
      >
        Pricing
      </button>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-xs font-semibold text-indigo-400 bg-indigo-50 px-3 py-1 rounded-full">{user.email}</span>
          <button 
            onClick={onLogout}
            className="text-sm font-medium text-slate-500 hover:text-pink-600 transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <button 
          onClick={() => onNavigate(AppState.LOGIN)}
          className="px-6 py-2.5 bg-indigo-950 text-white rounded-full text-sm font-bold hover:bg-black transition-all hover:scale-105"
        >
          Get Started
        </button>
      )}
    </div>
  </header>
);

const Landing: React.FC<{ onStart: () => void; onViewPricing: () => void }> = ({ onStart, onViewPricing }) => (
  <div className="pt-32 pb-20 overflow-hidden">
    {/* Hero Section */}
    <section className="px-8 sm:px-12 md:px-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
      <div className="max-w-2xl space-y-8 reveal">
        <div className="flex items-center gap-4 mb-2">
          <Logo size="md" />
          <div className="px-4 py-1.5 bg-green-100/50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-200">✨ Version 2.1 now live</div>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold text-indigo-950 leading-[0.9] tracking-tight">
          Turn inspiration <br />
          <span className="italic text-indigo-400 font-serif font-light">into your reality</span>
        </h1>
        <p className="text-xl text-slate-500 font-light leading-relaxed max-w-lg">
          Your Pinterest boards are full of dreams. We provide the roadmap to make them your daily life. From vision boards to actionable habits.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            onClick={onStart}
            className="px-10 py-5 bg-indigo-950 text-white rounded-full text-lg font-bold hover:bg-black transform hover:-translate-y-1 transition-all shadow-xl shadow-indigo-100"
          >
            Create My Plan
          </button>
          <button 
            onClick={() => {
               const flowSec = document.getElementById('manifestation-flow');
               flowSec?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-10 py-5 bg-white text-slate-600 border border-slate-200 rounded-full text-lg font-semibold hover:bg-slate-50 transition-all"
          >
            How it works
          </button>
        </div>
      </div>

      <div className="hidden lg:block relative h-[600px] w-full">
        <div className="absolute top-10 left-0 w-64 h-80 rounded-[2.5rem] bg-indigo-100 overflow-hidden shadow-2xl animate-float border-4 border-white transform -rotate-6">
          <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=600&fit=crop" className="w-full h-full object-cover" alt="yoga" />
        </div>
        <div className="absolute top-40 left-60 w-56 h-64 rounded-[2.5rem] bg-pink-100 overflow-hidden shadow-2xl animate-float-delayed border-4 border-white transform rotate-6">
          <img src="https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400&h=600&fit=crop" className="w-full h-full object-cover" alt="journal" />
        </div>
        <div className="absolute -bottom-10 left-20 w-72 h-48 rounded-[2.5rem] bg-green-50 overflow-hidden shadow-2xl animate-float border-4 border-white">
          <img src="https://images.unsplash.com/photo-1513519247388-44284507d60d?w=600&h=400&fit=crop" className="w-full h-full object-cover" alt="interior" />
        </div>
      </div>
    </section>

    {/* Aesthetic Marquee */}
    <div className="my-24 py-6 overflow-hidden border-y border-indigo-50/50 bg-white/30 backdrop-blur-sm">
      <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
        {Array(10).fill(["AESTHETIC", "GROWTH", "MINDFULNESS", "HABITS", "MANIFEST", "VISION"]).flat().map((word, i) => (
          <span key={i} className="text-4xl font-black text-indigo-50 tracking-tighter opacity-50">{word}</span>
        ))}
      </div>
    </div>

    {/* The Flow Section */}
    <section id="manifestation-flow" className="mt-40 px-8 sm:px-12 md:px-24 space-y-20">
      <div className="text-left space-y-4 max-w-xl reveal">
        <h2 className="text-4xl font-bold text-indigo-950 italic font-serif">The Manifestation Flow ✨</h2>
        <p className="text-slate-500">Three simple steps to transform your digital inspiration into a physical routine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { step: "01", title: "Connect", desc: "Paste your Pinterest board URL. It can be about fitness, home decor, or your dream career.", icon: "📌" },
          { step: "02", title: "Analyze", desc: "Our AI identifies the core values, aesthetics, and goals hidden in your pins.", icon: "🧠" },
          { step: "03", title: "Manifest", desc: "Receive a personalized weekly plan, habits, and immediate steps to start living that life.", icon: "🌿" }
        ].map((item, i) => (
          <div key={i} className={`glass-card p-10 rounded-[3rem] space-y-6 hover:translate-y-[-10px] transition-all duration-500 group border-white/50 shadow-sm hover:shadow-xl reveal stagger-${i+1}`}>
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:rotate-12 transition-transform">
              {item.icon}
            </div>
            <div className="space-y-2">
              <span className="text-xs font-black text-indigo-300 tracking-widest uppercase">{item.step}</span>
              <h3 className="text-2xl font-bold text-indigo-950">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed font-light">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Feature Section */}
    <section className="mt-40 bg-indigo-950 py-32 rounded-[4rem] mx-4 sm:mx-8 md:mx-12 text-white overflow-hidden relative reveal">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-400/10 rounded-full blur-[80px] -ml-20 -mb-20"></div>
      
      <div className="px-12 md:px-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <h2 className="text-5xl font-bold leading-tight font-serif italic">Your Bestie in <br /> Life Design</h2>
          <div className="space-y-6">
            <div className="flex gap-4 group">
              <div className="shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">✓</div>
              <div>
                <h4 className="font-bold text-lg">AI Aesthetic Analysis</h4>
                <p className="text-indigo-200/70 font-light">We don't just read titles; we understand the vibe of your collection.</p>
              </div>
            </div>
            <div className="flex gap-4 group">
              <div className="shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">✓</div>
              <div>
                <h4 className="font-bold text-lg">Weekly Actionable Roadmap</h4>
                <p className="text-indigo-200/70 font-light">Concrete tasks from Monday to Sunday to keep you on track.</p>
              </div>
            </div>
            <div className="flex gap-4 group">
              <div className="shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">✓</div>
              <div>
                <h4 className="font-bold text-lg">Micro-habit Integration</h4>
                <p className="text-indigo-200/70 font-light">Small changes that lead to the version of you in your pins.</p>
              </div>
            </div>
          </div>
          <button onClick={onStart} className="px-8 py-4 bg-white text-indigo-950 rounded-full font-bold hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95">Start Manifesting ✨</button>
        </div>
        <div className="relative group">
          <div className="aspect-square bg-white/5 rounded-[4rem] border border-white/10 flex items-center justify-center overflow-hidden">
            <div className="w-4/5 h-4/5 glass-card rounded-[3rem] p-8 space-y-6 animate-pulse border-white/20">
              <div className="h-4 w-1/2 bg-white/20 rounded-full"></div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-white/10 rounded-full"></div>
                <div className="h-2 w-full bg-white/10 rounded-full"></div>
                <div className="h-2 w-2/3 bg-white/10 rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 rounded-2xl bg-white/5"></div>
                <div className="h-20 rounded-2xl bg-white/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="mt-40 px-12 md:px-24 py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-3">
        <Logo size="sm" />
        <span className="font-bold text-indigo-950">Pin2Life AI</span>
      </div>
      <p className="text-slate-400 text-sm">© 2025 Pin2Life AI. Designed for dreamers. 🌸</p>
      <div className="flex gap-6 text-slate-400 text-sm font-medium">
        <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
        <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
      </div>
    </footer>
  </div>
);

const Pricing: React.FC<{ onSelect: () => void }> = ({ onSelect }) => (
  <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 space-y-16 animate-in fade-in slide-in-from-bottom-4">
    <div className="text-center space-y-4 max-w-2xl mx-auto">
      <h2 className="text-5xl font-bold text-indigo-950 italic font-serif">Choose your path ✨</h2>
      <p className="text-slate-500 text-lg">Invest in your growth. From small sparks to visionary changes.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="glass-card p-10 rounded-[3rem] flex flex-col justify-between border-white shadow-xl hover:shadow-2xl transition-all group">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entry</span>
            <h3 className="text-3xl font-bold text-indigo-950">The Spark</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-indigo-950">$0</span>
            <span className="text-slate-400 text-sm">/forever</span>
          </div>
          <ul className="space-y-4">
            {['1 AI Plan', 'Basic Dashboard', 'Export as Image'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                <span className="text-indigo-300">✦</span> {feature}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={onSelect} className="mt-10 w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all border border-slate-100">Start for free</button>
      </div>

      <div className="relative p-1 rounded-[3.5rem] bg-gradient-to-tr from-green-200 via-indigo-300 to-pink-200 shadow-2xl transform md:-translate-y-4 group">
        <div className="bg-white/95 backdrop-blur-sm p-10 rounded-[3.3rem] h-full flex flex-col justify-between space-y-6">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-indigo-950 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Most Popular</div>
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Growth</span>
              <h3 className="text-3xl font-bold text-indigo-950">Dreamer</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-indigo-950">$9.99</span>
              <span className="text-slate-400 text-sm">/mo</span>
            </div>
            <ul className="space-y-4">
              {['Unlimited Plans', 'Smart Habit Tracker', 'AI Bestie Chat', 'Custom Themes'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                  <span className="text-indigo-300">✨</span> {feature}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={onSelect} className="mt-10 w-full py-5 bg-indigo-950 text-white rounded-[2rem] font-bold text-lg hover:bg-black transition-all shadow-xl shadow-indigo-100">Get Started</button>
        </div>
      </div>

      <div className="glass-card p-10 rounded-[3rem] flex flex-col justify-between border-white shadow-xl hover:shadow-2xl transition-all group">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mastery</span>
            <h3 className="text-3xl font-bold text-indigo-950">Visionary</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-indigo-950">$79.99</span>
            <span className="text-slate-400 text-sm">/yr</span>
          </div>
          <ul className="space-y-4">
            {['Everything in Dreamer', 'Priority AI', 'Export to Notion/Calendar', 'Early Access'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600 text-sm">
                <span className="text-green-500">🌿</span> {feature}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={onSelect} className="mt-10 w-full py-4 bg-indigo-50 text-indigo-900 rounded-2xl font-bold hover:bg-indigo-100 transition-all">Go Pro</button>
      </div>
    </div>
  </div>
);

const Login: React.FC<{ onManualUser: (user: any) => void }> = ({ onManualUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (isPlaceholder) {
      setTimeout(() => { onManualUser({ email, id: 'demo-user' }); setLoading(false); }, 800);
      return;
    }
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20 bg-soft-gradient">
      <div className="glass-card w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl border-white/50 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-start gap-4">
          <Logo size="md" />
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-indigo-950 font-serif italic">{isSignUp ? 'Join the vibe 🌸' : 'Welcome back, Bestie! 🌸'}</h2>
            <p className="text-slate-500 text-sm">Your ideas deserve a plan.</p>
          </div>
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs">{error}</div>}
          <div className="space-y-3">
            <input type="email" placeholder="Email" required className="w-full px-6 py-4 bg-white/50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" required className="w-full px-6 py-4 bg-white/50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-950 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg disabled:opacity-50 active:scale-95">
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>
        </form>
        <p className="text-left text-sm text-slate-500">
          {isSignUp ? 'Already joined?' : "New here?"}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-indigo-600 font-bold hover:underline">
            {isSignUp ? 'Log In' : 'Sign Up Free'}
          </button>
        </p>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ onGenerate: (url: string) => void }> = ({ onGenerate }) => {
  const [url, setUrl] = useState('');
  return (
    <div className="max-w-2xl mx-auto px-6 pt-32 pb-20 space-y-12 reveal">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-indigo-950 font-serif italic">Bring your vision board to life ✨</h2>
        <p className="text-slate-500 text-lg">Paste a link to any Pinterest board. We'll turn your ideas into something you can actually do.</p>
      </div>
      <div className="glass-card p-10 rounded-[3rem] shadow-xl border-white space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 ml-1">Pinterest Board URL</label>
          <input type="text" placeholder="https://pinterest.com/..." className="w-full px-6 py-5 bg-white border border-slate-100 rounded-3xl focus:ring-4 focus:ring-indigo-50 transition-all outline-none text-lg" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <button onClick={() => onGenerate(url)} disabled={!url} className="w-full py-5 bg-indigo-950 text-white rounded-3xl font-bold text-lg hover:scale-[1.02] transition-all shadow-xl shadow-indigo-100 active:scale-95">✨ Generate My Action Plan</button>
      </div>
    </div>
  );
};

const Processing: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length), 2800);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center space-y-12 bg-soft-gradient">
      <div className="relative animate-float">
        <Logo size="lg" />
      </div>
      <div className="space-y-4 max-w-sm">
        <h3 className="text-2xl font-bold text-indigo-950 animate-pulse">{LOADING_MESSAGES[messageIndex]}</h3>
        <p className="text-indigo-300 text-xs tracking-[0.3em] uppercase font-bold">manifesting your life</p>
      </div>
    </div>
  );
};

const PlanResult: React.FC<{ plan: ActionPlan; onReset: () => void }> = ({ plan, onReset }) => (
  <div className="max-w-5xl mx-auto px-6 pt-28 pb-32 space-y-12 reveal">
    <div className="space-y-4 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Ready to Bloom
      </div>
      <h2 className="text-5xl md:text-6xl font-bold text-indigo-950 max-w-3xl mx-auto leading-tight italic font-serif">"{plan.goal}"</h2>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-3 glass-card p-12 rounded-[3.5rem] space-y-8 shadow-2xl">
        <h3 className="text-2xl font-bold text-indigo-950 flex items-center gap-2">🗓️ Weekly Roadmap</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {plan.weeklyPlan.map((day, i) => (
            <div key={i} className="bg-white/60 p-6 rounded-3xl border border-white hover:bg-white transition-all group">
              <span className="font-black text-indigo-300 text-[10px] uppercase block mb-3">{day.day}</span>
              <ul className="space-y-2">
                {day.actions.map((act, j) => (<li key={j} className="text-sm text-slate-700 leading-snug">{act}</li>))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-card p-10 rounded-[3rem] space-y-6 shadow-xl">
        <h3 className="text-xl font-bold text-indigo-950 flex items-center gap-2">🌱 First Steps</h3>
        <div className="space-y-4">
          {plan.firstSteps.map((step, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" className="mt-1 w-5 h-5 rounded-lg border-2 border-indigo-100 text-indigo-600 focus:ring-indigo-100" />
              <span className="text-slate-700 text-sm group-hover:text-indigo-600 transition-colors">{step}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] space-y-8 shadow-xl">
        <h3 className="text-xl font-bold text-indigo-950 flex items-center gap-2">💎 Core Habits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plan.suggestedHabits.map((habit, i) => (
            <div key={i} className="p-8 bg-indigo-950 text-white rounded-[2.5rem] shadow-lg flex flex-col gap-2 group hover:scale-[1.02] transition-transform">
              <span className="text-indigo-300 font-bold text-[10px] uppercase tracking-widest">Habit #{i+1}</span>
              <span className="font-semibold text-lg leading-tight">{habit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row gap-4 pt-12 justify-center">
      <button className="px-10 py-5 bg-white text-indigo-950 border border-slate-100 rounded-full font-bold shadow-sm hover:bg-slate-50 transition-all">📥 Download PDF</button>
      <button onClick={onReset} className="px-10 py-5 bg-indigo-950 text-white rounded-full font-bold shadow-xl hover:bg-black transition-all">✨ Create New Plan</button>
    </div>
  </div>
);

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); if (session?.user) setState(AppState.DASHBOARD); setInitializing(false); }).catch(() => setInitializing(false));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); setState(session?.user ? AppState.DASHBOARD : AppState.LANDING); });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); setState(AppState.LANDING); };
  const handleGenerate = async (url: string) => {
    setState(AppState.PROCESSING);
    setError(null);
    try { const generatedPlan = await generatePlanFromBoard(url); setPlan(generatedPlan); setState(AppState.RESULT); }
    catch (err) { setError("Analysis failed. Try a public Pinterest link."); setState(AppState.DASHBOARD); }
  };

  if (initializing) return (
    <div className="min-h-screen flex items-center justify-center bg-soft-gradient">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-indigo-300 tracking-widest animate-pulse">SETTING THE VIBE</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Header user={user} onLogout={handleLogout} onNavigate={setState} />
      <main>
        {state === AppState.LANDING && <Landing onStart={() => setState(AppState.LOGIN)} onViewPricing={() => setState(AppState.PRICING)} />}
        {state === AppState.LOGIN && <Login onManualUser={(u) => { setUser(u); setState(AppState.DASHBOARD); }} />}
        {state === AppState.PRICING && <Pricing onSelect={() => setState(user ? AppState.DASHBOARD : AppState.LOGIN)} />}
        {state === AppState.DASHBOARD && <Dashboard onGenerate={handleGenerate} />}
        {state === AppState.PROCESSING && <Processing />}
        {state === AppState.RESULT && plan && <PlanResult plan={plan} onReset={() => setState(AppState.DASHBOARD)} />}
        {error && <div className="fixed bottom-10 right-10 glass-card px-6 py-4 rounded-2xl text-red-600 shadow-2xl z-50">{error}</div>}
      </main>
    </div>
  );
};

export default App;
