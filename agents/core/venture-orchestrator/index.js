/**
 * VENTURE ORCHESTRATOR v2.0
 * Portfolio-level venture coordination
 * Manages synergy between 10-12 ventures
 */

class VentureOrchestrator {
  constructor() {
    this.ventures = {};
    this.synergies = {};
    this.portfolio_state = {
      total_ventures: 0,
      synergy_clusters: [],
      resource_allocation: {},
      overall_synergy: 0
    };
  }

  /**
   * Register a venture into the portfolio
   */
  registerVenture(venture) {
    this.ventures[venture.id] = {
      id: venture.id,
      name: venture.name,
      mission: venture.mission,
      projects: venture.projects || [],
      synergy_score: 0,
      resources_allocated: 0,
      ip_contributions: [],
      ip_consumed: []
    };
    this.portfolio_state.total_ventures++;
    console.log(`[VentureOrchestrator] Registered venture: ${venture.name}`);
    return { success: true, venture_id: venture.id };
  }

  /**
   * Calculate synergy between two ventures
   * Scoring: 0-100
   * - Shared IP? (0-30 points)
   * - Mission overlap? (0-30 points)
   * - Complementary tech? (0-20 points)
   * - Strategic alignment? (0-20 points)
   */
  calculateSynergy(venture_a_id, venture_b_id) {
    const v_a = this.ventures[venture_a_id];
    const v_b = this.ventures[venture_b_id];

    if (!v_a || !v_b) return 0;

    let score = 0;

    // 1. Shared IP contributions (already flowing?)
    const shared_ip = v_a.ip_contributions.filter(ip =>
      v_b.ip_consumed.includes(ip.id)
    ).length;
    score += Math.min(shared_ip * 15, 30);

    // 2. Mission overlap (key words that repeat)
    const mission_keywords_a = v_a.mission.toLowerCase().split(/\s+/);
    const mission_keywords_b = v_b.mission.toLowerCase().split(/\s+/);
    const overlap = mission_keywords_a.filter(k =>
      mission_keywords_b.includes(k) && k.length > 3
    ).length;
    // Higher weight for strong mission alignment
    if (overlap >= 2) score += 30;
    else if (overlap === 1) score += 15;

    // 3. Complementary tech domains (help each other)
    const domains_a = new Set(v_a.projects.map(p => p.domain || ''));
    const domains_b = new Set(v_b.projects.map(p => p.domain || ''));
    // Bonus for different but related domains
    const complementary = [...domains_a].filter(d => !domains_b.has(d)).length;
    score += Math.min(complementary * 5, 20);

    // 4. Strategic alignment (both care about humanity/sustainability/impact)
    const impact_keywords = ['health', 'humanity', 'sustainability', 'efficiency', 'wellness', 'access', 'equity'];
    const impact_a = mission_keywords_a.filter(k => impact_keywords.includes(k)).length;
    const impact_b = mission_keywords_b.filter(k => impact_keywords.includes(k)).length;
    if (impact_a > 0 && impact_b > 0) score += 20;

    return Math.min(score, 100);
  }

  /**
   * Detect high-synergy clusters in portfolio
   * Returns groups of ventures that amplify each other
   */
  detectSynergyClusters() {
    const venture_ids = Object.keys(this.ventures);
    const clusters = [];

    // Build synergy matrix
    const synergy_matrix = {};
    for (let i = 0; i < venture_ids.length; i++) {
      for (let j = i + 1; j < venture_ids.length; j++) {
        const id_pair = `${venture_ids[i]}-${venture_ids[j]}`;
        synergy_matrix[id_pair] = this.calculateSynergy(venture_ids[i], venture_ids[j]);
      }
    }

    // Identify high-synergy pairs (≥40)
    const high_synergy = Object.entries(synergy_matrix)
      .filter(([_, score]) => score >= 40)
      .map(([pair, score]) => ({ pair, score }));

    // Cluster high-synergy ventures
    if (high_synergy.length > 0) {
      const clustered = new Set();
      for (const { pair, score } of high_synergy) {
        const [v1, v2] = pair.split('-');
        if (!clustered.has(v1) && !clustered.has(v2)) {
          clusters.push({
            ventures: [v1, v2].map(id => this.ventures[id].name),
            synergy_score: score,
            potential_ip_flow: []
          });
          clustered.add(v1);
          clustered.add(v2);
        }
      }
    }

    this.portfolio_state.synergy_clusters = clusters;
    return clusters;
  }

