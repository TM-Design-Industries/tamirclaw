const MarineSpecialist = require('./index');

async function runTests() {
  const specialist = new MarineSpecialist('dummy');
  let passed = 0, failed = 0;

  console.log('\n=== MARINE SPECIALIST TESTS ===\n');

  try {
    const result = await specialist.process({
      action: 'analyze_project',
      data: {brief: 'Hull optimization for cargo ship', target_market: 'cargo'}
    });
    if (result.success && result.feasibility === 'HIGH') {
      console.log('✅ TEST 1: Project analysis - PASS');
      passed++;
    } else {
      console.log('❌ TEST 1: FAIL');
      failed++;
    }
  } catch (e) {
    console.log('❌ TEST 1: ERROR -', e.message);
    failed++;
  }

  try {
    const result = await specialist.process({
      action: 'regulatory_check',
      data: {region: 'IMO'}
    });
    if (result.success && result.certifications.length > 0) {
      console.log('✅ TEST 2: Regulatory check - PASS');
      passed++;
    } else {
      console.log('❌ TEST 2: FAIL');
      failed++;
    }
  } catch (e) {
    console.log('❌ TEST 2: ERROR -', e.message);
    failed++;
  }

  try {
    const result = await specialist.process({
      action: 'vendor_recommendation',
      data: {component_type: 'propulsion'}
    });
    if (result.success && result.recommended_vendors.length > 0) {
      console.log('✅ TEST 3: Vendor recommendation - PASS');
      passed++;
    } else {
      console.log('❌ TEST 3: FAIL');
      failed++;
    }
  } catch (e) {
    console.log('❌ TEST 3: ERROR -', e.message);
    failed++;
  }

  try {
    const result = await specialist.process({
      action: 'analyze_project',
      data: {brief: 'Offshore support vessel', target_market: 'offshore'}
    });
    if (result.success && result.analysis.margin === '35%') {
      console.log('✅ TEST 4: Offshore margin - PASS');
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
