/**
 * Tests for Excellence Enforcement (Anti-Mediocrity Governor)
 */

const ExcellenceEnforcer = require('./index.js');

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('EXCELLENCE ENFORCEMENT TESTS');
  console.log('='.repeat(70) + '\n');

  const enforcer = new ExcellenceEnforcer();
  let passed = 0;
  let failed = 0;

  // TEST 1: Mission-critical work (9.5+ required)
  console.log('TEST 1: Mission-critical work (eVTOL safety)');
  const mission_critical = enforcer.evaluateWork({
    id: 'work1',
    venture_id: 'air',
    type: 'mission_critical',
    quality_score: 9.8,
    description: 'eVTOL safety system'
  });

  if (mission_critical.status === 'APPROVED' && mission_critical.score_received >= 9.5) {
    passed++;
    console.log(`✅ World-class work APPROVED (${mission_critical.score_received}/10)`);
  } else {
    failed++;
    console.log(`❌ Should be approved`);
  }

  // TEST 2: Mission-critical below threshold
  console.log('\nTEST 2: Mission-critical below threshold (8.5/10)');
  const mission_weak = enforcer.evaluateWork({
    id: 'work2',
    venture_id: 'any1',
    type: 'mission_critical',
    quality_score: 8.5,
    description: 'Health access tool (insufficient)'
  });

  if (mission_weak.status === 'REJECTED' && mission_weak.gap <= -1) {
    passed++;
    console.log(`✅ Weak mission-critical work REJECTED`);
    console.log(`   Gap: ${mission_weak.gap.toFixed(2)} points below 9.5/10`);
  } else {
    failed++;
    console.log(`❌ Should reject weak mission-critical (got ${mission_weak.status})`);
  }

  // TEST 3: Standard work (9.0+ required)
  console.log('\nTEST 3: Standard work (Design Expert)');
  const standard_good = enforcer.evaluateWork({
    id: 'work3',
    venture_id: 'tmd',
    type: 'standard',
    quality_score: 9.2,
    description: 'Interior design'
  });

  if (standard_good.status === 'APPROVED' && standard_good.score_received >= 9.0) {
    passed++;
    console.log(`✅ Good standard work APPROVED (${standard_good.score_received}/10)`);
  } else {
    failed++;
    console.log(`❌ Should approve good standard work`);
  }

  // TEST 4: Infrastructure work (7.0+ required)
  console.log('\nTEST 4: Infrastructure work (Internal tool)');
  const infra_ok = enforcer.evaluateWork({
    id: 'work4',
    venture_id: 'sys',
    type: 'infrastructure',
    quality_score: 7.5,
    description: 'Monitoring dashboard'
  });

  if (infra_ok.status === 'APPROVED') {
    passed++;
    console.log(`✅ Acceptable infrastructure APPROVED (${infra_ok.score_received}/10)`);
  } else {
    failed++;
    console.log(`❌ Infrastructure should pass at 7.5`);
  }

  // TEST 5: Needs revision (borderline)
  console.log('\nTEST 5: Borderline work (needs revision)');
  const borderline = enforcer.evaluateWork({
    id: 'work5',
    venture_id: 'nday',
    type: 'standard',
    quality_score: 8.6,
    description: 'Wellness algorithm'
  });

  if (borderline.status === 'NEEDS_REVISION') {
    passed++;
    console.log(`✅ Borderline work flagged for REVISION`);
    console.log(`   Required actions: ${borderline.required_actions.join(', ')}`);
  } else {
    failed++;
    console.log(`❌ Should flag for revision`);
  }

  // TEST 6: Appeal rejected work
  console.log('\nTEST 6: Appeal rejected work');
  const appeal = enforcer.appealDecision('work2', 'Different evaluation criteria should apply');

  if (appeal.success && appeal.status === 'PENDING_REVIEW') {
    passed++;
    console.log(`✅ Valid appeal submitted: ${appeal.appeal_id}`);
  } else {
    failed++;
    console.log(`❌ Appeal should be accepted`);
  }

  // TEST 7: Invalid appeal
  console.log('\nTEST 7: Invalid appeal reasoning');
  const bad_appeal = enforcer.appealDecision('work2', 'We worked really hard');

  if (!bad_appeal.success && bad_appeal.status === 'INSUFFICIENT_REASONING') {
    passed++;
    console.log(`✅ Weak appeal REJECTED`);
    console.log(`   Reason: "${bad_appeal.message}"`);
  } else {
    failed++;
    console.log(`❌ Bad reasoning should be rejected`);
  }

  // TEST 8: Quality statistics
  console.log('\nTEST 8: Quality statistics');
  const stats = enforcer.getQualityStats();

  if (stats.total_submissions >= 5) {
    passed++;
    console.log(`✅ Quality stats computed:`);
    console.log(`   Total: ${stats.total_submissions}`);
    console.log(`   Approved: ${stats.approved} (${stats.approval_rate})`);
    console.log(`   Rejected: ${stats.rejected} (${stats.rejection_rate})`);
    console.log(`   Enforcement: ${stats.enforcement_level}`);
  } else {
    failed++;
    console.log(`❌ Stats invalid`);
  }

  // TEST 9: Process interface
  console.log('\nTEST 9: Process interface');
  const process_result = await enforcer.process({
    action: 'evaluate_work',
    data: {
      submission: {
        id: 'test-work',
        venture_id: 'test',
        type: 'standard',
        quality_score: 9.3,
        description: 'Test submission'
      }
    }
  });

  if (process_result.success && process_result.decision.status === 'APPROVED') {
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
