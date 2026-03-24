/**
 * IP SYNTHESIS ENGINE v2.0
 * Cross-venture knowledge sharing and learning synthesis
 * 
 * When venture A discovers something, it automatically flows to ventures B, C, D
 * that can benefit from it. Creates compounding returns across portfolio.
 */

class IPSynthesisEngine {
  constructor() {
    this.discoveries = [];
    this.flows = [];  // IP flows between ventures
    this.venture_inventory = {};  // What each venture has learned
    this.impact_log = [];  // Track impact of each IP flow
  }

  /**
   * Register a new discovery from a venture
   */
  registerDiscovery(discovery) {
    const discovery_id = `DISC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const full_discovery = {
      id: discovery_id,
      source_venture: discovery.source_venture,
      type: discovery.type,
      title: discovery.title,
      description: discovery.description,
      applicable_domains: discovery.applicable_domains || [],
      impact_multiplier: discovery.impact_multiplier || 1,
      created_at: new Date().toISOString(),
      times_shared: 0,
      total_impact: 0
    };

    this.discoveries.push(full_discovery);
    console.log(`[IPSynthesis] Discovery registered: ${discovery.title} from ${discovery.source_venture}`);

    // Auto-synthesize to applicable ventures
    const synthesis_result = this.synthesizeToVentures(full_discovery);

    return {
      success: true,
      discovery_id: discovery_id,
      shared_with: synthesis_result.shared_with,
      potential_impact: synthesis_result.potential_impact
    };
  }

  /**
   * Find ventures that can benefit from a discovery
   */
  findApplicableVentures(discovery) {
    if (!this.venture_inventory[discovery.source_venture]) {
      this.venture_inventory[discovery.source_venture] = [];
    }

    const applicable = [];

    // For each applicable domain, ventures working in that domain can benefit
    for (const domain of discovery.applicable_domains) {
      for (const [venture_id, inventory] of Object.entries(this.venture_inventory)) {
        if (venture_id === discovery.source_venture) continue;  // Don't share with self

        // Check if venture has projects in this domain
        if (inventory.some(item => item.domain === domain)) {
          applicable.push(venture_id);
        }
      }
    }

    return [...new Set(applicable)];  // Remove duplicates
  }

  /**
   * Synthesize learning to applicable ventures
   */
  synthesizeToVentures(discovery) {
    const applicable_ventures = this.findApplicableVentures(discovery);
    const shared_with = [];

    for (const venture_id of applicable_ventures) {
      // Register the flow
      const flow = {
        from: discovery.source_venture,
        to: venture_id,
        discovery_id: discovery.id,
        discovery_type: discovery.type,
        discovery_title: discovery.title,
        shared_at: new Date().toISOString(),
        expected_impact: discovery.impact_multiplier
      };

      this.flows.push(flow);
      shared_with.push(venture_id);

      // Add to target venture's inventory
      if (!this.venture_inventory[venture_id]) {
        this.venture_inventory[venture_id] = [];
      }
      this.venture_inventory[venture_id].push({
        id: discovery.id,
        type: discovery.type,
        title: discovery.title,
        source: discovery.source_venture,
        received_at: new Date().toISOString()
      });

      console.log(`  → Shared with ${venture_id} (${discovery.type})`);
    }

    // Update discovery share count
    discovery.times_shared = shared_with.length;

    return {
      shared_with: shared_with,
      potential_impact: shared_with.length * discovery.impact_multiplier
    };
  }

  /**
   * Get IP flow map (visualization data)
   */
  getFlowMap() {
    const ventures = Object.keys(this.venture_inventory);
    const nodes = ventures.map(v => ({
      id: v,
      name: v.toUpperCase(),
      inventory_size: this.venture_inventory[v].length
    }));

    const edges = this.flows.map(flow => ({
      source: flow.from,
      target: flow.to,
      type: flow.discovery_type,
      title: flow.discovery_title,
      impact: flow.expected_impact
    }));

    return {
      nodes: nodes,
      edges: edges,
      total_flows: this.flows.length,
      total_discoveries: this.discoveries.length
    };
  }

  /**
   * Get synthesis impact report
   */
  getImpactReport() {
    // Calculate venture-level impact
    const venture_impact = {};
    for (const [venture_id, inventory] of Object.entries(this.venture_inventory)) {
      venture_impact[venture_id] = {
        discoveries_created: this.discoveries.filter(d => d.source_venture === venture_id).length,
        discoveries_received: inventory.length,
        total_ip_assets: inventory.length,
        impact_score: inventory.length * 1.5  // Each IP asset = 1.5 impact points
      };
    }

    // Calculate portfolio-wide impact
    const total_discoveries = this.discoveries.length;
    const total_flows = this.flows.length;
    const avg_shares_per_discovery = total_discoveries > 0
      ? total_flows / total_discoveries
      : 0;

    const impact_multiplier = 1 + (avg_shares_per_discovery * 0.2);  // Compounding effect

    return {
      timestamp: new Date().toISOString(),
      total_discoveries: total_discoveries,
      total_ip_flows: total_flows,
      avg_shares_per_discovery: avg_shares_per_discovery.toFixed(2),
      venture_impact: venture_impact,
      portfolio_impact_multiplier: impact_multiplier.toFixed(2),
      synthesis_efficiency: ((total_flows / Math.max(total_discoveries, 1)) * 100).toFixed(1) + '%'
    };
  }

  /**
   * Register a venture's domain specialties
   */
  registerVentureCapabilities(venture_id, capabilities) {
    if (!this.venture_inventory[venture_id]) {
      this.venture_inventory[venture_id] = [];
    }

    for (const cap of capabilities) {
      this.venture_inventory[venture_id].push({
        id: `CAP-${Date.now()}`,
        type: 'capability',
        title: cap.title,
        domain: cap.domain,
        registered_at: new Date().toISOString()
      });
    }

    return { success: true, venture_id, capabilities_registered: capabilities.length };
  }

  /**
   * Get discoveries of a specific type
   */
  getDiscoveriesByType(type) {
    return this.discoveries.filter(d => d.type === type);
  }

  /**
   * Process interface
   */
  async process(input) {
    const { action, data } = input;

    try {
      switch (action) {
        case 'register_discovery':
          return this.registerDiscovery(data.discovery);

        case 'find_applicable_ventures':
          return {
            success: true,
            applicable_ventures: this.findApplicableVentures(data.discovery)
          };

        case 'synthesize_learning':
          return {
            success: true,
            flow_map: this.getFlowMap()
          };

        case 'get_flow_map':
          return {
            success: true,
            flow_map: this.getFlowMap()
          };

        case 'get_impact':
          return {
            success: true,
            impact_report: this.getImpactReport()
          };

        case 'register_capabilities':
          return this.registerVentureCapabilities(data.venture_id, data.capabilities);

        default:
          return { success: false, error: 'Unknown action' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = IPSynthesisEngine;
