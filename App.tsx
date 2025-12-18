
import React, { useState, useEffect } from 'react';
import { AppState, User, ActionPlan } from './types';
import { LOADING_MESSAGES } from './constants';
import { generatePlanFromBoard } from './services/geminiService';
import { supabase } from './services/supabaseClient';

// --- Sub-components ---

const Header: React.FC<{ user: any; onLogout: () => void }> = ({ user, onLogout }) => (
  <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center transition-all bg-white/30 backdrop-blur-sm">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-pink-300 rounded-full flex items-center justify-center text-white font-bold shadow-sm">P</div>
      <span className="text-xl font-bold tracking-tight text-indigo-900">Pinterest-to-Life</span>
    </div>
    {user && (
      <div className="flex items-center gap-4">
        <span className="hidden sm:block text-xs font-medium text-indigo-400">{user.email}</span>
        <button 
          onClick={onLogout}
          className="text-sm font-medium text-slate-500 hover:text-pink-600 transition-colors"
        >
          Logout
        </button>
      </div>
    )}
  </header>
);

const Landing: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 pt-20">
    <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <h1 className="text-5xl md:text-7xl font-bold text-indigo-950 leading-tight">
        Turn inspiration <br />
        <span className="italic text-pink-400">into action</span> ✨
      </h1>
      <p className="text-xl text-slate-600 max-w-xl mx-auto font-light leading-relaxed">
        From Pinterest boards to real-life plans. We help you build the life you've been pinning.
      </p>
      <button 
        onClick={onStart}
        className="px-10 py-5 bg-indigo-900 text-white rounded-full text-lg font-semibold hover:bg-indigo-800 transform hover:-translate-y-1 transition-all shadow-xl shadow-indigo-100"
      >
        Get started for free
      </button>
      <div className="pt-12 flex justify-center gap-4 flex-wrap opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
        <img src="https://picsum.photos/seed/p1/200/200" className="w-24 h-24 rounded-2xl object-cover -rotate-6 shadow-lg" alt="inspiration" />
        <img src="https://picsum.photos/seed/p2/200/200" className="w-24 h-24 rounded-2xl object-cover rotate-3 shadow-lg" alt="inspiration" />
        <img src="https://picsum.photos/seed/p3/200/200" className="w-24 h-24 rounded-2xl object-cover rotate-12 shadow-lg" alt="inspiration" />
        <img src="https://picsum.photos/seed/p4/200/200" className="w-24 h-24 rounded-2xl object-cover -rotate-12 shadow-lg" alt="inspiration" />
      </div>
    </div>
  </div>
);

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20">
      <div className="glass-card w-full max-w-md p-10 rounded-3xl shadow-2xl border-white/50 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-indigo-950">{isSignUp ? 'Join the vibe 🌸' : 'Welcome back, Bestie! 🌸'}</h2>
          <p className="text-slate-500">Your ideas deserve a plan. Let's make them happen.</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm border border-red-100 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors font-medium text-slate-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white/80 backdrop-blur px-2 text-slate-400">or use email</span></div>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <input 
              type="email" 
              placeholder="Email address"
              required
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password"
              required
              className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-pink-400 text-white rounded-2xl font-bold text-lg hover:bg-pink-500 transition-all disabled:opacity-50 shadow-lg shadow-pink-100 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                isSignUp ? 'Sign Up' : 'Log In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 pt-4">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-pink-500 font-bold hover:underline"
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// ... Rest of Dashboard, Processing and PlanResult components (unchanged) ...
const Dashboard: React.FC<{ onGenerate: (url: string) => void }> = ({ onGenerate }) => {
  const [url, setUrl] = useState('');
  return (
    <div className="max-w-2xl mx-auto px-6 pt-32 pb-20 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-indigo-950">Bring your vision board to life ✨</h2>
        <p className="text-slate-500 text-lg">Paste a link to any Pinterest board. We'll turn your ideas into something you can actually do.</p>
      </div>
      <div className="glass-card p-8 rounded-[2rem] shadow-xl border-white space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">Pinterest Board URL</label>
          <input 
            type="text" 
            placeholder="https://pinterest.com/username/my-aesthetic-board"
            className="w-full px-6 py-5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all outline-none text-lg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button 
          onClick={() => onGenerate(url)}
          disabled={!url}
          className="w-full py-5 bg-indigo-900 text-white rounded-2xl font-bold text-lg hover:bg-indigo-950 transform hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span>✨</span> Generate my plan
        </button>
        <p className="text-center text-sm text-slate-400">Try boards like "Minimalist Home", "Daily Wellness", or "Career Goals".</p>
      </div>
    </div>
  );
};

