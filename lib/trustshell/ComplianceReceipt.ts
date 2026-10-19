// lib/trustshell/ComplianceReceipt.ts
// TrustShell Sprint — Created March 26 2026 by Gemini

import { getSupabaseAdmin } from '@/lib/supabase-admin';

import type { ComplianceReceipt, KYAComplianceResult, BFTConsensusProof } from './types';

/**
 * The HMAC key behind `auditHash`. There is NO fallback: the old default
 * ('trinity-default-sbt-secret') was in this public repo, so anyone could mint
 * an auditHash that "verified". A receipt we cannot sign with a private key is
 * not a receipt, so a missing secret fails loudly instead.
 */
export function requireReceiptHmacSecret(): string {
  const secret = process.env.TRUSTRAILS_HMAC_SECRET;
  if (!secret) {
    throw new Error('TRUSTRAILS_HMAC_SECRET is not set: refusing to issue an unsigned compliance receipt.');
  }
  return secret;
}

/**
 * What this receipt does NOT prove. No Fireblocks pre-authorization is performed
 * (no credentials, no API call), and the BFT "vote" is a local rule simulation
 * in BFTAuthorizer, not a multi-party vote.
 */
export const RECEIPT_SIMULATED_PARTS = [
  'fireblocks_preauth: not performed (no Fireblocks call; id is null)',
  'bft_consensus: local rule simulation in BFTAuthorizer, not a multi-party vote',
];

export class ComplianceReceiptGenerator {
  private get supabase() { return getSupabaseAdmin(); }

  async generate(params: {
    kyaResult:       KYAComplianceResult;
    bftProof:        BFTConsensusProof;
    amountUSDC:      number;
    recipientAddress: string;
    solanaTxHash:    string;
    solanaExplorerUrl: string;
    ruleHash:        string;
  }): Promise<ComplianceReceipt> {
    // Before anything else: no secret, no receipt, no DB write.
    const secret = requireReceiptHmacSecret();

    const receiptId = crypto.randomUUID();

    // Build audit hash — tamper-evident proof of entire receipt
    const auditData = [
      receiptId,
      params.kyaResult.agentName,
      params.kyaResult.repidScore.toString(),
      params.amountUSDC.toString(),
      params.recipientAddress,
      params.bftProof.passed.toString(),
      params.bftProof.consensusWeight.toFixed(4),
      params.solanaTxHash,
      params.ruleHash,
    ].join(':');

    const auditHash = await this.hmacSha256(auditData, secret);

    const receipt: ComplianceReceipt = {
      receiptId,
      label:              'SIMULATED',
      simulated:          RECEIPT_SIMULATED_PARTS,
      agentName:          params.kyaResult.agentName,
      agentRepidScore:    params.kyaResult.repidScore,
      agentRepidTier:     params.kyaResult.repidTier,
      paymentAmountUSDC:  params.amountUSDC,
      recipientAddress:   params.recipientAddress,
      kyaVerified:        params.kyaResult.kya_verified,
      zkpProofCID:        params.kyaResult.zkpProofCID,
      humanCustodyBound:  params.kyaResult.humanCustodyBound,
      bftProof:           params.bftProof,
      withinDailyLimit:   params.kyaResult.withinDailyLimit,
      withinTxLimit:      params.kyaResult.withinTxLimit,
      ruleHash:           params.ruleHash,
      insuranceCoverage:  params.kyaResult.insuranceCoverage,
      solanaExplorerUrl:  params.solanaExplorerUrl,
      solanaTxHash:       params.solanaTxHash,
      // No Fireblocks pre-authorization happens, so there is no id to report.
      fireblocksPreAuthId: null,
      auditHash,
      createdAt:          new Date().toISOString(),
    };

    // Fetch custodian context for metadata
    const agentData = await this.supabase
      .from('agent_kya_registry')
      .select('lifecycle_state, custodian_link_active, custodian_tier')
      .eq('agent_name', params.kyaResult.agentName)
      .single();

    const custodian_context = agentData.data?.custodian_link_active
      ? `Custodian verified (${agentData.data?.custodian_tier}) — ZKP protected`
      : 'DBT-only — agent liability only';

    // Persist to Supabase
    const { error } = await this.supabase.from('kya_compliance_receipts').insert({
      receipt_id:           receipt.receiptId,
      agent_name:           receipt.agentName,
      agent_repid_score:    receipt.agentRepidScore,
      agent_repid_tier:     receipt.agentRepidTier,
      payment_amount_usdc:  receipt.paymentAmountUSDC,
      recipient_address:    receipt.recipientAddress,
      kya_verified:         receipt.kyaVerified,
      zkp_proof_cid:        receipt.zkpProofCID,
      human_custody_bound:  receipt.humanCustodyBound,
      bft_passed:           receipt.bftProof.passed,
      bft_votes_for:        receipt.bftProof.votesFor,
      bft_votes_against:    receipt.bftProof.votesAgainst,
      bft_consensus_weight: receipt.bftProof.consensusWeight,
      bft_threshold:        receipt.bftProof.threshold,
      pythagorean_veto:     receipt.bftProof.pythagoreanVeto,
      within_daily_limit:   receipt.withinDailyLimit,
      within_tx_limit:      receipt.withinTxLimit,
      rule_hash:            receipt.ruleHash,
      insurance_coverage:   receipt.insuranceCoverage,
      solana_tx_hash:       receipt.solanaTxHash,
      solana_explorer_url:  receipt.solanaExplorerUrl,
      fireblocks_preauth_id: receipt.fireblocksPreAuthId,
      audit_hash:           receipt.auditHash,
      custodian_context:    custodian_context,
    });

    // An unpersisted receipt must not be returned as if it existed. The tx hash
    // goes in the message: the Solana transfer already ran, so it must not be lost.
    if (error) {
      throw new Error(
        `kya_compliance_receipts insert failed for receipt ${receipt.receiptId} ` +
          `(solana tx ${params.solanaTxHash}): ${error.message}`
      );
    }

    return receipt;
  }

  private async hmacSha256(data: string, secret: string): Promise<string> {
    const crypto = await import('crypto');
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }
}
