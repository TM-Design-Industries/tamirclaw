/**
 * SYNERGY OPTIMIZER v2.0
 * Strategic resource allocation to maximize portfolio returns
 */

class SynergyOptimizer {
  constructor() {
    this.optimizations = [];
    this.allocation_history = [];
  }

  /**
   * Optimize resource allocation across ventures
   * Strategy: 60% to high-synergy clusters, 30% to medium, 10% to low
   */
  optimizeAllocation(ventures, total_budget) {
    // Categorize ventures by synergy level
    const high_synergy = ventures.filter(v => v.synergy_with_others >= 70);
    const medium_synergy = ventures.filter(v => v.synergy_with_others >= 40 && v.synergy_with_others < 70);
    const low_synergy = ventures.filter(v => v.synergy_with_others < 40);

    const allocation = {};

    // Strategic allocation
    const high_budget = total_budget * 0.60;
    const medium_budget = total_budget * 0.30;
    const low_budget = total_budget * 0.10;

    // Distribute within high-synergy cluster proportionally
    const high_total_synergy = high_synergy.reduce((sum, v) => sum + v.synergy_with_others, 0);
    for (const venture of high_synergy) {
      const proportion = high_total_synergy > 0 ? venture.synergy_with_others / high_total_synergy : 1 / high_synergy.length;
      allocation[venture.id] = high_budget * proportion;
    }

    // Distribute medium
    const medium_total_synergy = medium_synergy.reduce((sum, v) => sum + v.synergy_with_others, 0);
    for (const venture of medium_synergy) {
      const proportion = medium_total_synergy > 0 ? venture.synergy_with_others / medium_total_synergy : 1 / medium_synergy.length;
      allocation[venture.id] = (allocation[venture.id] || 0) + (medium_budget * proportion);
    }

    // Distribute low
    const low_total_synergy = low_synergy.reduce((sum, v) => sum + v.synergy_with_others, 0);
    for (const venture of low_synergy) {
      const proportion = low_total_synergy > 0 ? venture.synergy_with_others / low_total_synergy : 1 / low_synergy.length;
      allocation[venture.id] = (allocation[venture.id] || 0) + (low_budget * proportion);
    }

    // Calculate expected returns
    const expected_return = this.calculatePortfolioReturn(ventures, allocation);

    const optimization = {
      timestamp: new Date().toISOString(),
      total_budget: total_budget,
      allocation: allocation,
      high_synergy_clusters: high_synergy.map(v => v.id),
      medium_synergy_ventures: medium_synergy.map(v => v.id),
      low_synergy_ventures: low_synergy.map(v => v.id),
      expected_portfolio_return: expected_return,
      strategy: `60% to high-synergy (${high_synergy.length} ventures), 30% to medium (${medium_synergy.length}), 10% to low (${low_synergy.length})`
    };

    this.optimizations.push(optimization);
    return optimization;
  }

  /**
   * Calculate expected portfolio returns
   */
  calculatePortfolioReturn(ventures, allocation) {
    let total_return = 0;

    for (const venture of ventures) {
      const allocated = allocation[venture.id] || 0;
      
      // Return multiplier based on synergy
      let multiplier = 1;
      if (venture.synergy_with_others >= 70) multiplier = 3.5;  // High synergy = 3.5x
      else if (venture.synergy_with_others >= 40) multiplier = 2.0;  // Medium = 2x
      else multiplier = 1.2;  // Low = 1.2x

      const venture_return = allocated * multiplier;
      total_return += venture_return;
    }

    return total_return;
  }

  /**
   * Predict impact of resource changes
   * Simple: moving resources from low-synergy to high-synergy always improves
   */
  predictImpact(current_allocation, proposed_changes) {
    // Apply changes
    const simulated = { ...current_allocation };
    let total_moved_from_low = 0;
    let total_moved_to_high = 0;

    for (const [venture_id, delta] of Object.entries(proposed_changes)) {
      simulated[venture_id] = (simulated[venture_id] || 0) + delta;
      
      // Track if moving FROM low-synergy TO high-synergy (both positive)
      if (delta > 0) total_moved_to_high += delta;
    }

    // Simplified return calculation
    // More resources = more return (basic)
    const current_return = Object.values(current_allocation).reduce((a, b) => a + b, 0);
    const simulated_return = Object.values(simulated).reduce((a, b) => a + b, 0);
    
    // Bonus for moving to high-synergy
    const synergy_bonus = total_moved_to_high * 0.5;

    return {
      current_return: current_return,
      projected_return: simulated_return + synergy_bonus,
      improvement: (simulated_return + synergy_bonus) - current_return,
      improvement_percent: (((synergy_bonus) / current_return) * 100).toFixed(1) + '%'
    };
  }

  /**
   * Get optimization recommendations
   */
  getRecommendations(ventures) {
    const recommendations = [];

    // Identify under-resourced high-synergy ventures
    const underresourced = ventures.filter(v =>
      v.synergy_with_others >= 70 && v.current_resources < (v.potential * 0.6)
    );

    if (underresourced.length > 0) {
      recommendations.push({
        type: 'INCREASE_RESOURCES',
        ventures: underresourced.map(v => v.id),
        reason: 'High-synergy ventures are under-resourced',
        impact: 'Could improve portfolio return by 40-60%'
      });
    }

    // Identify over-resourced low-synergy ventures
    const overresourced = ventures.filter(v =>
      v.synergy_with_others < 40 && v.current_resources > (v.potential * 0.4)
    );

    if (overresourced.length > 0) {
      recommendations.push({
        type: 'REDUCE_RESOURCES',
        ventures: overresourced.map(v => v.id),
        reason: 'Low-synergy ventures are consuming excess resources',
        impact: 'Free up 20-30% of budget for high-impact work'
      });
    }

    // Identify opportunities for synergy
    const potential_synergy = ventures.filter(v =>
      v.synergy_with_others >= 40 && v.synergy_with_others < 70
    );

    if (potential_synergy.length > 0) {
      recommendations.push({
        type: 'BUILD_SYNERGY',
        ventures: potential_synergy.map(v => v.id),
        reason: 'Medium-synergy ventures could be leveraged more',
        impact: 'Potential 2-3x return improvement through collaboration'
      });
    }

    return recommendations;
  }

  /**
   * Process interface
   */
  async process(input) {
    const { action, data } = input;

    try {
      switch (action) {
        case 'optimize_clusters':
          return {
            success: true,
            optimization: this.optimizeAllocation(data.ventures, data.total_budget)
          };

        case 'predict_impact':
          return {
            success: true,
            impact: this.predictImpact(data.current_allocation, data.proposed_changes)
          };

        case 'recommend_strategies':
          return {
            success: true,
            recommendations: this.getRecommendations(data.ventures)
          };

        default:
          return { success: false, error: 'Unknown action' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = SynergyOptimizer;
