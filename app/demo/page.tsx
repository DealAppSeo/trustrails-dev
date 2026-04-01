'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, ShieldAlert, Link as LinkIcon, Unlink, Activity } from 'lucide-react';

type Score = { rep_score: number; display_name: string; identity_type: string };
type Event = { id: string; event_type: string; target_address: string; details: any; tx_hash: string; created_at: string };

export default function TrustCeremonyDemo() {
  const [seanScore, setSeanScore] = useState<number>(75);
  const [melScore, setMelScore] = useState<number>(45);
  const [sophiaScore, setSophiaScore] = useState<number>(52);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const fetchScores = async () => {
    const urls = ['sean.sbt', 'mel.agent', 'sophia.agent'];
    for (const addr of urls) {
      try {
        const res = await fetch(`/api/repid/${addr}`);
        const data = await res.json();
        if (data.rep_score) {
          if (addr === 'sean.sbt') setSeanScore(Number(data.rep_score));
          if (addr === 'mel.agent') setMelScore(Number(data.rep_score));
          if (addr === 'sophia.agent') setSophiaScore(Number(data.rep_score));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/trust-events');
      const data = await res.json();
      if (Array.isArray(data)) setEvents(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchScores();
    fetchEvents();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'repid_scores' },
        () => fetchScores()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trust_events' },
        () => fetchEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAction = async (actionId: string, url: string, body: any) => {
    setLoading(actionId);
    setErrorToast(null);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Action failed');
      }
      // Scores update automatically via Supabase realtime subscription
    } catch (e: any) {
      setErrorToast(e.message);
      setTimeout(() => setErrorToast(null), 5000);
    } finally {
      setLoading(null);
    }
  };

  const IdentityCard = ({ name, type, score, color }: { name: string, type: string, score: number, color: string }) => (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col items-center shadow-lg transform transition-all hover:scale-105">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${color}`}>
        {type === 'SBT' ? <Shield className="w-8 h-8 text-white" /> : <Activity className="w-8 h-8 text-white" />}
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
      <span className="px-3 py-1 bg-slate-800 text-xs font-semibold rounded-full text-slate-400 mb-4">{type} Identity</span>
      <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
        {score} <span className="text-sm font-medium text-slate-500">RepID</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="border-b border-slate-800 pb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <ShieldAlert className="w-10 h-10 text-emerald-500" />
              Live Trust Ceremony
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Real-time KYA Verification and RepID Propagation via HyperDAG</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold text-emerald-500 tracking-wider">LIVE NETWORK</span>
          </div>
        </header>

        {errorToast && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-center shadow-xl animate-in slide-in-from-top-2">
            <ShieldAlert className="w-5 h-5 mr-3 text-red-400" />
            <span className="font-semibold">{errorToast}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <IdentityCard name="Sean (Sponsor)" type="SBT" score={seanScore} color="bg-indigo-600" />
          <IdentityCard name="MEL Agent" type="DBT" score={melScore} color="bg-emerald-600" />
          <IdentityCard name="SOPHIA Agent" type="DBT" score={sophiaScore} color="bg-amber-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <LinkIcon className="w-6 h-6 text-indigo-400" />
              Operator Actions
            </h2>
            <div className="space-y-4">
              <button 
                disabled={loading !== null}
                onClick={() => handleAction('vouch-mel', '/api/vouch', { target: 'mel.agent', type: 'revocable' })}
                className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-400 font-bold py-4 px-6 rounded-xl transition-colors flex justify-between items-center group disabled:opacity-50"
              >
                <span>Vouch for MEL (Revocable)</span>
                {loading === 'vouch-mel' ? <span className="animate-pulse">Tx Pending...</span> : <span className="opacity-0 group-hover:opacity-100 transition-opacity">→ +15 Rep</span>}
              </button>
              
              <button 
                disabled={loading !== null}
                onClick={() => handleAction('remove-mel', '/api/remove-vouch', { target: 'mel.agent' })}
                className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold py-4 px-6 rounded-xl transition-colors flex justify-between items-center group disabled:opacity-50"
              >
                <span>Remove MEL Vouching</span>
                {loading === 'remove-mel' ? <span className="animate-pulse">Tx Pending...</span> : <span className="hidden group-hover:flex items-center text-red-400"><Unlink className="w-4 h-4 mr-1"/> -15 Rep</span>}
              </button>

              <div className="h-px bg-slate-800 my-6"></div>

              <button 
                disabled={loading !== null}
                onClick={() => handleAction('vouch-sophia', '/api/vouch', { target: 'sophia.agent', type: 'time_locked' })}
                className="w-full bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/50 text-amber-400 font-bold py-4 px-6 rounded-xl transition-colors flex justify-between items-center group disabled:opacity-50"
              >
                <span>Vouch for SOPHIA (6-Month Lock)</span>
                {loading === 'vouch-sophia' ? <span className="animate-pulse">Tx Pending...</span> : <span className="opacity-0 group-hover:opacity-100 transition-opacity">→ +20 Rep</span>}
              </button>

              <button 
                disabled={loading !== null}
                onClick={() => handleAction('remove-sophia', '/api/remove-vouch', { target: 'sophia.agent' })}
                className="w-full bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 text-red-400 font-bold py-4 px-6 rounded-xl transition-colors flex justify-between items-center group disabled:opacity-50"
              >
                <span>Try to Unlink SOPHIA</span>
                {loading === 'remove-sophia' ? <span className="animate-pulse">Tx Pending...</span> : <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs border border-red-500/50 px-2 py-1 rounded">Constraint Check Active</span>}
              </button>
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-400" />
              Live Trust Events Feed
            </h2>
            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-4 pr-2">
              {events.length === 0 ? (
                <div className="text-center text-slate-500 py-10 italic">Waiting for consensus events...</div>
              ) : (
                events.map((ev) => (
                  <div key={ev.id} className="bg-slate-950 border border-slate-800 p-4 rounded-lg text-sm font-mono animate-in fade-in slide-in-from-left-4">
                    <div className="flex justify-between text-slate-500 mb-2 text-xs">
                      <span>{new Date(ev.created_at).toLocaleTimeString()}</span>
                      <span className="text-indigo-400/70 truncate w-32 tracking-wider">{ev.tx_hash?.substring(0, 16)}...</span>
                    </div>
                    <div className="text-white font-bold flex items-center gap-2">
                      <span className={ev.event_type.includes('BLOCKED') ? 'text-red-400' : 'text-emerald-400'}>[{ev.event_type}]</span>
                      {ev.target_address}
                    </div>
                    {ev.details && Object.keys(ev.details).length > 0 && (
                      <div className="mt-2 text-slate-400 text-xs mt-3 bg-slate-900 p-2 rounded">
                        {JSON.stringify(ev.details)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
