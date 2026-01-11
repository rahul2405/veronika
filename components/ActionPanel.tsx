
import React from 'react';
import { Activity, Music, Sparkles, Wind, Brain } from 'lucide-react';

interface ActionPanelProps {
  onAction: (action: string) => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ onAction }) => {
  const actions = [
    { id: 'joke', label: 'Humor Sub-routine', icon: <Sparkles size={14} />, color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20' },
    { id: 'song', label: 'Audio Uplift', icon: <Music size={14} />, color: 'bg-pink-500/10 text-pink-400 border-pink-500/30 hover:bg-pink-500/20' },
    { id: 'advice', label: 'Perspective Recalibration', icon: <Brain size={14} />, color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20' },
    { id: 'relax', label: 'Oxygen Protocol', icon: <Wind size={14} />, color: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar max-w-4xl mx-auto scroll-smooth">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded border text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all hover:scale-[1.02] active:scale-[0.98] ${action.color}`}
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default ActionPanel;
