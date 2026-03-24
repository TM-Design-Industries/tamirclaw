/**
 * VEHICLE SPECIALIST TESTS
 */

const VehicleSpecialist = require('./index');

async function runTests() {
  const specialist = new VehicleSpecialist('dummy_key');
  let passed = 0;
  let failed = 0;

  console.log('\n=== VEHICLE SPECIALIST TESTS ===\n');

  // TEST 1: Analyze Project
  console.log('TEST 1: Analyze automotive project');
  try {
    const result = await specialist.process({
      action: 'analyze_project',
      data: {
        brief: 'Premium interior redesign with smart controls',
        timeline: 12,
        budget: 500000,
        target_market: 'luxury'
      }
    });

    if (result.success && result.feasibility === 'HIGH') {
      console.log('✅ PASS - Project analyzed');
      console.log('   Feasibility:', result.feasibility);
      console.log('   Complexity:', result.analysis.complexity);
      passed++;
    } else {
      console.log('❌ FAIL - Could not analyze');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 2: Market Assessment
  console.log('\nTEST 2: Market assessment for segment');
  try {
    const result = await specialist.process({
      action: 'market_assessment',
      data: {
        segment: 'luxury',
        region: 'EU'
      }
    });

    if (result.success && result.competitors.length > 0) {
      console.log('✅ PASS - Market assessed');
      console.log('   Segment:', result.segment);
      console.log('   Margin:', result.margin_potential);
      console.log('   Competitors:', result.competitors.join(', '));
      passed++;
    } else {
      console.log('❌ FAIL - Could not assess market');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 3: Regulatory Check
  console.log('\nTEST 3: Regulatory requirements check');
  try {
    const result = await specialist.process({
      action: 'regulatory_check',
      data: {
        region: 'EU',
        product_type: 'Interior'
      }
    });

    if (result.success && result.certifications.length > 0) {
      console.log('✅ PASS - Regulations retrieved');
      console.log('   Region:', result.region);
      console.log('   Emissions:', result.emissions_standard);
      console.log('   Timeline:', result.estimated_timeline);
      passed++;
    } else {
      console.log('❌ FAIL - Could not get regulations');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 4: Vendor Recommendation
  console.log('\nTEST 4: Vendor recommendation');
  try {
    const result = await specialist.process({
      action: 'vendor_recommendation',
      data: {
        component_type: 'interior_materials',
        volume: 'High (500K+ units/year)',
        quality_level: 'OEM Premium'
      }
    });

    if (result.success && result.recommended_vendors.length > 0) {
      console.log('✅ PASS - Vendors recommended');
      console.log('   Component:', result.component_type);
      console.log('   Vendors:', result.recommended_vendors.join(', '));
      console.log('   Lead time:', result.typical_lead_time);
      passed++;
    } else {
      console.log('❌ FAIL - Could not recommend vendors');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 5: Different Markets
  console.log('\nTEST 5: Different market segments');
  try {
    const luxury = await specialist.process({
      action: 'market_assessment',
      data: {segment: 'luxury'}
    });

    const budget = await specialist.process({
      action: 'market_assessment',
      data: {segment: 'budget'}
    });

    const luxuryMargin = parseFloat(luxury.margin_potential);
    const budgetMargin = parseFloat(budget.margin_potential);

    if (luxuryMargin > budgetMargin) {
      console.log('✅ PASS - Margins vary by segment');
      console.log('   Luxury margin: ' + luxury.margin_potential);
      console.log('   Budget margin: ' + budget.margin_potential);
      passed++;
    } else {
      console.log('❌ FAIL - Margins not realistic');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 6: Different Regions
  console.log('\nTEST 6: Regulatory differences by region');
  try {
    const eu = await specialist.process({
      action: 'regulatory_check',
      data: {region: 'EU'}
    });

    const china = await specialist.process({
      action: 'regulatory_check',
      data: {region: 'China'}
    });

    if (eu.emissions_standard !== china.emissions_standard) {
      console.log('✅ PASS - Different standards by region');
      console.log('   EU:', eu.emissions_standard);
      console.log('   China:', china.emissions_standard);
      passed++;
    } else {
      console.log('❌ FAIL - Standards should differ');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 7: Complexity Assessment
  console.log('\nTEST 7: Project complexity assessment');
  try {
    const simple = await specialist.process({
      action: 'analyze_project',
      data: {
        brief: 'Simple interior trim design',
        target_market: 'budget'
      }
    });

    const complex = await specialist.process({
      action: 'analyze_project',
      data: {
        brief: 'EV interior with autonomous controls and AI integration',
        target_market: 'luxury'
      }
    });

    if (simple.analysis.complexity === 'simple' && complex.analysis.complexity === 'complex') {
      console.log('✅ PASS - Complexity assessed correctly');
      console.log('   Simple brief: ' + simple.analysis.complexity);
      console.log('   Complex brief: ' + complex.analysis.complexity);
      passed++;
    } else {
      console.log('❌ FAIL - Complexity assessment wrong');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // SUMMARY
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}\n`);

  return {
    passed,
    failed,
    total: passed + failed
  };
}

// Run if called directly
if (require.main === module) {
  runTests().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  });
}

module.exports = runTests;
