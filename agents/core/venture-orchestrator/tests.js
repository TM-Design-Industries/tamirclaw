/**
 * Tests for VentureOrchestrator
 */

const VentureOrchestrator = require('./index.js');

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('VENTURE ORCHESTRATOR TESTS');
  console.log('='.repeat(70) + '\n');

  const orchestrator = new VentureOrchestrator();
  let passed = 0;
  let failed = 0;

  // TEST 1: Register ventures
  console.log('TEST 1: Register ventures');
  const ventures = [
    { id: 'nday', name: 'NuDay', mission: 'Health behavior wellness humanity' },
    { id: 'brid', name: 'BetterRide', mission: 'Transportation safety efficiency' },
    { id: 'any1', name: 'ANY1', mission: 'Access health equity humanity' },
    { id: 'air', name: 'AIR eVTOL', mission: 'Aerospace innovation sustainability' },
    { id: 'tmd', name: 'TMD Design', mission: 'Design manufacturing excellence' }
  ];

  for (const venture of ventures) {
    const result = orchestrator.registerVenture({
      ...venture,
      projects: [
        { id: `p1-${venture.id}`, domain: venture.id.split('-')[0] }
      ]
    });
    if (result.success) {
      passed++;
      console.log(`✅ Registered: ${venture.name}`);
    } else {
      failed++;
      console.log(`❌ Failed: ${venture.name}`);
    }
  }

  // TEST 2: Calculate synergy
  console.log('\nTEST 2: Calculate synergy between ventures');
  const synergy_nday_brid = orchestrator.calculateSynergy('nday', 'brid');
  if (synergy_nday_brid >= 25) {
    passed++;
    console.log(`✅ NuDay + BetterRide synergy: ${synergy_nday_brid}/100 (expected medium)`);
  } else {
    failed++;
    console.log(`❌ Too low synergy: ${synergy_nday_brid}`);
  }

  const synergy_brid_air = orchestrator.calculateSynergy('brid', 'air');
  if (synergy_brid_air < 50) {
    passed++;
    console.log(`✅ BetterRide + AIR synergy: ${synergy_brid_air}/100 (low)`);
  } else {
    failed++;
    console.log(`❌ Unexpectedly high: ${synergy_brid_air}`);
  }

  // TEST 3: Detect synergy clusters
  console.log('\nTEST 3: Detect high-synergy clusters');
  const clusters = orchestrator.detectSynergyClusters();
  if (clusters.length > 0) {
    passed++;
    console.log(`✅ Found ${clusters.length} synergy cluster(s)`);
    for (const cluster of clusters) {
      console.log(`   Cluster: ${cluster.ventures.join(' + ')} (score: ${cluster.synergy_score})`);
    }
  } else {
    failed++;
    console.log(`❌ No clusters detected`);
  }

  // TEST 4: Register IP contribution
  console.log('\nTEST 4: Register IP contribution from venture');
  const ip_result = orchestrator.registerIPContribution('air', {
    type: 'material_process',
    description: 'Carbon fiber + resin at X temp = 30% lighter',
    applicable_domains: ['brid', 'tmd', 'any1']
  });
  if (ip_result.success) {
    passed++;
    console.log(`✅ IP registered: ${ip_result.ip_id}`);
  } else {
    failed++;
    console.log(`❌ IP registration failed`);
  }

  // TEST 5: Optimize resource allocation
  console.log('\nTEST 5: Optimize resource allocation');
  const allocation = orchestrator.optimizeResourceAllocation(100);
  if (Object.keys(allocation).length === 5) {
    passed++;
    console.log(`✅ Resource allocation complete:`);
    for (const [venture_id, resources] of Object.entries(allocation)) {
      const venture = orchestrator.ventures[venture_id];
      console.log(`   ${venture.name}: ${resources.toFixed(1)} units`);
    }
  } else {
    failed++;
    console.log(`❌ Allocation failed`);
  }

  // TEST 6: Get portfolio snapshot
  console.log('\nTEST 6: Get portfolio snapshot');
  const snapshot = orchestrator.getPortfolioSnapshot();
  if (snapshot.total_ventures === 5) {
    passed++;
    console.log(`✅ Portfolio snapshot:`);
    console.log(`   Total ventures: ${snapshot.total_ventures}`);
    console.log(`   Synergy clusters: ${snapshot.synergy_clusters}`);
    console.log(`   Average cluster synergy: ${snapshot.average_cluster_synergy}`);
    console.log(`   IP flowing: ${snapshot.ip_flowing} pieces`);
  } else {
    failed++;
    console.log(`❌ Snapshot invalid`);
  }

  // TEST 7: Process method
  console.log('\nTEST 7: Process method (main interface)');
  const process_result = await orchestrator.process({
    action: 'get_snapshot'
  });
  if (process_result.success) {
    passed++;
    console.log(`✅ Process method works`);
  } else {
    failed++;
    console.log(`❌ Process method failed`);
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
