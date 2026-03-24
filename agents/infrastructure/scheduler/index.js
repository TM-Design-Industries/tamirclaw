/**
 * SCHEDULER AGENT
 */

class Scheduler {
  constructor() {
    this.name = 'Scheduler';
    this.meetings = new Map();
    this.calendar = [];
  }

  async scheduleMeeting(input) {
    try {
      const {title, participants, start_time, duration, description} = input;
      if (!title || !start_time) return {success: false, error: 'Missing fields'};

      const meetingId = `MEET-${Date.now()}`;
      this.meetings.set(meetingId, {
        title, participants: participants || [], start_time, duration: duration || 60,
        description, status: 'scheduled', created_at: new Date().toISOString()
      });

      this.calendar.push({meetingId, start_time, duration: duration || 60});

      return {success: true, meeting_id: meetingId, title: title, start_time: start_time};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async checkAvailability(input) {
    try {
      const {start_time, duration} = input;
      if (!start_time) return {success: false, error: 'Missing start_time'};

      let available = true;
      const dur = duration || 60;

      for (const event of this.calendar) {
        const eventEnd = new Date(event.start_time).getTime() + (event.duration * 60000);
        const requestEnd = new Date(start_time).getTime() + (dur * 60000);
        
        if (new Date(start_time).getTime() < eventEnd && requestEnd > new Date(event.start_time).getTime()) {
          available = false;
          break;
        }
      }

      return {success: true, start_time: start_time, available: available};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async getMeetings() {
    return {
      success: true,
      total_meetings: this.meetings.size,
      meetings: Array.from(this.meetings.values()).map((m, i) => ({
        id: Array.from(this.meetings.keys())[i],
        title: m.title,
        start_time: m.start_time,
        duration: m.duration
      }))
    };
  }

  async process(input) {
    const {action, data} = input;
    switch(action) {
      case 'schedule_meeting': return await this.scheduleMeeting(data);
      case 'check_availability': return await this.checkAvailability(data);
      case 'get_meetings': return await this.getMeetings();
      default: return {success: false, error: `Unknown action: ${action}`};
    }
  }
}

module.exports = Scheduler;
