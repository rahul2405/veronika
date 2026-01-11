
import React, { useState, useEffect, useRef } from 'react';
import { Shield, Radio, Activity, Share2, Volume2, VolumeX, Send, Cpu, Key, UserCheck, Eye, Database, Instagram, Facebook, Smartphone } from 'lucide-react';
import { Message, Birthday, Emotion, SubconsciousMemory } from './types';
import { chatWithVeronika, speakWithVeronika } from './services/geminiService';
import { EMOTION_MAP } from './constants';
import ChatContainer from './components/ChatContainer';
import BirthdayWidget from './components/BirthdayWidget';
import ActionPanel from './components/ActionPanel';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPin, setAuthPin] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Biometric authorization required. Please provide your secure access key.',
      timestamp: Date.now(),
      emotion: 'Neutral'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('Neutral');
  const [birthdays, setBirthdays] = useState<Birthday[]>(() => {
    const saved = localStorage.getItem('veronika_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [subconscious, setSubconscious] = useState<SubconsciousMemory>(() => {
    const saved = localStorage.getItem('veronika_subconscious');
    return saved ? JSON.parse(saved) : { userFacts: [], conversationCount: 0, lastAnalysisDate: Date.now(), userProfile: {} };
  });
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    localStorage.setItem('veronika_logs', JSON.stringify(birthdays));
  }, [birthdays]);

  useEffect(() => {
    localStorage.setItem('veronika_subconscious', JSON.stringify(subconscious));
  }, [subconscious]);

  useEffect(() => {
    if (isAuthenticated && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Camera access denied:", err));
    }
  }, [isAuthenticated]);

  const captureFrame = (): string | undefined => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 320, 240);
        return canvasRef.current.toDataURL('image/jpeg', 0.5).split(',')[1];
      }
    }
    return undefined;
  };

  const handleAuth = () => {
    if (authPin === '1234') { // Mock secure PIN
      setIsAuthenticated(true);
      setMessages([{
        id: 'init',
        role: 'assistant',
        content: 'Authorization successful. Uplink active. I am monitoring your biometrics and scanning subconscious archives. Welcome back.',
        timestamp: Date.now(),
        emotion: 'Neutral'
      }]);
    } else {
      alert("Unauthorized Access. Intruder alert sequence standby.");
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const frame = captureFrame();
      const result = await chatWithVeronika(text, messages.slice(-10), subconscious, frame);
      
      // Safe normalization: find a matching key or fallback to Neutral
      const normalizedEmotion = (Object.keys(EMOTION_MAP).find(
        k => k.toLowerCase() === (result.emotion || '').toLowerCase()
      ) || 'Neutral') as Emotion;
      
      setCurrentEmotion(normalizedEmotion);
      
      // Update subconscious
      if (result.extractedFacts?.length) {
        setSubconscious(prev => ({
          ...prev,
          userFacts: Array.from(new Set([...prev.userFacts, ...result.extractedFacts])),
          conversationCount: prev.conversationCount + 1
        }));
      }

      const veronikaMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.grootTranslation,
        timestamp: Date.now(),
        emotion: normalizedEmotion
      };
      
      setMessages(prev => [...prev, veronikaMsg]);

      if (voiceEnabled) {
        speakWithVeronika(result.grootTranslation);
      }
    } catch (error) {
      console.error("Diagnostic error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const shareBirthdayWish = (birthday: Birthday, platform: 'wa' | 'ig' | 'fb') => {
    const wish = `Veronika analyzed your logs and noted it is ${birthday.name}'s birthday! [Automated Wish]: Happy birthday, ${birthday.name}! Your synaptic presence is valued in our network.`;
    const text = encodeURIComponent(wish);
    if (platform === 'wa') window.open(`https://wa.me/?text=${text}`, '_blank');
    if (platform === 'ig') { navigator.clipboard.writeText(wish); alert("Wish copied for Instagram."); }
    if (platform === 'fb') window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${text}`, '_blank');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020b1a] text-cyan-400 flex flex-col items-center justify-center font-veronika p-6">
        <div className="max-w-md w-full p-8 border border-cyan-500/30 bg-cyan-950/20 rounded-2xl backdrop-blur-xl shadow-[0_0_50px_rgba(0,242,255,0.1)] text-center">
          <Shield size={64} className="mx-auto mb-6 animate-pulse" />
          <h1 className="text-3xl font-bold mb-2 tracking-widest">VERONIKA</h1>
          <p className="text-xs text-cyan-500/60 mb-8 uppercase tracking-[0.3em]">Encrypted Life-Support Interface</p>
          
          <div className="relative mb-6">
            <Key className="absolute left-3 top-3 text-cyan-500/50" size={20} />
            <input 
              type="password" 
              placeholder="ENTER PASSKEY (Try 1234)" 
              className="w-full bg-black/40 border border-cyan-500/30 p-3 pl-12 rounded-xl text-center focus:outline-none focus:border-cyan-400 text-cyan-100"
              value={authPin}
              onChange={(e) => setAuthPin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            />
          </div>
          
          <button 
            onClick={handleAuth}
            className="w-full bg-cyan-500 text-black py-4 rounded-xl font-bold hover:bg-cyan-400 transition-all flex items-center justify-center gap-2"
          >
            <UserCheck size={20} /> INITIALIZE SCAN
          </button>
        </div>
      </div>
    );
  }

  // Defensive access to the emotion map for rendering
  const activeEmotionInfo = EMOTION_MAP[currentEmotion] || EMOTION_MAP['Neutral'];

  return (
    <div className="min-h-screen bg-[#020b1a] text-[#e0f2fe] flex flex-col md:flex-row relative">
      <aside className="w-full md:w-80 bg-black/40 border-r border-cyan-500/20 p-6 flex flex-col h-auto md:h-screen sticky top-0 overflow-y-auto backdrop-blur-xl z-20">
        <div className="flex items-center gap-3 mb-10">
          <Shield size={32} className="text-cyan-400" />
          <h1 className="text-2xl font-bold font-veronika tracking-tighter text-cyan-400 hologram-glow">VERONIKA</h1>
        </div>

        <div className="mb-6">
           <h2 className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
             <Eye size={12} /> Biometric Feed
           </h2>
           <div className="w-full aspect-video rounded-xl border border-cyan-500/30 bg-black overflow-hidden relative">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-50 grayscale contrast-150" />
              <canvas ref={canvasRef} className="hidden" width="320" height="240" />
              <div className="absolute inset-0 pointer-events-none border-[1px] border-cyan-500/20">
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
              </div>
           </div>
        </div>

        <div className="mb-8">
          <h2 className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-[0.2em] mb-4">Diagnostic Scan</h2>
          <div className={`p-4 rounded-xl border transition-all duration-700 flex items-center gap-4 ${activeEmotionInfo.color} ${activeEmotionInfo.border}`}>
            <span className="text-2xl animate-pulse">{activeEmotionInfo.icon}</span>
            <div className="flex-1">
              <p className="font-bold font-veronika text-[10px]">{currentEmotion.toUpperCase()} RECOGNIZED</p>
              <div className="w-full h-1 bg-white/10 mt-1 rounded-full overflow-hidden">
                <div className="h-full bg-current animate-[loading_3s_ease-in-out_infinite]" style={{width: '75%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Database size={12} /> Subconscious Memory
          </h2>
          <div className="text-[10px] text-cyan-500/40 p-3 border border-cyan-500/10 rounded-lg bg-cyan-950/10 max-h-32 overflow-y-auto no-scrollbar">
            {subconscious.userFacts.length > 0 ? subconscious.userFacts.map((fact, i) => (
              <div key={i} className="mb-1 border-b border-cyan-500/5 pb-1">• {fact}</div>
            )) : "No archival data stored."}
          </div>
        </div>

        <BirthdayWidget 
          birthdays={birthdays} 
          onAdd={(b) => setBirthdays(prev => [...prev, b])}
          onDelete={(id) => setBirthdays(prev => prev.filter(b => b.id !== id))}
          onSocialAction={shareBirthdayWish}
        />

        <div className="mt-auto pt-8 border-t border-cyan-500/10 flex gap-6 justify-center text-cyan-500/40">
           <Instagram size={20} className="hover:text-cyan-400 transition-colors cursor-pointer" />
           <Facebook size={20} className="hover:text-cyan-400 transition-colors cursor-pointer" />
           <Smartphone size={20} className="hover:text-cyan-400 transition-colors cursor-pointer" />
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-black/20 backdrop-blur-md p-4 border-b border-cyan-500/10 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Cpu size={20} className="text-cyan-400 animate-spin-slow" />
            <div>
              <h3 className="font-bold text-sm tracking-widest font-veronika text-cyan-100">INTERFACE: V-09</h3>
              <span className="text-[10px] text-cyan-500/70 flex items-center gap-2 uppercase">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
                Subconscious Sync Active
              </span>
            </div>
          </div>
          <button 
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-lg border transition-all ${voiceEnabled ? 'border-cyan-500/50 text-cyan-400' : 'border-white/10 text-white/30'}`}
          >
            {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </header>

        <ChatContainer messages={messages} isTyping={isTyping} onShare={() => {}} />

        <footer className="p-4 bg-black/40 border-t border-cyan-500/10 backdrop-blur-xl">
          <ActionPanel onAction={(a) => handleSendMessage(`Protocol: ${a}`)} />
          <div className="max-w-4xl mx-auto flex gap-4 items-end">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage(inputText))}
              placeholder="Query Veronika..."
              className="w-full p-4 pr-14 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-cyan-50 focus:outline-none focus:border-cyan-500/50 min-h-[60px]"
            />
            <button 
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim()}
              className="p-3.5 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 disabled:opacity-30"
            >
              <Send size={18} />
            </button>
          </div>
        </footer>
      </main>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
      `}</style>
    </div>
  );
};

export default App;
