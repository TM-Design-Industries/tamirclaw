/**
 * MVP TESTING FRAMEWORK v2.0
 * 2-week rapid venture viability testing
 * Day 14: GO or KILL (not "continue researching")
 */

class MVPTestingFramework {
  constructor() {
    this.sprints = [];
    this.current_sprint = null;
  }

  /**
   * Start a 2-week MVP sprint
   */
  startSprint(venture_idea) {
    const sprint_id = `SPRINT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    this.current_sprint = {
      id: sprint_id,
      venture_name: venture_idea.name,
      problem_statement: venture_idea.problem_statement,
      target_users: venture_idea.target_users,
      estimated_effort: venture_idea.estimated_effort,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      days: [],
      team_size: 5,
      metrics: {
        customer_interviews: 0,
        real_users_tested: 0,
        positive_feedback: 0,
        total_feedback: 0,
        mvp_completeness: 0
      },
      decision: null
    };

    this.sprints.push(this.current_sprint);

    console.log(`[MVPTesting] Sprint started: ${venture_idea.name} (14 days)`);
    console.log(`  Problem: ${venture_idea.problem_statement}`);
    console.log(`  Target: ${venture_idea.target_users}`);

    return {
      success: true,
      sprint_id: sprint_id,
      deadline: this.current_sprint.end_date
    };
  }

  /**
   * Record daily standup
   */
  dailyStandup(day_number, update) {
    if (!this.current_sprint) {
      return { success: false, error: 'No active sprint' };
    }

    const day_record = {
      day: day_number,
      timestamp: new Date().toISOString(),
      what_was_done: update.what_was_done,
      blockers: update.blockers || [],
      customer_feedback: update.customer_feedback,
      morale: update.morale,
      severity: this.assessSeverity(day_number, update)
    };

    this.current_sprint.days.push(day_record);

    // Update metrics
    if (update.customer_feedback) {
      this.current_sprint.metrics.total_feedback++;
      if (update.customer_feedback.includes('yes') || update.customer_feedback.includes('want')) {
        this.current_sprint.metrics.positive_feedback++;
      }
    }

    console.log(`[MVPTesting Day ${day_number}] ${update.what_was_done}`);
    if (update.blockers.length > 0) {
      console.log(`  ⚠️ Blockers: ${update.blockers.join(', ')}`);
    }
    console.log(`  Morale: ${update.morale}/10`);

    return { success: true, day_recorded: day_number };
  }

  /**
   * Assess severity of blockers
   */
  assessSeverity(day_number, update) {
    const blocker_count = update.blockers.length;
    const morale = update.morale;

    if (morale < 3 || blocker_count > 3) return 'critical';
    if (morale < 5 || blocker_count > 1) return 'high';
    return 'low';
  }

  /**
   * Make GO/KILL decision at day 14
   */
  makeDecision() {
    if (!this.current_sprint) {
      return { success: false, error: 'No active sprint' };
    }

    const metrics = this.current_sprint.metrics;
    const feedback_rate = metrics.total_feedback > 0
      ? metrics.positive_feedback / metrics.total_feedback
      : 0;

    // Scoring (0-100)
    let score = 0;

    // 1. Can we build an MVP? (technical feasibility)
    const days_with_progress = this.current_sprint.days.filter(d =>
      d.what_was_done && d.what_was_done.length > 5
    ).length;
    const build_score = (days_with_progress / 14) * 40;  // 0-40 points
    score += build_score;

    // 2. Do real users want it? (feedback rate)
    const feedback_score = feedback_rate * 30;  // 0-30 points
    score += feedback_score;

    // 3. Can 5 people execute it long-term? (team viability)
    const avg_morale = this.current_sprint.days.reduce((sum, d) => sum + d.morale, 0) /
      Math.max(this.current_sprint.days.length, 1);
    const morale_score = (avg_morale / 10) * 20;  // 0-20 points
    score += morale_score;

    // 4. Can we ship it? (no critical blockers)
    const critical_days = this.current_sprint.days.filter(d => d.severity === 'critical').length;
    const blocker_score = Math.max(0, 10 - critical_days * 5);  // 0-10 points
    score += blocker_score;

    // Decision threshold
    const decision = score >= 60 ? 'GO' : 'KILL';
    const confidence = score / 100;

    // Detailed rationale
    const reasons = [];
    if (build_score > 20) reasons.push('✅ MVP buildable');
    else reasons.push('❌ MVP not buildable');

    if (feedback_rate > 0.6) reasons.push('✅ Strong customer interest');
    else if (feedback_rate > 0.4) reasons.push('⚠️ Mixed customer interest');
    else reasons.push('❌ Weak customer interest');

    if (avg_morale >= 7) reasons.push('✅ Team confident');
    else if (avg_morale >= 5) reasons.push('⚠️ Team uncertain');
    else reasons.push('❌ Team demoralized');

    if (critical_days === 0) reasons.push('✅ No blocking issues');
    else reasons.push(`❌ ${critical_days} critical blocker days`);

    const verdict = {
      sprint_id: this.current_sprint.id,
      venture_name: this.current_sprint.venture_name,
      go_or_kill: decision,
      confidence: confidence.toFixed(2),
      score: score.toFixed(0),
      rationale: reasons.join(' | '),
      detailed_metrics: {
        build_feasibility: build_score.toFixed(1),
        customer_interest: feedback_score.toFixed(1),
        team_capability: morale_score.toFixed(1),
        blocker_free: blocker_score.toFixed(1)
      },
      decision_date: new Date().toISOString()
    };

    this.current_sprint.decision = verdict;
    return verdict;
  }

  /**
   * Get sprint status
   */
  getSprintStatus() {
    if (!this.current_sprint) {
      return { success: false, error: 'No active sprint' };
    }

    const days_completed = this.current_sprint.days.length;
    const remaining_days = 14 - days_completed;

    return {
      success: true,
      sprint_id: this.current_sprint.id,
      venture_name: this.current_sprint.venture_name,
      progress: `Day ${days_completed}/14`,
      remaining_days: remaining_days,
      metrics: this.current_sprint.metrics,
      days_summary: this.current_sprint.days.map(d => ({
        day: d.day,
        progress: d.what_was_done.substring(0, 50) + '...',
        severity: d.severity
      }))
    };
  }

  /**
   * Process interface
   */
  async process(input) {
    const { action, data } = input;

    try {
      switch (action) {
        case 'start_sprint':
          return this.startSprint(data.venture_idea);

        case 'daily_standup':
          return this.dailyStandup(data.sprint_day, data.progress_update);

        case 'get_status':
          return this.getSprintStatus();

        case 'make_decision':
          return {
            success: true,
            decision: this.makeDecision()
          };

        default:
          return { success: false, error: 'Unknown action' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = MVPTestingFramework;
