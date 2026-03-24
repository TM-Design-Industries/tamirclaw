/**
 * DOCUMENT MANAGER AGENT
 */

class DocumentManager {
  constructor() {
    this.name = 'Document Manager';
    this.documents = new Map();
  }

  async storeDocument(input) {
    try {
      const {project_id, type, filename, content} = input;
      if (!project_id || !filename) return {success: false, error: 'Missing fields'};

      const docId = `DOC-${Date.now()}`;
      this.documents.set(docId, {
        project_id, type: type || 'general', filename, content, 
        stored_at: new Date().toISOString(), version: 1
      });

      return {success: true, doc_id: docId, filename: filename, version: 1};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async getDocuments(input) {
    try {
      const {project_id} = input;
      if (!project_id) return {success: false, error: 'Missing project_id'};

      const docs = [];
      for (const [id, doc] of this.documents.entries()) {
        if (doc.project_id === project_id) {
          docs.push({id, filename: doc.filename, type: doc.type, version: doc.version});
        }
      }

      return {success: true, project_id: project_id, documents: docs};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async updateDocument(input) {
    try {
      const {doc_id, content} = input;
      if (!doc_id || !content) return {success: false, error: 'Missing fields'};

      const doc = this.documents.get(doc_id);
      if (!doc) return {success: false, error: 'Document not found'};

      doc.content = content;
      doc.version++;
      doc.updated_at = new Date().toISOString();

      return {success: true, doc_id: doc_id, version: doc.version};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  async process(input) {
    const {action, data} = input;
    switch(action) {
      case 'store_document': return await this.storeDocument(data);
      case 'get_documents': return await this.getDocuments(data);
      case 'update_document': return await this.updateDocument(data);
      default: return {success: false, error: `Unknown action: ${action}`};
    }
  }
}

module.exports = DocumentManager;
