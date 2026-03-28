const http = require('http');
const { createClient } = require('@supabase/supabase-js');

async function run() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/trustrails/demo',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, res => {
    let body = '';
    res.on('data', c => body += c.toString());
    res.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const hero = data.results.find(r => r.beat === 2);
        const hash = hero.solanaTxHash;
        
        if(!hash) throw new Error("Hash not found side demo!");
        console.log("Found Hash:", hash);

        const contentStr = JSON.stringify({
          tx_hash: hash,
          explorer_url: `https://explorer.solana.com/tx/${hash}?cluster=devnet`,
          amount_usdc: 25000,
          agent: "SOPHIA", 
          liability_tier: "human_backed"
        });

        // Insert exactly as ALL_NIGHT_SPRINT.md commanded
        const dbRes = await supabase.from('sprint_reports').insert({
          agent_name: 'GEMINI',
          report_type: 'solana_tx_confirmed',
          content: contentStr,
          metadata: '{"sprint": "stablehacks_march29", "milestone": "first_real_tx"}'
        });

        if (dbRes.error) console.error("DB Error:", dbRes.error);
        else console.log("✅ Successfully wrote solana_tx_confirmed to sprint_reports!");
      } catch(e) { console.error(e); }
    });
  });
  req.on('error', console.error);
  req.write('{}');
  req.end();
}
run();
