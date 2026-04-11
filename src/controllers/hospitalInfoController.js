const hospitalInfoService = require('../services/hospitalInfoService');

const hospitalInfoController = {
  async getAll(req, res) {
    try {
      const data = await hospitalInfoService.getAll();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await hospitalInfoService.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Info rumah sakit tidak ditemukan' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getByKey(req, res) {
    try {
      const data = await hospitalInfoService.getByKey(req.params.key);
      if (!data) return res.status(404).json({ success: false, message: 'Key tidak ditemukan' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const data = await hospitalInfoService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const data = await hospitalInfoService.update(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Info rumah sakit tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async upsertByKey(req, res) {
    try {
      const { key, value } = req.body;
      const data = await hospitalInfoService.upsertByKey(key, value);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await hospitalInfoService.delete(req.params.id);
      res.json({ success: true, message: 'Info rumah sakit berhasil dihapus' });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Info rumah sakit tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = hospitalInfoController;
