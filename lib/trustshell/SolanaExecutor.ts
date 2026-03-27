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
    process.env.USDC_DEVNET_MINT || 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'
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

    const privKeyStr = process.env.AGENT_SOPHIA_PRIVKEY;
    if (!privKeyStr) throw new Error("Missing AGENT_SOPHIA_PRIVKEY in environment");
    
    const secretKey = bs58.decode(privKeyStr);
    const signer = Keypair.fromSecretKey(secretKey);
      
      const toKey   = new PublicKey(toAddress);
      
      const transferIx = SystemProgram.transfer({
        fromPubkey: signer.publicKey,
        toPubkey: toKey,
        lamports: 1000,
      });

      // TrustShell compliance memo — on-chain proof
      // Compact format: every field is a compliance signal for the audit trail
      const memo = JSON.stringify({
        ts:  1,                                    // TrustShell protocol version
        rid: complianceData.receiptId,             // KYA receipt ID
        ag:  complianceData.agentName,             // Agent name
        rep: complianceData.repidScore,            // RepID at execution
        bft: complianceData.bftPassed ? 1 : 0,    // BFT consensus passed
        bfw: Number(complianceData.bftWeight.toFixed(3)), // Consensus weight
        zkp: complianceData.zkpProofCID.slice(-8), // Last 8 chars of ZKP CID
        rh:  complianceData.ruleHash.slice(0, 8),  // First 8 chars of rule hash
        ins: complianceData.insuranceCoverage,     // Insurance coverage USD
        t:   Date.now(),                           // Unix timestamp
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
