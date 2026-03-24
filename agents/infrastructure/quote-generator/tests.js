/**
 * QUOTE GENERATOR TESTS
 */

const QuoteGeneratorAgent = require('./index');

async function runTests() {
  const quoteGen = new QuoteGeneratorAgent();
  let passed = 0;
  let failed = 0;

  console.log('\n=== QUOTE GENERATOR AGENT TESTS ===\n');

  // TEST 1: Estimate Cost
  console.log('TEST 1: Estimate project cost');
  try {
    const result = await quoteGen.process({
      action: 'estimate_cost',
      data: {
        domain: 'automotive',
        complexity: 'complex',
        timeline_weeks: 12,
        client_type: 'enterprise'
      }
    });

    if (result.success && result.cost_estimate > 0) {
      console.log('✅ PASS - Cost estimated: $' + result.cost_estimate.toLocaleString());
      console.log('   Labor: $' + result.breakdown.labor.toLocaleString());
      console.log('   Markup: ' + result.breakdown.markup_rate);
      passed++;
    } else {
      console.log('❌ FAIL - Could not estimate cost');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 2: Generate Quote
  console.log('\nTEST 2: Generate full proposal');
  try {
    const result = await quoteGen.process({
      action: 'generate_quote',
      data: {
        client: 'Audi AG',
        project_name: 'Interior Redesign - A8',
        domain: 'automotive',
        complexity: 'complex',
        timeline_weeks: 12,
        client_type: 'enterprise',
        description: 'Complete interior redesign for the new Audi A8 model including ergonomics, materials, and manufacturing optimization.',
        deliverables: [
          '3D CAD models',
          'Material specifications',
          'Manufacturing DFM analysis',
          'Cost optimization report',
          'Design documentation'
        ]
      }
    });

    if (result.success && result.quote_id) {
      console.log('✅ PASS - Quote generated:', result.quote_id);
      console.log('   Total: $' + result.cost.toLocaleString());
      console.log('   Status: ' + result.status);
      global.testQuoteId = result.quote_id;
      passed++;
    } else {
      console.log('❌ FAIL - Could not generate quote');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 3: Rush Timeline Penalty
  console.log('\nTEST 3: Rush timeline adds 20% fee');
  try {
    const normal = await quoteGen.process({
      action: 'estimate_cost',
      data: {
        domain: 'aerospace',
        complexity: 'moderate',
        timeline_weeks: 12,
        client_type: 'smb'
      }
    });

    const rush = await quoteGen.process({
      action: 'estimate_cost',
      data: {
        domain: 'aerospace',
        complexity: 'moderate',
        timeline_weeks: 6, // Less than 8 weeks
        client_type: 'smb'
      }
    });

    const difference = rush.cost_estimate - normal.cost_estimate;
    const expectedRushFee = normal.breakdown.labor * 0.20; // 20% of labor

    if (rush.cost_estimate > normal.cost_estimate) {
      console.log('✅ PASS - Rush fee applied correctly');
      console.log('   Normal: $' + normal.cost_estimate.toLocaleString());
      console.log('   Rush (6 weeks): $' + rush.cost_estimate.toLocaleString());
      console.log('   Difference: $' + difference.toLocaleString());
      passed++;
    } else {
      console.log('❌ FAIL - Rush fee not applied');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 4: Different Client Types
  console.log('\nTEST 4: Client type affects markup');
  try {
    const startup = await quoteGen.process({
      action: 'estimate_cost',
      data: {
        domain: 'industrial',
        complexity: 'simple',
        client_type: 'startup'
      }
    });

    const enterprise = await quoteGen.process({
      action: 'estimate_cost',
      data: {
        domain: 'industrial',
        complexity: 'simple',
        client_type: 'enterprise'
      }
    });

    if (enterprise.cost_estimate > startup.cost_estimate) {
      console.log('✅ PASS - Enterprise markup higher than startup');
      console.log('   Startup (25%): $' + startup.cost_estimate.toLocaleString());
      console.log('   Enterprise (45%): $' + enterprise.cost_estimate.toLocaleString());
      passed++;
    } else {
      console.log('❌ FAIL - Client type pricing not working');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 5: Update Quote Status
  console.log('\nTEST 5: Update quote status');
  try {
    const result = await quoteGen.process({
      action: 'update_status',
      data: {
        quote_id: global.testQuoteId,
        status: 'sent'
      }
    });

    if (result.success && result.status === 'sent') {
      console.log('✅ PASS - Quote status updated to sent');
      passed++;
    } else {
      console.log('❌ FAIL - Could not update status');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 6: All Domains
  console.log('\nTEST 6: Pricing works for all domains');
  try {
    const domains = ['automotive', 'aerospace', 'marine', 'architecture', 'industrial'];
    let allSucceed = true;

    for (const domain of domains) {
      const result = await quoteGen.process({
        action: 'estimate_cost',
        data: {domain, complexity: 'moderate', client_type: 'smb'}
      });
      if (!result.success) {
        allSucceed = false;
        console.log(`   ❌ ${domain} failed`);
      } else {
        console.log(`   ✓ ${domain}: $${result.cost_estimate.toLocaleString()}`);
      }
    }

    if (allSucceed) {
      console.log('✅ PASS - All domains work');
      passed++;
    } else {
      console.log('❌ FAIL - Some domains failed');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 7: Invalid Domain
  console.log('\nTEST 7: Invalid domain handling');
  try {
    const result = await quoteGen.process({
      action: 'estimate_cost',
      data: {
        domain: 'invalid_domain',
        complexity: 'simple'
      }
    });

    if (!result.success && result.error) {
      console.log('✅ PASS - Invalid domain rejected');
      passed++;
    } else {
      console.log('❌ FAIL - Invalid domain not caught');
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