const Processing: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center space-y-12">
      <div className="relative">
        <div className="w-32 h-32 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">✨</span>
        </div>
      </div>
      <div className="space-y-2 max-w-sm">
        <h3 className="text-2xl font-bold text-indigo-950 transition-all animate-pulse">
          {LOADING_MESSAGES[messageIndex]}
        </h3>
        <p className="text-slate-400 text-sm">Our AI is hand-crafting your unique action plan...</p>
      </div>
    </div>
  );
};

const PlanResult: React.FC<{ plan: ActionPlan; onReset: () => void }> = ({ plan, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-32 space-y-10">
      <div className="space-y-2 text-center">
        <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest">Plan Generated</span>
        <h2 className="text-4xl font-bold text-indigo-950">{plan.goal}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2 glass-card p-8 rounded-[2rem] border-white/80 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🗓️</span>
            <h3 className="text-2xl font-bold text-indigo-900">Weekly Roadmap</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plan.weeklyPlan.map((day, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <span className="font-bold text-indigo-900 block mb-2">{day.day}</span>
                <ul className="space-y-2">
                  {day.actions.map((act, j) => (
                    <li key={j} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-indigo-300">•</span> {act}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-8 rounded-[2rem] border-white/80 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🌱</span>
            <h3 className="text-2xl font-bold text-indigo-900">First Steps</h3>
          </div>
          <div className="space-y-3">
            {plan.firstSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-6 h-6 rounded-md border-2 border-pink-200 flex-shrink-0 group-hover:bg-pink-50 transition-colors"></div>
                <span className="text-slate-700 font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-8 rounded-[2rem] border-white/80 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✨</span>
            <h3 className="text-2xl font-bold text-indigo-900">Suggested Habits</h3>
          </div>
          <div className="space-y-4">
            {plan.suggestedHabits.map((habit, i) => (
              <div key={i} className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <span className="text-indigo-900 font-medium">{habit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
        <button className="px-8 py-4 bg-indigo-900 text-white rounded-2xl font-bold hover:bg-indigo-950 transition-all">📥 Export as PDF</button>
        <button onClick={onReset} className="px-8 py-4 bg-pink-50 text-pink-600 rounded-2xl font-bold hover:bg-pink-100 transition-all">✨ New Board</button>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) setState(AppState.DASHBOARD);
      setInitializing(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setState(AppState.DASHBOARD);
      } else {
        setState(AppState.LANDING);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setState(AppState.LANDING);
  };

  const handleGenerate = async (url: string) => {
    setState(AppState.PROCESSING);
    setError(null);
    try {
      const generatedPlan = await generatePlanFromBoard(url);
      setPlan(generatedPlan);
      setState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setError("Oops! Something went wrong with the AI analysis.");
      setState(AppState.DASHBOARD);
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-gradient">
        <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (state) {
      case AppState.LANDING: return <Landing onStart={() => setState(AppState.LOGIN)} />;
      case AppState.LOGIN: return <Login />;
      case AppState.DASHBOARD: return (
        <>
          {error && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl border border-red-100 shadow-sm z-50">
              {error}
            </div>
          )}
          <Dashboard onGenerate={handleGenerate} />
        </>
      );
      case AppState.PROCESSING: return <Processing />;
      case AppState.RESULT: return plan ? <PlanResult plan={plan} onReset={() => setState(AppState.DASHBOARD)} /> : null;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Header user={user} onLogout={handleLogout} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
