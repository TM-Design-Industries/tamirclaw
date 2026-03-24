/**
 * AGENT VALIDATOR
 * Validation layer that checks all agent outputs
 * 
 * Catches:
 * 1. Logical errors
 * 2. Conflicts between agents
 * 3. Unverified facts
 * 4. Procedural violations
 * 5. Conflicts of interest
 */

class AgentValidator {
  constructor() {
    this.validations = [];
    this.known_facts = {};
    this.procedures = {};
    this.authority_rules = {};
  }

  /**
   * Main validation - runs all checks
   */
  validate(agent_output, context = {}) {
    const result = {
      agent: agent_output.agent_name || 'Unknown',
      output_id: agent_output.id || `OUT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      checks: {
        error_check: null,
        conflict_check: null,
        fact_check: null,
        process_check: null,
        interest_check: null
      },
      status: 'PENDING',
      severity: [],
      recommendation: null,
      notes: []
    };

    // Run all 5 checks
    result.checks.error_check = this._checkErrors(agent_output, context);
    result.checks.conflict_check = this._checkConflicts(agent_output, context);
    result.checks.fact_check = this._checkFacts(agent_output, context);
    result.checks.process_check = this._checkProcedures(agent_output, context);
    result.checks.interest_check = this._checkBias(agent_output, context);

    // Determine overall status
    const blocker = Object.values(result.checks).find(c => c.status === 'BLOCKED');
    const flag = Object.values(result.checks).find(c => c.status === 'FLAGGED');

    if (blocker) {
      result.status = 'BLOCKED';
      result.recommendation = '❌ DO NOT SEND - Critical error must be fixed';
    } else if (flag) {
      result.status = 'FLAGGED';
      result.recommendation = '⚠️ SEND WITH NOTES - Review issues before acting';
    } else {
      result.status = 'VALIDATED';
      result.recommendation = '✅ READY - All checks passed';
    }

    return result;
  }

  /**
   * Check 1: Logical Errors
   */
  _checkErrors(output, context) {
    const issues = [];

    // Check for self-contradiction
    if (output.claims && Array.isArray(output.claims)) {
      for (let i = 0; i < output.claims.length; i++) {
        for (let j = i + 1; j < output.claims.length; j++) {
          if (this._contradicts(output.claims[i], output.claims[j])) {
            issues.push({
              type: 'self_contradiction',
              claim1: output.claims[i],
              claim2: output.claims[j],
              severity: 'HIGH'
            });
          }
        }
      }
    }

    // Check for logical impossibilities
    if (output.plan && Array.isArray(output.plan)) {
      for (let i = 0; i < output.plan.length; i++) {
        for (let j = i + 1; j < output.plan.length; j++) {
          if (this._mutuallyExclusive(output.plan[i], output.plan[j])) {
            issues.push({
              type: 'mutual_exclusivity',
              action1: output.plan[i],
              action2: output.plan[j],
              severity: 'MEDIUM'
            });
          }
        }
      }
    }

    return {
      status: issues.length === 0 ? 'PASS' : (
        issues.some(i => i.severity === 'HIGH') ? 'BLOCKED' : 'FLAGGED'
      ),
      issues: issues,
      summary: `${issues.length} logical issues found`
    };
  }

  /**
   * Check 2: Conflicts with other agents
   */
  _checkConflicts(output, context) {
    const issues = [];

    // Check against previous agent outputs in context
    if (context.previous_outputs && Array.isArray(context.previous_outputs)) {
      for (const prev of context.previous_outputs) {
        if (this._contradicts(output.recommendation, prev.recommendation)) {
          issues.push({
            type: 'agent_conflict',
            this_agent: output.agent_name,
            other_agent: prev.agent_name,
            conflict: `${output.recommendation} vs ${prev.recommendation}`,
            severity: 'MEDIUM'
          });
        }
      }
    }

    // Check for resource conflicts
    if (output.resources && context.allocated_resources) {
      for (const [resource, amount] of Object.entries(output.resources || {})) {
        if (context.allocated_resources[resource] && 
            amount > context.allocated_resources[resource]) {
          issues.push({
            type: 'resource_conflict',
            resource: resource,
            requested: amount,
            available: context.allocated_resources[resource],
            severity: 'HIGH'
          });
        }
      }
    }

    return {
      status: issues.length === 0 ? 'PASS' : (
        issues.some(i => i.severity === 'HIGH') ? 'BLOCKED' : 'FLAGGED'
      ),
      issues: issues,
      summary: `${issues.length} conflicts detected`
    };
  }

  /**
   * Check 3: Fact Verification
   */
  _checkFacts(output, context) {
    const issues = [];

    if (!output.claims) return { status: 'PASS', issues: [], summary: 'No claims to verify' };

    for (const claim of output.claims) {
      // Check if claim is in known facts
      if (this.known_facts[claim]) {
        if (this.known_facts[claim].value === claim) {
          issues.push({
            type: 'verified_fact',
            claim: claim,
            source: this.known_facts[claim].source,
            status: 'VERIFIED'
          });
        } else {
          issues.push({
            type: 'contradicts_known_fact',
            claim: claim,
            known_fact: this.known_facts[claim].value,
            severity: 'HIGH'
          });
        }
      } else {
        // Unverified claim
        issues.push({
          type: 'unverified_claim',
          claim: claim,
          severity: 'LOW',
          note: 'No evidence found, but not contradicted'
        });
      }
    }

    return {
      status: issues.some(i => i.severity === 'HIGH') ? 'BLOCKED' : (
        issues.some(i => i.severity === 'LOW') ? 'FLAGGED' : 'PASS'
      ),
      issues: issues,
      summary: `${issues.filter(i => i.status === 'VERIFIED').length} verified, ${issues.filter(i => i.type === 'unverified_claim').length} unverified`
    };
  }

  /**
   * Check 4: Procedure Compliance
   */
  _checkProcedures(output, context) {
    const issues = [];

    // Check if agent followed escalation rules
    if (output.decision_level && context.required_escalation) {
      if (output.decision_level > context.required_escalation) {
        issues.push({
          type: 'escalation_violation',
          decision_level: output.decision_level,
          required_level: context.required_escalation,
          severity: 'HIGH'
        });
      }
    }

    // Check if agent documented decision
    if (!output.rationale) {
      issues.push({
        type: 'missing_documentation',
        field: 'rationale',
        severity: 'MEDIUM'
      });
    }

    // Check authority
    if (output.authority_needed && context.available_authority < output.authority_needed) {
      issues.push({
        type: 'insufficient_authority',
        needed: output.authority_needed,
        available: context.available_authority,
        severity: 'HIGH'
      });
    }

    return {
      status: issues.length === 0 ? 'PASS' : (
        issues.some(i => i.severity === 'HIGH') ? 'BLOCKED' : 'FLAGGED'
      ),
      issues: issues,
      summary: `${issues.length} procedure issues found`
    };
  }

  /**
   * Check 5: Conflict of Interest / Bias
   */
  _checkBias(output, context) {
    const issues = [];

    // Check if agent recommends only itself
    if (output.recommendation && output.recommendation.includes(output.agent_name)) {
      issues.push({
        type: 'self_recommendation',
        note: 'Agent recommends only itself - request independent verification',
        severity: 'MEDIUM'
      });
    }

    // Check if agent downplays risks
    if (output.risks && output.risks.length === 0 && context.known_risks) {
      issues.push({
        type: 'risk_understatement',
        note: `Known risks exist but agent lists ${output.risks.length}`,
        severity: 'MEDIUM'
      });
    }

    // Check if agent has financial interest
    if (output.cost_impact && output.agent_name.includes('Cost') && output.cost_impact < 0) {
      issues.push({
        type: 'potential_bias',
        note: 'Cost agent recommending cost reduction - verify with other agents',
        severity: 'LOW'
      });
    }

    return {
      status: issues.length === 0 ? 'PASS' : (
        issues.some(i => i.severity === 'HIGH') ? 'BLOCKED' : 'FLAGGED'
      ),
      issues: issues,
      summary: `${issues.length} potential bias issues found`
    };
  }

  // Helper: Check if two claims contradict
  _contradicts(claim1, claim2) {
    if (!claim1 || !claim2) return false;
    const c1 = String(claim1).toLowerCase();
    const c2 = String(claim2).toLowerCase();
    
    return (c1.includes('no') && c2.includes('yes')) ||
           (c1.includes('must') && c2.includes('cannot')) ||
           (c1.includes('always') && c2.includes('never'));
  }

  // Helper: Check if two actions are mutually exclusive
  _mutuallyExclusive(action1, action2) {
    if (!action1 || !action2) return false;
    const a1 = String(action1).toLowerCase();
    const a2 = String(action2).toLowerCase();

    return (a1.includes('wait') && a2.includes('start')) ||
           (a1.includes('cancel') && a2.includes('execute')) ||
           (a1.includes('kill') && a2.includes('launch'));
  }

  /**
   * Register known fact
   */
  registerFact(claim, value, source) {
    this.known_facts[claim] = { value, source, timestamp: new Date().toISOString() };
  }

  /**
   * Get validation report
   */
  report(validation_result) {
    let report = `\n${'='.repeat(60)}\nAGENT VALIDATION REPORT\n${'='.repeat(60)}\n`;
    report += `Agent: ${validation_result.agent}\n`;
    report += `Status: ${validation_result.status}\n`;
    report += `Recommendation: ${validation_result.recommendation}\n\n`;

    for (const [check, result] of Object.entries(validation_result.checks)) {
      if (result) {
        report += `${check}: ${result.status}\n`;
        if (result.issues.length > 0) {
          report += `  Issues: ${result.issues.length}\n`;
        }
      }
    }

    report += `${'='.repeat(60)}\n`;
    return report;
  }

  /**
   * Process interface
   */
  async process(input) {
    const { action, data } = input;

    try {
      switch (action) {
        case 'validate':
          return {
            success: true,
            validation: this.validate(data.output, data.context)
          };

        case 'register_fact':
          this.registerFact(data.claim, data.value, data.source);
          return { success: true, message: 'Fact registered' };

        default:
          return { success: false, error: 'Unknown action' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = AgentValidator;
