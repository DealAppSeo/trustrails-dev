// middleware.ts — CONTAINMENT: API writes are off unless TRUSTRAILS_WRITES_ENABLED=true.
//
// No route under app/api authenticates its caller, and this server holds a Supabase key that
// writes Trinity production tables (lib/supabase-admin.ts), an agent's Solana key and a Base
// Sepolia deployer key. Anyone could POST to rewrite institution config or RepID weights, vouch,
// raise RepID, or walk the four-factor flow to a server-signed on-chain mint. PR #6 turned off
// /pay with its own flag; this turns off every other write the same way, in one place, until
// real authorization exists. Reads (GET/HEAD/OPTIONS) are untouched.
//
// Exact string 'true' only: a typo or an unset variable stays off.
import { NextResponse, type NextRequest } from 'next/server';

const READ_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function middleware(req: NextRequest) {
  if (READ_METHODS.has(req.method.toUpperCase())) return NextResponse.next();
  if (process.env.TRUSTRAILS_WRITES_ENABLED === 'true') return NextResponse.next();
  return NextResponse.json(
    {
      error: 'disabled',
      reason:
        'API writes are turned off: these routes do not yet authenticate the caller. ' +
        'Set TRUSTRAILS_WRITES_ENABLED=true only once they do.',
    },
    { status: 503 },
  );
}

export const config = { matcher: '/api/:path*' };
