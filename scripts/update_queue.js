const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qnnpjhlxljtqyigedwkb.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '***REDACTED_JWT***';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { error } = await supabase
    .from('trinity_gemini_queue')
    .update({ 
      status: 'done', 
      result: 'Built app/security/page.tsx with VERITAS hallucination interception visuals and live agent action feed via new api/security endpoint.',
      completed_at: new Date().toISOString()
    })
    .ilike('title', '%Phase 4%');

  console.log(error ? `Failed: ${error.message}` : 'Updated queue for Phase 4');
}

run();
