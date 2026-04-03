const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function exportPitches() {
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
  
  const { data, error } = await supabase
    .from('trinity_artifacts')
    .select('title, artifact_type, content, creator_agent, created_at')
    .in('artifact_type', ['report', 'document', 'markdown', 'md'])
    .gte('created_at', twelveHoursAgo)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching artifacts:", error);
    return;
  }

  let mdContent = `# TrustRails - Overnight Agent Hackathon Pitches\n\n`;
  mdContent += `*Generated: ${new Date().toISOString()}*\n\n---\n\n`;

  if (data && data.length > 0) {
    data.forEach((item) => {
      mdContent += `## ${item.title || 'Untitled Workflow'} \n`;
      mdContent += `**Agent:** ${item.creator_agent} | **Type:** ${item.artifact_type} | **Time:** ${new Date(item.created_at).toLocaleString()}\n\n`;
      mdContent += `${item.content}\n\n`;
      mdContent += `---\n\n`;
    });
  } else {
    mdContent += `*No pitch artifacts found in the last 12 hours.*\n\n---\n\n`;
  }

  mdContent += `## 🏁 Four.Meme Hackathon Submission Checklist\n\n`;
  mdContent += `- [ ] **Project Name** & Logo Assets\n`;
  mdContent += `- [ ] **Elevator Pitch:** (1-2 sentences)\n`;
  mdContent += `- [ ] **Detailed Description:** The Problem, The Solution, The Tech Stack\n`;
  mdContent += `- [ ] **Demo Video URL:** (Loom/YouTube) — *Must show Hallucination/Cap Rate Catch*\n`;
  mdContent += `- [ ] **Public GitHub Repo Link**\n`;
  mdContent += `- [ ] **Smart Contract Addresses:** Your Base Sepolia Receipts & Solana Settlement Tx Hashes\n`;
  mdContent += `- [ ] **Team Wallets:** (For Prize Distribution)\n`;

  const outPath = 'C:\\Users\\Cash4\\OneDrive\\Desktop\\hackathon_pitch_review.md';
  fs.writeFileSync(outPath, mdContent, 'utf8');
  console.log(`Successfully wrote hackathon pitches to ${outPath}`);
}

exportPitches();
