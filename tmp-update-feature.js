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
  const tag = process.argv[2];
  if (!tag) {
    console.error("No tag provided.");
    return;
  }
  
  if (tag === 'FINAL_LOG') {
    const { error } = await supabase.from('team_coordination_log').insert({
      message: 'GEMINI WORK SPRINT COMPLETE — [layout, jurisdiction, signal-library, tooltips, leaderboard]',
      author: 'Gemini'
    });
    if (error) console.log("LOG ERROR:", JSON.stringify(error));
    else console.log("Final log posted.");
    return;
  }

  const { error } = await supabase
    .from('feature_registry')
    .update({ status: 'done', updated_at: new Date().toISOString() })
    .eq('feature_tag', tag);

  if (error) {
    console.log(`UPDATE_ERROR [${tag}]:`, JSON.stringify(error));
  } else {
    console.log(`UPDATE_SUCCESS [${tag}]`);
  }
}
run();
