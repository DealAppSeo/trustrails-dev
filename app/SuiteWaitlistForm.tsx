"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function SuiteWaitlistForm() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Explicit source as per instructions
    const { error: insertError } = await supabase.from('waitlist').insert([
      { email, source: 'hyperdag-suite' }
    ]);
    
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

  if (done) return <div style={{ color: '#10b981', fontSize: '15px', fontWeight: 'bold', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>You're in.</div>;

  return (
    <form onSubmit={submit} style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', maxWidth: '400px', margin: '0 auto', flexWrap: 'wrap' }}>
      <input 
        type="email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        required 
        placeholder="Enter your email" 
        style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', flex: 1, minWidth: '200px' }} 
      />
      <button 
        type="submit" 
        disabled={loading}
        style={{ background: 'linear-gradient(to right, #10b981, #059669)', color: '#fff', fontWeight: 'bold', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', border: 'none', cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.5 : 1 }}
      >
        {loading ? 'Joining...' : 'Get Early Access'}
      </button>
      {error && <div style={{ color: '#ef4444', fontSize: '12px', width: '100%', textAlign: 'center', marginTop: '4px' }}>{error}</div>}
    </form>
  );
}
