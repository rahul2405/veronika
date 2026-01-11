
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { Share2, Copy, Send, Zap, ChevronRight } from 'lucide-react';

interface ChatContainerProps {
  messages: Message[];
  isTyping: boolean;
  onShare: (content: string, platform: 'whatsapp' | 'facebook' | 'copy') => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isTyping, onShare }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-8 scroll-smooth pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-start gap-4 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center text-[10px] font-bold tracking-tighter shadow-[0_0_10px_rgba(0,0,0,0.3)] transition-all ${
                msg.role === 'user' 
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                  : 'bg-cyan-600/20 border-cyan-500/50 text-cyan-400'
              }`}>
                {msg.role === 'user' ? 'USER' : 'V-09'}
              </div>
              
              <div className="flex flex-col gap-1">
                <div className={`relative group p-4 rounded-xl border backdrop-blur-md transition-all ${
                  msg.role === 'user' 
                    ? 'bg-blue-600/10 text-blue-100 border-blue-500/30 rounded-tr-none' 
                    : 'bg-cyan-600/5 text-cyan-50 border-cyan-500/20 rounded-tl-none shadow-[0_0_15px_rgba(0,242,255,0.05)]'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="absolute -top-1.5 -left-1.5">
                       <Zap size={10} className="text-cyan-400 fill-cyan-400 animate-pulse" />
                    </div>
                  )}
                  <p className="text-sm md:text-base leading-relaxed tracking-wide font-light whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.role === 'assistant' && (
                    <div className="mt-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                      <button 
                        onClick={() => onShare(msg.content, 'whatsapp')}
                        className="p-1.5 hover:bg-cyan-500/10 rounded border border-transparent hover:border-cyan-500/30 text-cyan-500/60 hover:text-cyan-400 transition-all"
                        title="Uplink to WhatsApp"
                      >
                        <Share2 size={12} />
                      </button>
                      <button 
                        onClick={() => onShare(msg.content, 'copy')}
                        className="p-1.5 hover:bg-cyan-500/10 rounded border border-transparent hover:border-cyan-500/30 text-cyan-500/60 hover:text-cyan-400 transition-all"
                        title="Copy String"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  )}
                </div>
                <span className={`text-[9px] font-veronika opacity-30 tracking-widest ${msg.role === 'user' ? 'text-right' : ''}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg border border-cyan-500/30 bg-cyan-600/20 flex items-center justify-center text-[10px] font-bold text-cyan-400">
              V-09
            </div>
            <div className="bg-cyan-600/5 border border-cyan-500/20 p-4 rounded-xl rounded-tl-none flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
              <span className="text-[10px] ml-2 text-cyan-400/50 font-veronika animate-pulse">PROCESSING...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
