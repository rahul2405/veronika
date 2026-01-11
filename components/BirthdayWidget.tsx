
import React, { useState } from 'react';
import { Radio, Plus, Trash2, Database, Send, Instagram, Facebook } from 'lucide-react';
import { Birthday } from '../types';

interface BirthdayWidgetProps {
  birthdays: Birthday[];
  onAdd: (b: Birthday) => void;
  onDelete: (id: string) => void;
  onSocialAction?: (b: Birthday, platform: 'wa' | 'ig' | 'fb') => void;
}

const BirthdayWidget: React.FC<BirthdayWidgetProps> = ({ birthdays, onAdd, onDelete, onSocialAction }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newDate) {
      onAdd({ id: Date.now().toString(), name: newName, date: newDate });
      setNewName(''); setNewDate(''); setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-bold text-cyan-500/60 uppercase tracking-[0.2em] flex items-center gap-2">
          <Database size={12} />
          Event Registry
        </h2>
        <button onClick={() => setIsAdding(!isAdding)} className="p-1 hover:bg-cyan-500/10 text-cyan-400 border border-transparent hover:border-cyan-500/30 transition-all rounded">
          <Plus size={16} />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-cyan-950/20 p-3 rounded-lg border border-cyan-500/20 space-y-2">
          <input type="text" placeholder="Identity" className="w-full text-xs p-2 rounded bg-black/40 border border-cyan-500/20 text-cyan-100" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <input type="date" className="w-full text-xs p-2 rounded bg-black/40 border border-cyan-500/20 text-cyan-100" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
          <button type="submit" className="w-full text-[10px] bg-cyan-500 text-black py-2 rounded font-bold uppercase">Archive</button>
        </form>
      )}

      <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
        {birthdays.map((b) => (
          <div key={b.id} className="group p-3 rounded-lg bg-black/20 border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Radio size={12} className="text-cyan-400" />
                <span className="text-xs text-cyan-100 uppercase font-semibold tracking-tighter">{b.name}</span>
              </div>
              <button onClick={() => onDelete(b.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all">
                <Trash2 size={12} />
              </button>
            </div>
            <div className="flex items-center justify-between">
               <span className="text-[9px] text-cyan-500/40 uppercase">{new Date(b.date).toLocaleDateString()}</span>
               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => onSocialAction?.(b, 'wa')} className="text-cyan-500/60 hover:text-cyan-400"><Send size={10} /></button>
                  <button onClick={() => onSocialAction?.(b, 'ig')} className="text-cyan-500/60 hover:text-cyan-400"><Instagram size={10} /></button>
                  <button onClick={() => onSocialAction?.(b, 'fb')} className="text-cyan-500/60 hover:text-cyan-400"><Facebook size={10} /></button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BirthdayWidget;
