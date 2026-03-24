# Knowledge Base Agent

## Purpose
Institutional memory system that stores, retrieves, and learns from all projects.

## Architecture
- **Layer:** Core
- **Decision Level:** 1 (pure storage and retrieval)
- **Integration:** Gemini API for semantic embeddings
- **Status:** Ready for production

## Features

### 1. Store Project
Save completed project data with semantic embeddings for future retrieval.

**Input:**
```javascript
{
  "action": "store_project",
  "data": {
    "project_id": "AUT-2025-001",
    "client": "Audi AG",
    "domain": "automotive",
    "brief": "Interior redesign for A8",
    "outcome": "Delivered premium interior",
    "cost": 500000,
    "timeline": 12
  }
}
```

### 2. Query
Search knowledge base using semantic text search (powered by Gemini embeddings).

**Input:**
```javascript
{
  "action": "query",
  "data": {
    "query_text": "automotive interior design optimization",
    "domain": "automotive", // optional filter
    "limit": 5
  }
}
```

**Output:** Similar projects ranked by relevance

### 3. Search Similar
Find projects in the same domain.

**Input:**
```javascript
{
  "action": "search_similar",
  "data": {
    "domain": "automotive",
    "limit": 5
  }
}
```

### 4. Extract Lessons
Learn from completed projects.

**Input:**
```javascript
{
  "action": "extract_lessons",
  "data": {
    "project_id": "AUT-2025-001",
    "what_worked": "Modular design approach",
    "what_failed": "Initial material selection too expensive",
    "improvements": ["Use composites", "Value engineering earlier"]
  }
}
```

### 5. Get Statistics
View knowledge base overview.

## How It Works

1. **Projects are stored** with semantic embeddings (using Gemini API)
2. **Queries are embedded** using the same model
3. **Cosine similarity** finds relevant projects
4. **Lessons are extracted** from each project
5. **Patterns emerge** as more projects complete

## Semantic Search

When you query "automotive interior design", the system:
1. Converts query to embedding vector
2. Compares to all stored project embeddings
3. Returns projects ranked by similarity (0.0 to 1.0)

## Gemini Integration

**Model:** text-embedding-004
**Provider:** Google's Generative AI API
**Purpose:** Create semantic embeddings for similarity search

**Fallback:** Simple hash-based embedding if API unavailable

## Storage Strategy

**Current:** In-memory Map (fast for testing)
**Next:** PostgreSQL with pgvector extension (production)

## Lessons Database

Each completed project extracts:
- What worked
- What failed
- Improvements for next time
- Best practices

Over time, patterns emerge across projects.

## Use Cases

### Finding Similar Past Projects
```javascript
// New automotive project arrives
await kb.query({
  query_text: "automotive interior design for premium segment",
  domain: "automotive"
});
// Returns: Audi A8 interior, BMW iX interior, etc.
```

### Learning from Mistakes
```javascript
// "This material failed once before"
await kb.query({
  query_text: "aluminum corrosion failure marine environment"
});
// Returns: Previous marine project that had same issue
```

### Vendor/Supplier Recommendations
```javascript
// "Who makes the best composites?"
await kb.query({
  query_text: "composite supplier aerospace certification"
});
// Returns: Past projects with composite suppliers and ratings
```

## Integration Points

**With Orchestrator:**
- Store completed projects
- Query past similar projects for context

**With Domain Specialists:**
- Get domain-specific lessons
- Understand market/regulatory history

**With Execution Agents:**
- Learn from engineering decisions
- Avoid past mistakes

**With Quality Gates:**
- Track quality over time
- Identify improvement areas

## Tests
```bash
node tests.js
```

Expected: 7/7 passing

Test coverage:
- Project storage
- Multiple projects
- Text-based queries
- Domain filtering
- Lesson extraction
- Statistics

## Future Enhancements
- [ ] PostgreSQL + pgvector backend
- [ ] Real Gemini API integration
- [ ] Automatic lesson extraction (use Claude to analyze)
- [ ] Vendor rating system
- [ ] Regulatory requirement tracker
- [ ] Cost trend analysis
- [ ] Team skill tracking
- [ ] Machine learning on success factors
