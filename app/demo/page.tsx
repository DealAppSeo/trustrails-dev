'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function DemoPage() {
  const [wallet, setWallet] = useState('');
  const [dbtTokenId, setDbtTokenId] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [smsOtp, setSmsOtp] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [factorsVerified, setFactorsVerified] = useState(0);
  const [sbtResult, setSbtResult] = useState<any>(null);

  // Poll trust_events every 3s
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/trustrails/trust-events?limit=20');
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events);
        }
      } catch (err) {}
    };
    fetchEvents();
    const interval = setInterval(fetchEvents, 3000);
    return () => clearInterval(interval);
  }, []);

  const initiatePol = async () => {
    setLoading(true);
    const res = await fetch('/api/trustrails/initiate-pol', {
      method: 'POST',
      body: JSON.stringify({ wallet_address: wallet })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setDbtTokenId(data.dbt_token_id);
      setStep(2);
    } else {
      alert(data.error);
    }
  };

  const verifyFactor = async (type: string, value: string) => {
    setLoading(true);
    const res = await fetch('/api/trustrails/verify-factor', {
      method: 'POST',
      body: JSON.stringify({ dbt_token_id: dbtTokenId, factor_type: type, value })
    });
    const data = await res.json();
    setLoading(false);
    
    if (res.ok) {
      setFactorsVerified(data.factors_verified);
      if (data.complete) {
        setSbtResult(data);
        generateReceipt(data.sbt_token_id);
        setStep(6);
      } else {
        if (type === 'email') setStep(3);
        if (type === 'sms') setStep(4);
        if (type === 'biometric') setStep(5);
      }
    } else {
      alert(data.error);
    }
  };

  const verifyWalletSig = async () => {
    if (!(window as any).ethereum) {
      alert('MetaMask not found');
      return;
    }
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const timestamp = Date.now();
      const message = `TrustRails PoL verification | ${dbtTokenId} | ${timestamp}`;
      const signature = await signer.signMessage(message);
      
      await verifyFactor('wallet_sig', JSON.stringify({ signature, message }));
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  const generateReceipt = async (sbt_token_id: string) => {
    const res = await fetch('/api/trustrails/generate-compliance-receipt', {
      method: 'POST',
      body: JSON.stringify({
        sbt_token_id,
        agent_id: 'TRINITY-DEMO',
        transaction_type: 'POL_ONBOARDING',
        amount_usdc: 100 // dummy test value
      })
    });
    const data = await res.json();
    if (res.ok) {
      setSbtResult((prev: any) => ({ ...prev, receipt_id: data.receipt_id }));
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#111', color: '#fff' }}>
      
      {/* LEFT COLUMN: WIZARD */}
      <div style={{ flex: 1, padding: '40px', borderRight: '1px solid #333' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '30px', color: '#4ADE80' }}>TrustRails PoL Verification Wizard</h1>
        
        {step === 1 && (
          <div style={{ padding: '20px', backgroundColor: '#222', borderRadius: '8px' }}>
            <h2>[1] Initiate PoL</h2>
            <p style={{ color: '#aaa', marginBottom: '15px' }}>Enter wallet address to begin proof of life verification.</p>
            <input 
              value={wallet} 
              onChange={e => setWallet(e.target.value)} 
              placeholder="0x..." 
              style={{ padding: '10px', width: '100%', marginBottom: '15px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}
            />
            <button 
              onClick={initiatePol} 
              disabled={loading || !wallet}
              style={{ padding: '10px 20px', backgroundColor: '#4ADE80', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {loading ? 'Initializing...' : 'Start Verification'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ padding: '20px', backgroundColor: '#222', borderRadius: '8px' }}>
            <h2>[2] Email Verification</h2>
            <p style={{ color: '#aaa', marginBottom: '15px' }}>DBT created: <strong>{dbtTokenId}</strong><br/>Enter the 6-digit OTP sent to your email (check server console).</p>
            <input 
              value={emailOtp} 
              onChange={e => setEmailOtp(e.target.value)} 
              placeholder="000000" 
              style={{ padding: '10px', width: '100%', marginBottom: '15px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}
            />
            <button 
              onClick={() => verifyFactor('email', emailOtp)} 
              disabled={loading || !emailOtp}
              style={{ padding: '10px 20px', backgroundColor: '#4ADE80', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{ padding: '20px', backgroundColor: '#222', borderRadius: '8px' }}>
            <h2>[3] SMS Verification</h2>
            <p style={{ color: '#aaa', marginBottom: '15px' }}>✅ Factor 1/4 verified — Email confirmed<br/>Enter the 6-digit OTP sent to your phone (check console).</p>
            <input 
              value={smsOtp} 
              onChange={e => setSmsOtp(e.target.value)} 
              placeholder="000000" 
              style={{ padding: '10px', width: '100%', marginBottom: '15px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}
            />
            <button 
              onClick={() => verifyFactor('sms', smsOtp)} 
              disabled={loading || !smsOtp}
              style={{ padding: '10px 20px', backgroundColor: '#4ADE80', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {loading ? 'Verifying...' : 'Verify Phone'}
            </button>
          </div>
        )}

        {step === 4 && (
          <div style={{ padding: '20px', backgroundColor: '#222', borderRadius: '8px' }}>
            <h2>[4] Biometric Confirmation</h2>
            <p style={{ color: '#aaa', marginBottom: '15px' }}>✅ Factor 2/4 verified — Phone confirmed<br/>Confirm biometric liveness check.</p>
            <button 
              onClick={() => verifyFactor('biometric', 'biometric_confirmed_' + Date.now())} 
              disabled={loading}
              style={{ padding: '10px 20px', backgroundColor: '#4ADE80', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {loading ? 'Processing...' : 'Simulate Liveness Pass'}
            </button>
          </div>
        )}

        {step === 5 && (
          <div style={{ padding: '20px', backgroundColor: '#222', borderRadius: '8px' }}>
            <h2>[5] Wallet Signature</h2>
            <p style={{ color: '#aaa', marginBottom: '15px' }}>✅ Factor 3/4 verified — Biometric confirmed<br/>Sign challenge to prove custody of {wallet}.</p>
            <button 
              onClick={verifyWalletSig} 
              disabled={loading}
              style={{ padding: '10px 20px', backgroundColor: '#4ADE80', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {loading ? 'Waiting for wallet...' : 'Sign with MetaMask'}
            </button>
          </div>
        )}

        {step === 6 && sbtResult && (
          <div style={{ padding: '30px', backgroundColor: '#132c1b', border: '1px solid #4ADE80', borderRadius: '8px' }}>
            <h2 style={{ color: '#4ADE80', marginBottom: '10px' }}>CONVERSION COMPLETE</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '2' }}>
              <li>🏆 <strong>SBT Minted:</strong> {sbtResult.sbt_token_id}</li>
              <li>📍 <strong>On-chain:</strong> <a href={`https://sepolia.basescan.org/tx/${sbtResult.on_chain_tx_hash}`} target="_blank" style={{color: '#60A5FA'}}>Base Sepolia Explorer</a></li>
              <li>🛡️ <strong>Qualification Tier:</strong> Retail (verified)</li>
              <li>📋 <strong>Compliance Receipt:</strong> {sbtResult.receipt_id || 'Generating...'}</li>
            </ul>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: EVENTS */}
      <div style={{ width: '400px', backgroundColor: '#1a1a1a', padding: '40px', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Live Trust Events</h2>
        {events.map((ev) => (
          <div key={ev.id} style={{ padding: '15px', backgroundColor: '#222', marginBottom: '10px', borderRadius: '6px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', color: '#60A5FA' }}>{ev.event_type}</span>
              <span style={{ color: '#666' }}>{new Date(ev.created_at).toLocaleTimeString()}</span>
            </div>
            <div style={{ color: '#aaa', wordBreak: 'break-all' }}>Subject: {ev.subject_id}</div>
            <pre style={{ margin: '8px 0 0 0', padding: '8px', backgroundColor: '#111', color: '#888', borderRadius: '4px', fontSize: '11px', overflowX: 'hidden' }}>
              {JSON.stringify(ev.event_data, null, 2)}
            </pre>
          </div>
        ))}
      </div>

    </div>
  );
}
