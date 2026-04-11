const dischargeIndicatorService = require('../services/dischargeIndicatorService');

const dischargeIndicatorController = {
  async getAll(req, res) {
    try {
      const result = await dischargeIndicatorService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await dischargeIndicatorService.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Data discharge tidak ditemukan' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const body = { ...req.body };
      if (body.tgl_masuk) body.tgl_masuk = new Date(body.tgl_masuk);
      if (body.tgl_keluar) body.tgl_keluar = new Date(body.tgl_keluar);
      const data = await dischargeIndicatorService.create(body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };
      if (body.tgl_masuk) body.tgl_masuk = new Date(body.tgl_masuk);
      if (body.tgl_keluar) body.tgl_keluar = new Date(body.tgl_keluar);
      const data = await dischargeIndicatorService.update(req.params.id, body);
      res.json({ success: true, data });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Data discharge tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await dischargeIndicatorService.delete(req.params.id);
      res.json({ success: true, message: 'Data discharge berhasil dihapus' });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Data discharge tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = dischargeIndicatorController;
