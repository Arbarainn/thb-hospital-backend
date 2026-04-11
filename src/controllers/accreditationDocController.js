const accreditationDocService = require('../services/accreditationDocService');

const accreditationDocController = {
  async getAll(req, res) {
    try {
      const result = await accreditationDocService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await accreditationDocService.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Dokumen akreditasi tidak ditemukan' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const body = { ...req.body };
      if (req.file) {
        body.file_url = `/uploads/panduan/${req.file.filename}`;
      }
      const data = await accreditationDocService.create(body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };
      if (req.file) {
        body.file_url = `/uploads/panduan/${req.file.filename}`;
        
        // Delete old file
        const fs = require('fs');
        const path = require('path');
        const existing = await accreditationDocService.getById(req.params.id);
        if (existing && existing.file_url) {
          const oldPath = path.join(__dirname, '../../', existing.file_url);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }
      const data = await accreditationDocService.update(req.params.id, body);
      res.json({ success: true, data });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Dokumen akreditasi tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const fs = require('fs');
      const path = require('path');

      const existing = await accreditationDocService.getById(req.params.id);
      if (existing && existing.file_url) {
        const filePath = path.join(__dirname, '../../', existing.file_url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      await accreditationDocService.delete(req.params.id);
      res.json({ success: true, message: 'Dokumen akreditasi berhasil dihapus' });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Dokumen akreditasi tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = accreditationDocController;
