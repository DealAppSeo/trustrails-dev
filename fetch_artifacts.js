const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkArtifacts() {
  // Query artifacts from the last 12 hours
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from('trinity_artifacts')
    .select('title, artifact_type, creator_agent, created_at')
    .in('artifact_type', ['report', 'document', 'markdown', 'md'])
    .gte('created_at', twelveHoursAgo)
    .order('created_at', { ascending: false });

  if (error) console.error("Error:", error);
  else console.log(JSON.stringify(data, null, 2));
}

checkArtifacts();
