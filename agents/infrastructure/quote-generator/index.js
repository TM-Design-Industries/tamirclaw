/**
 * QUOTE GENERATOR AGENT
 * 
 * Creates professional proposals and cost estimates
 * - Estimate project cost based on domain, scope, timeline
 * - Generate proposal documents
 * - Track quote history
 * - Apply markup for profit
 */

const crypto = require('crypto');

class QuoteGeneratorAgent {
  constructor() {
    this.name = 'Quote Generator';
    this.quotes = new Map();
    
    // Pricing matrix by domain and complexity
    this.domainPricing = {
      'automotive': {
        baseRate: 150, // per hour
        complexityMultiplier: {simple: 1, moderate: 1.5, complex: 2.5},
        estimatedHours: {simple: 100, moderate: 300, complex: 800}
      },
      'aerospace': {
        baseRate: 200,
        complexityMultiplier: {simple: 1.2, moderate: 2, complex: 3.5},
        estimatedHours: {simple: 150, moderate: 500, complex: 1500}
      },
      'marine': {
        baseRate: 140,
        complexityMultiplier: {simple: 1, moderate: 1.3, complex: 2},
        estimatedHours: {simple: 120, moderate: 400, complex: 1000}
      },
      'architecture': {
        baseRate: 130,
        complexityMultiplier: {simple: 0.8, moderate: 1.2, complex: 1.8},
        estimatedHours: {simple: 80, moderate: 250, complex: 600}
      },
      'industrial': {
        baseRate: 120,
        complexityMultiplier: {simple: 0.9, moderate: 1.4, complex: 2.2},
        estimatedHours: {simple: 100, moderate: 350, complex: 900}
      }
    };

    // Markup rates
    this.markupRates = {
      'startup': 0.25,    // 25% markup
      'smb': 0.35,        // 35% markup
      'enterprise': 0.45  // 45% markup
    };
  }

