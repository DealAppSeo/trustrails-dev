const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58');
const fs = require('fs');

async function fundAndRun() {
  let env = fs.readFileSync('.env.local', 'utf8');
  const privMatch = env.match(/^SOPHIA_SOLANA_PRIVATE_KEY=(.*)$/m);
  if(!privMatch) {
    console.log('No SOPHIA KEY');
    return;
  }
  const privKey = privMatch[1].trim();

  const kp = Keypair.fromSecretKey(bs58.decode(privKey));
  const conn = new Connection('https://api.devnet.solana.com', 'confirmed');

  console.log('Wallet:', kp.publicKey.toBase58());
  try {
    const bal = await conn.getBalance(kp.publicKey);
    console.log('Current balance:', bal / LAMPORTS_PER_SOL);
    
    if (bal < 0.05 * LAMPORTS_PER_SOL) {
      console.log('Airdropping 1 SOL...');
      const sig = await conn.requestAirdrop(kp.publicKey, 1 * LAMPORTS_PER_SOL);
      await conn.confirmTransaction(sig, 'confirmed');
      console.log('Funded!');
    }
    
    console.log('Triggering payment...');
    const res = await fetch('http://localhost:3000/api/trustrails/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentName: 'SOPHIA',
        recipientAddress: 'NEXUS',
        amountUSDC: 25000,
        purpose: 'institutional_treasury_rebalance'
      })
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch(e) {
    console.error('Error:', e);
  }
}
fundAndRun();
