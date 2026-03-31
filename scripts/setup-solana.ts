// scripts/setup-solana.ts
// Generates keys, requests airdrops, and sets up `.env.local`

import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import * as fs from 'fs';
import * as bs58 from 'bs58';

async function main() {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  console.log('🔗 Connected to Solana Devnet');

  // 1. Generate keys
  const sophia = Keypair.generate();
  const alphaCounterparty = Keypair.generate();
  const betaCounterparty = Keypair.generate();

  console.log('✓ Keys generated');
  console.log(`  SOPHIA: ${sophia.publicKey.toBase58()}`);
  console.log(`  ALPHA:  ${alphaCounterparty.publicKey.toBase58()}`);
  console.log(`  BETA:   ${betaCounterparty.publicKey.toBase58()}`);

  // 2. Airdrop SOL
  console.log('🔄 Requesting SOL Airdrop for SOPHIA...');
  try {
    const airdropSignature = await connection.requestAirdrop(sophia.publicKey, 2 * LAMPORTS_PER_SOL);
    // @ts-ignore
    const { blockhash } = await connection.getRecentBlockhash();
    // @ts-ignore
    await connection.confirmTransaction(airdropSignature);
    console.log('✓ 2 SOL Airdropped to SOPHIA');

    const bal = await connection.getBalance(sophia.publicKey);
    console.log(`  Balance: ${bal / LAMPORTS_PER_SOL} SOL`);
  } catch (e: any) {
    console.warn(`⚠️ Warning: Airdrop failed (rate limited?). Proceeding anyway: ${e.message}`);
  }

  // Using Circle's official Devnet USDC: 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU

  // 5. Append to .env.local
  const envVars = `\n
# TrustRails Dynamic Generated Keys (Solana Devnet)
AGENT_SOPHIA_PRIVKEY=${bs58.encode(sophia.secretKey)}
COUNTERPARTY_ALPHA_PUBKEY=${alphaCounterparty.publicKey.toBase58()}
COUNTERPARTY_BETA_PUBKEY=${betaCounterparty.publicKey.toBase58()}
USDC_DEVNET_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
`;

  fs.appendFileSync('.env.local', envVars);
  fs.appendFileSync('.env', envVars);
  console.log('✓ Keys written to .env and .env.local');

  console.log('\n=== SOLANA SETUP COMPLETE ===');
  console.log('You can now run the /demo endpoints!');
}

main().catch(console.error);
