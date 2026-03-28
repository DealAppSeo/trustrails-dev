// lib/trustshell/VaultPermission.ts
// TrustShell Sprint — Created March 26 2026 by Gemini

import { createClient } from '@supabase/supabase-js';

const _supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const _supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!_supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in Vercel Environment');
}
if (!_supabaseKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or ANON_KEY in Vercel Environment');
}

import type { VaultAccessRequest, VaultAccessResult } from './types';
import { KYAValidator } from './KYAValidator';
import { BFTAuthorizer } from './BFTAuthorizer';

export class VaultPermissionGate {
  private supabase = createClient(_supabaseUrl, _supabaseKey);
  private kya    = new KYAValidator();
  private bft    = new BFTAuthorizer();

  async checkAccess(req: VaultAccessRequest): Promise<VaultAccessResult> {
    // Get vault config
    const { data: vault } = await this.supabase
      .from('permissioned_vaults')
      .select('*')
      .eq('vault_id', req.vaultId)
      .single();

    if (!vault || !vault.active) {
      return { permitted: false, reason: 'Vault not found or inactive', agentRepid: 0, minRequired: 0 };
    }

    // Get agent KYA profile
    const profile = await this.kya.getAgentProfile(req.agentName);
    if (!profile) {
      await this.logAccess(req, 'denied', 0, vault.min_repid_required, 'Agent not in KYA registry');
      return { permitted: false, reason: 'Agent not in KYA registry', agentRepid: 0, minRequired: vault.min_repid_required };
    }

    // Check RepID minimum
    if (profile.repidScore < vault.min_repid_required) {
      const reason = `RepID ${profile.repidScore} below vault minimum ${vault.min_repid_required} (${vault.min_tier_required} tier required)`;
      await this.logAccess(req, 'denied', profile.repidScore, vault.min_repid_required, reason);
      return { permitted: false, reason, agentRepid: profile.repidScore, minRequired: vault.min_repid_required };
    }

    // Check vault access permission
    if (!profile.vaultAccessPermitted) {
      const reason = 'Agent not permitted for vault operations — human custody verification required';
      await this.logAccess(req, 'denied', profile.repidScore, vault.min_repid_required, reason);
      return { permitted: false, reason, agentRepid: profile.repidScore, minRequired: vault.min_repid_required };
    }

    // Check human custody for vault ops
    if (vault.requires_human_custody && !profile.humanCustodyVerified) {
      const reason = 'Vault requires human custody binding — 4FA soulbound token required';
      await this.logAccess(req, 'denied', profile.repidScore, vault.min_repid_required, reason);
      return { permitted: false, reason, agentRepid: profile.repidScore, minRequired: vault.min_repid_required };
    }

    // BFT consensus for withdrawals above threshold
    if (vault.requires_bft_consensus && req.action !== 'deposit') {
      const paymentId = crypto.randomUUID();
      const bftProof = await this.bft.authorize(
        paymentId, req.agentName, req.amountUSDC,
        vault.max_withdrawal_usdc, `vault_${req.action}`
      );
      if (!bftProof.passed) {
        const reason = `BFT consensus failed (${(bftProof.consensusWeight * 100).toFixed(1)}% < ${(bftProof.threshold * 100)}% threshold)`;
        await this.logAccess(req, 'denied', profile.repidScore, vault.min_repid_required, reason);
        return { permitted: false, reason, agentRepid: profile.repidScore, minRequired: vault.min_repid_required };
      }
    }

    await this.logAccess(req, req.action, profile.repidScore, vault.min_repid_required, 'Access granted');
    return { permitted: true, reason: 'KYA verified, RepID sufficient, BFT consensus passed', agentRepid: profile.repidScore, minRequired: vault.min_repid_required };
  }

  private async logAccess(
    req: VaultAccessRequest, action: string,
    repid: number, minRequired: number, reason: string
  ) {
    await this.supabase.from('vault_access_log').insert({
      vault_id:        req.vaultId,
      agent_name:      req.agentName,
      repid_at_access: repid,
      action,
      amount_usdc:     req.amountUSDC,
      denied_reason:   action === 'denied' ? reason : null,
    });
  }
}
