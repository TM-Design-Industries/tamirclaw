const AircraftSpecialist = require('./index');

async function runTests() {
  const specialist = new AircraftSpecialist('dummy');
  let passed = 0, failed = 0;

  console.log('\n=== AIRCRAFT SPECIALIST TESTS ===\n');

  // TEST 1
  try {
    const result = await specialist.process({
      action: 'analyze_project',
      data: {brief: 'eVTOL fuselage design', target_market: 'evtol'}
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

  // TEST 2
  try {
    const result = await specialist.process({
      action: 'regulatory_check',
      data: {region: 'FAA'}
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

  // TEST 3
  try {
    const result = await specialist.process({
      action: 'vendor_recommendation',
      data: {component_type: 'avionics'}
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

  // TEST 4
  try {
    const result = await specialist.process({
      action: 'analyze_project',
      data: {brief: 'Commercial aircraft interior', target_market: 'commercial'}
    });
    if (result.success && result.analysis.margin === '35%') {
      console.log('✅ TEST 4: Commercial margin - PASS');
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
