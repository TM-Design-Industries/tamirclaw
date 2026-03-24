/**
 * Tests for Mission Gates
 */

const MissionGates = require('./index.js');

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('MISSION GATES TESTS');
  console.log('='.repeat(70) + '\n');

  const gates = new MissionGates();
  let passed = 0;
  let failed = 0;

  // TEST 1: Score a high-quality mission-aligned project
  console.log('TEST 1: High-quality, mission-aligned project');
  const result1 = gates.scoreProject({
    project: { id: 'proj1', venture_id: 'nday', name: 'NuDay wellness app' },
    scores: {
      desirability: 9,
      functionality: 9,
      manufacturability: 8,
      credibility: 9,
      viability: 9,
      differentiation: 8,
      aesthetics: 9,
      performance: 9,
      helps_nature: 7,
      helps_humanity: 9,
      conscience_approval: 9,
      venture_synergy: 8
    }
  });

  if (result1.status === 'PASS' && result1.overall_score > 8) {
    passed++;
    console.log(`✅ High-quality project PASSED`);
    console.log(`   Overall score: ${result1.overall_score.toFixed(1)}/10`);
  } else {
    failed++;
    console.log(`❌ Should have passed`);
  }

  // TEST 2: Score a technically good but mission-misaligned project
  console.log('\nTEST 2: Technically good, mission-misaligned project');
  const result2 = gates.scoreProject({
    project: { id: 'proj2', venture_id: 'tmd', name: 'Luxury car interior' },
    scores: {
      desirability: 9,
      functionality: 9,
      manufacturability: 8,
      credibility: 9,
      viability: 8,
      differentiation: 9,
      aesthetics: 10,
      performance: 9,
      helps_nature: 2,
      helps_humanity: 3,
      conscience_approval: 3,
      venture_synergy: 1
    }
  });

  if (result2.status === 'FAIL') {
    passed++;
    console.log(`✅ Mission-misaligned project REJECTED`);
    console.log(`   Mission score: ${result2.mission_score.toFixed(1)}/10 (too low)`);
  } else {
    failed++;
    console.log(`❌ Should have been rejected`);
  }

  // TEST 3: Score a mediocre project
  console.log('\nTEST 3: Mediocre project (all 6/10)');
  const result3 = gates.scoreProject({
    project: { id: 'proj3', venture_id: 'any1', name: 'Healthcare access tool' },
    scores: {
      desirability: 6,
      functionality: 6,
      manufacturability: 6,
      credibility: 6,
      viability: 6,
      differentiation: 6,
      aesthetics: 6,
      performance: 6,
      helps_nature: 6,
      helps_humanity: 6,
      conscience_approval: 6,
      venture_synergy: 6
    }
  });

  if (result3.status === 'FAIL') {
    passed++;
    console.log(`✅ Mediocre project REJECTED`);
    console.log(`   Overall score: ${result3.overall_score.toFixed(1)}/10 (below threshold)`);
  } else {
    failed++;
    console.log(`❌ Should have been rejected`);
  }

  // TEST 4: Non-mission-critical project (lower thresholds)
  console.log('\nTEST 4: Non-mission-critical project (7+)');
  const result4 = gates.scoreProject({
    project: { id: 'proj4', venture_id: 'other', name: 'Internal tool' },
    scores: {
      desirability: 8,
      functionality: 8,
      manufacturability: 7,
      credibility: 8,
      viability: 7,
      differentiation: 7,
      aesthetics: 7,
      performance: 8,
      helps_nature: 7,
      helps_humanity: 7,
      conscience_approval: 7,
      venture_synergy: 7
    }
  });

  if (result4.status === 'PASS') {
    passed++;
    console.log(`✅ Non-mission-critical project PASSED`);
    console.log(`   Overall score: ${result4.overall_score.toFixed(1)}/10`);
  } else {
    failed++;
    console.log(`❌ Should have passed`);
  }

  // TEST 5: Decision history
  console.log('\nTEST 5: Decision history tracking');
  const history = gates.getDecisionHistory();
  if (history.length === 4) {
    passed++;
    console.log(`✅ All decisions logged: ${history.length} entries`);
  } else {
    failed++;
    console.log(`❌ Incorrect history count`);
  }

  // TEST 6: Portfolio health
  console.log('\nTEST 6: Portfolio health analysis');
  const health = gates.getPortfolioHealth();
  console.log(`   Total decisions: ${health.total_decisions}`);
  console.log(`   Passed: ${health.passed} (${health.pass_rate})`);
  console.log(`   Avg technical: ${health.avg_technical_score}/10`);
  console.log(`   Avg mission: ${health.avg_mission_score}/10`);
  console.log(`   Portfolio health: ${health.health}`);
  if (health.passed >= 1) {
    passed++;
    console.log(`✅ Portfolio health computed`);
  } else {
    failed++;
    console.log(`❌ Portfolio health failed`);
  }

  // TEST 7: Process interface
  console.log('\nTEST 7: Process interface');
  const process_result = await gates.process({
    project: { id: 'test', venture_id: 'air', name: 'eVTOL safety system' },
    scores: {
      desirability: 10, functionality: 10, manufacturability: 9, credibility: 10,
      viability: 9, differentiation: 10, aesthetics: 8, performance: 10,
      helps_nature: 8, helps_humanity: 10, conscience_approval: 10, venture_synergy: 9
    }
  });

  if (process_result.success && process_result.verdict.status === 'PASS') {
    passed++;
    console.log(`✅ Process interface works`);
  } else {
    failed++;
    console.log(`❌ Process interface failed`);
  }

  // SUMMARY
  console.log('\n' + '='.repeat(70));
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(70) + '\n');

  return failed === 0;
}

if (require.main === module) {
  runTests().then(success => process.exit(success ? 0 : 1));
}

module.exports = runTests;
