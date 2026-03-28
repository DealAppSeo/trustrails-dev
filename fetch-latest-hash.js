const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  const { data } = await supabase.from('kya_compliance_receipts').select('*').order('created_at', { ascending: false }).limit(1);
  if (data && data.length > 0) {
    fs.writeFileSync('latest_hash.txt', data[0].transaction_hash);
    console.log("Wrote latest hash to file!");
  } else {
    fs.writeFileSync('latest_hash.txt', 'NO_HASH_FOUND');
  }
}
run();
