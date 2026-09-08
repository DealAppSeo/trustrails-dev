// app/page.tsx — trustrails.dev, coming soon.
//
// Sean's call 2026-09-08: TrustRails is not being introduced yet. The full
// product landing that used to live here is NOT deleted — it moved to
// app/preview/page.tsx, unlinked from anywhere, so the StableHacks submission
// content is one `git mv` from being restored.
//
// Inline styles, not Tailwind. `tailwindcss` is in package.json but this repo
// has no tailwind.config, no postcss.config, and app/globals.css is imported by
// nothing — every utility class renders as bare markup. See WaitlistForm.tsx.

import type { Metadata } from 'next';
import { WaitlistForm } from './WaitlistForm';

export const metadata: Metadata = {
  title: 'TrustRails — accountability for autonomous agents',
  description:
    'Agents are already moving money. TrustRails is building the layer that says who is accountable when one gets it wrong. Coming soon.',
};

const BG = '#020817';
const TEXT = '#f1f5f9';
const MUTED = '#94a3b8';
const DIM = '#64748b';
const BORDER = '#1e293b';
const PANEL = '#0b1220';
const AMBER = '#f59e0b';

function Belief({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div
      style={{
        background: PANEL,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <span style={{ color: AMBER, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
        {n}
      </span>
      <h3 style={{ color: TEXT, fontSize: 16, fontWeight: 700, margin: 0, lineHeight: 1.35 }}>{title}</h3>
      <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{body}</p>
    </div>
  );
}

export default function ComingSoon() {
  return (
    <main
      style={{
        background: BG,
        minHeight: '100vh',
        padding: '72px 24px 88px',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        {/* Wordmark + status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56, flexWrap: 'wrap' }}>
          <span style={{ color: TEXT, fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em' }}>TrustRails</span>
          <span
            style={{
              color: AMBER,
              border: `1px solid ${AMBER}44`,
              background: '#f59e0b12',
              borderRadius: 999,
              padding: '4px 11px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}
          >
            Coming soon
          </span>
        </div>

        {/* The two questions */}
        <p style={{ color: DIM, fontSize: 13, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', margin: '0 0 20px' }}>
          Two questions nobody has answered
        </p>

        <h1 style={{ color: TEXT, fontSize: 'clamp(30px, 5.2vw, 50px)', fontWeight: 800, lineHeight: 1.13, letterSpacing: '-0.022em', margin: '0 0 22px', maxWidth: 760 }}>
          When an agent spends your money and gets it wrong, who is accountable?
        </h1>

        <h2 style={{ color: MUTED, fontSize: 'clamp(19px, 3vw, 26px)', fontWeight: 500, lineHeight: 1.35, letterSpacing: '-0.01em', margin: '0 0 30px', maxWidth: 720 }}>
          And how do you give it enough authority to be useful, without giving it
          enough to be dangerous?
        </h2>

        <p style={{ color: MUTED, fontSize: 17, lineHeight: 1.7, margin: '0 0 44px', maxWidth: 660 }}>
          Autonomous agents are already moving real money. The tooling to hold one
          accountable afterwards does not exist yet. That is what we are building.
        </p>

        {/* CTA */}
        <div
          style={{
            background: PANEL,
            border: `1px solid ${BORDER}`,
            borderRadius: 14,
            padding: '26px 26px 24px',
            marginBottom: 64,
          }}
        >
          <h3 style={{ color: TEXT, fontSize: 17, fontWeight: 700, margin: '0 0 6px' }}>
            Want to see it before anyone else?
          </h3>
          <p style={{ color: MUTED, fontSize: 14.5, lineHeight: 1.6, margin: '0 0 18px' }}>
            Leave an email and we will send you the first working version — and the
            evidence behind it. No newsletter, no drip sequence.
          </p>
          <WaitlistForm />
        </div>

        {/* Vision cast */}
        <p style={{ color: DIM, fontSize: 13, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', margin: '0 0 8px' }}>
          What we believe
        </p>
        <p style={{ color: MUTED, fontSize: 16, lineHeight: 1.7, margin: '0 0 26px', maxWidth: 680 }}>
          These are not slogans. They are the rules we hold our own system to, and
          the ones we will publish results against.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(268px, 1fr))',
            gap: 16,
            marginBottom: 48,
          }}
        >
          <Belief
            n="01"
            title="Trust is earned, never configured"
            body="An agent's authority should come from behaviour you can audit, not from the plan it is on. Spending limits expand as reliability is demonstrated and contract when it is not."
          />
          <Belief
            n="02"
            title="A check that did not run is not a pass"
            body="Every verdict is VERIFIED, NOT CHECKED, or FAILED — never just pass and fail. Collapsing those two is how a system reports success it has not earned, and we have watched it cost real money."
          />
          <Belief
            n="03"
            title="Receipts, or it did not happen"
            body="Every consequential action leaves evidence a third party can verify without trusting us. If we cannot show the receipt, we do not get to make the claim."
          />
          <Belief
            n="04"
            title="Reputation should be portable"
            body="Trust an agent earns belongs to the agent, not to our platform. It is anchored on open standards so it moves with them — including away from us."
          />
        </div>

        {/* Goal */}
        <div style={{ borderLeft: `2px solid ${AMBER}`, paddingLeft: 20, margin: '0 0 56px', maxWidth: 680 }}>
          <p style={{ color: DIM, fontSize: 13, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', margin: '0 0 10px' }}>
            The goal
          </p>
          <p style={{ color: TEXT, fontSize: 18, lineHeight: 1.62, margin: 0, fontWeight: 500 }}>
            Make an agent&rsquo;s track record something you can check before you
            trust it with anything — the way you would check a counterparty, not the
            way you would read a marketing page.
          </p>
        </div>

        {/* Closing CTA */}
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 30 }}>
          <p style={{ color: MUTED, fontSize: 15.5, lineHeight: 1.65, margin: '0 0 18px', maxWidth: 620 }}>
            If any of that is a problem you have, we would like to hear how you hit
            it. Leave an email and tell us — we read every one.
          </p>
          <WaitlistForm />
        </div>
      </div>
    </main>
  );
}
