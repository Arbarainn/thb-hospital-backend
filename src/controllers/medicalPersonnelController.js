const medicalPersonnelService = require('../services/medicalPersonnelService');

const medicalPersonnelController = {
  async getAll(req, res) {
    try {
      const result = await medicalPersonnelService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await medicalPersonnelService.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Tenaga medis tidak ditemukan' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const data = await medicalPersonnelService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const data = await medicalPersonnelService.update(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Tenaga medis tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await medicalPersonnelService.delete(req.params.id);
      res.json({ success: true, message: 'Tenaga medis berhasil dihapus' });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Tenaga medis tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = medicalPersonnelController;
