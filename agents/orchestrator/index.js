/**
 * ORCHESTRATOR AGENT
 * 
 * The central coordination system
 * - Manages work queue
 * - Assigns agents to projects
 * - Detects conflicts
 * - Routes to specialists when needed
 * - Escalates to Tamir when necessary
 */

const crypto = require('crypto');

class OrchestratorAgent {
  constructor() {
    this.name = 'Orchestrator';
    this.workQueue = [];
    this.assignments = new Map();
    this.decisions = [];
    
    // Agent availability
    this.agents = {
      infrastructure: {
        'project_tracker': {status: 'ready', working_on: []},
        'email_manager': {status: 'ready', working_on: []},
        'quote_generator': {status: 'ready', working_on: []}
      },
      specialists: {
        'vehicle_specialist': {status: 'ready', domain: 'automotive'},
        'aircraft_specialist': {status: 'ready', domain: 'aerospace'},
        'marine_specialist': {status: 'ready', domain: 'marine'}
      },
      execution: {
        'mechanical_engineer': {status: 'ready', domain: 'mechanical'},
        'dfm_specialist': {status: 'ready', domain: 'manufacturing'},
        'design_expert': {status: 'ready', domain: 'design'}
      }
    };
  }

  /**
   * INTAKE PROJECT
   * New project arrives, create initial assignment
   */
  async intakeProject(input) {
    try {
      const {client, brief, domain, budget, deadline} = input;

      if (!client || !brief || !domain) {
        return {
          success: false,
          error: 'Missing required fields: client, brief, domain'
        };
      }

      const projectId = `${domain.substring(0,3).toUpperCase()}-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

      // Step 1: Route to Project Tracker for creation
      const projectTrackerAssignment = {
        project_id: projectId,
        agent: 'project_tracker',
        action: 'create',
        data: {client, brief, domain, budget, deadline},
        status: 'assigned',
        priority: 'high',
        assigned_at: new Date().toISOString()
      };

      // Step 2: Route to Domain Specialist for context
      const domainMap = {
        'automotive': 'vehicle_specialist',
        'aerospace': 'aircraft_specialist',
        'marine': 'marine_specialist'
      };

      const specialistAgent = domainMap[domain] || 'vehicle_specialist';

      const specialistAssignment = {
        project_id: projectId,
        agent: specialistAgent,
        action: 'analyze_domain',
        data: {brief, domain},
        status: 'assigned',
        priority: 'high',
        assigned_at: new Date().toISOString()
      };

      // Step 3: Route to Quote Generator for cost estimate
      const quoteAssignment = {
        project_id: projectId,
        agent: 'quote_generator',
        action: 'estimate_cost',
        data: {domain, budget, complexity: 'moderate'},
        status: 'assigned',
        priority: 'high',
        assigned_at: new Date().toISOString()
      };

      // Store assignments
      const assignment = {
        project_id: projectId,
        client,
        domain,
        budget,
        deadline,
        status: 'intake_in_progress', // intake → planning → design → engineering → review → delivery
        created_at: new Date().toISOString(),
        agents_assigned: [
          {agent: 'project_tracker', status: 'assigned'},
          {agent: specialistAgent, status: 'assigned'},
          {agent: 'quote_generator', status: 'assigned'}
        ],
        workflow: [projectTrackerAssignment, specialistAssignment, quoteAssignment]
      };

      this.assignments.set(projectId, assignment);

      // Add to work queue
      this.workQueue.push({
        project_id: projectId,
        priority: 'high',
        type: 'intake',
        created_at: new Date().toISOString()
      });

      console.log(`[Orchestrator] Intake: Project ${projectId} for ${client} (${domain})`);
      console.log(`[Orchestrator] Assigned to: project_tracker, ${specialistAgent}, quote_generator`);

      return {
        success: true,
        project_id: projectId,
        status: 'intake_in_progress',
        assigned_agents: ['project_tracker', specialistAgent, 'quote_generator'],
        next_action: 'waiting_for_initial_analysis',
        workflow: assignment.workflow
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to intake project: ${error.message}`
      };
    }
  }

  /**
   * ASSIGN AGENTS
   * Based on project status, assign specialized agents
   */
  async assignAgents(input) {
    try {
      const {project_id, phase} = input;

      if (!project_id) {
        return {
          success: false,
          error: 'Missing required field: project_id'
        };
      }

      const assignment = this.assignments.get(project_id);
      if (!assignment) {
        return {
          success: false,
          error: `Project ${project_id} not found`
        };
      }

      // Based on phase, assign appropriate agents
      let agentsToAssign = [];

      switch(phase) {
        case 'design':
          agentsToAssign = ['design_expert', 'dfm_specialist'];
          break;
        case 'engineering':
          agentsToAssign = ['mechanical_engineer', 'dfm_specialist'];
          break;
        case 'review':
          agentsToAssign = ['design_expert', 'mechanical_engineer'];
          break;
        default:
          agentsToAssign = [];
      }

      // Update assignment
      assignment.current_phase = phase;
      assignment.agents_assigned.push(
        ...agentsToAssign.map(agent => ({agent, status: 'assigned'}))
      );

      console.log(`[Orchestrator] Assigned ${agentsToAssign.join(', ')} to phase: ${phase}`);

      return {
        success: true,
        project_id: project_id,
        phase: phase,
        assigned_agents: agentsToAssign,
        message: `Agents assigned for ${phase} phase`
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to assign agents: ${error.message}`
      };
    }
  }

  /**
   * CHECK STATUS
   * Get project status and agent progress
   */
  async checkStatus(input) {
    try {
      const {project_id} = input;

      if (!project_id) {
        return {
          success: false,
          error: 'Missing required field: project_id'
        };
      }

      const assignment = this.assignments.get(project_id);
      if (!assignment) {
        return {
          success: false,
          error: `Project ${project_id} not found`
        };
      }

      return {
        success: true,
        project_id: project_id,
        client: assignment.client,
        domain: assignment.domain,
        status: assignment.status,
        current_phase: assignment.current_phase || 'intake',
        agents_assigned: assignment.agents_assigned,
        created_at: assignment.created_at,
        summary: `Project in ${assignment.status} with ${assignment.agents_assigned.length} agents assigned`
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to check status: ${error.message}`
      };
    }
  }

  /**
   * ESCALATE
   * When something needs Tamir's attention
   */
  async escalate(input) {
    try {
      const {project_id, reason, severity} = input;

      if (!project_id || !reason) {
        return {
          success: false,
          error: 'Missing required fields: project_id, reason'
        };
      }

      const escalation = {
        escalation_id: `ESC-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        project_id: project_id,
        reason: reason,
        severity: severity || 'medium', // low, medium, high, critical
        created_at: new Date().toISOString(),
        status: 'pending_tamir_review'
      };

      console.log(`[Orchestrator] ESCALATION [${escalation.severity}]: ${reason}`);
      console.log(`[Orchestrator] Project ${project_id} needs Tamir's attention`);

      return {
        success: true,
        escalation_id: escalation.escalation_id,
        project_id: project_id,
        reason: reason,
        severity: severity,
        status: 'pending_tamir_review',
        message: `Escalation created. Tamir will review.`
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to escalate: ${error.message}`
      };
    }
  }

  /**
   * GET QUEUE
   * Show work queue status
   */
  async getQueueStatus() {
    try {
      return {
        success: true,
        queue_length: this.workQueue.length,
        queue: this.workQueue.map(item => ({
          project_id: item.project_id,
          priority: item.priority,
          type: item.type,
          created_at: item.created_at
        })),
        total_projects: this.assignments.size
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get queue: ${error.message}`
      };
    }
  }

  /**
   * MAIN ROUTER
   */
  async process(input) {
    const {action, data} = input;

    switch(action) {
      case 'intake_project':
        return await this.intakeProject(data);
      case 'assign_agents':
        return await this.assignAgents(data);
      case 'check_status':
        return await this.checkStatus(data);
      case 'escalate':
        return await this.escalate(data);
      case 'get_queue':
        return await this.getQueueStatus();
      default:
        return {
          success: false,
          error: `Unknown action: ${action}`
        };
    }
  }
}

module.exports = OrchestratorAgent;
