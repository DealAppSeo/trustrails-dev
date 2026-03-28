import { SystemTrustScore } from '@/components/trustrails/SystemTrustScore';
import { AgentRepIDGrid }   from '@/components/trustrails/AgentRepIDGrid';
import { LiveReceiptFeed }  from '@/components/trustrails/LiveReceiptFeed';
import { RiskSlider }       from '@/components/trustrails/RiskSlider';
import { InstitutionalControls } from '@/components/trustrails/InstitutionalControls';

export default function Dashboard() {
  return (
    <div style={{
      background: '#020817',
      color: '#f1f5f9',
      minHeight: '100vh',
      padding: '32px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          paddingBottom: '24px',
          borderBottom: '1px solid #1e293b',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#1e293b',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '20px'
            }}>
              TR
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>TrustRails Control Matrix</h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#94a3b8' }}>Enterprise Agentic Compliance Gateway</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="/api/trustrails/demo/villain" target="_blank" rel="noreferrer" style={{
              background: '#991b1b',
              color: '#f1f5f9',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⛔ Run Guardrail Demo
            </a>
            <a href="/api/trustrails/demo" target="_blank" rel="noreferrer" style={{
              background: '#1d4ed8',
              color: '#f1f5f9',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ✅ Run Compliance Demo
            </a>
          </div>
        </header>

        {/* System Trust Score */}
        <div style={{ marginBottom: '40px' }}>
          <SystemTrustScore />
        </div>

        {/* Main Grid Layout */}
        <div style={{
          display: 'flex',
          gap: '32px',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}>
          
          {/* Left Column: Controls & Agents */}
          <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 24px 0' }}>
                Institutional Risk Configuration
              </h2>
              <RiskSlider />
            </div>
            
            <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', flexGrow: 1 }}>
              <AgentRepIDGrid />
            </div>
          </div>

          {/* Right Column: Feed & Limits */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px' }}>
              <InstitutionalControls institutionId="default" />
            </div>

            <div style={{ background: '#1e293b', borderRadius: '12px', flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #020817' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                  Live Compliance Feed
                </h2>
              </div>
              <div style={{ flexGrow: 1 }}>
                <LiveReceiptFeed />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Badges */}
        <footer style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '16px',
          padding: '32px 0',
          borderTop: '1px solid #1e293b'
        }}>
          {['MiCA Compliant', 'GENIUS Act Ready', 'FATF Rec. 16 Aligned', 'Fireblocks Pre-Auth', 'AMINA Bank Pilot Ready'].map(label => (
            <div key={label} style={{
              background: '#1e293b',
              padding: '6px 16px',
              borderRadius: '24px',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ✓ {label}
            </div>
          ))}
        </footer>

      </div>
    </div>
  );
}
