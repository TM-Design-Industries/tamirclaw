/**
 * VENDOR MANAGER AGENT
 */

class VendorManager {
  constructor() {
    this.name = 'Vendor Manager';
    this.vendors = new Map();
    this.orders = new Map();
  }

  async addVendor(input) {
    try {
      const {name, category, contact, lead_time} = input;
      if (!name || !category) return {success: false, error: 'Missing fields'};

      const vendorId = `VENDOR-${Date.now()}`;
      this.vendors.set(vendorId, {
        name, category, contact, lead_time: lead_time || '8 weeks', rating: 4.5
      });

      return {success: true, vendor_id: vendorId, name: name, category: category};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async createPO(input) {
    try {
      const {vendor_id, items, quantity, cost} = input;
      if (!vendor_id || !items) return {success: false, error: 'Missing fields'};

      const vendor = this.vendors.get(vendor_id);
      if (!vendor) return {success: false, error: 'Vendor not found'};

      const poId = `PO-${Date.now()}`;
      this.orders.set(poId, {
        vendor_id, items, quantity, cost, status: 'draft', created_at: new Date().toISOString()
      });

      return {success: true, po_id: poId, vendor: vendor.name, items: items, cost: cost};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async getVendors() {
    return {
      success: true,
      total_vendors: this.vendors.size,
      vendors: Array.from(this.vendors.values()).map((v, i) => ({
        id: Array.from(this.vendors.keys())[i],
        name: v.name,
        category: v.category,
        lead_time: v.lead_time,
        rating: v.rating
      }))
    };
  }

  async process(input) {
    const {action, data} = input;
    switch(action) {
      case 'add_vendor': return await this.addVendor(data);
      case 'create_po': return await this.createPO(data);
      case 'get_vendors': return await this.getVendors();
      default: return {success: false, error: `Unknown action: ${action}`};
    }
  }
}

module.exports = VendorManager;
