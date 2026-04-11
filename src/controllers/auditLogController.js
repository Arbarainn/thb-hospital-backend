const auditLogService = require('../services/auditLogService');

const auditLogController = {
  async getAll(req, res) {
    try {
      const result = await auditLogService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await auditLogService.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Audit log tidak ditemukan' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const data = await auditLogService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await auditLogService.delete(req.params.id);
      res.json({ success: true, message: 'Audit log berhasil dihapus' });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Audit log tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = auditLogController;
