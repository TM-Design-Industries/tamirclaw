/**
 * CRM AGENT
 */

class CRMAgent {
  constructor() {
    this.name = 'CRM Agent';
    this.clients = new Map();
    this.interactions = [];
  }

  async addClient(input) {
    try {
      const {name, email, phone, company} = input;
      if (!name || !email) return {success: false, error: 'Missing fields'};

      const clientId = `CLIENT-${Date.now()}`;
      this.clients.set(clientId, {
        name, email, phone, company, created_at: new Date().toISOString(), interactions: 0
      });

      return {success: true, client_id: clientId, name: name};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async logInteraction(input) {
    try {
      const {client_id, type, notes} = input;
      if (!client_id || !type) return {success: false, error: 'Missing fields'};

      const client = this.clients.get(client_id);
      if (!client) return {success: false, error: 'Client not found'};

      client.interactions++;
      this.interactions.push({
        client_id, type, notes, logged_at: new Date().toISOString()
      });

      return {success: true, interaction_logged: true, total_interactions: client.interactions};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async getClientInfo(input) {
    try {
      const {client_id} = input;
      if (!client_id) return {success: false, error: 'Missing client_id'};

      const client = this.clients.get(client_id);
      if (!client) return {success: false, error: 'Client not found'};

      return {success: true, client: client};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async process(input) {
    const {action, data} = input;
    switch(action) {
      case 'add_client': return await this.addClient(data);
      case 'log_interaction': return await this.logInteraction(data);
      case 'get_client_info': return await this.getClientInfo(data);
      default: return {success: false, error: `Unknown action: ${action}`};
    }
  }
}

module.exports = CRMAgent;
