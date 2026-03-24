/**
 * FACT CHECKER AGENT
 * Validates all claims before they reach Tamir
 */

class FactChecker {
  constructor() {
    this.verified_facts = {};
    this.known_contradictions = {};
    this.confidence_history = {};
  }

  /**
   * Main: Check all claims in agent output
   */
  checkOutput(agent_output) {
    const result = {
      agent: agent_output.agent_name || 'Unknown',
      timestamp: new Date().toISOString(),
      claims: [],
      summary: {
        total_claims: 0,
        verified: 0,
        likely: 0,
        uncertain: 0,
        unverified: 0,
        blocked: 0
      },
      status: 'PASS',
      recommendation: null,
      cleaned_output: agent_output
    };

    // Extract all claims from output
    const claims = this._extractClaims(agent_output);
    result.summary.total_claims = claims.length;

    // Check each claim
    for (const claim of claims) {
      const checked = this._checkClaim(claim, agent_output);
      result.claims.push(checked);

      // Count by status
      result.summary[checked.status.toLowerCase()]++;

      // Block if critical claim is unverified
      if (checked.is_critical && checked.status === 'UNVERIFIED') {
        result.status = 'BLOCK';
      }

      // Warn if contradictions found
      if (checked.contradictions.length > 0) {
        result.status = 'BLOCK';
      }
    }

    // Determine recommendation
    result.recommendation = this._getRecommendation(result);

    return result;
  }

  /**
   * Extract all claims from output
   */
  _extractClaims(output) {
    const claims = [];

    // Claims array
    if (output.claims && Array.isArray(output.claims)) {
      for (const claim of output.claims) {
        claims.push({
          text: claim,
          source: 'claims_array',
          context: output
        });
      }
    }

    // Recommendation field
    if (output.recommendation) {
      claims.push({
        text: output.recommendation,
        source: 'recommendation',
        context: output,
        is_critical: true
      });
    }

    // Numbers and dates in output
    const numbers = this._extractNumbers(JSON.stringify(output));
    for (const num of numbers) {
      if (num.confidence < 100) {
        claims.push({
          text: num.text,
          source: 'numeric',
          value: num.value,
          is_critical: num.is_currency || num.is_date
        });
      }
    }

    return claims;
  }

  /**
   * Check individual claim
   */
  _checkClaim(claim, context) {
    const result = {
      claim: claim.text,
      status: 'UNVERIFIED',
      confidence: 0,
      sources: [],
      contradictions: [],
      evidence: null,
      notes: [],
      is_critical: claim.is_critical || false,
      recommendation: 'ASK FOR SOURCE'
    };

    // Check if claim matches verified facts
    if (this.verified_facts[claim.text]) {
      const fact = this.verified_facts[claim.text];
      result.status = 'VERIFIED';
      result.confidence = 100;
      result.sources = [fact.source];
      result.evidence = fact.evidence;
    }

    // Check for contradictions
    if (this.known_contradictions[claim.text]) {
      result.contradictions = this.known_contradictions[claim.text];
      result.status = 'BLOCKED';
      result.recommendation = 'CONTRADICTS KNOWN FACT';
    }

    // Check if claim is reasonable/likely
    if (this._isReasonable(claim.text, context)) {
      if (result.status !== 'VERIFIED') {
        result.status = 'LIKELY';
        result.confidence = 75;
      }
    }

    // Check if claim contains qualifier (already has confidence level)
    const qualifier = this._extractQualifier(claim.text);
    if (qualifier) {
      result.notes.push(`Claim already qualified: "${qualifier}"`);
      result.confidence = qualifier.confidence || 50;
      result.status = qualifier.status || 'UNCERTAIN';
    }

    // Red flags
    if (this._hasRedFlags(claim.text)) {
      result.status = 'BLOCKED';
      result.notes.push('Red flags detected: unrealistic claim');
      result.recommendation = 'REVISE CLAIM';
    }

    return result;
  }

  /**
   * Extract claims from numbers in output
   */
  _extractNumbers(text) {
    const numbers = [];
    
    // Currency amounts
    const currency_regex = /\$(\d+[KMB]?)/g;
    let match;
    while ((match = currency_regex.exec(text)) !== null) {
      numbers.push({
        text: match[0],
        value: match[1],
        is_currency: true,
        confidence: 0
      });
    }

    // Dates
    const date_regex = /\d{4}-\d{2}-\d{2}/g;
    while ((match = date_regex.exec(text)) !== null) {
      numbers.push({
        text: match[0],
        value: match[0],
        is_date: true,
        confidence: 0
      });
    }

    return numbers;
  }

  /**
   * Check if claim is reasonable
   */
  _isReasonable(claim, context) {
    // Check against impossibilities
    if (claim.includes('10x in 1 week')) return false;
    if (claim.includes('100% success')) return false;
    if (claim.includes('no risk')) return false;

    return true;
  }

  /**
   * Extract confidence qualifier from claim
   */
  _extractQualifier(claim) {
    const qualifiers = {
      'assuming': { status: 'UNCERTAIN', confidence: 50 },
      'likely': { status: 'LIKELY', confidence: 75 },
      'probably': { status: 'LIKELY', confidence: 70 },
      'estimated': { status: 'UNCERTAIN', confidence: 60 },
      'approximately': { status: 'UNCERTAIN', confidence: 65 },
      'about': { status: 'UNCERTAIN', confidence: 60 },
      'based on': { status: 'LIKELY', confidence: 70 },
      'unverified': { status: 'UNVERIFIED', confidence: 20 }
    };

    for (const [word, meta] of Object.entries(qualifiers)) {
      if (claim.toLowerCase().includes(word)) {
        return meta;
      }
    }

    return null;
  }

  /**
   * Detect red flags
   */
  _hasRedFlags(claim) {
    const red_flags = [
      'will definitely',
      'guaranteed to',
      '100% chance',
      'no risk',
      'impossible to fail',
      'can\'t go wrong',
      'obviously',
      'of course'
    ];

    const lower = claim.toLowerCase();
    return red_flags.some(flag => lower.includes(flag));
  }

  /**
   * Get recommendation
   */
  _getRecommendation(result) {
    const { total_claims, blocked, verified } = result.summary;

    if (blocked > 0) {
      return '❌ BLOCKED - Claims contain unverified or contradictory information';
    }

    if (verified === total_claims) {
      return '✅ APPROVED - All claims verified';
    }

    const unverified = result.summary.unverified;
    if (unverified > 0) {
      return `⚠️  SEND WITH WARNINGS - ${unverified} claim(s) unverified, mark with confidence levels`;
    }

    return '✅ READY - Send with confidence qualifiers where needed';
  }

  /**
   * Register verified fact
   */
  registerFact(claim, source, evidence) {
    this.verified_facts[claim] = {
      source: source,
      evidence: evidence,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Register contradiction
   */
  registerContradiction(claim, contradicting_fact, source) {
    this.known_contradictions[claim] = this.known_contradictions[claim] || [];
    this.known_contradictions[claim].push({
      contradicts: contradicting_fact,
      source: source,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Process interface
   */
  async process(input) {
    const { action, data } = input;

    try {
      switch (action) {
        case 'check':
          return {
            success: true,
            result: this.checkOutput(data.output)
          };

        case 'register_fact':
          this.registerFact(data.claim, data.source, data.evidence);
          return { success: true, message: 'Fact registered' };

        case 'register_contradiction':
          this.registerContradiction(data.claim, data.contradicting_fact, data.source);
          return { success: true, message: 'Contradiction registered' };

        default:
          return { success: false, error: 'Unknown action' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = FactChecker;
