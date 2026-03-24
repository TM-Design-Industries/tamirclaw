/**
 * KNOWLEDGE BASE AGENT
 * 
 * Institutional memory system
 * - Store project data
 * - Semantic search using Gemini embeddings
 * - Extract lessons from completed projects
 * - Find similar past projects
 */

const crypto = require('crypto');
const https = require('https');

class KnowledgeBaseAgent {
  constructor(geminiApiKey) {
    this.name = 'Knowledge Base';
    // Use provided API key or fallback to environment
    this.geminiApiKey = geminiApiKey || process.env.GEMINI_API_KEY || 'AIzaSyCzxYYoFjz8EN4y8lLeh-_HqxdeBno80t0';
    this.geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent';
    
    // In-memory storage (replace with DB later)
    this.projects = new Map();
    this.lessons = [];
    this.warnings = [];
    this.patterns = [];
    this.vendors = new Map();
    this.regulations = new Map();
  }

  /**
   * GET GEMINI EMBEDDING
   * Use Gemini to create semantic embeddings
   */
  async getEmbedding(text) {
    try {
      return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
          model: 'models/text-embedding-004',
          content: {
            parts: [{ text: text }]
          }
        });

        const url = new URL(this.geminiEndpoint);
        url.searchParams.append('key', this.geminiApiKey);

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          }
        };

        const req = https.request(url, options, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const response = JSON.parse(data);
              if (response.embedding && response.embedding.values) {
                resolve(response.embedding.values);
              } else {
                // Fallback: simple hash-based embedding if API fails
                resolve(this.simpleEmbedding(text));
              }
            } catch (e) {
              resolve(this.simpleEmbedding(text));
            }
          });
        });

        req.on('error', () => {
          resolve(this.simpleEmbedding(text));
        });

        req.write(payload);
        req.end();
      });
    } catch (error) {
      console.log('[KB] Embedding API error, using fallback');
      return this.simpleEmbedding(text);
    }
  }

  /**
   * SIMPLE EMBEDDING FALLBACK
   * Hash-based embedding when API unavailable
   */
  simpleEmbedding(text) {
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(768).fill(0);
    
    words.forEach(word => {
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = ((hash << 5) - hash) + word.charCodeAt(i);
        hash = hash & hash;
      }
      const index = Math.abs(hash) % 768;
      embedding[index] += 1;
    });
    
    return embedding;
  }

  /**
   * STORE PROJECT
   * Save project data with embeddings
   */
  async storeProject(input) {
    try {
      const {project_id, client, domain, brief, outcome, cost, timeline} = input;

      if (!project_id || !client || !domain) {
        return {
          success: false,
          error: 'Missing required fields: project_id, client, domain'
        };
      }

      // Create embedding for semantic search
      const searchText = `${client} ${domain} ${brief || ''} ${outcome || ''}`;
      const embedding = await this.getEmbedding(searchText);

      const project = {
        project_id,
        client,
        domain,
        brief: brief || '',
        outcome: outcome || '',
        cost: cost || null,
        timeline: timeline || null,
        stored_at: new Date().toISOString(),
        embedding: embedding,
        searchText: searchText
      };

      this.projects.set(project_id, project);

      console.log(`[KB] Stored project ${project_id} from ${client}`);

      return {
        success: true,
        project_id: project_id,
        stored: true
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to store project: ${error.message}`
      };
    }
  }

  /**
   * QUERY
   * Search knowledge base for specific information
   */
  async query(input) {
    try {
      const {query_text, domain, limit} = input;

      if (!query_text) {
        return {
          success: false,
          error: 'Missing required field: query_text'
        };
      }

      // Get embedding for query
      const queryEmbedding = await this.getEmbedding(query_text);

      // Find similar projects using cosine similarity
      const results = [];

      for (const [id, project] of this.projects.entries()) {
        // Filter by domain if specified
        if (domain && project.domain !== domain) continue;

        // Calculate similarity
        const similarity = this.cosineSimilarity(queryEmbedding, project.embedding);
        
        if (similarity > 0.3) {
          results.push({
            project_id: id,
            client: project.client,
            domain: project.domain,
            brief: project.brief.substring(0, 100),
            similarity: similarity.toFixed(2)
          });
        }
      }

      // Sort by similarity
      results.sort((a, b) => b.similarity - a.similarity);

      const topResults = results.slice(0, limit || 5);

      console.log(`[KB] Query "${query_text}" found ${topResults.length} results`);

      return {
        success: true,
        query: query_text,
        results_count: topResults.length,
        results: topResults
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to query KB: ${error.message}`
      };
    }
  }

  /**
   * COSINE SIMILARITY
   * Calculate similarity between two embeddings
   */
  cosineSimilarity(a, b) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (normA * normB);
  }

  /**
   * EXTRACT LESSONS
   * Learn from completed project
   */
  async extractLessons(input) {
    try {
      const {project_id, what_worked, what_failed, improvements} = input;

      if (!project_id || !what_worked) {
        return {
          success: false,
          error: 'Missing required fields: project_id, what_worked'
        };
      }

      const lesson = {
        lesson_id: `LESSON-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        project_id: project_id,
        what_worked: what_worked,
        what_failed: what_failed || '',
        improvements: improvements || [],
        created_at: new Date().toISOString()
      };

      this.lessons.push(lesson);

      console.log(`[KB] Extracted lesson ${lesson.lesson_id} from ${project_id}`);

      return {
        success: true,
        lesson_id: lesson.lesson_id,
        lesson_count: this.lessons.length
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to extract lessons: ${error.message}`
      };
    }
  }

  /**
   * SEARCH SIMILAR
   * Find projects similar to current one
   */
  async searchSimilar(input) {
    try {
      const {domain, client_type, complexity, limit} = input;

      if (!domain) {
        return {
          success: false,
          error: 'Missing required field: domain'
        };
      }

      const similar = [];

      for (const [id, project] of this.projects.entries()) {
        if (project.domain === domain) {
          similar.push({
            project_id: id,
            client: project.client,
            brief: project.brief.substring(0, 80),
            outcome: project.outcome.substring(0, 80)
          });
        }
      }

      return {
        success: true,
        domain: domain,
        similar_projects: similar.slice(0, limit || 5),
        total_in_domain: similar.length
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to search similar: ${error.message}`
      };
    }
  }

  /**
   * GET STATISTICS
   */
  async getStats() {
    return {
      success: true,
      total_projects: this.projects.size,
      total_lessons: this.lessons.length,
      total_warnings: this.warnings.length,
      projects_by_domain: this.getProjectsByDomain(),
      summary: `Knowledge base contains ${this.projects.size} projects and ${this.lessons.length} lessons`
    };
  }

  /**
   * GET PROJECTS BY DOMAIN
   */
  getProjectsByDomain() {
    const byDomain = {};
    for (const project of this.projects.values()) {
      byDomain[project.domain] = (byDomain[project.domain] || 0) + 1;
    }
    return byDomain;
  }

  /**
   * MAIN ROUTER
   */
  async process(input) {
    const {action, data} = input;

    switch(action) {
      case 'store_project':
        return await this.storeProject(data);
      case 'query':
        return await this.query(data);
      case 'extract_lessons':
        return await this.extractLessons(data);
      case 'search_similar':
        return await this.searchSimilar(data);
      case 'get_stats':
        return await this.getStats();
      default:
        return {
          success: false,
          error: `Unknown action: ${action}`
        };
    }
  }
}

module.exports = KnowledgeBaseAgent;
