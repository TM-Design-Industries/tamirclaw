/**
 * MARINE SPECIALIST AGENT
 */

class MarineSpecialist {
  constructor(geminiApiKey) {
    this.name = 'Marine Specialist';
    this.domain = 'marine';
    this.geminiApiKey = geminiApiKey;

    this.regulations = {
      'imo': {certifications: ['SOLAS', 'MARPOL'], standard: 'IMO', timeline: '18-24 months'},
      'dnv': {certifications: ['DNV GL', 'Class Society'], standard: 'DNV', timeline: '12-18 months'},
      'imo_2030': {certifications: ['EEDI', 'CII'], standard: 'IMO 2030 Efficiency', timeline: '24-36 months'}
    };

    this.vendors = {
      'propulsion': ['MAN', 'Wärtsilä', 'Rolls-Royce', 'Damen'],
      'hull': ['Meyer Werft', 'Fincantieri', 'STX France', 'China State Shipbuilding'],
      'systems': ['Kongsberg', 'Wartsila', 'Furuno', 'Navico'],
      'composites': ['Hexcel', 'Sika', 'Toray', 'Scott Bader']
    };

    this.markets = {
      'cargo': {segment: 'Cargo Ships', margin: 0.20, competitors: ['Maersk', 'MSC', 'CMA CGM']},
      'offshore': {segment: 'Offshore Support', margin: 0.35, competitors: ['Seacor', 'Gulf Mark', 'Maersk Supply']},
      'specialty': {segment: 'Specialized Vessels', margin: 0.40, competitors: ['Various Specialist Builders']}
    };
  }

  async analyzeProject(input) {
    try {
      const {brief, timeline, budget, target_market} = input;
      if (!brief || !target_market) return {success: false, error: 'Missing fields'};

      const market = this.markets[target_market?.toLowerCase()] || this.markets['cargo'];

      return {
        success: true,
        analysis: {
          domain: 'marine',
          target_market: target_market,
          market_segment: market.segment,
          margin: (market.margin * 100) + '%',
          competitors: market.competitors,
          feasibility: 'HIGH',
          complexity: brief.includes('autonomous') ? 'complex' : 'moderate',
          timeline_estimate: timeline || 24,
          key_considerations: [
            'Corrosion resistance critical',
            'Hydrodynamic optimization',
            'IMO environmental compliance',
            'Ballast water management',
            'Crew safety systems',
            'Maritime regulations'
          ]
        },
        feasibility: 'HIGH',
        next_step: 'Regulatory assessment'
      };
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async regulatoryCheck(input) {
    try {
      const {region} = input;
      if (!region) return {success: false, error: 'Missing region'};

      const regs = this.regulations[region?.toLowerCase()] || this.regulations['imo'];

      return {
        success: true,
        region: region,
        certifications: regs.certifications,
        standard: regs.standard,
        timeline: regs.timeline,
        testing_required: [
          'Hull strength analysis',
          'Stability and trim',
          'Hydrodynamic testing',
          'Environmental compliance',
          'Safety drills and training',
          'Ballast system certification'
        ],
        critical_path: [
          '1. Design approval',
          '2. Class society review',
          '3. ABS/DNV certification plan',
          '4. Construction phase (18-24 months)',
          '5. Sea trials (1-2 months)',
          '6. Final certification'
        ]
      };
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async vendorRecommendation(input) {
    try {
      const {component_type} = input;
      if (!component_type) return {success: false, error: 'Missing component_type'};

      const vendors = this.vendors[component_type.toLowerCase()] || ['TBD'];

      return {
        success: true,
        component_type: component_type,
        recommended_vendors: vendors,
        maritime_certified: true,
        lead_time: '16-32 weeks',
        quality_level: 'Marine Grade / Class Society Approved',
        notes: 'All components must be certified for marine environment. Salt spray resistance required.'
      };
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async process(input) {
    const {action, data} = input;
    switch(action) {
      case 'analyze_project': return await this.analyzeProject(data);
      case 'regulatory_check': return await this.regulatoryCheck(data);
      case 'vendor_recommendation': return await this.vendorRecommendation(data);
      default: return {success: false, error: `Unknown action: ${action}`};
    }
  }
}

module.exports = MarineSpecialist;
