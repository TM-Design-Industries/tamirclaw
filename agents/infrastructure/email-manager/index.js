/**
 * EMAIL MANAGER AGENT
 * 
 * Parses, prioritizes, and routes emails
 * - Extract sender, subject, body, attachments
 * - Score priority (urgent keywords, client importance)
 * - Suggest routing (project tracker, orchestrator, etc)
 * - Archive for later reference
 */

const crypto = require('crypto');

class EmailManagerAgent {
  constructor() {
    this.name = 'Email Manager';
    this.emails = new Map();
    this.archive = [];

    // Priority keywords
    this.urgentKeywords = [
      'urgent', 'asap', 'immediately', 'critical', 'emergency',
      'deadline', 'overdue', 'rush', 'quick turnaround'
    ];

    this.projectKeywords = [
      'project', 'design', 'proposal', 'quote', 'timeline',
      'budget', 'specs', 'requirements', 'deliverables'
    ];

    this.clientDatabase = {
      'audi': {importance: 'high', domain: 'automotive'},
      'bmw': {importance: 'high', domain: 'automotive'},
      'tesla': {importance: 'high', domain: 'automotive'},
      'airbus': {importance: 'critical', domain: 'aerospace'},
      'bombardier': {importance: 'high', domain: 'aerospace'},
      'rolls royce': {importance: 'high', domain: 'aerospace'}
    };
  }

