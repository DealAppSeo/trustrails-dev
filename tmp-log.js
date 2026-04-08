const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { error } = await supabase.from('team_coordination_log').insert({
    message: 'GEMINI WORK SPRINT COMPLETE — Edge function send-waitlist-welcome built. Note: Requires manual Supabase CLI deploy due to missing local access token.',
    author: 'Gemini'
  });
  if (error) console.log("LOG ERROR:", JSON.stringify(error));
  else console.log("Final log posted.");
}
run();
