"use client";

// app/WaitlistForm.tsx
//
// STYLING IS INLINE, NOT TAILWIND, AND THAT IS THE FIX [MEASURED 2026-09-08].
//
// This component used to be styled entirely with Tailwind utility classes
// (`bg-[#1e293b]`, `px-4 py-2 rounded`, …). None of them did anything.
// `tailwindcss` is in package.json, but this repo has NO tailwind.config, NO
// postcss.config, and `app/globals.css` is imported by nothing — the only
// occurrence of the string "globals.css" in the tree is inside that file's own
// comment. So no utilities are ever generated and every class renders as bare
// unstyled markup. The signup form on the homepage was a naked input and button.
//
// Adding the Tailwind pipeline instead would pull a preflight reset across every
// existing surface, all of which are hand-styled inline — that is a visual
// redesign, not a fix. Inline styles are what actually works here today.

import { useId, useState } from 'react';
import { supabase } from '@/lib/supabase';

const FIELD: React.CSSProperties = {
  background: '#0b1220',
  border: '1px solid #334155',
  color: '#f1f5f9',
  padding: '0 14px',
  borderRadius: 8,
  fontSize: 15,
  height: 46,
  width: '100%',
  maxWidth: 300,
  outline: 'none',
  boxSizing: 'border-box',
};

const BUTTON: React.CSSProperties = {
  background: '#f59e0b',
  color: '#0a0f1e',
  fontWeight: 700,
  padding: '0 22px',
  borderRadius: 8,
  fontSize: 15,
  height: 46,
  border: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

export function WaitlistForm() {
  // The coming-soon page renders this component TWICE. A hardcoded element id
  // gave both instances the same one, which is invalid HTML and pointed both
  // <label>s at the first input — so the second field had no accessible name.
  const fieldId = useId();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: insertError } = await supabase.from('waitlist').insert([{ email }]);

    setLoading(false);

    if (insertError) {
      // Surface the real reason. A duplicate is a success from the visitor's
      // point of view; anything else is logged rather than swallowed.
      if (insertError.code === '23505') {
        setDone(true);
      } else {
        setError('That did not go through. Try again, or email us directly.');
        console.error('[waitlist]', insertError.code, insertError.message);
      }
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div style={{ color: '#22c55e', fontSize: 15, fontWeight: 600, minHeight: 46, display: 'flex', alignItems: 'center' }}>
        You’re on the list. We’ll be in touch.
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      <label htmlFor={fieldId} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
        Email address
      </label>
      <input
        id={fieldId}
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="you@company.com"
        style={FIELD}
      />
      <button type="submit" disabled={loading} style={{ ...BUTTON, opacity: loading ? 0.6 : 1 }}>
        {loading ? 'Sending…' : 'Get early access'}
      </button>
      {error && (
        <div style={{ color: '#f87171', fontSize: 13, width: '100%' }} role="alert">
          {error}
        </div>
      )}
    </form>
  );
}
