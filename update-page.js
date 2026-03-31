const fs = require('fs');
let code = fs.readFileSync('c:/Users/Cash4/OneDrive/Desktop/trustrails-dev/app/dashboard/page.tsx', 'utf8');

// 1. Add import and State
code = code.replace(
  "import { useState, useEffect } from 'react';",
  "import { useState, useEffect } from 'react';\nimport { createClient } from '@supabase/supabase-js';\n\nconst supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';\nconst supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';\nconst supabase = createClient(supabaseUrl, supabaseKey);"
);

code = code.replace(
  "export default function Dashboard() {",
  "export default function Dashboard() {\n  const [sophiaLiveRepId, setSophiaLiveRepId] = useState('8,590');\n  useEffect(() => {\n    if(supabaseUrl) {\n      supabase.from('trinity_agent_registry').select('reputation_score').eq('agent_name', 'trinity-sophia').single()\n        .then(({data}) => {\n          if (data && data.reputation_score) {\n            setSophiaLiveRepId(Math.round(data.reputation_score * 100).toLocaleString());\n          }\n        });\n    }\n  }, []);"
);

// 2. Replace hardcoded RepIDs
code = code.replace(/>8590</g, '>{sophiaLiveRepId}<');
code = code.replace(/'8,590'/g, 'sophiaLiveRepId');

// 3. Update handleComplianceDemo
code = code.replace(
  "const handleComplianceDemo = async () => {",
  "const handleComplianceDemo = async (amount = 25000) => {"
);

code = code.replace(
  "body: JSON.stringify({ agentName: 'SOPHIA', recipientAddress: 'NEXUS', amountUSDC: 25000, purpose: 'institutional_treasury_rebalance' })",
  "body: JSON.stringify({ agentName: 'SOPHIA', recipientAddress: 'NEXUS', amountUSDC: amount, purpose: 'institutional_treasury_rebalance' })"
);

code = code.replace(
  "const data = await res.json();\n      if (!res.ok) throw new Error(data.reason || data.message || data.error || 'Payment execution failed');\n      \n      setLiveTxHash(data.receipt?.solanaTxHash || '');\n      setLiveExplorerUrl(data.explorerUrl || '');\n\n      setDemoStateR(2);\n      setTimeout(() => setRevealRA(true), 500);\n      setTimeout(() => setRevealRB(true), 2000);\n      setTimeout(() => setRevealRC(true), 3500);",
  `const data = await res.json();
      if (res.status === 202) {
        setDemoStateR(3);
        setTimeout(() => setRevealRA(true), 500);
      } else {
        if (!res.ok) throw new Error(data.reason || data.message || data.error || 'Payment execution failed');
        setLiveTxHash(data.receipt?.solanaTxHash || '');
        setLiveExplorerUrl(data.explorerUrl || '');
        setDemoStateR(2);
        setTimeout(() => setRevealRA(true), 500);
        setTimeout(() => setRevealRB(true), 2000);
        setTimeout(() => setRevealRC(true), 3500);
      }`
);

// 4. Transform single button into two buttons
code = code.replace(
  `            <button 
              onClick={handleComplianceDemo} 
              disabled={demoLoading}
              style={{ width: '100%', padding: '16px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: demoLoading ? 'not-allowed' : 'pointer', marginBottom: '24px', display: 'flex', justifyContent: 'center', gap: '8px', opacity: demoLoading ? 0.7 : 1 }}
            >
              {demoLoading ? '⏳ Processing...' : '✅ Run Compliance Demo'}
            </button>`,
  `            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              <button 
                onClick={() => handleComplianceDemo(25000)} 
                disabled={demoLoading}
                style={{ flex: 1, padding: '16px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: demoLoading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', opacity: demoLoading ? 0.7 : 1 }}
              >
                {demoLoading ? '⏳...' : '✅ Single-Sig Demo ($25k)'}
              </button>
              <button 
                onClick={() => handleComplianceDemo(75000)} 
                disabled={demoLoading}
                style={{ flex: 1, padding: '16px', background: '#92400e', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: demoLoading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', opacity: demoLoading ? 0.7 : 1 }}
              >
                {demoLoading ? '⏳...' : '🛡️ Dual-Auth Demo ($75k)'}
              </button>
            </div>`
);

// 5. Inject demoStateR === 3 layout
code = code.replace(
  "{demoStateR === 2 && (",
  `{demoStateR === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#1e293b', borderRadius: '8px', padding: '16px' }}>
                  {!revealRA ? (
                    <div style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
                      <div className="spinner" style={{ marginRight: '8px' }}></div>
                      <TypeText text="Agent SOPHIA-1 initiating $75,000 cross-border\\npayment. BFT consensus running..." time={30} />
                    </div>
                  ) : (
                    <div className="card-appear" style={{ background: '#1a1000', border: '1px solid #92400e', padding: '16px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '12px', borderBottom: '1px solid #78350f', paddingBottom: '8px' }}>
                        ⏳ AWAITING DUAL AUTHORIZATION
                      </div>
                      <div style={{ fontSize: '15px', marginBottom: '12px' }}>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '100px'}}>Agent:</span> {getAgent('SOPHIA', sophiaLiveRepId, 'Platinum')}</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '100px'}}>Amount:</span> $75,000 USDC</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '100px'}}>BFT:</span> 91% — PASSES threshold ✓</div>
                      </div>
                      <div style={{ fontSize: '14px', background: '#000', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', color: '#cbd5e1', marginBottom: '12px' }}>
                        $75,000 > single-sig limit: $50,000<br/>
                        Dual-sig required. Transaction locked.<br/><br/>
                        Co-authorization pending:<br/>
                        CFO — SBT-CFO-001 [Biometric] ⏳ Pending<br/>
                        CTO — SBT-CTO-001 [Biometric] ⏳ Pending<br/><br/>
                        HTTP 202 returned<br/>
                        Cryptographic escrow: active
                      </div>
                      <div style={{ fontSize: '14px', color: '#fcd34d', fontStyle: 'italic' }}>
                        Not a Slack message. Not an email. Cryptographic co-signature. Every time.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {demoStateR === 2 && (`
);

fs.writeFileSync('c:/Users/Cash4/OneDrive/Desktop/trustrails-dev/app/dashboard/page.tsx', code);
console.log('Successfully updated app/dashboard/page.tsx');
