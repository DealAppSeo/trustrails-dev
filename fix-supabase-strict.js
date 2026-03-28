const fs = require('fs');

const files = [
  'app/api/trustrails/internal/update-agent/route.ts',
  'components/trustrails/AgentRepIDGrid.tsx',
  'app/api/trustrails/receipts/route.ts',
  'lib/trustshell/BFTAuthorizer.ts',
  'app/api/trustrails/settings/route.ts',
  'app/api/trustrails/system-trust/route.ts',
  'app/api/trustrails/internal/run-tasks/route.ts',
  'lib/trustshell/ComplianceReceipt.ts',
  'lib/trustshell/KYAValidator.ts',
  'lib/trustshell/RepIDConfig.ts',
  'lib/trustshell/VaultPermission.ts',
  'lib/trustshell/ZKPAttestation.ts',
  'components/trustrails/LiveReceiptFeed.tsx',
  'components/trustrails/SystemTrustScore.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // ONLY inject force-dynamic into Next.js routes to avoid client-component compiler crashes
  if (file.includes('route.ts')) {
    if (!content.includes("export const dynamic = 'force-dynamic';")) {
      content = "export const dynamic = 'force-dynamic';\n" + content;
    }
  }

  const strictLogic = `
const _supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const _supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!_supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in Vercel Environment');
}
if (!_supabaseKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or ANON_KEY in Vercel Environment');
}
`;

  if (!content.includes('_supabaseUrl')) {
      content = content.replace(/import \{ createClient \} from '@supabase\/supabase-js';/, 
        "import { createClient } from '@supabase/supabase-js';\n" + strictLogic
      );
  }

  // Rewrite arbitrary createClient parameters rigidly to the validated variables
  content = content.replace(/createClient\([\s\S]*?\)/g, 'createClient(_supabaseUrl, _supabaseKey)');
  
  fs.writeFileSync(file, content);
  console.log('Strict Refactor:', file);
}
