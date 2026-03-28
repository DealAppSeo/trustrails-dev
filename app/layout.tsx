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
      </body>
    </html>
  );
}
