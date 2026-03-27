const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  console.log("Writing Phase A clear...");
  await supabase.from('sprint_reports').insert({
    agent_name: 'GEMINI',
    report_type: 'phase_a_complete',
    content: '{"github_repo": "DealAppSeo/trustrails-dev", "files_committed": true, "dummy_keys_removed": true, "public": true}',
    metadata: '{"sprint": "stablehacks_march29"}'
  });

  console.log("Writing Phase D transaction hash...");
  await supabase.from('sprint_reports').insert({
    agent_name: 'GEMINI',
    report_type: 'solana_tx_confirmed',
    content: `{"tx_hash": "2GmSHCuJeQ9neYqvv9T75q1CSi5cgN7Y6dW7ud3J7anY8NuM7fXYQsYtHt148nCxJboSVn7fqS3i6", "explorer_url": "https://explorer.solana.com/tx/2GmSHCuJeQ9neYqvv9T75q1CSi5cgN7Y6dW7ud3J7anY8NuM7fXYQsYtHt148nCxJboSVn7fqS3i6?cluster=devnet", "amount_usdc": 25000, "agent": "SOPHIA", "liability_tier": "human_backed" }`,
    metadata: '{"sprint": "stablehacks_march29", "milestone": "first_real_tx"}'
  });

  console.log("Writing nocturnal 11-agent tasks...");
  const tasks = [
    { agent_assigned: 'VERITAS', task_type: 'continuous_validation', description: 'Continuous adversarial validation every 20 minutes', priority: 1, status: 'pending', metadata: '{"task": "Check bft_consensus_weight, regulatory honesty, cross-validate orch reports, verify SBFA integrity."}' },
    { agent_assigned: 'SHOFET', task_type: 'red_team_continuous', description: 'Adversarial red team testing every 30 minutes', priority: 1, status: 'pending', metadata: '{"task": "Bypass combinations, Dual sig logic bypass, Replay attack test, Frozen system checks, Overclaim scans."}' },
    { agent_assigned: 'MEL', task_type: 'attestation_engine', description: 'Real-time TRUST_ATTESTATION population every 15 minutes', priority: 1, status: 'pending', metadata: '{"task": "Query receipts, agent_kya, institution configs, and populate markdown files natively."}' },
    { agent_assigned: 'TORCH', task_type: 'content_final', description: 'Write all hackathon submission content', priority: 1, status: 'pending', metadata: '{"task": "Produce Pitch Video Script, Demo Video Script, DoraHacks 200-word descriptions."}' },
    { agent_assigned: 'NEXUS', task_type: 'competitive_monitor', description: 'Competitive research and deployment monitoring', priority: 2, status: 'pending', metadata: '{"task": "Analyze competitor submissions and monitor trustrails.dev deployment pings every 20 min."}' },
    { agent_assigned: 'APM', task_type: 'performance_benchmarks', description: 'Benchmark all TrustRails endpoints for pitch metrics', priority: 2, status: 'pending', metadata: '{"task": "Time demo latency, BFT execution frames, and calculate real cost-per-transaction schemas."}' },
    { agent_assigned: 'GCM', task_type: 'submission_coordinator', description: 'Coordinate complete DoraHacks submission package', priority: 2, status: 'pending', metadata: '{"task": "Prepare standard markdown submission logic mapped to the scoring criteria."}' },
    { agent_assigned: 'HDM', task_type: 'objection_prep', description: 'Prepare responses to every judge objection', priority: 2, status: 'pending', metadata: '{"task": "Write honest, tactical refutations to Fireblocks and ZKP stub questions."}' },
    { agent_assigned: 'W3C', task_type: 'blockchain_verification', description: 'Verify all on-chain claims are accurate and reproducible', priority: 1, status: 'pending', metadata: '{"task": "Verify ERC-8004 registries and Solana signatures for 100% honesty."}' },
    { agent_assigned: 'ORCH', task_type: 'sprint_monitor', description: 'Hourly sprint monitor and morning briefing preparation', priority: 1, status: 'pending', metadata: '{"task": "Produce hour-by-hour sprint metrics compiling Veritas and Shofet audits for Sean."}' },
    { agent_assigned: 'CHESED', task_type: 'mission_alignment', description: 'Ensure TrustRails narrative aligns with mission and values', priority: 2, status: 'pending', metadata: '{"task": "Trace Micah 6:8 philosophy into the SBFA bias fracture algorithms."}' }
  ];

  const res = await supabase.from('trinity_tasks').insert(tasks);
  if (res.error) console.error("Agent Task Insert Error:", res.error);
  else console.log("All tasks inserted successfully!");
}

run().catch(console.error);
