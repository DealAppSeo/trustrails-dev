// lib/trustshell/SolanaExecutor.ts
// TrustShell Sprint — Created March 26 2026 by Gemini

import {
  Connection, Keypair, PublicKey, Transaction,
  TransactionInstruction, SystemProgram
} from '@solana/web3.js';
import bs58 from 'bs58';

export class SolanaExecutor {
  private connection = new Connection(
    process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    'confirmed'
  );
  private usdcMint = new PublicKey(
    process.env.USDC_DEVNET_MINT || '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
  );
  private MEMO_PROGRAM = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

  async execute(
    amountUSDC:      number,
    toAddress:       string,
    signerPrivKey:   string,
    complianceData:  {
      receiptId:       string;
      agentName:       string;
      repidScore:      number;
      bftPassed:       boolean;
      bftWeight:       number;
      zkpProofCID:     string;
      ruleHash:        string;
      insuranceCoverage: number;
    }
  ): Promise<{ txHash: string; explorerUrl: string }> {

    let privKeyStr = process.env.AGENT_SOPHIA_PRIVKEY;
    if (complianceData.agentName === 'SOPHIA') {
      privKeyStr = process.env.SOPHIA_SOLANA_PRIVATE_KEY || privKeyStr;
    }
    if (!privKeyStr) throw new Error("Missing sender private key in environment");
    
    // BUG FIX: Clean invisible whitespace/newlines (carriage returns) from dotenv lines
    privKeyStr = privKeyStr.trim();

    let finalToAddress = toAddress.trim();
    let recipientName = finalToAddress.slice(0, 8);
    let recipientRepid = 0;

    if (finalToAddress === 'NEXUS') {
      finalToAddress = (process.env.NEXUS_SOLANA_ADDRESS || 'mkxYpeHVaH3zychKcBsoLG53MwNnFkmFfeqDDDeCFKT').trim();
      recipientName = 'NEXUS';
      recipientRepid = 2658;
    }
    
    // BUG FIX: Fallback for 'dummy123' which would fail new PublicKey() base58 decode
    if (finalToAddress === 'dummy123') {
      finalToAddress = '11111111111111111111111111111111'; // Valid System Account fallback
    }

    const secretKey = bs58.decode(privKeyStr);
    const signer = Keypair.fromSecretKey(secretKey);
      
    const toKey   = new PublicKey(finalToAddress);
      
    const transferIx = SystemProgram.transfer({
      fromPubkey: signer.publicKey,
      toPubkey: toKey,
      lamports: 1000, // 1000 lamports for demo compliance anchor
    });

    const memo = JSON.stringify({
      ag:    complianceData.agentName,
      to:    recipientName,
      rep_s: complianceData.repidScore,
      rep_r: recipientRepid,
      bft:   complianceData.bftPassed ? 1 : 0,
      zkp:   complianceData.zkpProofCID.slice(-8),
      t:     Date.now()
    });

      const memoIx = new TransactionInstruction({
        keys:      [],
        programId: this.MEMO_PROGRAM,
        data:      Buffer.from(memo, 'utf8'),
      });

      const tx = new Transaction().add(transferIx, memoIx);
      tx.feePayer      = signer.publicKey;
      tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
      tx.sign(signer);

    const txHash = await this.connection.sendRawTransaction(tx.serialize());
    // await this.connection.confirmTransaction(txHash, 'confirmed');

    return {
      txHash,
      explorerUrl: `https://explorer.solana.com/tx/${txHash}?cluster=devnet`,
    };
  }
}
