/**
 * ORCHESTRATOR TESTS
 */

const OrchestratorAgent = require('./index');

async function runTests() {
  const orchestrator = new OrchestratorAgent();
  let passed = 0;
  let failed = 0;

  console.log('\n=== ORCHESTRATOR AGENT TESTS ===\n');

  // TEST 1: Intake Project
  console.log('TEST 1: Intake new project');
  try {
    const result = await orchestrator.process({
      action: 'intake_project',
      data: {
        client: 'Audi AG',
        brief: 'Complete interior redesign for A8',
        domain: 'automotive',
        budget: 500000,
        deadline: '2026-06-30'
      }
    });

    if (result.success && result.project_id) {
      console.log('✅ PASS - Project intaken:', result.project_id);
      console.log('   Status: ' + result.status);
      console.log('   Assigned to:', result.assigned_agents.join(', '));
      passed++;
      global.testProjectId = result.project_id;
    } else {
      console.log('❌ FAIL - Could not intake project');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 2: Check Status
  console.log('\nTEST 2: Check project status');
  try {
    const result = await orchestrator.process({
      action: 'check_status',
      data: {
        project_id: global.testProjectId
      }
    });

    if (result.success && result.project_id === global.testProjectId) {
      console.log('✅ PASS - Status retrieved');
      console.log('   Status: ' + result.status);
      console.log('   Agents: ' + result.agents_assigned.length);
      passed++;
    } else {
      console.log('❌ FAIL - Could not get status');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 3: Assign Agents for Design Phase
  console.log('\nTEST 3: Assign agents for design phase');
  try {
    const result = await orchestrator.process({
      action: 'assign_agents',
      data: {
        project_id: global.testProjectId,
        phase: 'design'
      }
    });

    if (result.success && result.assigned_agents.includes('design_expert')) {
      console.log('✅ PASS - Agents assigned for design phase');
      console.log('   Agents:', result.assigned_agents.join(', '));
      passed++;
    } else {
      console.log('❌ FAIL - Could not assign design agents');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 4: Escalate Issue
  console.log('\nTEST 4: Escalate to Tamir');
  try {
    const result = await orchestrator.process({
      action: 'escalate',
      data: {
        project_id: global.testProjectId,
        reason: 'Budget exceeded by 15% due to material constraints',
        severity: 'high'
      }
    });

    if (result.success && result.escalation_id) {
      console.log('✅ PASS - Escalation created');
      console.log('   ID: ' + result.escalation_id);
      console.log('   Severity: ' + result.severity);
      passed++;
    } else {
      console.log('❌ FAIL - Could not escalate');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 5: Get Queue Status
  console.log('\nTEST 5: Get work queue status');
  try {
    const result = await orchestrator.process({
      action: 'get_queue'
    });

    if (result.success && result.queue_length >= 1) {
      console.log('✅ PASS - Queue retrieved');
      console.log('   Items in queue: ' + result.queue_length);
      console.log('   Total projects: ' + result.total_projects);
      passed++;
    } else {
      console.log('❌ FAIL - Could not get queue');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 6: Multiple Projects
  console.log('\nTEST 6: Handle multiple concurrent projects');
  try {
    const result1 = await orchestrator.process({
      action: 'intake_project',
      data: {
        client: 'Airbus',
        brief: 'eVTOL fuselage design',
        domain: 'aerospace',
        budget: 2000000,
        deadline: '2026-12-31'
      }
    });

    const result2 = await orchestrator.process({
      action: 'intake_project',
      data: {
        client: 'Ship Dynamics',
        brief: 'Marine hull optimization',
        domain: 'marine',
        budget: 750000
      }
    });

    const queue = await orchestrator.process({
      action: 'get_queue'
    });

    if (queue.total_projects === 3) {
      console.log('✅ PASS - Multiple projects handled');
      console.log('   Total projects: ' + queue.total_projects);
      console.log('   Projects:', queue.queue.map(q => q.project_id).join(', '));
      passed++;
    } else {
      console.log('❌ FAIL - Could not handle multiple projects');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 7: Different Domains
  console.log('\nTEST 7: Correct specialist assignment by domain');
  try {
    const autoResult = await orchestrator.process({
      action: 'intake_project',
      data: {client: 'BMW', brief: 'Wheel design', domain: 'automotive', budget: 100000}
    });

    const aeroResult = await orchestrator.process({
      action: 'intake_project',
      data: {client: 'Boeing', brief: 'Wing design', domain: 'aerospace', budget: 5000000}
    });

    const autoHasVehicleSpec = autoResult.assigned_agents.includes('vehicle_specialist');
    const aeroHasAircraftSpec = aeroResult.assigned_agents.includes('aircraft_specialist');

    if (autoHasVehicleSpec && aeroHasAircraftSpec) {
      console.log('✅ PASS - Specialists assigned correctly by domain');
      console.log('   Automotive: vehicle_specialist ✓');
      console.log('   Aerospace: aircraft_specialist ✓');
      passed++;
    } else {
      console.log('❌ FAIL - Wrong specialist assignments');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // SUMMARY
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}\n`);

  return {
    passed,
    failed,
    total: passed + failed
  };
}

// Run if called directly
if (require.main === module) {
  runTests().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  });
}

module.exports = runTests;
