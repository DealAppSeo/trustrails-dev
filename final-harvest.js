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
        console.log("FINAL_HASH:", hash);

        const contentStr = JSON.stringify({
          tx_hash: hash,
          explorer_url: `https://explorer.solana.com/tx/${hash}?cluster=devnet`,
          amount_usdc: 25000,
          agent: "SOPHIA", 
          liability_tier: "human_backed"
        });

        // Insert exactly as ALL_NIGHT_SPRINT.md commanded
        const dbRes1 = await supabase.from('sprint_reports').insert({
          agent_name: 'GEMINI_SWARM',
          report_type: 'solana_tx_confirmed',
          content: contentStr,
          metadata: '{"sprint": "stablehacks_march29", "milestone": "final_demonstration"}'
        });

        const dbRes2 = await supabase.from('kya_compliance_receipts').insert({
          agent_id: 'SOPHIA',
          transaction_hash: hash,
          amount: 25000,
          destination_address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
          compliance_status: 'cleared',
          zkp_attestation_id: 'zkp_devnet_final',
          travel_rule_cleared: true,
          aml_risk_score: 12
        });

        if (dbRes1.error) console.error("DB1 Error:", dbRes1.error);
        else if (dbRes2.error) console.error("DB2 Error:", dbRes2.error);
        else console.log("✅ Wrote to kya_compliance_receipts AND sprint_reports!");
      } catch(e) { console.error(e); }
    });
  });
  req.on('error', console.error);
  req.write('{}');
  req.end();
}
run();
