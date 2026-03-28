import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TrustRails',
  description: 'The SSL Trust Layer for Autonomous Agent Finance on Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ 
        background: '#020817', 
        color: '#f1f5f9', 
        margin: 0, 
        padding: 0, 
        fontFamily: 'system-ui, sans-serif' 
      }}>
        {children}
        <footer style={{
          textAlign: 'center',
          padding: '16px',
          fontSize: '11px',
          color: '#334155',
          borderTop: '1px solid #1e293b',
          fontFamily: 'monospace'
        }}>
          © 2026 HyperDAG Protocol · TrustRails ·
          Patent Portfolio Pending (P-001–P-028) ·
          Proprietary Technology — All Rights Reserved
        </footer>
      </body>
    </html>
  );
}
