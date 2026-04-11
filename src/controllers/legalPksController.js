const legalPksService = require('../services/legalPksService');

const legalPksController = {
  async getAll(req, res) {
    try {
      const result = await legalPksService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await legalPksService.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'PKS tidak ditemukan' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const body = { ...req.body };
      
      // Parse numeric fields and relations
      if (body.unit_pengusul_id) {
        body.units = { connect: { id: Number(body.unit_pengusul_id) } };
        delete body.unit_pengusul_id;
      }
      
      // Parse dates
      if (body.tanggal_mulai) body.tanggal_mulai = new Date(body.tanggal_mulai);
      if (body.tanggal_berakhir) body.tanggal_berakhir = new Date(body.tanggal_berakhir);

      // Parse decimal
      if (body.nilai_kerjasama) body.nilai_kerjasama = Number(body.nilai_kerjasama);

      // Handle file upload
      if (req.file) {
        body.file_pks_url = `/uploads/legal/${req.file.filename}`;
      }

      const data = await legalPksService.create(body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };
      
      // Parse numeric fields and relations
      if (body.unit_pengusul_id) {
        body.units = { connect: { id: Number(body.unit_pengusul_id) } };
        delete body.unit_pengusul_id;
      }
      
      // Parse dates
      if (body.tanggal_mulai) body.tanggal_mulai = new Date(body.tanggal_mulai);
      if (body.tanggal_berakhir) body.tanggal_berakhir = new Date(body.tanggal_berakhir);

      // Parse decimal
      if (body.nilai_kerjasama) body.nilai_kerjasama = Number(body.nilai_kerjasama);

      // Handle file upload
      if (req.file) {
        body.file_pks_url = `/uploads/legal/${req.file.filename}`;
        
        // Delete old file
        const fs = require('fs');
        const path = require('path');
        const existing = await legalPksService.getById(req.params.id);
        if (existing && existing.file_pks_url) {
          const oldPath = path.join(__dirname, '../../', existing.file_pks_url);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      const data = await legalPksService.update(req.params.id, body);
      res.json({ success: true, data });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'PKS tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const existing = await legalPksService.getById(req.params.id);
      if (existing && existing.file_pks_url) {
        const filePath = path.join(__dirname, '../../', existing.file_pks_url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      await legalPksService.delete(req.params.id);
      res.json({ success: true, message: 'PKS berhasil dihapus' });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'PKS tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = legalPksController;
