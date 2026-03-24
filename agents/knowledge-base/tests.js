/**
 * KNOWLEDGE BASE TESTS
 */

const KnowledgeBaseAgent = require('./index');

async function runTests() {
  // Use dummy API key for testing
  const kb = new KnowledgeBaseAgent('dummy_key_for_testing');
  let passed = 0;
  let failed = 0;

  console.log('\n=== KNOWLEDGE BASE AGENT TESTS ===\n');

  // TEST 1: Store Project
  console.log('TEST 1: Store project in knowledge base');
  try {
    const result = await kb.process({
      action: 'store_project',
      data: {
        project_id: 'AUT-2025-001',
        client: 'Audi AG',
        domain: 'automotive',
        brief: 'Interior redesign for A8 model',
        outcome: 'Delivered premium interior with 15% cost reduction',
        cost: 500000,
        timeline: 12
      }
    });

    if (result.success && result.project_id) {
      console.log('✅ PASS - Project stored');
      passed++;
    } else {
      console.log('❌ FAIL - Could not store project');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 2: Store Multiple Projects
  console.log('\nTEST 2: Store multiple projects');
  try {
    await kb.process({
      action: 'store_project',
      data: {
        project_id: 'AER-2025-001',
        client: 'Airbus',
        domain: 'aerospace',
        brief: 'eVTOL fuselage design',
        outcome: 'FAA-certified design completed ahead of schedule'
      }
    });

    await kb.process({
      action: 'store_project',
      data: {
        project_id: 'MAR-2025-001',
        client: 'Ship Dynamics',
        domain: 'marine',
        brief: 'Hull optimization',
        outcome: 'Hydrodynamic efficiency improved 8%'
      }
    });

    const stats = await kb.process({
      action: 'get_stats'
    });

    if (stats.total_projects === 3) {
      console.log('✅ PASS - 3 projects stored');
      console.log('   Domains:', Object.keys(stats.projects_by_domain).join(', '));
      passed++;
    } else {
      console.log('❌ FAIL - Wrong project count');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 3: Query Knowledge Base
  console.log('\nTEST 3: Query knowledge base by text');
  try {
    const result = await kb.process({
      action: 'query',
      data: {
        query_text: 'automotive interior design',
        limit: 5
      }
    });

    if (result.success && result.results_count >= 1) {
      console.log('✅ PASS - Query found', result.results_count, 'results');
      if (result.results[0]) {
        console.log('   Top match:', result.results[0].client);
      }
      passed++;
    } else {
      console.log('❌ FAIL - Query returned no results');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 4: Search Similar Projects
  console.log('\nTEST 4: Search for similar projects by domain');
  try {
    const result = await kb.process({
      action: 'search_similar',
      data: {
        domain: 'automotive',
        limit: 5
      }
    });

    if (result.success && result.similar_projects.length >= 1) {
      console.log('✅ PASS - Found', result.similar_projects.length, 'automotive projects');
      passed++;
    } else {
      console.log('❌ FAIL - Could not find similar projects');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 5: Extract Lessons
  console.log('\nTEST 5: Extract lessons from completed project');
  try {
    const result = await kb.process({
      action: 'extract_lessons',
      data: {
        project_id: 'AUT-2025-001',
        what_worked: 'Modular design approach allowed parallel development',
        what_failed: 'Initial material selection was too expensive',
        improvements: [
          'Use composite materials for cost reduction',
          'Implement value engineering earlier in process',
          'Better vendor communication'
        ]
      }
    });

    if (result.success && result.lesson_id) {
      console.log('✅ PASS - Lesson extracted:', result.lesson_id);
      console.log('   Total lessons:', result.lesson_count);
      passed++;
    } else {
      console.log('❌ FAIL - Could not extract lesson');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 6: Multiple Domain Query
  console.log('\nTEST 6: Query with domain filter');
  try {
    const result = await kb.process({
      action: 'query',
      data: {
        query_text: 'design engineering',
        domain: 'aerospace',
        limit: 5
      }
    });

    if (result.success) {
      console.log('✅ PASS - Domain-filtered query completed');
      console.log('   Found:', result.results_count, 'results');
      passed++;
    } else {
      console.log('❌ FAIL - Domain filter failed');
      failed++;
    }
  } catch (error) {
    console.log('❌ FAIL -', error.message);
    failed++;
  }

  // TEST 7: Get Stats
  console.log('\nTEST 7: Get knowledge base statistics');
  try {
    const result = await kb.process({
      action: 'get_stats'
    });

    if (result.success && result.total_projects >= 3) {
      console.log('✅ PASS - Stats retrieved');
      console.log('   Projects:', result.total_projects);
      console.log('   Lessons:', result.total_lessons);
      console.log('   By domain:', JSON.stringify(result.projects_by_domain));
      passed++;
    } else {
      console.log('❌ FAIL - Could not get stats');
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
