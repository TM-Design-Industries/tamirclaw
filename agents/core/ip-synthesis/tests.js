/**
 * Tests for IP Synthesis Engine
 */

const IPSynthesisEngine = require('./index.js');

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('IP SYNTHESIS ENGINE TESTS');
  console.log('='.repeat(70) + '\n');

  const engine = new IPSynthesisEngine();
  let passed = 0;
  let failed = 0;

  // TEST 1: Register venture capabilities
  console.log('TEST 1: Register venture capabilities');
  const ventures = [
    { id: 'nday', capabilities: [{title: 'Health behavior', domain: 'behavioral'}] },
    { id: 'brid', capabilities: [{title: 'Transportation', domain: 'transportation'}, {title: 'Driver wellness', domain: 'behavioral'}] },
    { id: 'any1', capabilities: [{title: 'Health access', domain: 'behavioral'}, {title: 'Community networks', domain: 'social'}] },
    { id: 'air', capabilities: [{title: 'Aerospace', domain: 'aerospace'}, {title: 'Materials', domain: 'materials'}] },
    { id: 'tmd', capabilities: [{title: 'Design', domain: 'design'}, {title: 'Manufacturing', domain: 'manufacturing'}] }
  ];

  for (const venture of ventures) {
    const result = engine.registerVentureCapabilities(venture.id, venture.capabilities);
    if (result.success && result.capabilities_registered > 0) {
      passed++;
      console.log(`✅ ${venture.id}: ${result.capabilities_registered} capabilities`);
    } else {
      failed++;
      console.log(`❌ Failed to register ${venture.id}`);
    }
  }

  // TEST 2: Register discovery (behavioral)
  console.log('\nTEST 2: Register behavioral discovery (from NuDay)');
  const disc1 = engine.registerDiscovery({
    source_venture: 'nday',
    type: 'behavioral_model',
    title: 'Weight loss success patterns',
    description: 'Pattern = 85% success for weight loss behavior change',
    applicable_domains: ['behavioral'],
    impact_multiplier: 2
  });

  if (disc1.success && disc1.shared_with.length > 0) {
    passed++;
    console.log(`✅ Discovery registered, shared with: ${disc1.shared_with.join(', ')}`);
  } else {
    failed++;
    console.log(`❌ Discovery registration failed`);
  }

  // TEST 3: Register material discovery
  console.log('\nTEST 3: Register material discovery (from AIR eVTOL)');
  const disc2 = engine.registerDiscovery({
    source_venture: 'air',
    type: 'material',
    title: 'Carbon fiber resin optimization',
    description: 'Carbon fiber + resin at X temp = 30% lighter',
    applicable_domains: ['materials', 'manufacturing'],
    impact_multiplier: 3
  });

  if (disc2.success && disc2.shared_with.length > 0) {
    passed++;
    console.log(`✅ Material discovery shared with: ${disc2.shared_with.join(', ')}`);
  } else {
    failed++;
    console.log(`❌ Material discovery failed`);
  }

  // TEST 4: Get flow map
  console.log('\nTEST 4: Get IP flow map');
  const flow_map = engine.getFlowMap();
  if (flow_map.nodes.length === 5 && flow_map.edges.length > 0) {
    passed++;
    console.log(`✅ Flow map created:`);
    console.log(`   Nodes (ventures): ${flow_map.nodes.length}`);
    console.log(`   Edges (IP flows): ${flow_map.edges.length}`);
  } else {
    failed++;
    console.log(`❌ Flow map invalid`);
  }

  // TEST 5: Get impact report
  console.log('\nTEST 5: Get impact report');
  const impact = engine.getImpactReport();
  if (impact.total_discoveries >= 2) {
    passed++;
    console.log(`✅ Impact report:`);
    console.log(`   Total discoveries: ${impact.total_discoveries}`);
    console.log(`   Total IP flows: ${impact.total_ip_flows}`);
    console.log(`   Avg shares per discovery: ${impact.avg_shares_per_discovery}`);
    console.log(`   Portfolio impact multiplier: ${impact.portfolio_impact_multiplier}x`);
    console.log(`   Synthesis efficiency: ${impact.synthesis_efficiency}`);
  } else {
    failed++;
    console.log(`❌ Impact report insufficient data`);
  }

  // TEST 6: Venture inventory
  console.log('\nTEST 6: Venture IP inventory');
  let inventory_valid = true;
  for (const [venture_id, inventory] of Object.entries(engine.venture_inventory)) {
    if (inventory.length === 0) {
      inventory_valid = false;
      break;
    }
  }

  if (inventory_valid) {
    passed++;
    console.log(`✅ All ventures have IP inventory:`);
    for (const [venture_id, inventory] of Object.entries(engine.venture_inventory)) {
      console.log(`   ${venture_id}: ${inventory.length} items`);
    }
  } else {
    failed++;
    console.log(`❌ Some ventures have empty inventory`);
  }

  // TEST 7: Process interface
  console.log('\nTEST 7: Process interface');
  const process_result = await engine.process({
    action: 'register_discovery',
    data: {
      discovery: {
        source_venture: 'brid',
        type: 'cost_reduction',
        title: 'Fleet optimization saves 20% fuel',
        description: 'Routing algorithm reduces fuel consumption by 20%',
        applicable_domains: ['transportation'],
        impact_multiplier: 1.5
      }
    }
  });

  if (process_result.success) {
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
