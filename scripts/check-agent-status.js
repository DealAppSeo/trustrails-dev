const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../trinity-ecosystem/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qnnpjhlxljtqyigedwkb.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFubnBqaGx4bGp0cXlpZ2Vkd2tiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTkzOTU5MSwiZXhwIjoyMDY3NTE1NTkxfQ.4ADAiDK-CD6Jk5_JgizadriWVBoYg42NnsKsbcQ0h6A';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAgentStatus() {
  console.log("Checking agent logs...");
  const { data: logs, error: logsError } = await supabase
    .from('trinity_agent_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (logsError) console.error("Error logs:", logsError.message);
  console.log("RECENT LOGS:", JSON.stringify(logs, null, 2));

  console.log("Checking task status...");
  const { data: tasks, error: tasksError } = await supabase
    .from('trinity_tasks')
    .select('id, title, status, claimed_by, failure_reflection, assigned_to')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (tasksError) console.error("Error tasks:", tasksError.message);
  console.log("RECENT TASKS:", JSON.stringify(tasks, null, 2));

  console.log("Checking system events...");
  const { data: mcp, error: mcpError } = await supabase
    .from('trinity_mcp_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (mcpError) console.error("Error MCP:", mcpError.message);
  console.log("RECENT MCP EVENTS:", JSON.stringify(mcp, null, 2));
}

checkAgentStatus();
