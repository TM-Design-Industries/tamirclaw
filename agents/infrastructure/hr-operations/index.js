/**
 * HR OPERATIONS AGENT
 */

class HROperations {
  constructor() {
    this.name = 'HR Operations';
    this.team_members = new Map();
    this.schedules = [];
  }

  async addTeamMember(input) {
    try {
      const {name, role, email} = input;
      if (!name || !role) return {success: false, error: 'Missing fields'};

      const memberId = `TEAM-${Date.now()}`;
      this.team_members.set(memberId, {
        name, role, email, hired_at: new Date().toISOString()
      });

      return {success: true, member_id: memberId, name: name, role: role};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async scheduleShift(input) {
    try {
      const {member_id, date, hours} = input;
      if (!member_id || !date || !hours) return {success: false, error: 'Missing fields'};

      const member = this.team_members.get(member_id);
      if (!member) return {success: false, error: 'Member not found'};

      this.schedules.push({member_id, date, hours, scheduled_at: new Date().toISOString()});

      return {success: true, scheduled: true, member: member.name, date: date, hours: hours};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async getTeamStatus() {
    return {
      success: true,
      total_members: this.team_members.size,
      scheduled_shifts: this.schedules.length,
      team_members: Array.from(this.team_members.values()).map((m, i) => ({
        id: Array.from(this.team_members.keys())[i],
        name: m.name,
        role: m.role
      }))
    };
  }

  async process(input) {
    const {action, data} = input;
    switch(action) {
      case 'add_team_member': return await this.addTeamMember(data);
      case 'schedule_shift': return await this.scheduleShift(data);
      case 'get_team_status': return await this.getTeamStatus();
      default: return {success: false, error: `Unknown action: ${action}`};
    }
  }
}

module.exports = HROperations;
