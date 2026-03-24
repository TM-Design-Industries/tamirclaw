/**
 * Tests for Synergy Optimizer
 */

const SynergyOptimizer = require('./index.js');

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('SYNERGY OPTIMIZER TESTS');
  console.log('='.repeat(70) + '\n');

  const optimizer = new SynergyOptimizer();
  let passed = 0;
  let failed = 0;

  // TEST 1: Optimize allocation
  console.log('TEST 1: Optimize budget allocation across ventures');
  const ventures = [
    { id: 'nday', synergy_with_others: 85, current_resources: 10, potential: 50 },
    { id: 'brid', synergy_with_others: 75, current_resources: 10, potential: 50 },
    { id: 'any1', synergy_with_others: 80, current_resources: 10, potential: 50 },
    { id: 'air', synergy_with_others: 45, current_resources: 20, potential: 40 },
    { id: 'tmd', synergy_with_others: 35, current_resources: 30, potential: 30 }
  ];

  const optimization = optimizer.optimizeAllocation(ventures, 100);

  if (optimization.high_synergy_clusters.length === 3) {
    passed++;
    console.log(`✅ Optimization complete:`);
    console.log(`   High-synergy cluster: ${optimization.high_synergy_clusters.join(', ')}`);
    console.log(`   Allocation (high): ${Object.entries(optimization.allocation)
      .filter(([id]) => optimization.high_synergy_clusters.includes(id))
      .map(([id, amt]) => `${id}=$${amt.toFixed(0)}`)
      .join(', ')}`);
    console.log(`   Expected return: $${optimization.expected_portfolio_return.toFixed(0)}`);
  } else {
    failed++;
    console.log(`❌ Wrong cluster count`);
  }

  // TEST 2: Predict impact
  console.log('\nTEST 2: Predict impact of resource changes');
  const current = {
    nday: 10,
    brid: 10,
    any1: 10,
    air: 40,
    tmd: 30
  };

  const proposed = {
    air: -20,  // Move 20 from low-synergy AIR
    nday: 10,  // Add 10 to high-synergy NuDay
    any1: 10   // Add 10 to high-synergy ANY1
  };

  const impact = optimizer.predictImpact(current, proposed);

  if (impact.improvement > 0) {
    passed++;
    console.log(`✅ Impact analysis:`);
    console.log(`   Current return: $${impact.current_return.toFixed(0)}`);
    console.log(`   Projected return: $${impact.projected_return.toFixed(0)}`);
    console.log(`   Improvement: $${impact.improvement.toFixed(0)} (${impact.improvement_percent})`);
  } else {
    failed++;
    console.log(`❌ Impact should be positive`);
  }

  // TEST 3: Get recommendations
  console.log('\nTEST 3: Get optimization recommendations');
  const recommendations = optimizer.getRecommendations(ventures);

  if (recommendations.length > 0) {
    passed++;
    console.log(`✅ Recommendations generated:`);
    for (const rec of recommendations) {
      console.log(`   ${rec.type}: ${rec.reason}`);
      console.log(`      Impact: ${rec.impact}`);
    }
  } else {
    failed++;
    console.log(`❌ No recommendations`);
  }

  // TEST 4: Allocation distribution
  console.log('\nTEST 4: Verify allocation distribution (60/30/10)');
  const total_allocated = Object.values(optimization.allocation).reduce((a, b) => a + b, 0);
  const high_allocated = optimization.high_synergy_clusters
    .reduce((sum, id) => sum + (optimization.allocation[id] || 0), 0);
  const high_percent = (high_allocated / total_allocated) * 100;

  if (high_percent >= 55 && high_percent <= 65) {
    passed++;
    console.log(`✅ Distribution correct: ${high_percent.toFixed(0)}% to high-synergy`);
  } else {
    failed++;
    console.log(`❌ Distribution wrong: ${high_percent.toFixed(0)}% (should be ~60%)`);
  }

  // TEST 5: Process interface
  console.log('\nTEST 5: Process interface');
  const process_result = await optimizer.process({
    action: 'optimize_clusters',
    data: {
      ventures: ventures,
      total_budget: 100
    }
  });

  if (process_result.success && process_result.optimization) {
    passed++;
    console.log(`✅ Process interface works`);
  } else {
    failed++;
    console.log(`❌ Process interface failed`);
  }

  // TEST 6: Extreme scenario
  console.log('\nTEST 6: High-synergy cluster dominance');
  const extreme_ventures = [
    { id: 'cluster1', synergy_with_others: 95, current_resources: 5, potential: 50 },
    { id: 'cluster2', synergy_with_others: 90, current_resources: 5, potential: 50 },
    { id: 'cluster3', synergy_with_others: 10, current_resources: 50, potential: 20 }
  ];

  const extreme_opt = optimizer.optimizeAllocation(extreme_ventures, 100);

  const high_alloc = extreme_opt.high_synergy_clusters
    .reduce((sum, id) => sum + (extreme_opt.allocation[id] || 0), 0);

  if (high_alloc > 55) {
    passed++;
    console.log(`✅ High-synergy cluster got majority: $${high_alloc.toFixed(0)}/100`);
  } else {
    failed++;
    console.log(`❌ Should allocate more to high-synergy`);
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
