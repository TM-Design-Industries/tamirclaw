/**
 * QUALITY GATES AGENT
 * 
 * 8-Dimension Scoring Framework
 * Never ship below 7/10
 * 5 validation gates
 */

class QualityGatesAgent {
  constructor() {
    this.name = 'Quality Gates Agent';
    this.reviews = new Map();
    
    // 8 dimensions
    this.dimensions = {
      'desirability': {weight: 0.15, description: 'Do customers want this?'},
      'functionality': {weight: 0.15, description: 'Does it work as specified?'},
      'manufacturability': {weight: 0.15, description: 'Can we build it economically?'},
      'credibility': {weight: 0.15, description: 'Would engineers respect this?'},
      'viability': {weight: 0.15, description: 'Can we make money on it?'},
      'differentiation': {weight: 0.10, description: 'Why is it better than competitors?'},
      'aesthetics': {weight: 0.10, description: 'Is it beautiful?'},
      'performance': {weight: 0.05, description: 'Does it deliver on promises?'}
    };
  }

  /**
   * SCORE PROJECT
   * 8-dimension evaluation
   */
  async scoreProject(input) {
    try {
      const {project_id, scores} = input;
      if (!project_id || !scores) return {success: false, error: 'Missing fields'};

      // Validate all 8 dimensions provided
      const required_dims = Object.keys(this.dimensions);
      for (const dim of required_dims) {
        if (scores[dim] === undefined) {
          return {success: false, error: `Missing score for ${dim}`};
        }
      }

      // Calculate weighted average
      let total_score = 0;
      const dimension_scores = {};

      for (const dim of required_dims) {
        const score = Math.min(10, Math.max(0, scores[dim]));
        dimension_scores[dim] = score;
        total_score += score * this.dimensions[dim].weight;
      }

      const review = {
        project_id,
        dimension_scores,
        weighted_score: parseFloat(total_score.toFixed(1)),
        status: total_score >= 7 ? 'PASS' : 'FAIL',
        created_at: new Date().toISOString()
      };

      this.reviews.set(project_id, review);

      console.log(`[QualityGates] Project ${project_id}: ${review.weighted_score}/10 (${review.status})`);

      return {
        success: true,
        project_id: project_id,
        weighted_score: review.weighted_score,
        status: review.status,
        dimension_scores: dimension_scores,
        next_action: review.status === 'PASS' ? 'Proceed to next gate' : 'Iterate and resubmit'
      };
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  /**
   * VALIDATION GATE
   * 5 gates in sequence
   */
  async validateGate(input) {
    try {
      const {project_id, gate_number, checklist} = input;
      if (!project_id || !gate_number) return {success: false, error: 'Missing fields'};

      const gates = {
        1: 'Concept Review (Tamir approval)',
        2: 'Design Validation (QA + Specialists)',
        3: 'Engineering Sign-Off (Execution experts)',
        4: 'Business Review (Finance + Strategy)',
        5: 'Final Approval (Tamir + Quality check)'
      };

      const gate_name = gates[gate_number];

      // Simple checklist validation
      const items = checklist || [];
      const passed_items = items.filter(i => i.passed).length;
      const pass_rate = items.length > 0 ? (passed_items / items.length) : 1.0;

      const gate_status = pass_rate >= 0.9 ? 'PASS' : 'FAIL';

      return {
        success: true,
        project_id: project_id,
        gate: gate_number,
        gate_name: gate_name,
        pass_rate: (pass_rate * 100).toFixed(0) + '%',
        status: gate_status,
        items_passed: passed_items,
        items_total: items.length,
        next_gate: gate_status === 'PASS' ? `Gate ${gate_number + 1}` : `Iterate Gate ${gate_number}`
      };
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  /**
   * GET REPORT
   */
  async getReport(input) {
    try {
      const {project_id} = input;
      if (!project_id) return {success: false, error: 'Missing project_id'};

      const review = this.reviews.get(project_id);
      if (!review) return {success: false, error: 'Project not reviewed yet'};

      return {
        success: true,
        project_id: project_id,
        overall_score: review.weighted_score,
        status: review.status,
        dimensions: review.dimension_scores,
        recommendation: review.status === 'PASS' 
          ? 'Ready for next phase' 
          : 'Requires iteration before proceeding'
      };
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  /**
   * MAIN ROUTER
   */
  async process(input) {
    const {action, data} = input;

    switch(action) {
      case 'score_project':
        return await this.scoreProject(data);
      case 'validate_gate':
        return await this.validateGate(data);
      case 'get_report':
        return await this.getReport(data);
      default:
        return {success: false, error: `Unknown action: ${action}`};
    }
  }
}

module.exports = QualityGatesAgent;
