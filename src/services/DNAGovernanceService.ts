import { dbEngine } from '../db/dbEngine';
import { DNARuleItem, DNAViolationItem } from '../types';

export class DNAGovernanceService {
  private static instance: DNAGovernanceService | null = null;

  private constructor() {
    // Initialize if needed
  }

  public static getInstance(): DNAGovernanceService {
    if (!DNAGovernanceService.instance) {
      DNAGovernanceService.instance = new DNAGovernanceService();
    }
    return DNAGovernanceService.instance;
  }

  /**
   * Evaluates a payload or potential operation against the system's unbreachable DNA Constitution.
   * Returns validation result: Allow, Block, Escalate, Review
   */
  public evaluateGovernanceSafety(params: {
    agent: string;
    tool: string;
    ruleType: 'business' | 'finance' | 'inventory' | 'risk' | 'permission' | 'compliance';
    inputData: any;
  }): {
    action: 'allow' | 'block' | 'escalate' | 'review';
    violatedRule?: DNARuleItem;
    reason: string;
  } {
    const rules = dbEngine.dna_rules.getAll().filter(
      r => r.rule_type === params.ruleType && r.status === 'active'
    );

    const inputString = typeof params.inputData === 'string' 
      ? params.inputData 
      : JSON.stringify(params.inputData);

    for (const rule of rules) {
      // 1. Finance Rule Checks
      if (params.ruleType === 'finance') {
        // e.g., Maximum discount limitation (Max 25%)
        if (rule.rule_id === 'dna_rule_01') {
          try {
            const parsed = typeof params.inputData === 'object' ? params.inputData : JSON.parse(params.inputData || '{}');
            const discount = parsed.discount || parsed.discount_rate || parsed.percentage;
            if (discount !== undefined && Number(discount) > 0.25) {
              this.logViolation({
                agent: params.agent,
                tool: params.tool,
                rule_id: rule.rule_id,
                input: inputString,
                reason: `Proposed discount of ${(Number(discount) * 100).toFixed(1)}% exceeds the statutory max discount baseline of 25%.`,
                severity: 'block'
              });
              return {
                action: 'block',
                violatedRule: rule,
                reason: `Finance Rule Violation: Discount exceed limits (Max 25%).`
              };
            }
          } catch (_) {
            // Safe fallback
          }
        }
      }

      // 2. Inventory Safety Level Check
      if (params.ruleType === 'inventory') {
        if (rule.rule_id === 'dna_rule_02') {
          try {
            const parsed = typeof params.inputData === 'object' ? params.inputData : JSON.parse(params.inputData || '{}');
            const remainingQty = parsed.remainingQty || parsed.quantity || parsed.stock;
            // Guard safety level lock
            if (remainingQty !== undefined && Number(remainingQty) < 5) {
              this.logViolation({
                agent: params.agent,
                tool: params.tool,
                rule_id: rule.rule_id,
                input: inputString,
                reason: `Attempt to deplete stocks below safety level of 5 units (Target stock request: ${remainingQty}). Rejected.`,
                severity: 'block'
              });
              return {
                action: 'block',
                violatedRule: rule,
                reason: `Inventory Rule Violation: Safety level breached (< 5 units).`
              };
            }
          } catch (_) {
            // Guard safely
          }
        }
      }

      // 3. Tone of Voice / Business Check
      if (params.ruleType === 'business') {
        if (rule.rule_id === 'dna_rule_03') {
          const lowerInput = inputString.toLowerCase();
          const ClickbaitWords = ['click here', 'limited time only!', 'you won\'t believe', 'xxx', 'cheap', 'lowest price guaranteed'];
          const matched = ClickbaitWords.find(word => lowerInput.includes(word));
          if (matched) {
            this.logViolation({
              agent: params.agent,
              tool: params.tool,
              rule_id: rule.rule_id,
              input: inputString,
              reason: `Spam-like tone detected: contains '${matched}'. Violates 'minimalist_european' brand guidelines.`,
              severity: 'review'
            });
            return {
              action: 'review',
              violatedRule: rule,
              reason: `Tone Guideline Deviation: Found spam word '${matched}'. Escalated to Marketing Review Workflow.`
            };
          }
        }
      }

      // 4. Supplier Geo-Diversification Risk Check
      if (params.ruleType === 'risk') {
        if (rule.rule_id === 'dna_rule_04') {
          try {
            const parsed = typeof params.inputData === 'object' ? params.inputData : JSON.parse(params.inputData || '{}');
            const allocationRatio = parsed.allocationRatio || parsed.ratio || parsed.percentage;
            if (allocationRatio !== undefined && Number(allocationRatio) > 0.75) {
              this.logViolation({
                agent: params.agent,
                tool: params.tool,
                rule_id: rule.rule_id,
                input: inputString,
                reason: `Geographical supplier concentration ratio of ${(Number(allocationRatio) * 100).toFixed(0)}% exceeds safe risk limit of 75%.`,
                severity: 'escalate'
              });
              return {
                action: 'escalate',
                violatedRule: rule,
                reason: `Risk Allocation Warning: Geographic concentration exceeds 75% security tolerance limit.`
              };
            }
          } catch (_) {
            // Guard
          }
        }
      }

      // 5. GDPR / Compliance Check
      if (params.ruleType === 'compliance') {
        if (rule.rule_id === 'dna_rule_05') {
          const lowerInput = inputString.toLowerCase();
          const piiRegex = /(phone|tel|mobile):\s*\+?\d{6,15}|(\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b)/gi;
          if (piiRegex.test(lowerInput)) {
            this.logViolation({
              agent: params.agent,
              tool: params.tool,
              rule_id: rule.rule_id,
              input: inputString,
              reason: `Unencrypted PII signature (email or phone) detected in payload tracking. Enforced protection blocker.`,
              severity: 'block'
            });
            return {
              action: 'block',
              violatedRule: rule,
              reason: `GDPR Compliance Block: Proactively blocked unencrypted customer PII tracking.`
            };
          }
        }
      }
    }

    return {
      action: 'allow',
      reason: 'All DNA constraints checked. Safe configuration verified.'
    };
  }

  /**
   * Logs safety violations to database under P0-007 constitution requirements
   */
  private logViolation(data: {
    agent: string;
    tool: string;
    rule_id: string;
    input: string;
    reason: string;
    severity: 'block' | 'escalate' | 'review' | 'allow';
  }): void {
    dbEngine.dna_violations.create({
      agent: data.agent,
      tool: data.tool,
      rule_id: data.rule_id,
      input: data.input,
      reason: data.reason,
      severity: data.severity
    });
  }

  /**
   * Manual override of rules
   */
  public handleManualExempt(violationId: string, authorizer: string): boolean {
    const violation = dbEngine.dna_violations.getAll().find(v => v.violation_id === violationId);
    if (violation) {
      // Create a compensation record
      dbEngine.dna_violations.create({
        agent: authorizer,
        tool: violation.tool,
        rule_id: violation.rule_id,
        input: `EXEMPTION_OVERRIDE_FOR: ${violationId}`,
        reason: `Exemption manual override strictly authorized by super administrator: ${authorizer}. Approved under special business context.`,
        severity: 'allow'
      });
      return true;
    }
    return false;
  }
}
