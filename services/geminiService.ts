
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { VERONIKA_SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult, SubconsciousMemory } from "../types";

const API_KEY = process.env.API_KEY || "";

export const chatWithVeronika = async (
  message: string, 
  history: any[], 
  subconscious: SubconsciousMemory,
  imageFrame?: string // base64
) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = 'gemini-3-flash-preview';

  const parts: any[] = [
    { text: `[SUBCONSCIOUS_DATA]: ${JSON.stringify(subconscious)}` },
    { text: message }
  ];

  if (imageFrame) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageFrame
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: [
      ...history.map(h => ({ role: h.role === 'assistant' ? 'model' : 'user', parts: [{ text: h.content }] })),
      { role: 'user', parts }
    ],
    config: {
      systemInstruction: VERONIKA_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          emotion: { type: Type.STRING },
          advice: { type: Type.STRING },
          grootTranslation: { type: Type.STRING },
          extractedFacts: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "New facts to store in subconscious memory about the user."
          }
        },
        required: ["emotion", "advice", "grootTranslation", "extractedFacts"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const speakWithVeronika = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `In a sophisticated, calm, and intelligent female AI voice, say: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (base64Audio) {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const bytes = decode(base64Audio);
    const audioBuffer = await decodeAudioData(bytes, audioContext, 24000, 1);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  }
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
