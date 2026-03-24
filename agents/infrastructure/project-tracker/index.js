/**
 * PROJECT TRACKER AGENT
 * 
 * Manages project lifecycle:
 * - Create projects from briefs
 * - Track status and progress
 * - Manage milestones and deliverables
 * - Update timelines
 */

const crypto = require('crypto');

class ProjectTrackerAgent {
  constructor() {
    this.name = 'Project Tracker';
    this.projects = new Map(); // In-memory for now, replace with DB
    this.milestones = new Map();
  }

  /**
   * CREATE PROJECT
   * Input: {client, brief, domain, deadline, budget}
   * Output: {project_id, status, created_at}
   */
  async createProject(input) {
    try {
      const {client, brief, domain, deadline, budget} = input;

      // Validate
      if (!client || !brief || !domain) {
        return {
          success: false,
          error: 'Missing required fields: client, brief, domain'
        };
      }

      // Generate ID
      const projectId = `${domain.substring(0, 3).toUpperCase()}-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

      // Create project record
      const project = {
        id: projectId,
        client: client,
        brief: brief,
        domain: domain,
        deadline: deadline || null,
        budget: budget || null,
        status: 'intake', // intake → planning → design → engineering → testing → delivery
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        progress: 0,
        milestones: [],
        deliverables: [],
        assigned_agents: [],
        decisions: [],
        notes: []
      };

      // Store
      this.projects.set(projectId, project);

      console.log(`[ProjectTracker] Created project ${projectId}`);

      return {
        success: true,
        project_id: projectId,
        status: project.status,
        created_at: project.created_at
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create project: ${error.message}`
      };
    }
  }

  /**
   * UPDATE STATUS
   * Input: {project_id, status}
   * Status flow: intake → planning → design → engineering → testing → delivery
   */
  async updateStatus(input) {
    try {
      const {project_id, status} = input;

      if (!project_id || !status) {
        return {
          success: false,
          error: 'Missing required fields: project_id, status'
        };
      }

      const project = this.projects.get(project_id);
      if (!project) {
        return {
          success: false,
          error: `Project ${project_id} not found`
        };
      }

      const validStatuses = ['intake', 'planning', 'design', 'engineering', 'testing', 'delivery', 'completed'];
      if (!validStatuses.includes(status)) {
        return {
          success: false,
          error: `Invalid status. Valid: ${validStatuses.join(', ')}`
        };
      }

      project.status = status;
      project.updated_at = new Date().toISOString();

      console.log(`[ProjectTracker] Updated ${project_id} to ${status}`);

      return {
        success: true,
        project_id: project_id,
        status: status,
        updated_at: project.updated_at
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update status: ${error.message}`
      };
    }
  }

  /**
   * ADD MILESTONE
   * Input: {project_id, name, due_date, deliverables}
   */
  async addMilestone(input) {
    try {
      const {project_id, name, due_date, deliverables} = input;

      if (!project_id || !name) {
        return {
          success: false,
          error: 'Missing required fields: project_id, name'
        };
      }

      const project = this.projects.get(project_id);
      if (!project) {
        return {
          success: false,
          error: `Project ${project_id} not found`
        };
      }

      const milestone = {
        id: `MS-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        name: name,
        due_date: due_date || null,
        deliverables: deliverables || [],
        status: 'pending', // pending → in_progress → completed
        created_at: new Date().toISOString()
      };

      project.milestones.push(milestone);

      console.log(`[ProjectTracker] Added milestone ${milestone.id} to ${project_id}`);

      return {
        success: true,
        milestone_id: milestone.id,
        project_id: project_id
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to add milestone: ${error.message}`
      };
    }
  }

  /**
   * GET STATUS
   * Input: {project_id}
   * Output: Full project record
   */
  async getStatus(input) {
    try {
      const {project_id} = input;

      if (!project_id) {
        return {
          success: false,
          error: 'Missing required field: project_id'
        };
      }

      const project = this.projects.get(project_id);
      if (!project) {
        return {
          success: false,
          error: `Project ${project_id} not found`
        };
      }

      return {
        success: true,
        project_id: project.id,
        status: project.status,
        progress: project.progress,
        client: project.client,
        domain: project.domain,
        deadline: project.deadline,
        budget: project.budget,
        milestones_count: project.milestones.length,
        milestones: project.milestones,
        assigned_agents: project.assigned_agents,
        created_at: project.created_at,
        updated_at: project.updated_at
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get status: ${error.message}`
      };
    }
  }

  /**
   * LIST ALL PROJECTS
   */
  async listProjects() {
    try {
      const projects = Array.from(this.projects.values()).map(p => ({
        id: p.id,
        client: p.client,
        domain: p.domain,
        status: p.status,
        progress: p.progress,
        created_at: p.created_at
      }));

      return {
        success: true,
        total: projects.length,
        projects: projects
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to list projects: ${error.message}`
      };
    }
  }

  /**
   * MAIN ROUTER
   */
  async process(input) {
    const {action, data} = input;

    switch(action) {
      case 'create':
        return await this.createProject(data);
      case 'update_status':
        return await this.updateStatus(data);
      case 'add_milestone':
        return await this.addMilestone(data);
      case 'get_status':
        return await this.getStatus(data);
      case 'list':
        return await this.listProjects();
      default:
        return {
          success: false,
          error: `Unknown action: ${action}`
        };
    }
  }
}

module.exports = ProjectTrackerAgent;
