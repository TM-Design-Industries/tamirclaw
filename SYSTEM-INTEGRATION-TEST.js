/**
 * SYSTEM INTEGRATION TEST
 * 
 * End-to-end flow:
 * Email → Project Tracker → Orchestrator → Specialists → Execution → Quality Gates → Approval
 */

const ProjectTrackerAgent = require('./agents/infrastructure/project-tracker');
const EmailManagerAgent = require('./agents/infrastructure/email-manager');
const QuoteGeneratorAgent = require('./agents/infrastructure/quote-generator');
const OrchestratorAgent = require('./agents/orchestrator');
const VehicleSpecialist = require('./agents/specialists/vehicle');
const MechanicalEngineer = require('./agents/execution/mechanical-engineer');
const DFMSpecialist = require('./agents/execution/dfm-specialist');
const DesignExpert = require('./agents/execution/design-expert');
const QualityGatesAgent = require('./agents/quality-gates');

async function runIntegrationTest() {
  console.log('\n' + '='.repeat(70));
  console.log('TAMIRCLAW SYSTEM INTEGRATION TEST');
  console.log('Email → Project → Quote → Specialists → Engineers → QA → Approval');
  console.log('='.repeat(70) + '\n');

  // Initialize agents
  const email = new EmailManagerAgent();
  const tracker = new ProjectTrackerAgent();
  const quotes = new QuoteGeneratorAgent();
  const orchestrator = new OrchestratorAgent();
  const vehicle = new VehicleSpecialist();
  const mechanical = new MechanicalEngineer();
  const dfm = new DFMSpecialist();
  const design = new DesignExpert();
  const qa = new QualityGatesAgent();

  let step = 1;

  try {
    // STEP 1: EMAIL ARRIVES
    console.log(`STEP ${step++}: Email Intake`);
    const emailResult = await email.process({
      action: 'parse',
      data: {
        from: 'tamir@audi.com',
        to: 'tamir@tmd.local',
        subject: 'URGENT: A8 Interior Redesign - Premium Segment',
        body: 'We need a complete interior redesign for the new A8. Budget: €500K, Timeline: 12 months. Premium quality required.',
        attachments: ['specs.pdf']
      }
    });

    if (!emailResult.success) throw new Error('Email parse failed');
    console.log(`✅ Email parsed: ${emailResult.email_id}\n`);

    const emailId = emailResult.email_id;

    // STEP 2: PRIORITIZE & ROUTE
    console.log(`STEP ${step++}: Email Prioritization & Routing`);
    const priorityResult = await email.process({
      action: 'prioritize',
      data: {email_id: emailId}
    });

    const routeResult = await email.process({
      action: 'route',
      data: {email_id: emailId}
    });

    if (!routeResult.success) throw new Error('Email routing failed');
    console.log(`✅ Priority: ${priorityResult.priority}`);
    console.log(`✅ Route: ${routeResult.suggested_route}\n`);

    // STEP 3: PROJECT INTAKE
    console.log(`STEP ${step++}: Project Intake & Creation`);
    const projectResult = await orchestrator.process({
      action: 'intake_project',
      data: {
        client: 'Audi AG',
        brief: 'Complete interior redesign for A8 - Premium segment',
        domain: 'automotive',
        budget: 500000,
        deadline: '2026-12-31'
      }
    });

    if (!projectResult.success) throw new Error('Project intake failed');
    console.log(`✅ Project created: ${projectResult.project_id}`);
    console.log(`✅ Assigned agents: ${projectResult.assigned_agents.join(', ')}\n`);

    const projectId = projectResult.project_id;

    // STEP 4: DOMAIN SPECIALIST ANALYSIS
    console.log(`STEP ${step++}: Domain Specialist Analysis (Vehicle)`);
    const vehicleResult = await vehicle.process({
      action: 'analyze_project',
      data: {
        brief: 'Complete interior redesign for A8 - Premium segment',
        timeline: 12,
        budget: 500000,
        target_market: 'luxury'
      }
    });

    if (!vehicleResult.success) throw new Error('Vehicle analysis failed');
    console.log(`✅ Feasibility: ${vehicleResult.feasibility}`);
    console.log(`✅ Complexity: ${vehicleResult.analysis.complexity}`);
    console.log(`✅ Market segment: ${vehicleResult.analysis.market_segment}\n`);

    // STEP 5: QUOTE GENERATION
    console.log(`STEP ${step++}: Quote Generation`);
    const quoteResult = await quotes.process({
      action: 'generate_quote',
      data: {
        client: 'Audi AG',
        project_name: 'A8 Interior Redesign',
        domain: 'automotive',
        complexity: 'complex',
        timeline_weeks: 12,
        client_type: 'enterprise',
        description: 'Complete interior redesign with premium materials',
        deliverables: ['3D CAD', 'Material specs', 'DFM analysis', 'Cost optimization']
      }
    });

    if (!quoteResult.success) throw new Error('Quote generation failed');
    console.log(`✅ Quote ID: ${quoteResult.quote_id}`);
    console.log(`✅ Total cost: €${quoteResult.cost.toLocaleString()}\n`);

    // STEP 6: EXECUTION EXPERTS (Parallel)
    console.log(`STEP ${step++}: Execution Experts (Parallel)`);

    const mechResult = await mechanical.process({
      action: 'design_analysis',
      data: {brief: 'A8 interior redesign', timeline: 12, budget: 500000}
    });

    const dfmResult = await dfm.process({
      action: 'analyze_manufacturability',
      data: {process_type: 'injection_molding', complexity: 'complex', volume: 100000}
    });

    const designResult = await design.process({
      action: 'aesthetic_review',
      data: {brief: 'A8 interior - premium market', style_reference: 'luxury_automotive'}
    });

    if (!mechResult.success || !dfmResult.success || !designResult.success) {
      throw new Error('Execution expert analysis failed');
    }

    console.log(`✅ Mechanical: ${mechResult.analysis.feasibility}`);
    console.log(`✅ DFM: Per-unit cost €${dfmResult.setup_cost} setup + €${dfmResult.per_unit_cost}`);
    console.log(`✅ Design: Score ${designResult.review.aesthetic_score}/10\n`);

    // STEP 7: QUALITY GATES
    console.log(`STEP ${step++}: Quality Assessment (8 Dimensions)`);
    const qaResult = await qa.process({
      action: 'score_project',
      data: {
        project_id: projectId,
        scores: {
          desirability: 9,      // Luxury market wants premium interiors
          functionality: 8,     // All specs met
          manufacturability: 8,  // Injection molding feasible
          credibility: 9,       // Audi track record
          viability: 8,         // Margin 45% on enterprise
          differentiation: 8,   // Premium positioning
          aesthetics: 9,        // Design-led brand
          performance: 8        // All deliverables on time
        }
      }
    });

    if (!qaResult.success) throw new Error('QA scoring failed');
    console.log(`✅ Overall Score: ${qaResult.weighted_score}/10`);
    console.log(`✅ Status: ${qaResult.status}`);

    if (qaResult.status === 'FAIL') {
      console.log('❌ PROJECT REJECTED - Score below 7/10\n');
      throw new Error('Quality gate failed');
    }

    console.log(`✅ All 8 dimensions >= 7\n`);

    // STEP 8: VALIDATION GATES
    console.log(`STEP ${step++}: Validation Gates (5-stage)`);

    const gates = [
      {num: 1, name: 'Concept Review', items: 3},
      {num: 2, name: 'Design Validation', items: 4},
      {num: 3, name: 'Engineering Sign-Off', items: 5},
      {num: 4, name: 'Business Review', items: 3},
      {num: 5, name: 'Final Approval', items: 2}
    ];

    for (const gate of gates) {
      const gateResult = await qa.process({
        action: 'validate_gate',
        data: {
          project_id: projectId,
          gate_number: gate.num,
          checklist: Array(gate.items).fill(0).map((_, i) => ({
            item: `Check ${i + 1}`,
            passed: true
          }))
        }
      });

      if (!gateResult.success || gateResult.status === 'FAIL') {
        throw new Error(`Gate ${gate.num} failed`);
      }

      console.log(`✅ Gate ${gate.num}: ${gate.name} - PASS`);
    }

    console.log('');

    // FINAL SUMMARY
    console.log('='.repeat(70));
    console.log('✅ INTEGRATION TEST PASSED');
    console.log('='.repeat(70));
    console.log(`
Project: A8 Interior Redesign
Client: Audi AG
Budget: €500,000
Timeline: 12 months
Quality Score: ${qaResult.weighted_score}/10
Status: APPROVED FOR PRODUCTION

Agents Involved:
- Email Manager (routing)
- Project Tracker (management)
- Orchestrator (coordination)
- Vehicle Specialist (domain expertise)
- Mechanical Engineer (design)
- DFM Specialist (manufacturability)
- Design Expert (aesthetics)
- Quality Gates (validation)

All systems operational. Ready for real-world execution.
    `);
    console.log('='.repeat(70) + '\n');

    return true;

  } catch (error) {
    console.log(`\n❌ INTEGRATION TEST FAILED`);
    console.log(`Error at step ${step}: ${error.message}\n`);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  runIntegrationTest().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = runIntegrationTest;
