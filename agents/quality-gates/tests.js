const QualityGatesAgent = require('./index');

async function runTests() {
  const qa = new QualityGatesAgent();
  let passed = 0, failed = 0;

  console.log('\n=== QUALITY GATES TESTS ===\n');

  // TEST 1: Pass (all >= 7)
  try {
    const result = await qa.process({
      action: 'score_project',
      data: {
        project_id: 'TEST-001',
        scores: {
          desirability: 8,
          functionality: 8,
          manufacturability: 7,
          credibility: 8,
          viability: 8,
          differentiation: 7,
          aesthetics: 8,
          performance: 7
        }
      }
    });

    if (result.success && result.status === 'PASS' && result.weighted_score >= 7.5) {
      console.log('✅ TEST 1: Score >= 7.5 returns PASS');
      passed++;
    } else {
      console.log('❌ TEST 1: FAIL');
      failed++;
    }
  } catch (e) {
    console.log('❌ TEST 1: ERROR -', e.message);
    failed++;
  }

  // TEST 2: Fail (some < 7)
  try {
    const result = await qa.process({
      action: 'score_project',
      data: {
        project_id: 'TEST-002',
        scores: {
          desirability: 6,
          functionality: 5,
          manufacturability: 7,
          credibility: 6,
          viability: 5,
          differentiation: 6,
          aesthetics: 6,
          performance: 5
        }
      }
    });

    if (result.success && result.status === 'FAIL' && result.weighted_score < 7) {
      console.log('✅ TEST 2: Score < 7 returns FAIL');
      passed++;
    } else {
      console.log('❌ TEST 2: FAIL');
      failed++;
    }
  } catch (e) {
    console.log('❌ TEST 2: ERROR -', e.message);
    failed++;
  }

  // TEST 3: Validation Gate
  try {
    const result = await qa.process({
      action: 'validate_gate',
      data: {
        project_id: 'TEST-001',
        gate_number: 1,
        checklist: [
          {item: 'Strategic fit', passed: true},
          {item: 'Concept clarity', passed: true},
          {item: 'Risk assessment', passed: true}
        ]
      }
    });

    if (result.success && result.status === 'PASS') {
      console.log('✅ TEST 3: Gate validation works');
      passed++;
    } else {
      console.log('❌ TEST 3: FAIL');
      failed++;
    }
  } catch (e) {
    console.log('❌ TEST 3: ERROR -', e.message);
    failed++;
  }

  // TEST 4: Get Report
  try {
    const result = await qa.process({
      action: 'get_report',
      data: {project_id: 'TEST-001'}
    });

    if (result.success && result.overall_score && result.dimensions) {
      console.log('✅ TEST 4: Report retrieval works');
      passed++;
    } else {
      console.log('❌ TEST 4: FAIL');
      failed++;
    }
  } catch (e) {
    console.log('❌ TEST 4: ERROR -', e.message);
    failed++;
  }

  console.log(`\n=== SUMMARY ===\nPassed: ${passed}/4\n`);
  return failed === 0;
}

if (require.main === module) {
  runTests().then(success => process.exit(success ? 0 : 1));
}

module.exports = runTests;
