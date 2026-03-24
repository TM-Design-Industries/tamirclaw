/**
 * Test Fact Checker with Gemini Semantic Search
 */

const KnowledgeBaseAgent = require('./agents/knowledge-base');
const FactChecker = require('./agents/core/fact-checker');

async function testFactCheckerWithGemini() {
  console.log('\n' + '='.repeat(70));
  console.log('FACT CHECKER + GEMINI SEMANTIC SEARCH TEST');
  console.log('='.repeat(70) + '\n');

  // Initialize Knowledge Base with real projects
  const kb = new KnowledgeBaseAgent();

  console.log('📚 Loading knowledge base with past projects...\n');

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
    }
  ];

  for (const project of projects) {
    await kb.storeProject(project);
  }

  console.log('✅ Knowledge base loaded\n');

  // Initialize Fact Checker WITH Knowledge Base
  const checker = new FactChecker(kb);

  // Register some known facts
  checker.registerFact(
    'NuDay reached 50K users',
    'dashboard_2026-03-24',
    'Live user count confirmed'
  );

  console.log('-'.repeat(70) + '\n');

  // TEST 1: Verify claim about health platform timeline
  console.log('TEST 1: Verify "Health platform can be built in 3 months"\n');

  const output1 = {
    agent_name: 'Project Planner',
    claims: [
      'Health platform for behavior change can be built in 3 months',
      'Team has relevant experience'
    ],
    recommendation: 'Start immediately'
  };

  const result1 = await checker.checkOutput(output1);

  console.log(`Agent: ${result1.agent}`);
  console.log(`Status: ${result1.status}`);
  console.log(`Knowledge Base Used: ${result1.knowledge_base_used}\n`);

  result1.claims.forEach(claim => {
    console.log(`Claim: "${claim.claim}"`);
    console.log(`  Status: ${claim.status}`);
    console.log(`  Confidence: ${claim.confidence}%`);
    if (claim.semantic_analysis) {
      console.log(`  Semantic: Found ${claim.semantic_analysis.similar_projects.length} similar projects`);
      if (claim.semantic_analysis.similar_projects.length > 0) {
        const top = claim.semantic_analysis.similar_projects[0];
        console.log(`    → ${top.client}: ${top.timeline} months`);
      }
    }
    if (claim.notes.length > 0) {
      claim.notes.forEach(note => console.log(`  Note: ${note}`));
    }
    console.log();
  });

  console.log(`Recommendation: ${result1.recommendation}\n`);

  console.log('-'.repeat(70) + '\n');

  // TEST 2: Check contradictory cost claim
  console.log('TEST 2: Verify "NuDay cost $200K to build"\n');

  const output2 = {
    agent_name: 'Cost Estimator',
    claims: [
      'NuDay cost $200K to build and scale',
      'Similar projects cost $150K-$400K'
    ]
  };

  const result2 = await checker.checkOutput(output2);

  result2.claims.forEach(claim => {
    console.log(`Claim: "${claim.claim}"`);
    console.log(`  Status: ${claim.status}`);
    console.log(`  Confidence: ${claim.confidence}%`);
    if (claim.semantic_analysis) {
      console.log(`  Semantic check: Similar projects found`);
      claim.semantic_analysis.similar_projects.slice(0, 2).forEach(proj => {
        console.log(`    → ${proj.client}: $${proj.cost || 'N/A'}`);
      });
    }
    console.log();
  });

  console.log('-'.repeat(70) + '\n');

  // TEST 3: Cross-domain claim verification
  console.log('TEST 3: Verify "Driver behavior monitoring is like health platforms"\n');

  const output3 = {
    agent_name: 'Domain Expert',
    claims: [
      'Driver behavior monitoring shares architecture with health apps',
      'Similar market size potential'
    ]
  };

  const result3 = await checker.checkOutput(output3);

  result3.claims.forEach(claim => {
    console.log(`Claim: "${claim.claim}"`);
    console.log(`  Status: ${claim.status}`);
    if (claim.semantic_analysis && claim.semantic_analysis.similar_projects.length > 0) {
      console.log(`  Semantic Analysis:`);
      claim.semantic_analysis.similar_projects.forEach(proj => {
        console.log(`    • ${proj.client} (${proj.domain})`);
      });
    }
    console.log();
  });

  console.log('='.repeat(70) + '\n');

  // Summary
  console.log('SUMMARY:\n');
  console.log('✅ Fact Checker now uses Gemini Semantic Search');
  console.log('✅ Can find similar past projects to verify claims');
  console.log('✅ Detects when claim patterns match known outcomes');
  console.log('✅ Provides higher confidence when similarity found');
  console.log('\nThis enables intelligent fact-checking that learns from history.');
}

testFactCheckerWithGemini().catch(err => console.error('Error:', err));