  /**
   * Allocate resources based on synergy
   * High-synergy clusters get more resources
   */
  optimizeResourceAllocation(total_resources = 100) {
    const clusters = this.detectSynergyClusters();
    const allocation = {};

    // Calculate total synergy
    let total_synergy = 0;
    for (const cluster of clusters) {
      total_synergy += cluster.synergy_score;
    }

    if (total_synergy === 0) {
      // Equal allocation if no synergy
      const per_venture = total_resources / Object.keys(this.ventures).length;
      for (const venture_id of Object.keys(this.ventures)) {
        allocation[venture_id] = per_venture;
      }
    } else {
      // Allocate proportional to synergy
      const venture_synergy_score = {};
      for (const venture_id of Object.keys(this.ventures)) {
        venture_synergy_score[venture_id] = 0;
      }

      for (const cluster of clusters) {
        for (const venture_name of cluster.ventures) {
          const venture_id = Object.keys(this.ventures).find(
            id => this.ventures[id].name === venture_name
          );
          if (venture_id) {
            venture_synergy_score[venture_id] += cluster.synergy_score;
          }
        }
      }

      for (const [venture_id, score] of Object.entries(venture_synergy_score)) {
        allocation[venture_id] = (score / total_synergy) * total_resources * 0.8;
      }

      // Remaining 20% distributed equally
      const equal_share = (total_resources * 0.2) / Object.keys(this.ventures).length;
      for (const venture_id of Object.keys(this.ventures)) {
        allocation[venture_id] = (allocation[venture_id] || 0) + equal_share;
      }
    }

    this.portfolio_state.resource_allocation = allocation;
    return allocation;
  }

  /**
   * Register IP contribution from a venture
   */
  registerIPContribution(venture_id, ip_data) {
    const venture = this.ventures[venture_id];
    if (!venture) return { success: false, error: 'Venture not found' };

    const ip_id = `IP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const ip_entry = {
      id: ip_id,
      venture_id: venture_id,
      type: ip_data.type, // algorithm, process, material, design, etc.
      description: ip_data.description,
      applicable_domains: ip_data.applicable_domains || [],
      created_at: new Date().toISOString()
    };

    venture.ip_contributions.push(ip_entry);
    console.log(`[VentureOrchestrator] New IP contribution: ${ip_entry.description}`);

    // Auto-broadcast to applicable ventures
    this.broadcastIPToVentures(ip_entry);
    return { success: true, ip_id };
  }

  /**
   * Auto-share IP to ventures that can use it
   */
  broadcastIPToVentures(ip_entry) {
    for (const venture_id of Object.keys(this.ventures)) {
      if (venture_id === ip_entry.venture_id) continue;

      const venture = this.ventures[venture_id];
      const projects = venture.projects || [];

      // Check if any project in this venture matches applicable domains
      for (const project of projects) {
        if (ip_entry.applicable_domains.includes(project.domain)) {
          venture.ip_consumed.push(ip_entry.id);
          console.log(`[VentureOrchestrator] IP shared to ${venture.name}: ${ip_entry.description}`);
          break;
        }
      }
    }
  }

  /**
   * Get portfolio health snapshot
   */
  getPortfolioSnapshot() {
    const clusters = this.detectSynergyClusters();
    const allocation = this.optimizeResourceAllocation();

    // Calculate overall synergy
    let overall_synergy = 0;
    for (const cluster of clusters) {
      overall_synergy += cluster.synergy_score;
    }
    overall_synergy = overall_synergy / Math.max(clusters.length, 1);

    return {
      timestamp: new Date().toISOString(),
      total_ventures: Object.keys(this.ventures).length,
      synergy_clusters: clusters.length,
      average_cluster_synergy: overall_synergy.toFixed(1),
      resource_allocation: allocation,
      ip_flowing: Object.values(this.ventures).reduce(
        (sum, v) => sum + v.ip_consumed.length,
        0
      ),
      status: 'operational'
    };
  }

  /**
   * Process main orchestrator actions
   */
  async process(input) {
    const { action, data } = input;

    try {
      switch (action) {
        case 'register_venture':
          return this.registerVenture(data);

        case 'register_ip':
          return this.registerIPContribution(data.venture_id, data.ip_data);

        case 'detect_synergy':
          return {
            success: true,
            clusters: this.detectSynergyClusters()
          };

        case 'optimize_portfolio':
          return {
            success: true,
            allocation: this.optimizeResourceAllocation(data.total_resources || 100),
            snapshot: this.getPortfolioSnapshot()
          };

        case 'get_snapshot':
          return {
            success: true,
            snapshot: this.getPortfolioSnapshot()
          };

        default:
          return { success: false, error: 'Unknown action' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = VentureOrchestrator;