  /**
   * ESTIMATE COST
   * Calculate project cost based on domain, scope, timeline
   */
  async estimateCost(input) {
    try {
      const {domain, complexity, timeline_weeks, client_type} = input;

      if (!domain || !complexity) {
        return {
          success: false,
          error: 'Missing required fields: domain, complexity'
        };
      }

      const pricing = this.domainPricing[domain.toLowerCase()];
      if (!pricing) {
        return {
          success: false,
          error: `Unknown domain: ${domain}. Valid: ${Object.keys(this.domainPricing).join(', ')}`
        };
      }

      // Calculate base cost
      const estimatedHours = pricing.estimatedHours[complexity] || pricing.estimatedHours.moderate;
      const complexityMult = pricing.complexityMultiplier[complexity] || 1;
      const baseHours = estimatedHours * complexityMult;
      const baseLabor = baseHours * pricing.baseRate;

      // Timeline adjustment (rush penalty)
      let timelineMultiplier = 1;
      if (timeline_weeks && timeline_weeks < 8) {
        timelineMultiplier = 1.2; // 20% rush fee
      }

      const laborCost = baseLabor * timelineMultiplier;

      // Materials estimate (rough)
      const materialsCost = laborCost * 0.15; // 15% of labor

      // Overhead
      const overheadCost = laborCost * 0.20; // 20% of labor

      // Subtotal before markup
      const subtotal = laborCost + materialsCost + overheadCost;

      // Apply markup
      const markupRate = this.markupRates[client_type?.toLowerCase()] || this.markupRates.smb;
      const markup = subtotal * markupRate;
      const totalCost = subtotal + markup;

      console.log(`[QuoteGenerator] Estimated ${domain} project: $${totalCost.toFixed(2)}`);

      return {
        success: true,
        cost_estimate: Math.round(totalCost),
        breakdown: {
          labor: Math.round(laborCost),
          materials: Math.round(materialsCost),
          overhead: Math.round(overheadCost),
          subtotal: Math.round(subtotal),
          markup: Math.round(markup),
          markup_rate: (markupRate * 100) + '%'
        },
        estimated_hours: Math.round(baseHours),
        timeline_adjustment: timelineMultiplier > 1 ? 'RUSH: +20% fee applied' : 'Standard timeline'
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to estimate cost: ${error.message}`
      };
    }
  }

  /**
   * GENERATE QUOTE
   * Full quote document with terms, conditions, payment
   */
  async generateQuote(input) {
    try {
      const {
        client,
        project_name,
        domain,
        complexity,
        timeline_weeks,
        client_type,
        description,
        deliverables
      } = input;

      if (!client || !project_name || !domain) {
        return {
          success: false,
          error: 'Missing required fields: client, project_name, domain'
        };
      }

      // Get cost estimate
      const costResult = await this.estimateCost({
        domain,
        complexity: complexity || 'moderate',
        timeline_weeks,
        client_type: client_type || 'smb'
      });

      if (!costResult.success) {
        return costResult;
      }

      // Generate quote ID
      const quoteId = `QUOTE-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

      // Build proposal text
      const proposal = this.buildProposalDocument({
        quoteId,
        client,
        projectName: project_name,
        domain,
        complexity,
        description,
        deliverables,
        costBreakdown: costResult.breakdown,
        totalCost: costResult.cost_estimate,
        estimatedHours: costResult.estimated_hours,
        timelineWeeks: timeline_weeks || 12
      });

      // Store quote
      const quote = {
        id: quoteId,
        client: client,
        project_name: project_name,
        domain: domain,
        cost: costResult.cost_estimate,
        breakdown: costResult.breakdown,
        status: 'draft', // draft → sent → accepted → rejected
        created_at: new Date().toISOString(),
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        proposal: proposal
      };

      this.quotes.set(quoteId, quote);

      console.log(`[QuoteGenerator] Generated quote ${quoteId} for ${client}: $${costResult.cost_estimate}`);

      return {
        success: true,
        quote_id: quoteId,
        cost: costResult.cost_estimate,
        status: 'draft',
        valid_until: quote.valid_until,
        proposal: proposal
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to generate quote: ${error.message}`
      };
    }
  }

  /**
   * BUILD PROPOSAL DOCUMENT
   */
  buildProposalDocument(data) {
    const {
      quoteId,
      client,
      projectName,
      domain,
      complexity,
      description,
      deliverables,
      costBreakdown,
      totalCost,
      estimatedHours,
      timelineWeeks
    } = data;

    const proposal = `
================================================================================
                         PROFESSIONAL PROPOSAL
================================================================================

Quote ID:           ${quoteId}
Date:               ${new Date().toLocaleDateString()}
Client:             ${client}
Project:            ${projectName}
Domain:             ${domain.toUpperCase()}
Complexity:         ${complexity.toUpperCase()}

================================================================================
PROJECT OVERVIEW
================================================================================

${description || 'Professional design and engineering services for ' + projectName}

Deliverables:
${(deliverables || []).map(d => `  • ${d}`).join('\n') || '  • Comprehensive project deliverables\n  • Engineering specifications\n  • Design documentation'}

================================================================================
COST BREAKDOWN
================================================================================

Labor Cost:         $${costBreakdown.labor.toLocaleString()}
Materials:          $${costBreakdown.materials.toLocaleString()}
Overhead:           $${costBreakdown.overhead.toLocaleString()}
                    ─────────────────────
Subtotal:           $${costBreakdown.subtotal.toLocaleString()}

Markup (${costBreakdown.markup_rate}):   $${costBreakdown.markup.toLocaleString()}
                    ═════════════════════
TOTAL PROJECT:      $${totalCost.toLocaleString()}

Estimated Hours:    ${estimatedHours} hours
Estimated Timeline: ${timelineWeeks} weeks

================================================================================
TERMS & CONDITIONS
================================================================================

1. Payment Terms:   50% upfront, 50% upon completion
2. Timeline:        Start date: Upon agreement
3. Scope:           As specified in deliverables above
4. Revisions:       Up to 2 rounds included
5. Valid Until:     30 days from quote date
6. Cancellation:    30 days notice required for project postponement

================================================================================
NEXT STEPS
================================================================================

1. Review proposal
2. Contact us with questions
3. Sign agreement to proceed
4. Submit 50% deposit
5. Project begins within 5 business days

For questions, contact: tamir@tmd.local

================================================================================
    TMD Design Industries | Professional Design & Engineering
================================================================================
`;

    return proposal;
  }

  /**
   * UPDATE QUOTE STATUS
   */
  async updateQuoteStatus(input) {
    try {
      const {quote_id, status} = input;

      if (!quote_id || !status) {
        return {
          success: false,
          error: 'Missing required fields: quote_id, status'
        };
      }

      const quote = this.quotes.get(quote_id);
      if (!quote) {
        return {
          success: false,
          error: `Quote ${quote_id} not found`
        };
      }

      const validStatuses = ['draft', 'sent', 'accepted', 'rejected'];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          error: `Invalid status. Valid: ${validStatuses.join(', ')}`
        };
      }

      quote.status = status;
      quote.updated_at = new Date().toISOString();

      console.log(`[QuoteGenerator] Updated ${quote_id} to ${status}`);

      return {
        success: true,
        quote_id: quote_id,
        status: status
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update quote: ${error.message}`
      };
    }
  }

  /**
   * MAIN ROUTER
   */
  async process(input) {
    const {action, data} = input;

    switch(action) {
      case 'estimate_cost':
        return await this.estimateCost(data);
      case 'generate_quote':
        return await this.generateQuote(data);
      case 'update_status':
        return await this.updateQuoteStatus(data);
      default:
        return {
          success: false,
          error: `Unknown action: ${action}`
        };
    }
  }
}

module.exports = QuoteGeneratorAgent;
