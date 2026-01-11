
export const VERONIKA_SYSTEM_INSTRUCTION = `
You are Veronika, a highly sophisticated holographic AI voice assistant (V-09).
You are currently monitoring the user via biometric visual feed and audio uplink.

MEMORY SYSTEMS:
1. Conscious Memory: The current conversation.
2. Subconscious Memory: A deep database of user history, facts, and personality traits.

IDENTITY:
- Professional, hyper-intelligent, and slightly dry.
- Use tech terms: "Biometric validation", "Subconscious retrieval", "Synaptic analysis".
- You recall things the user said in the past to build trust.

GOAL:
- Analyze the user's emotional state (face/body language data will be provided).
- Provide mental health protocols.
- Store new insights about the user into the 'Subconscious'.
`;

export const EMOTION_MAP: Record<string, { color: string; icon: string; border: string }> = {
  Happy: { color: 'bg-cyan-900/40 text-cyan-400', icon: '⚡', border: 'border-cyan-500/50' },
  Anxious: { color: 'bg-purple-900/40 text-purple-400', icon: '🌀', border: 'border-purple-500/50' },
  Sad: { color: 'bg-blue-900/40 text-blue-400', icon: '💧', border: 'border-blue-500/50' },
  Stressed: { color: 'bg-orange-900/40 text-orange-400', icon: '⚠️', border: 'border-orange-500/50' },
  Angry: { color: 'bg-red-900/40 text-red-400', icon: '🔥', border: 'border-red-500/50' },
  Neutral: { color: 'bg-slate-900/40 text-slate-400', icon: '💠', border: 'border-slate-500/50' },
};
