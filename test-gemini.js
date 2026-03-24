/**
 * Test Gemini API Integration
 */

const KnowledgeBaseAgent = require('./agents/knowledge-base');

async function testGemini() {
  console.log('\n' + '='.repeat(70));
  console.log('TESTING GEMINI API INTEGRATION');
  console.log('='.repeat(70) + '\n');

  const geminiApiKey = 'AIzaSyCzxYYoFjz8EN4y8lLeh-_HqxdeBno80t0';
  const kb = new KnowledgeBaseAgent(geminiApiKey);

  console.log('API Key configured: ' + (kb.geminiApiKey ? '✅' : '❌'));
  console.log('Endpoint: ' + kb.geminiEndpoint + '\n');

  // Test 1: Get embedding for text
  console.log('TEST 1: Get embedding for "NuDay health platform"');
  try {
    const embedding = await kb.getEmbedding('NuDay health platform');
    
    if (embedding && embedding.length > 0) {
      console.log(`✅ Embedding received: ${embedding.length} dimensions`);
      console.log(`   First 5 values: [${embedding.slice(0, 5).join(', ')}...]`);
    } else {
      console.log('⚠️  Embedding is empty or failed');
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  // Test 2: Store project with embedding
  console.log('\nTEST 2: Store project with semantic embedding');
  try {
    const result = await kb.storeProject({
      id: 'test-nuday',
      client: 'NuDay',
      description: 'Health behavior change platform for weight loss prevention',
      budget: 500000,
      timeline: 12,
      status: 'active'
    });

    if (result.success) {
      console.log(`✅ Project stored: ${result.project_id}`);
      console.log(`   Embedding created: ${result.embedding_dim} dimensions`);
    } else {
      console.log(`❌ Failed: ${result.error}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  // Test 3: Semantic search
  console.log('\nTEST 3: Semantic search for similar projects');
  try {
    const results = await kb.semanticSearch('health platform with behavior change');
    
    if (results && results.length > 0) {
      console.log(`✅ Found ${results.length} similar project(s)`);
      results.forEach((project, i) => {
        console.log(`   ${i + 1}. ${project.client} - ${project.description.substring(0, 50)}...`);
      });
    } else {
      console.log('ℹ️  No similar projects found yet (database empty)');
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  console.log('\n' + '='.repeat(70) + '\n');
}

testGemini().catch(err => console.error('Fatal error:', err));
