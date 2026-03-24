/**
 * PROJECT TRACKER TESTS
 */

const ProjectTrackerAgent = require('./index');

async function runTests() {
  const tracker = new ProjectTrackerAgent();
  let passed = 0;
  let failed = 0;

  console.log('\n=== PROJECT TRACKER AGENT TESTS ===\n');

  // TEST 1: Create Project
  console.log('TEST 1: Create project');
  try {
    const result = await tracker.process({
      action: 'create',
      data: {
        client: 'Audi',
        brief: 'Interior redesign for new model',
        domain: 'automotive',
        deadline: '2026-06-30',
        budget: 500000
      }
    });

    if (result.success && result.project_id) {
      console.log('✅ PASS - Project created:', result.project_id);
      passed++;
      global.testProjectId = result.project_id;
    } else {
      console.log('❌ FAIL - Could not create project');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 2: Get Status
  console.log('\nTEST 2: Get project status');
  try {
    const result = await tracker.process({
      action: 'get_status',
      data: {
        project_id: global.testProjectId
      }
    });

    if (result.success && result.status === 'intake') {
      console.log('✅ PASS - Status retrieved:', result.status);
      passed++;
    } else {
      console.log('❌ FAIL - Could not get status');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 3: Update Status
  console.log('\nTEST 3: Update project status');
  try {
    const result = await tracker.process({
      action: 'update_status',
      data: {
        project_id: global.testProjectId,
        status: 'planning'
      }
    });

    if (result.success && result.status === 'planning') {
      console.log('✅ PASS - Status updated to', result.status);
      passed++;
    } else {
      console.log('❌ FAIL - Could not update status');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 4: Add Milestone
  console.log('\nTEST 4: Add milestone');
  try {
    const result = await tracker.process({
      action: 'add_milestone',
      data: {
        project_id: global.testProjectId,
        name: 'Design Phase Complete',
        due_date: '2026-04-15',
        deliverables: ['CAD files', 'renderings', 'design specs']
      }
    });

    if (result.success && result.milestone_id) {
      console.log('✅ PASS - Milestone created:', result.milestone_id);
      passed++;
    } else {
      console.log('❌ FAIL - Could not add milestone');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 5: List Projects
  console.log('\nTEST 5: List all projects');
  try {
    const result = await tracker.process({
      action: 'list'
    });

    if (result.success && result.total >= 1) {
      console.log('✅ PASS - Found', result.total, 'projects');
      passed++;
    } else {
      console.log('❌ FAIL - Could not list projects');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 6: Invalid Action
  console.log('\nTEST 6: Invalid action handling');
  try {
    const result = await tracker.process({
      action: 'invalid_action',
      data: {}
    });

    if (!result.success && result.error) {
      console.log('✅ PASS - Invalid action rejected correctly');
      passed++;
    } else {
      console.log('❌ FAIL - Invalid action not caught');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 7: Missing Required Fields
  console.log('\nTEST 7: Missing required fields handling');
  try {
    const result = await tracker.process({
      action: 'create',
      data: {
        client: 'TestCorp'
        // Missing brief and domain
      }
    });

    if (!result.success && result.error) {
      console.log('✅ PASS - Missing fields rejected correctly');
      passed++;
    } else {
      console.log('❌ FAIL - Missing fields not caught');
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
