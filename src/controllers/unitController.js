const unitService = require('../services/unitService');

const unitController = {
  async getAll(req, res) {
    try {
      const result = await unitService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await unitService.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Unit tidak ditemukan' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const data = await unitService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const data = await unitService.update(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Unit tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await unitService.delete(req.params.id);
      res.json({ success: true, message: 'Unit berhasil dihapus' });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Unit tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = unitController;
