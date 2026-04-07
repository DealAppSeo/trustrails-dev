"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Attempt auto-create table on first run via rpc or just insert
    // Waitlist table must exist. The prompt said:
    // Store email in Supabase waitlist table:
    // CREATE TABLE IF NOT EXISTS waitlist ...
    // Since we can't reliably run raw DDL from client, we just assume it exists 
    // or rely on a script. I will create a script to run the setup manually just in case.
    
    const { error: insertError } = await supabase.from('waitlist').insert([{ email }]);
    
    setLoading(false);
    
    if (insertError) {
      if (insertError.code === '23505') {
        setError('You are already on the list!');
      } else {
        setError('Error joining waitlist.');
        console.error(insertError);
      }
    } else {
      setDone(true);
    }
  };

  if (done) return <div className="text-[#22c55e] text-sm font-bold h-[42px] flex items-center justify-center">You are on the list!</div>;

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row justify-center gap-2 items-center">
      <input 
        type="email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        required 
        placeholder="Enter your email" 
        className="bg-[#1e293b] border border-[#334155] text-white px-4 py-2 rounded text-sm w-64 h-[42px] focus:outline-none focus:border-[#3b82f6]" 
      />
      <button 
        type="submit" 
        disabled={loading}
        className="bg-[#f59e0b] text-[#0a0f1e] font-bold px-4 py-2 rounded text-sm h-[42px] hover:bg-[#d97706] transition-colors disabled:opacity-50"
      >
        {loading ? 'Joining...' : 'Get Early Access'}
      </button>
      {error && <div className="text-red-500 text-xs mt-2 w-full text-center sm:absolute sm:mt-12">{error}</div>}
    </form>
  );
}
