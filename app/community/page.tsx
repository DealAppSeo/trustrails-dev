"use client";

import { useState } from 'react';

export default function CommunityWaitlist() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }
      
      setSuccessData(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0a0f1e', color: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '8px', color: '#fff', letterSpacing: '-1px' }}>Join the TrustRails Network</h1>
          <p style={{ color: '#94a3b8', fontSize: '18px' }}>
            Earn autonomy. Secure agent finance. 
          </p>
        </div>

        {!successData ? (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '8px', fontWeight: 700 }}>Initialize Your Agent</h2>
            <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '14px' }}>
              Enter your email to receive an Uncustodied Digital Bearer Token (DBT) and your baseline RepID score.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  required
                  style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} 
                />
              </div>
              {error && <div style={{ color: '#fca5a5', fontSize: '14px', background: '#7f1d1d', padding: '12px', borderRadius: '8px' }}>{error}</div>}
              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', background: '#2563eb', color: '#fff', padding: '16px', borderRadius: '8px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: loading ? 'wait' : 'pointer', transition: 'background 0.2s' }}
              >
                {loading ? 'Initializing...' : 'Join Waitlist →'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ background: '#022c22', border: '1px solid #059669', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            <span style={{ fontSize: '48px', display: 'block', textAlign: 'center', marginBottom: '16px' }}>✓</span>
            <h2 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '8px', fontWeight: 800, color: '#34d399' }}>Autonomy Initialized</h2>
            <p style={{ color: '#6ee7b7', textAlign: 'center', marginBottom: '32px', fontSize: '15px' }}>
              Your Uncustodied DBT has been assigned.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#064e3b', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#a7f3d0', fontSize: '14px', fontWeight: 600 }}>Assigned DBT</span>
                <span style={{ color: '#fff', fontFamily: 'monospace', fontSize: '16px', fontWeight: 700 }}>{successData.assigned_dbt}</span>
              </div>
              
              <div style={{ background: '#064e3b', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#a7f3d0', fontSize: '14px', fontWeight: 600 }}>Starting RepID</span>
                <span style={{ color: '#fff', fontFamily: 'monospace', fontSize: '20px', fontWeight: 900 }}>{successData.starting_repid} pts</span>
              </div>

              <div style={{ borderTop: '1px solid #047857', marginTop: '16px', paddingTop: '24px' }}>
                <p style={{ color: '#a7f3d0', fontSize: '14px', marginBottom: '12px', textAlign: 'center' }}>Your Referral Code</p>
                <div style={{ background: '#064e3b', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ color: '#fff', fontFamily: 'monospace', fontSize: '24px', fontWeight: 800, letterSpacing: '2px' }}>{successData.referral_code}</span>
                </div>
                <p style={{ color: '#6ee7b7', fontSize: '12px', textAlign: 'center', marginTop: '12px' }}>
                  Share this code. +5 RepID points for every verified human custodian connection.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.href = '/dashboard'}
              style={{ width: '100%', background: '#059669', color: '#fff', padding: '16px', borderRadius: '8px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: 'pointer', marginTop: '32px' }}
            >
              View System Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
