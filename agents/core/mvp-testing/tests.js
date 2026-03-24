/**
 * Tests for MVP Testing Framework
 */

const MVPTestingFramework = require('./index.js');

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('MVP TESTING FRAMEWORK TESTS');
  console.log('='.repeat(70) + '\n');

  const framework = new MVPTestingFramework();
  let passed = 0;
  let failed = 0;

  // TEST 1: Start sprint
  console.log('TEST 1: Start 2-week MVP sprint');
  const sprint_result = framework.startSprint({
    name: 'TerraTech AI for Farmers',
    problem_statement: 'Small farmers lack affordable AI tools for crop optimization',
    target_users: 'Farmers in emerging markets',
    estimated_effort: 'medium'
  });

  if (sprint_result.success && sprint_result.sprint_id) {
    passed++;
    console.log(`✅ Sprint started: ${sprint_result.sprint_id}`);
  } else {
    failed++;
    console.log(`❌ Sprint start failed`);
  }

  // TEST 2: Daily standups (simulate 14 days)
  console.log('\nTEST 2: Simulate 14-day sprint with daily standups');
  const standup_data = [
    { day: 1, done: 'Set up development environment + basic structure', blockers: [], feedback: 'n/a', morale: 9 },
    { day: 2, done: 'Build super simple MVP (not polished)', blockers: [], feedback: 'ready for testing', morale: 8 },
    { day: 3, done: 'First 5 farmers test MVP', blockers: [], feedback: 'They want it!', morale: 10 },
    { day: 4, done: 'Iterate based on feedback', blockers: [], feedback: 'Still interested', morale: 9 },
    { day: 5, done: 'Add crop prediction feature', blockers: [], feedback: 'Very useful', morale: 9 },
    { day: 6, done: 'Test with 10 more farmers', blockers: [], feedback: 'Would pay for this', morale: 10 },
    { day: 7, done: 'Data integration for Indian crops', blockers: [], feedback: 'Game changer', morale: 9 },
    { day: 8, done: 'Performance optimization', blockers: ['slow server'], feedback: 'Much better now', morale: 8 },
    { day: 9, done: 'Mobile app version', blockers: [], feedback: 'Love the mobile', morale: 9 },
    { day: 10, done: 'User testing session 3', blockers: [], feedback: 'Ready to pay', morale: 10 },
    { day: 11, done: 'Scaling infrastructure', blockers: [], feedback: 'Can it handle 1000 users?', morale: 8 },
    { day: 12, done: 'Documentation for scaling', blockers: [], feedback: 'Yes, very impressed', morale: 9 },
    { day: 13, done: 'Final polish + bug fixes', blockers: [], feedback: 'Would use today', morale: 9 },
    { day: 14, done: 'Final user interviews', blockers: [], feedback: 'Strong YES', morale: 10 }
  ];

  let standups_passed = 0;
  for (const data of standup_data) {
    const result = framework.dailyStandup(data.day, {
      what_was_done: data.done,
      blockers: data.blockers,
      customer_feedback: data.feedback,
      morale: data.morale
    });

    if (result.success) {
      standups_passed++;
    }
  }

  if (standups_passed === 14) {
    passed++;
    console.log(`✅ All 14 daily standups recorded`);
  } else {
    failed++;
    console.log(`❌ Standup recording failed (${standups_passed}/14)`);
  }

  // TEST 3: Get sprint status
  console.log('\nTEST 3: Get sprint status');
  const status = framework.getSprintStatus();
  if (status.success && status.remaining_days === 0) {
    passed++;
    console.log(`✅ Sprint status: ${status.progress}`);
    console.log(`   Positive feedback: ${status.metrics.positive_feedback}/${status.metrics.total_feedback}`);
  } else {
    failed++;
    console.log(`❌ Status check failed`);
  }

  // TEST 4: Make GO/KILL decision
  console.log('\nTEST 4: Make GO/KILL decision at day 14');
  const decision = framework.makeDecision();
  if (decision.go_or_kill === 'GO') {
    passed++;
    console.log(`✅ DECISION: ${decision.go_or_kill} (confidence: ${decision.confidence})`);
    console.log(`   Score: ${decision.score}/100`);
    console.log(`   Rationale: ${decision.rationale}`);
  } else {
    failed++;
    console.log(`❌ Decision should be GO (was ${decision.go_or_kill})`);
  }

  // TEST 5: Kill scenario
  console.log('\nTEST 5: Simulate failed venture (should KILL)');
  const bad_sprint = framework.startSprint({
    name: 'Failing Venture',
    problem_statement: 'Solving a problem nobody has',
    target_users: 'Unknown market',
    estimated_effort: 'hard'
  });

  const bad_standups = [
    { day: 1, done: 'Started coding', blockers: ['unclear requirements'], feedback: 'no interest', morale: 5 },
    { day: 2, done: 'Struggled all day', blockers: ['scope unclear', 'team confused'], feedback: 'nobody wants this', morale: 3 },
    { day: 3, done: 'Nearly nothing', blockers: ['impossible deadline', 'wrong problem'], feedback: 'bad idea', morale: 2 },
    { day: 4, done: 'Gave up', blockers: ['critical: project unviable'], feedback: 'cancel now', morale: 1 }
  ];

  for (const data of bad_standups) {
    framework.dailyStandup(data.day, {
      what_was_done: data.done,
      blockers: data.blockers,
      customer_feedback: data.feedback,
      morale: data.morale
    });
  }

  const bad_decision = framework.makeDecision();
  if (bad_decision.go_or_kill === 'KILL') {
    passed++;
    console.log(`✅ Bad venture correctly KILLED`);
    console.log(`   Score: ${bad_decision.score}/100`);
  } else {
    failed++;
    console.log(`❌ Should have KILLED (was ${bad_decision.go_or_kill})`);
  }

  // TEST 6: Process interface
  console.log('\nTEST 6: Process interface');
  framework.startSprint({
    name: 'Test Process',
    problem_statement: 'Test',
    target_users: 'Test',
    estimated_effort: 'easy'
  });

  const process_result = await framework.process({
    action: 'daily_standup',
    data: {
      sprint_day: 1,
      progress_update: {
        what_was_done: 'Setup complete',
        blockers: [],
        customer_feedback: 'positive',
        morale: 8
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
