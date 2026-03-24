/**
 * Tests for Agent Validator
 */

const AgentValidator = require('./index.js');

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('AGENT VALIDATOR TESTS');
  console.log('='.repeat(70) + '\n');

  const validator = new AgentValidator();
  let passed = 0;
  let failed = 0;

  // TEST 1: Valid output passes all checks
  console.log('TEST 1: Valid agent output (all checks pass)');
  const valid_output = {
    agent_name: 'Cost Analyzer',
    id: 'out-1',
    recommendation: 'Project costs $100K with 20% margin',
    claims: ['Project scope: 6 months', 'Team: 5 engineers'],
    plan: ['Month 1-2: Design', 'Month 3-6: Execution'],
    rationale: 'Based on historical data from similar projects'
  };

  const result1 = validator.validate(valid_output, {
    previous_outputs: [],
    allocated_resources: { budget: 200000 }
  });

  if (result1.status === 'VALIDATED') {
    passed++;
    console.log(`✅ Valid output: ${result1.status}`);
  } else {
    failed++;
    console.log(`❌ Should be VALIDATED (got ${result1.status})`);
  }

  // TEST 2: Logical error detected
  console.log('\nTEST 2: Self-contradicting claims');
  const error_output = {
    agent_name: 'Design Agent',
    id: 'out-2',
    recommendation: 'Launch immediately',
    claims: [
      'Project is ready to launch',
      'Project has critical issues that must be fixed'
    ],
    plan: []
  };

  const result2 = validator.validate(error_output, {});

  if (result2.checks.error_check.status !== 'PASS') {
    passed++;
    console.log(`✅ Error detected: ${result2.status}`);
  } else {
    failed++;
    console.log(`❌ Should detect contradiction`);
  }

  // TEST 3: Conflict with another agent
  console.log('\nTEST 3: Conflict between agents');
  const agent1_output = {
    agent_name: 'Cost Agent',
    recommendation: 'Use expensive solution ($200K)',
    claims: [],
    resources: { budget: 200000 }
  };

  const agent2_output = {
    agent_name: 'Efficiency Agent',
    recommendation: 'Use cheap solution ($50K)',
    claims: [],
    resources: { budget: 50000 }
  };

  const result3 = validator.validate(agent2_output, {
    previous_outputs: [agent1_output],
    allocated_resources: { budget: 100000 }
  });

  if (result3.checks.conflict_check.status === 'FLAGGED') {
    passed++;
    console.log(`✅ Conflict detected: ${result3.status}`);
  } else {
    failed++;
    console.log(`❌ Should detect conflict`);
  }

  // TEST 4: Resource conflict
  console.log('\nTEST 4: Resource conflict (over-allocated)');
  const resource_output = {
    agent_name: 'Project Manager',
    recommendation: 'Allocate 150K budget',
    resources: { budget: 150000 }
  };

  const result4 = validator.validate(resource_output, {
    allocated_resources: { budget: 100000 }
  });

  if (result4.checks.conflict_check.status === 'BLOCKED') {
    passed++;
    console.log(`✅ Resource conflict blocked: ${result4.status}`);
  } else {
    failed++;
    console.log(`❌ Should block resource overallocation`);
  }

  // TEST 5: Unverified facts
  console.log('\nTEST 5: Fact verification');
  validator.registerFact('NuDay has 50K users', true, 'internal_data');

  const fact_output = {
    agent_name: 'Data Analyst',
    claims: [
      'NuDay has 50K users',  // Will be verified
      'BetterRide has 100K users'  // Will be unverified
    ]
  };

  const result5 = validator.validate(fact_output, {});

  const verified = result5.checks.fact_check.issues.filter(i => i.status === 'VERIFIED');
  const unverified = result5.checks.fact_check.issues.filter(i => i.type === 'unverified_claim');

  if (verified.length > 0 && unverified.length > 0) {
    passed++;
    console.log(`✅ Fact check mixed: ${verified.length} verified, ${unverified.length} unverified`);
  } else {
    failed++;
    console.log(`❌ Should have mixed verified/unverified`);
  }

  // TEST 6: Missing documentation
  console.log('\nTEST 6: Procedure violation (missing documentation)');
  const undoc_output = {
    agent_name: 'Execution Agent',
    recommendation: 'Kill project',
    // No rationale - missing documentation
    decision_level: 3
  };

  const result6 = validator.validate(undoc_output, {
    required_escalation: 5
  });

  if (result6.checks.process_check.status === 'FLAGGED') {
    passed++;
    console.log(`✅ Missing documentation detected: ${result6.status}`);
  } else {
    failed++;
    console.log(`❌ Should flag missing documentation`);
  }

  // TEST 7: Escalation violation
  console.log('\nTEST 7: Escalation violation (insufficient authority)');
  const escalation_output = {
    agent_name: 'Cost Agent',
    recommendation: 'Kill $500K project',
    decision_level: 2,  // Agent level, but needs Tamir level (5)
    rationale: 'Cost too high'
  };

  const result7 = validator.validate(escalation_output, {
    required_escalation: 5
  });

  if (result7.checks.process_check.status === 'BLOCKED') {
    passed++;
    console.log(`✅ Escalation violation blocked: ${result7.status}`);
  } else {
    failed++;
    console.log(`❌ Should block insufficient authority`);
  }

  // TEST 8: Bias detection
  console.log('\nTEST 8: Conflict of interest (self-recommendation)');
  const bias_output = {
    agent_name: 'Cost Analyzer',
    recommendation: 'Use Cost Analyzer system for all estimates',
    claims: [],
    rationale: 'Most accurate'
  };

  const result8 = validator.validate(bias_output, {});

  if (result8.checks.interest_check.status === 'FLAGGED') {
    passed++;
    console.log(`✅ Bias detected: ${result8.status}`);
  } else {
    failed++;
    console.log(`❌ Should detect self-recommendation bias`);
  }

  // TEST 9: Process interface
  console.log('\nTEST 9: Process interface');
  const process_result = await validator.process({
    action: 'validate',
    data: {
      output: valid_output,
      context: {}
    }
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
