/**
 * LEGAL/IP TRACKER AGENT
 */

class LegalIPTracker {
  constructor() {
    this.name = 'Legal/IP Tracker';
    this.contracts = new Map();
    this.ip_registrations = new Map();
  }

  async addContract(input) {
    try {
      const {client, description, terms, start_date, end_date} = input;
      if (!client || !description) return {success: false, error: 'Missing fields'};

      const contractId = `CONTRACT-${Date.now()}`;
      this.contracts.set(contractId, {
        client, description, terms, start_date, end_date, status: 'active'
      });

      return {success: true, contract_id: contractId, client: client, status: 'active'};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async registerIP(input) {
    try {
      const {type, name, description} = input;
      if (!type || !name) return {success: false, error: 'Missing fields'};

      const ipId = `IP-${Date.now()}`;
      this.ip_registrations.set(ipId, {
        type, name, description, registered_at: new Date().toISOString(), status: 'pending'
      });

      return {success: true, ip_id: ipId, type: type, name: name, status: 'pending'};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async getContracts() {
    return {
      success: true,
      total_contracts: this.contracts.size,
      contracts: Array.from(this.contracts.values()).map((c, i) => ({
        id: Array.from(this.contracts.keys())[i],
        client: c.client,
        status: c.status
      }))
    };
  }

  async process(input) {
    const {action, data} = input;
    switch(action) {
      case 'add_contract': return await this.addContract(data);
      case 'register_ip': return await this.registerIP(data);
      case 'get_contracts': return await this.getContracts();
      default: return {success: false, error: `Unknown action: ${action}`};
    }
  }
}

module.exports = LegalIPTracker;
