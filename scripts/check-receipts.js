const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../trinity-ecosystem/.env.local') });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qnnpjhlxljtqyigedwkb.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '***REDACTED_JWT***';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data } = await supabase.from('kya_compliance_receipts').select('receipt_id, base_sepolia_explorer_url, tx_verification_status');
  console.log(JSON.stringify(data, null, 2));
}
run();
