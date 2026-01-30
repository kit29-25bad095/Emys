
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const TemporalDrift: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const loadingMessages = [
    "Synchronizing historical imagery archives...",
    "Calibrating temporal vectors for GSD normalization...",
    "Synthesizing 1080p planetary time-lapse...",
    "Finalizing neural rendering of land-use changes...",
    "Uplinking rendered stream to control desk..."
  ];

  const generateTimeLapse = async () => {
    if (!prompt.trim()) return;

    try {
      setIsGenerating(true);
      setVideoUrl(null);
      let msgIndex = 0;
      const msgInterval = setInterval(() => {
        setStatusMessage(loadingMessages[msgIndex]);
        msgIndex = (msgIndex + 1) % loadingMessages.length;
      }, 5000);

      // Check for API Key selection (as per Veo rules)
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
      if (!hasKey) {
        setStatusMessage("Awaiting user API key selection...");
        await (window as any).aistudio?.openSelectKey();
        // Proceeding after prompt
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Planetary earth observation time-lapse: ${prompt}, high-fidelity, satellite view, photorealistic`,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const fetchRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await fetchRes.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }

      clearInterval(msgInterval);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        // Handle race condition/stale key
        await (window as any).aistudio?.openSelectKey();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden h-full flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1">Temporal_Engine</h3>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Drift Synthesis</h2>
          <p className="text-[10px] text-slate-500 mt-2 font-mono leading-relaxed max-w-xs">
            Generate high-resolution video reconstructions of geographical shifts using Veo neural rendering.
          </p>
        </div>
        <div className="flex gap-2">
           <span className="px-2 py-1 rounded bg-slate-800 text-[8px] font-mono text-slate-400 border border-slate-700">1080P_HD</span>
           <span className="px-2 py-1 rounded bg-emerald-500/10 text-[8px] font-mono text-emerald-400 border border-emerald-500/20">VEO_v3.1</span>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] bg-slate-950/60 rounded-3xl border border-slate-800/50 relative overflow-hidden flex items-center justify-center">
        {videoUrl ? (
          <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
        ) : isGenerating ? (
          <div className="text-center px-10">
            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-6 mx-auto"></div>
            <p className="text-sm font-black text-white uppercase tracking-widest mb-2">Synthesizing_Temporal_Drift</p>
            <p className="text-[10px] font-mono text-emerald-500/80 animate-pulse">{statusMessage}</p>
          </div>
        ) : (
          <div className="text-center opacity-40">
             <div className="text-6xl mb-4">📽️</div>
             <p className="text-[10px] font-mono uppercase tracking-[0.3em]">Temporal Plane Idle</p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Urban expansion of Dubai 2010-2024..."
          className="flex-1 bg-slate-950/60 border border-slate-800 rounded-2xl px-6 py-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50"
        />
        <button 
          onClick={generateTimeLapse}
          disabled={isGenerating || !prompt.trim()}
          className={`px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isGenerating ? 'bg-slate-800 text-slate-600' : 'bg-emerald-500 text-slate-950 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'}`}
        >
          {isGenerating ? 'PROCESSING...' : 'RUN_SYNTHESIS'}
        </button>
      </div>
    </div>
  );
};

export default TemporalDrift;
