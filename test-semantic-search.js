/**
 * Test Semantic Search in Knowledge Base
 */

const KnowledgeBaseAgent = require('./agents/knowledge-base');

async function testSemanticSearch() {
  console.log('\n' + '='.repeat(70));
  console.log('SEMANTIC SEARCH TEST');
  console.log('='.repeat(70) + '\n');

  const kb = new KnowledgeBaseAgent();

  // Store sample projects
  console.log('📦 Storing sample projects...\n');

  const projects = [
    {
      project_id: 'nuday-mvp',
      client: 'NuDay',
      domain: 'health behavior change platform',
      brief: 'Weight loss prevention using behavioral nudges',
      outcome: 'Reached 50K users in 6 months',
      cost: 500000,
      timeline: 6
    },
    {
      project_id: 'betterride-app',
      client: 'BetterRide',
      domain: 'driver safety and behavior improvement',
      brief: 'Mobile app for monitoring driver behavior',
      outcome: 'Deployed to 1000 drivers, 20% safety improvement',
      cost: 300000,
      timeline: 4
    },
    {
      project_id: 'air-evtol',
      client: 'AIR',
      domain: 'electric vertical takeoff aircraft',
      brief: 'Design and build prototype eVTOL aircraft',
      outcome: 'Prototype completed, FAA evaluation pending',
      cost: 2000000,
      timeline: 18
    },
    {
      project_id: 'reev-platform',
      client: 'REEV',
      domain: 'real estate technology',
      brief: 'Virtual tour platform for property inspection',
      outcome: 'Used by 50 agents, $200K ARR',
      cost: 150000,
      timeline: 3
    },
    {
      project_id: 'incare-health',
      client: 'InCare',
      domain: 'healthcare outcomes platform',
      brief: 'Patient behavior monitoring for chronic disease',
      outcome: 'Hospital pilot with 500 patients completed',
      cost: 400000,
      timeline: 8
    }
  ];

  for (const project of projects) {
    const result = await kb.storeProject(project);
    if (result.success) {
      console.log(`✅ ${project.client}: ${project.domain}`);
    } else {
      console.log(`❌ ${project.client}: ${result.error}`);
    }
  }

  console.log('\n' + '-'.repeat(70) + '\n');

  // Test 1: Search for similar health platform
  console.log('TEST 1: Search for health behavior change projects\n');
  const healthQuery = 'health behavior change platform for weight management';
  const healthResults = await kb.semanticSearch(healthQuery, 3);

  if (healthResults.length > 0) {
    console.log(`Found ${healthResults.length} similar project(s):\n`);
    healthResults.forEach((result, i) => {
      console.log(`${i + 1}. ${result.client} - ${result.domain}`);
      console.log(`   Similarity: ${(result.similarity * 100).toFixed(1)}%`);
      console.log(`   Brief: ${result.brief.substring(0, 60)}...\n`);
    });
  } else {
    console.log('No similar projects found\n');
  }

  console.log('-'.repeat(70) + '\n');

  // Test 2: Search for driver safety
  console.log('TEST 2: Search for driver/safety projects\n');
  const driverQuery = 'driver safety behavior monitoring app';
  const driverResults = await kb.semanticSearch(driverQuery, 3);

  if (driverResults.length > 0) {
    console.log(`Found ${driverResults.length} similar project(s):\n`);
    driverResults.forEach((result, i) => {
      console.log(`${i + 1}. ${result.client} - ${result.domain}`);
      console.log(`   Similarity: ${(result.similarity * 100).toFixed(1)}%\n`);
    });
  } else {
    console.log('No similar projects found\n');
  }

  console.log('-'.repeat(70) + '\n');

  // Test 3: Verify claim using semantic search
  console.log('TEST 3: Verify claim "We can build health platform in 3 months"\n');
  const claim = 'Health platform development timeline 3 months behavior change';
  const verification = await kb.verifyClaim(claim);

  console.log(`Verification Status: ${verification.status}`);
  console.log(`Confidence: ${verification.top_similarity ? (verification.top_similarity * 100).toFixed(1) + '%' : 'N/A'}`);
  console.log(`Reason: ${verification.reason}\n`);

  if (verification.similar_projects && verification.similar_projects.length > 0) {
    console.log('Relevant past projects:');
    verification.similar_projects.slice(0, 2).forEach(proj => {
      console.log(`  • ${proj.client} (${proj.timeline} months): ${proj.outcome}`);
    });
  }

  console.log('\n' + '-'.repeat(70) + '\n');

  // Test 4: Claim verification with cross-domain similarity
  console.log('TEST 4: Cross-domain search "AI-powered mobile app"\n');
  const crossDomainQuery = 'AI-powered mobile application for user behavior';
  const crossResults = await kb.semanticSearch(crossDomainQuery, 5);

  console.log(`Found ${crossResults.length} projects:\n`);
  crossResults.forEach((result, i) => {
    console.log(`${i + 1}. ${result.client}`);
    console.log(`   Domain: ${result.domain}`);
    console.log(`   Similarity: ${(result.similarity * 100).toFixed(1)}%\n`);
  });

  console.log('='.repeat(70) + '\n');
}

testSemanticSearch().catch(err => console.error('Error:', err));