  /**
   * PARSE EMAIL
   * Extract all relevant information from email
   */
  async parseEmail(input) {
    try {
      const {from, to, subject, body, attachments} = input;

      if (!from || !subject || !body) {
        return {
          success: false,
          error: 'Missing required fields: from, subject, body'
        };
      }

      const emailId = `EMAIL-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

      const email = {
        id: emailId,
        from: from,
        to: to || 'tamir@tmd.local',
        subject: subject,
        body: body,
        attachments: attachments || [],
        parsed_at: new Date().toISOString(),
        priority: null,
        suggested_action: null,
        keywords_found: [],
        read: false
      };

      // Store
      this.emails.set(emailId, email);

      console.log(`[EmailManager] Parsed email ${emailId} from ${from}`);

      return {
        success: true,
        email_id: emailId,
        from: from,
        subject: subject,
        body_length: body.length,
        attachments_count: attachments?.length || 0
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse email: ${error.message}`
      };
    }
  }

  /**
   * PRIORITIZE EMAIL
   * Score email based on sender importance, keywords, urgency
   */
  async prioritizeEmail(input) {
    try {
      const {email_id} = input;

      if (!email_id) {
        return {
          success: false,
          error: 'Missing required field: email_id'
        };
      }

      const email = this.emails.get(email_id);
      if (!email) {
        return {
          success: false,
          error: `Email ${email_id} not found`
        };
      }

      let score = 0;
      const keywords = [];

      // Check urgent keywords in subject/body
      const text = (email.subject + ' ' + email.body).toLowerCase();
      for (const keyword of this.urgentKeywords) {
        if (text.includes(keyword.toLowerCase())) {
          score += 5;
          keywords.push(keyword);
        }
      }

      // Check project keywords
      for (const keyword of this.projectKeywords) {
        if (text.includes(keyword.toLowerCase())) {
          score += 2;
          keywords.push(keyword);
        }
      }

      // Check client importance
      const senderDomain = email.from.split('@')[0].toLowerCase();
      for (const [client, data] of Object.entries(this.clientDatabase)) {
        if (senderDomain.includes(client)) {
          if (data.importance === 'critical') score += 10;
          if (data.importance === 'high') score += 7;
          keywords.push(`client_${data.importance}`);
        }
      }

      // Determine priority level
      let priority = 'low';
      if (score >= 15) priority = 'critical';
      else if (score >= 10) priority = 'high';
      else if (score >= 5) priority = 'medium';

      email.priority = priority;
      email.keywords_found = keywords;

      console.log(`[EmailManager] Prioritized ${email_id} as ${priority} (score: ${score})`);

      return {
        success: true,
        email_id: email_id,
        priority: priority,
        score: score,
        keywords: keywords
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to prioritize email: ${error.message}`
      };
    }
  }

  /**
   * ROUTE EMAIL
   * Suggest which agent should handle this email
   */
  async routeEmail(input) {
    try {
      const {email_id} = input;

      if (!email_id) {
        return {
          success: false,
          error: 'Missing required field: email_id'
        };
      }

      const email = this.emails.get(email_id);
      if (!email) {
        return {
          success: false,
          error: `Email ${email_id} not found`
        };
      }

      // If not prioritized yet, do it
      if (!email.priority) {
        await this.prioritizeEmail({email_id});
      }

      const text = (email.subject + ' ' + email.body).toLowerCase();
      let suggestedRoute = 'orchestrator'; // default
      let actionRequired = false;

      // Routing logic
      if (text.includes('vendor') || text.includes('supplier') || text.includes('purchase order')) {
        suggestedRoute = 'vendor_manager';
        actionRequired = true;
      } else if (text.includes('quote') || text.includes('proposal') || text.includes('pricing')) {
        suggestedRoute = 'quote_generator';
        actionRequired = true;
      } else if (text.includes('invoice') || text.includes('bill') || text.includes('payment')) {
        suggestedRoute = 'accounting_agent';
        actionRequired = true;
      } else if (text.includes('schedule') || text.includes('meeting') || text.includes('availability')) {
        suggestedRoute = 'scheduler_agent';
        actionRequired = true;
      } else if (text.includes('contract') || text.includes('agreement') || text.includes('legal')) {
        suggestedRoute = 'legal_agent';
        actionRequired = true;
      } else if (text.includes('project') || text.includes('brief') || text.includes('requirements')) {
        suggestedRoute = 'project_tracker';
        actionRequired = true;
      } else if (email.priority === 'critical' || email.priority === 'high') {
        suggestedRoute = 'orchestrator';
        actionRequired = true;
      }

      email.suggested_action = suggestedRoute;

      console.log(`[EmailManager] Routed ${email_id} to ${suggestedRoute}`);

      return {
        success: true,
        email_id: email_id,
        suggested_route: suggestedRoute,
        action_required: actionRequired,
        priority: email.priority,
        reason: `Email contains project-related keywords and is marked ${email.priority}`
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to route email: ${error.message}`
      };
    }
  }

  /**
   * ARCHIVE EMAIL
   * Move to archive and mark as read
   */
  async archiveEmail(input) {
    try {
      const {email_id} = input;

      if (!email_id) {
        return {
          success: false,
          error: 'Missing required field: email_id'
        };
      }

      const email = this.emails.get(email_id);
      if (!email) {
        return {
          success: false,
          error: `Email ${email_id} not found`
        };
      }

      email.read = true;
      email.archived_at = new Date().toISOString();
      this.archive.push({...email});
      this.emails.delete(email_id);

      console.log(`[EmailManager] Archived email ${email_id}`);

      return {
        success: true,
        email_id: email_id,
        archived_at: email.archived_at
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to archive email: ${error.message}`
      };
    }
  }

  /**
   * LIST UNREAD EMAILS
   * Get all unread emails sorted by priority
   */
  async listUnread() {
    try {
      const unread = Array.from(this.emails.values())
        .filter(e => !e.read)
        .sort((a, b) => {
          const priorityOrder = {critical: 0, high: 1, medium: 2, low: 3};
          return priorityOrder[a.priority || 'low'] - priorityOrder[b.priority || 'low'];
        })
        .map(e => ({
          id: e.id,
          from: e.from,
          subject: e.subject,
          priority: e.priority,
          suggested_action: e.suggested_action,
          parsed_at: e.parsed_at
        }));

      return {
        success: true,
        total_unread: unread.length,
        emails: unread
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to list unread: ${error.message}`
      };
    }
  }

  /**
   * MAIN ROUTER
   */
  async process(input) {
    const {action, data} = input;

    switch(action) {
      case 'parse':
        return await this.parseEmail(data);
      case 'prioritize':
        return await this.prioritizeEmail(data);
      case 'route':
        return await this.routeEmail(data);
      case 'archive':
        return await this.archiveEmail(data);
      case 'list_unread':
        return await this.listUnread();
      default:
        return {
          success: false,
          error: `Unknown action: ${action}`
        };
    }
  }
}

module.exports = EmailManagerAgent;
