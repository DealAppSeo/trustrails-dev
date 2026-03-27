const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');

async function fund() {
  const conn = new Connection('https://api.devnet.solana.com', 'confirmed');
  const pub = new PublicKey('43TSvktkyt3Fjb1C7eAkzW94GoFpD3Gi3ukGZhNA8FND');
  
  console.log("Requesting 2 SOL Airdrop...");
  try {
    const signature = await conn.requestAirdrop(pub, 2 * LAMPORTS_PER_SOL);
    const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash();
    await conn.confirmTransaction({
      blockhash, lastValidBlockHeight, signature
    });
    console.log("Airdrop confirmed! Hash: " + signature);
  } catch (e) {
    console.error("Airdrop failed. RPC might be rate limited. Try manual 'solana airdrop 2'.", e.message);
  }
}
fund();
