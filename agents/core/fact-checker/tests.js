/**
 * Tests for Fact Checker
 */

const FactChecker = require('./index.js');

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('FACT CHECKER TESTS');
  console.log('='.repeat(70) + '\n');

  const checker = new FactChecker();
  let passed = 0;
  let failed = 0;

  // TEST 1: Verified facts pass
  console.log('TEST 1: Verified facts');
  checker.registerFact('NuDay has 50K users', 'dashboard_2026-03-20', 'Live user count');
  
  const output1 = {
    agent_name: 'Data Agent',
    claims: ['NuDay has 50K users'],
    recommendation: 'Scale operations'
  };

  const result1 = checker.checkOutput(output1);
  
  if (result1.claims[0].status === 'VERIFIED') {
    passed++;
    console.log(`✅ Verified fact detected: ${result1.claims[0].status}`);
  } else {
    failed++;
    console.log(`❌ Should be VERIFIED`);
  }

  // TEST 2: Contradictions blocked
  console.log('\nTEST 2: Contradictory claims');
  checker.registerContradiction(
    'Cost is $100K',
    'Budget limit is $50K',
    'internal_constraint'
  );

  const output2 = {
    agent_name: 'Cost Agent',
    claims: ['Cost is $100K'],
    recommendation: 'Allocate budget'
  };

  const result2 = checker.checkOutput(output2);

  if (result2.claims[0].status === 'BLOCKED') {
    passed++;
    console.log(`✅ Contradiction detected: ${result2.status}`);
  } else {
    failed++;
    console.log(`❌ Should be BLOCKED`);
  }

  // TEST 3: Reasonable claims marked as likely
  console.log('\nTEST 3: Reasonable (likely) claims');
  const output3 = {
    agent_name: 'Project Manager',
    claims: ['Timeline is 8 weeks'],
    recommendation: 'Start immediately'
  };

  const result3 = checker.checkOutput(output3);

  if (result3.claims[0].status === 'LIKELY') {
    passed++;
    console.log(`✅ Reasonable claim: ${result3.claims[0].status} (${result3.claims[0].confidence}%)`);
  } else {
    failed++;
    console.log(`❌ Should be LIKELY`);
  }

  // TEST 4: Red flags detected
  console.log('\nTEST 4: Red flag detection');
  const output4 = {
    agent_name: 'Optimist Agent',
    claims: ['This will definitely succeed with 100% certainty'],
    recommendation: 'Go full speed'
  };

  const result4 = checker.checkOutput(output4);

  if (result4.status === 'BLOCK' || result4.claims[0].status === 'BLOCKED') {
    passed++;
    console.log(`✅ Red flags blocked: ${result4.status}`);
  } else {
    failed++;
    console.log(`❌ Should block unrealistic claim`);
  }

  // TEST 5: Qualifiers recognized
  console.log('\nTEST 5: Confidence qualifiers');
  const output5 = {
    agent_name: 'Analyst',
    claims: [
      'Market size is approximately $1B',
      'Growth is estimated at 20% yearly'
    ]
  };

  const result5 = checker.checkOutput(output5);
  const qualified_claims = result5.claims.filter(c => c.notes.length > 0);

  if (qualified_claims.length > 0) {
    passed++;
    console.log(`✅ Qualifiers recognized: ${qualified_claims.length} claims`);
  } else {
    failed++;
    console.log(`❌ Should recognize qualifiers`);
  }

  // TEST 6: Unverified facts marked
  console.log('\nTEST 6: Unverified claims marked');
  const output6 = {
    agent_name: 'Speculator',
    claims: ['BetterRide will have 1M users next year'],
    recommendation: 'Invest heavily'
  };

  const result6 = checker.checkOutput(output6);

  if (result6.claims[0].status === 'UNVERIFIED') {
    passed++;
    console.log(`✅ Unverified claim: ${result6.claims[0].status}`);
  } else {
    failed++;
    console.log(`❌ Should mark as UNVERIFIED`);
  }

  // TEST 7: Critical unverified claims block
  console.log('\nTEST 7: Critical claims must be verified');
  const output7 = {
    agent_name: 'Executive',
    recommendation: 'Launch product immediately',  // Critical
    claims: []
  };

  const result7 = checker.checkOutput(output7);

  // Recommendation is always critical
  if (result7.status === 'BLOCK' || result7.recommendation.includes('WARNINGS')) {
    passed++;
    console.log(`✅ Critical claim handling: ${result7.status}`);
  } else {
    failed++;
    console.log(`❌ Should warn about unverified critical claim`);
  }

  // TEST 8: Process interface
  console.log('\nTEST 8: Process interface');
  const output8 = {
    agent_name: 'Test Agent',
    claims: ['Test claim'],
    recommendation: 'Test action'
  };

  const process_result = await checker.process({
    action: 'check',
    data: { output: output8 }
  });

  if (process_result.success) {
    passed++;
    console.log(`✅ Process interface works`);
  } else {
    failed++;
    console.log(`❌ Process failed`);
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
