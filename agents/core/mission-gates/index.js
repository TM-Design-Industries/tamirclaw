/**
 * MISSION GATES v2.0
 * Quality gates aligned with Tamir's mission: nature, humanity, conscience, excellence
 * 
 * Scoring:
 * - Technical dimensions (8): 0-10 each (threshold: ≥7/10)
 * - Mission dimensions (4): 0-10 each (threshold: ≥9/10 for mission-critical)
 */

class MissionGates {
  constructor() {
    this.decisions = [];
    this.mission_critical_ventures = [
      'nday', 'any1', 'air', 'tetra', 'betterride'
    ];
  }

  /**
   * Score a project against mission and technical dimensions
   */
  scoreProject(input) {
    const { project, scores } = input;

    // Technical dimensions (existing)
    const technical_dims = [
      'desirability', 'functionality', 'manufacturability', 'credibility',
      'viability', 'differentiation', 'aesthetics', 'performance'
    ];

    // Mission dimensions (new)
    const mission_dims = [
      'helps_nature', 'helps_humanity', 'conscience_approval', 'venture_synergy'
    ];

    // Calculate technical score
    const tech_scores = technical_dims.map(dim => scores[dim] || 5);
    const technical_avg = tech_scores.reduce((a, b) => a + b, 0) / tech_scores.length;

    // Calculate mission score
    const mission_scores = mission_dims.map(dim => scores[dim] || 5);
    const mission_avg = mission_scores.reduce((a, b) => a + b, 0) / mission_scores.length;

    // Overall weighted score
    // Technical: 50%, Mission: 50%
    const overall_score = (technical_avg * 0.5) + (mission_avg * 0.5);

    // Determine if mission-critical
    const is_mission_critical = this.mission_critical_ventures.includes(project.venture_id);

    // Build verdict
    const verdict = this.buildVerdict(
      project,
      technical_avg,
      mission_avg,
      overall_score,
      scores,
      is_mission_critical
    );

    // Log decision
    this.decisions.push({
      project_id: project.id,
      timestamp: new Date().toISOString(),
      venture_id: project.venture_id,
      technical_score: technical_avg,
      mission_score: mission_avg,
      overall_score: overall_score,
      status: verdict.status,
      verdict: verdict.verdict
    });

    return verdict;
  }

  /**
   * Build detailed verdict based on scores
   */
  buildVerdict(project, tech_avg, mission_avg, overall_score, scores, is_mission_critical) {
    const reasons = [];

    // Check technical thresholds
    if (tech_avg < 7) {
      reasons.push(`❌ Technical score too low: ${tech_avg.toFixed(1)}/10 (need ≥7)`);
    } else {
      reasons.push(`✅ Technical score good: ${tech_avg.toFixed(1)}/10`);
    }

    // Check mission thresholds
    const mission_threshold = is_mission_critical ? 8.2 : 7;
    if (mission_avg < mission_threshold) {
      reasons.push(
        `❌ Mission score too low: ${mission_avg.toFixed(1)}/10 (need ≥${mission_threshold})`
      );
    } else {
      reasons.push(`✅ Mission score good: ${mission_avg.toFixed(1)}/10`);
    }

    // Detailed mission dimension checks
    const mission_checks = [
      { key: 'helps_nature', label: 'Nature flourishing', min: is_mission_critical ? 7 : 5 },
      { key: 'helps_humanity', label: 'Humanity help', min: is_mission_critical ? 8 : 6 },
      { key: 'conscience_approval', label: 'Conscience check', min: is_mission_critical ? 8 : 6 },
      { key: 'venture_synergy', label: 'Venture synergy', min: is_mission_critical ? 7 : 5 }
    ];

    for (const check of mission_checks) {
      const score = scores[check.key] || 0;
      if (score < check.min) {
        reasons.push(
          `⚠️  ${check.label} low: ${score}/10 (need ≥${check.min})`
        );
      } else {
        reasons.push(
          `✅ ${check.label} good: ${score}/10`
        );
      }
    }

    // Determine status
    let status = 'PASS';
    if (tech_avg < 7) status = 'FAIL';
    else if (mission_avg < mission_threshold) status = 'FAIL';
    else if (is_mission_critical && scores.helps_humanity < 8) status = 'FAIL';  // High bar for humanity
    else if (is_mission_critical && scores.conscience_approval < 8) status = 'FAIL';

    // Build verdict
    const verdict_text =
      status === 'PASS'
        ? `✅ PROJECT APPROVED: ${project.name}`
        : `❌ PROJECT REJECTED: ${project.name}`;

    return {
      status: status,
      project_id: project.id,
      project_name: project.name,
      venture_id: project.venture_id,
      is_mission_critical: is_mission_critical,
      technical_score: tech_avg,
      mission_score: mission_avg,
      overall_score: overall_score,
      mission_verdict: verdict_text,
      reasons: reasons,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Check if work meets excellence threshold (anti-mediocrity)
   */
  checkExcellence(project, overall_score, is_mission_critical) {
    const excellence_threshold = is_mission_critical ? 9.5 : 9;

    if (overall_score < excellence_threshold) {
      return {
        meets_excellence: false,
        threshold: excellence_threshold,
        current: overall_score,
        message: `Work rejected: ${overall_score.toFixed(1)}/10 is not world-class. Need ${excellence_threshold}/10 minimum.`
      };
    }

    return {
      meets_excellence: true,
      threshold: excellence_threshold,
      current: overall_score,
      message: `✅ Work meets excellence standard: ${overall_score.toFixed(1)}/10`
    };
  }

  /**
   * Get decision history
   */
  getDecisionHistory() {
    return this.decisions;
  }

  /**
   * Get portfolio health (how many passed vs rejected)
   */
  getPortfolioHealth() {
    const total = this.decisions.length;
    const passed = this.decisions.filter(d => d.status === 'PASS').length;
    const rejected = this.decisions.filter(d => d.status === 'FAIL').length;

    const avg_technical = this.decisions.reduce((sum, d) => sum + d.technical_score, 0) / Math.max(total, 1);
    const avg_mission = this.decisions.reduce((sum, d) => sum + d.mission_score, 0) / Math.max(total, 1);
    const avg_overall = this.decisions.reduce((sum, d) => sum + d.overall_score, 0) / Math.max(total, 1);

    return {
      total_decisions: total,
      passed: passed,
      rejected: rejected,
      pass_rate: ((passed / Math.max(total, 1)) * 100).toFixed(1) + '%',
      avg_technical_score: avg_technical.toFixed(1),
      avg_mission_score: avg_mission.toFixed(1),
      avg_overall_score: avg_overall.toFixed(1),
      health: avg_overall > 8 ? 'excellent' : avg_overall > 7 ? 'good' : 'needs_improvement'
    };
  }

  /**
   * Process interface
   */
  async process(input) {
    try {
      const verdict = this.scoreProject(input);
      return {
        success: true,
        verdict: verdict
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = MissionGates;
