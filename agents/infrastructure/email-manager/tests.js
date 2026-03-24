/**
 * EMAIL MANAGER TESTS
 */

const EmailManagerAgent = require('./index');

async function runTests() {
  const emailManager = new EmailManagerAgent();
  let passed = 0;
  let failed = 0;

  console.log('\n=== EMAIL MANAGER AGENT TESTS ===\n');

  // TEST 1: Parse Email
  console.log('TEST 1: Parse email');
  try {
    const result = await emailManager.process({
      action: 'parse',
      data: {
        from: 'tamir@audi.com',
        to: 'tamir@tmd.local',
        subject: 'URGENT: Interior Design Project Quote Needed',
        body: 'We need a quote for the new A8 interior redesign. Timeline is tight - deadline is June 30.',
        attachments: ['specifications.pdf', 'reference_images.zip']
      }
    });

    if (result.success && result.email_id) {
      console.log('✅ PASS - Email parsed:', result.email_id);
      passed++;
      global.testEmailId = result.email_id;
    } else {
      console.log('❌ FAIL - Could not parse email');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 2: Prioritize Email
  console.log('\nTEST 2: Prioritize email');
  try {
    const result = await emailManager.process({
      action: 'prioritize',
      data: {
        email_id: global.testEmailId
      }
    });

    if (result.success && result.priority === 'critical') {
      console.log('✅ PASS - Email prioritized as critical (score:', result.score + ')');
      passed++;
    } else {
      console.log('❌ FAIL - Could not prioritize email or priority not critical');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 3: Route Email
  console.log('\nTEST 3: Route email');
  try {
    const result = await emailManager.process({
      action: 'route',
      data: {
        email_id: global.testEmailId
      }
    });

    if (result.success && result.suggested_route === 'quote_generator') {
      console.log('✅ PASS - Email routed to quote_generator');
      passed++;
    } else {
      console.log('❌ FAIL - Could not route email correctly');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 4: Parse and Route Project Email
  console.log('\nTEST 4: Parse and route project brief');
  try {
    const parseResult = await emailManager.process({
      action: 'parse',
      data: {
        from: 'client@aerospace.com',
        subject: 'New eVTOL Project Brief',
        body: 'Please provide design specifications for our new eVTOL concept. Project budget: $2M, timeline: 6 months.',
        attachments: ['brief.docx']
      }
    });

    const emailId = parseResult.email_id;

    const routeResult = await emailManager.process({
      action: 'route',
      data: { email_id: emailId }
    });

    if (routeResult.success && routeResult.suggested_route === 'project_tracker') {
      console.log('✅ PASS - Project email routed to project_tracker');
      passed++;
    } else {
      console.log('❌ FAIL - Could not route project email');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 5: List Unread Emails
  console.log('\nTEST 5: List unread emails');
  try {
    const result = await emailManager.process({
      action: 'list_unread'
    });

    if (result.success && result.total_unread >= 2) {
      console.log('✅ PASS - Found', result.total_unread, 'unread emails');
      console.log('   Top priority:', result.emails[0]?.priority);
      passed++;
    } else {
      console.log('❌ FAIL - Could not list unread emails');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 6: Archive Email
  console.log('\nTEST 6: Archive email');
  try {
    const result = await emailManager.process({
      action: 'archive',
      data: {
        email_id: global.testEmailId
      }
    });

    if (result.success && result.archived_at) {
      console.log('✅ PASS - Email archived');
      passed++;
    } else {
      console.log('❌ FAIL - Could not archive email');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 7: Different Routing Based on Content
  console.log('\nTEST 7: Routing to vendor manager');
  try {
    const parseResult = await emailManager.process({
      action: 'parse',
      data: {
        from: 'supplier@materials.com',
        subject: 'Carbon Fiber Supplier Quote',
        body: 'Here is our quote for carbon fiber components. Purchase order terms attached.',
        attachments: ['quote.pdf']
      }
    });

    const routeResult = await emailManager.process({
      action: 'route',
      data: { email_id: parseResult.email_id }
    });

    if (routeResult.success && routeResult.suggested_route === 'vendor_manager') {
      console.log('✅ PASS - Supplier email routed to vendor_manager');
      passed++;
    } else {
      console.log('❌ FAIL - Could not route vendor email correctly');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 8: Missing Required Fields
  console.log('\nTEST 8: Missing required fields');
  try {
    const result = await emailManager.process({
      action: 'parse',
      data: {
        from: 'test@example.com'
        // Missing subject and body
      }
    });

    if (!result.success && result.error) {
      console.log('✅ PASS - Missing fields rejected correctly');
      passed++;
    } else {
      console.log('❌ FAIL - Missing fields not caught');
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
