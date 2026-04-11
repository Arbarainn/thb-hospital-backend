const internalMemoService = require('../services/internalMemoService');

const internalMemoController = {
  async getAll(req, res) {
    try {
      const result = await internalMemoService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await internalMemoService.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Memo tidak ditemukan' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const body = { ...req.body };
      if (body.tanggal) body.tanggal = new Date(body.tanggal);
      const data = await internalMemoService.create(body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };
      if (body.tanggal) body.tanggal = new Date(body.tanggal);
      const data = await internalMemoService.update(req.params.id, body);
      res.json({ success: true, data });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Memo tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await internalMemoService.delete(req.params.id);
      res.json({ success: true, message: 'Memo berhasil dihapus' });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Memo tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = internalMemoController;
