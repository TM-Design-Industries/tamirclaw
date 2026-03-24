/**
 * EXCELLENCE ENFORCEMENT v2.0
 * Anti-mediocrity governor - no compromises on quality
 * 
 * Thresholds:
 * - Mission-critical ventures (eVTOL, health, access): 9.5/10 minimum
 * - Standard ventures (design, optimization): 9.0/10 minimum
 * - Infrastructure (internal tools): 7.0/10 minimum
 */

class ExcellenceEnforcer {
  constructor() {
    this.thresholds = {
      mission_critical: 9.5,
      standard: 9.0,
      infrastructure: 7.0
    };

    this.decisions = [];
    this.appeals = [];
    this.rejected_work = [];
  }

  /**
   * Evaluate work against excellence thresholds
   */
  evaluateWork(submission) {
    const threshold = this.thresholds[submission.type] || 7.0;
    const score = submission.quality_score;

    let status = 'APPROVED';
    const reasons = [];
    const required_actions = [];

    // Check against threshold
    if (score >= threshold) {
      status = 'APPROVED';
      reasons.push(`✅ Exceeds ${submission.type} threshold of ${threshold}/10`);
      reasons.push(`✅ Score: ${score}/10 (${(score - threshold).toFixed(1)} above minimum)`);
    } else if (score >= threshold - 0.5) {
      status = 'NEEDS_REVISION';
      reasons.push(`⚠️  Close to threshold (${score.toFixed(1)} vs ${threshold})`);
      reasons.push('Request minor revision for final polish');
      required_actions.push('Iterate on identified weak points');
      required_actions.push('Resubmit for approval');
    } else {
      status = 'REJECTED';
      reasons.push(`❌ Below ${submission.type} threshold`);
      reasons.push(`❌ Score: ${score}/10 (need ${threshold}/10 minimum)`);
      reasons.push(`❌ Gap: ${(threshold - score).toFixed(1)} points below standard`);
      required_actions.push('Complete rework required');
      required_actions.push('Address fundamental quality issues');
      required_actions.push('Re-evaluate approach');
    }

    // Additional context for mission-critical work
    if (submission.type === 'mission_critical') {
      reasons.push(`🎯 Mission-critical: Lives/impact at stake - no compromises`);
    }

    const decision = {
      id: submission.id,
      venture_id: submission.venture_id,
      type: submission.type,
      status: status,
      threshold_required: threshold,
      score_received: score,
      gap: score - threshold,
      reasons: reasons,
      required_actions: required_actions,
      evaluated_at: new Date().toISOString(),
      appeal_count: 0,
      can_appeal: status === 'REJECTED'
    };

    this.decisions.push(decision);

    if (status === 'REJECTED') {
      this.rejected_work.push(decision);
    }

    return decision;
  }

  /**
   * Appeal a rejection (only allowed for legitimate reasons)
   */
  appealDecision(work_id, appeal_reasoning) {
    const original = this.decisions.find(d => d.id === work_id);

    if (!original || original.status !== 'REJECTED') {
      return { success: false, error: 'Cannot appeal approved work' };
    }

    // Validate appeal reasoning
    const valid_reasons = [
      'Different evaluation criteria should apply',
      'New evidence of higher quality',
      'Threshold should be adjusted for this venture',
      'Circumstances have changed'
    ];

    const has_valid_reason = valid_reasons.some(r => appeal_reasoning.includes(r));

    const appeal = {
      work_id: work_id,
      appeal_reasoning: appeal_reasoning,
      has_valid_reason: has_valid_reason,
      submitted_at: new Date().toISOString(),
      status: has_valid_reason ? 'PENDING_REVIEW' : 'INSUFFICIENT_REASONING'
    };

    this.appeals.push(appeal);
    original.appeal_count++;

    return {
      success: has_valid_reason,
      appeal_id: `APPEAL-${work_id}-${this.appeals.length}`,
      status: appeal.status,
      message: has_valid_reason
        ? 'Appeal submitted for review'
        : 'Appeal reasoning insufficient - no second chances on mediocrity'
    };
  }

  /**
   * Get quality statistics
   */
  getQualityStats() {
    const total = this.decisions.length;
    const approved = this.decisions.filter(d => d.status === 'APPROVED').length;
    const rejected = this.decisions.filter(d => d.status === 'REJECTED').length;
    const revised = this.decisions.filter(d => d.status === 'NEEDS_REVISION').length;

    // Category breakdown
    const by_type = {};
    for (const type of ['mission_critical', 'standard', 'infrastructure']) {
      const of_type = this.decisions.filter(d => d.type === type);
      by_type[type] = {
        total: of_type.length,
        approved: of_type.filter(d => d.status === 'APPROVED').length,
        approval_rate: of_type.length > 0
          ? ((of_type.filter(d => d.status === 'APPROVED').length / of_type.length) * 100).toFixed(0) + '%'
          : '0%'
      };
    }

    const avg_gap = this.rejected_work.length > 0
      ? this.rejected_work.reduce((sum, d) => sum + Math.abs(d.gap), 0) / this.rejected_work.length
      : 0;

    return {
      total_submissions: total,
      approved: approved,
      rejected: rejected,
      needs_revision: revised,
      approval_rate: total > 0 ? ((approved / total) * 100).toFixed(1) + '%' : '0%',
      rejection_rate: total > 0 ? ((rejected / total) * 100).toFixed(1) + '%' : '0%',
      by_category: by_type,
      avg_gap_when_rejected: avg_gap.toFixed(2),
      enforcement_level: this.getEnforcementLevel(approved, rejected, total)
    };
  }

  /**
   * Determine enforcement rigor level
   */
  getEnforcementLevel(approved, rejected, total) {
    if (total === 0) return 'no_data';
    const approval_rate = (approved / total) * 100;
    if (approval_rate > 80) return 'lenient';
    if (approval_rate > 60) return 'moderate';
    if (approval_rate > 40) return 'strict';
    return 'ruthless';
  }

  /**
   * Process interface
   */
  async process(input) {
    const { action, data } = input;

    try {
      switch (action) {
        case 'evaluate_work':
          return {
            success: true,
            decision: this.evaluateWork(data.submission)
          };

        case 'appeal_decision':
          return this.appealDecision(data.work_id, data.appeal_reasoning);

        case 'get_stats':
          return {
            success: true,
            stats: this.getQualityStats()
          };

        default:
          return { success: false, error: 'Unknown action' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = ExcellenceEnforcer;
