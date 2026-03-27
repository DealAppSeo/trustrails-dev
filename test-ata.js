const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { getOrCreateAssociatedTokenAccount } = require('@solana/spl-token');
const bs58 = require('bs58');


async function run() {
  try {
    const conn = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com', 'confirmed');
    const secretKey = bs58.decode(process.env.AGENT_SOPHIA_PRIVKEY);
    const signer = Keypair.fromSecretKey(secretKey);
    const usdcMint = new PublicKey(process.env.USDC_DEVNET_MINT);
    const toKey = new PublicKey(process.env.COUNTERPARTY_ALPHA_PUBKEY);

    console.log("Checking SOPHIA ATA...");
    const fromATA = await getOrCreateAssociatedTokenAccount(conn, signer, usdcMint, signer.publicKey);
    console.log("fromATA:", fromATA.address.toBase58());

    console.log("Checking ALHPA ATA...");
    const toATA = await getOrCreateAssociatedTokenAccount(conn, signer, usdcMint, toKey, true);
    console.log("toATA:", toATA.address.toBase58());

    console.log("SUCCESS");
  } catch (e) {
    console.error("FATAL ERROR:");
    console.error(e);
  }
}
run();
