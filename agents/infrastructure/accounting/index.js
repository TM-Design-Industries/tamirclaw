/**
 * ACCOUNTING AGENT
 */

class AccountingAgent {
  constructor() {
    this.name = 'Accounting Agent';
    this.invoices = new Map();
    this.expenses = new Map();
  }

  async createInvoice(input) {
    try {
      const {project_id, amount, client} = input;
      if (!project_id || !amount || !client) return {success: false, error: 'Missing fields'};

      const invoiceId = `INV-${Date.now()}`;
      this.invoices.set(invoiceId, {
        project_id, amount, client, status: 'draft', created_at: new Date().toISOString()
      });

      return {success: true, invoice_id: invoiceId, amount: amount, status: 'draft'};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async recordExpense(input) {
    try {
      const {category, amount, description} = input;
      if (!category || !amount) return {success: false, error: 'Missing fields'};

      const expenseId = `EXP-${Date.now()}`;
      this.expenses.set(expenseId, {
        category, amount, description, recorded_at: new Date().toISOString()
      });

      return {success: true, expense_id: expenseId, category: category, amount: amount};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async getFinancials() {
    let totalInvoiced = 0;
    let totalExpenses = 0;

    for (const inv of this.invoices.values()) totalInvoiced += inv.amount;
    for (const exp of this.expenses.values()) totalExpenses += exp.amount;

    return {
      success: true,
      total_invoiced: totalInvoiced,
      total_expenses: totalExpenses,
      net_profit: totalInvoiced - totalExpenses,
      invoices_count: this.invoices.size,
      expenses_count: this.expenses.size
    };
  }

  async process(input) {
    const {action, data} = input;
    switch(action) {
      case 'create_invoice': return await this.createInvoice(data);
      case 'record_expense': return await this.recordExpense(data);
      case 'get_financials': return await this.getFinancials();
      default: return {success: false, error: `Unknown action: ${action}`};
    }
  }
}

module.exports = AccountingAgent;
