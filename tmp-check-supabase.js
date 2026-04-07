const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("Missing Supabase credentials in env.");
  process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase
    .from('agent_repid')
    .select('agent_name, repid_score, earned_repid')
    .eq('agent_name', 'trinity-sophia')
    .limit(1);

  if (error) {
    console.log("QUERY_ERROR:", JSON.stringify(error));
    return;
  }

  if (!data || data.length === 0) {
    console.log("RESULT: No rows found for 'trinity-sophia'. Attempting insert...");
    
    // Attempt upsert
    const { error: insertError } = await supabase
      .from('agent_repid')
      .upsert({
        agent_name: 'trinity-sophia',
        repid_score: 6247,
        earned_repid: 6247,
        perceived_repid: 6180
      }, { onConflict: 'agent_name' });

    if (insertError) {
      console.log("INSERT_ERROR:", JSON.stringify(insertError));
    } else {
      console.log("INSERT_SUCCESS: Added seed row for 'trinity-sophia'.");
    }
  } else {
    console.log("RESULT: Row exists ->", JSON.stringify(data[0]));
  }
}

run();
