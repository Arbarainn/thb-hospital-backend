const webBannerService = require('../services/webBannerService');

const webBannerController = {
  async getAll(req, res) {
    try {
      const result = await webBannerService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await webBannerService.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Banner tidak ditemukan' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const body = { ...req.body };
      if (body.urutan !== undefined) body.urutan = parseInt(body.urutan) || 0;
      if (body.is_active !== undefined) body.is_active = body.is_active === '1' || body.is_active === 'true' || body.is_active === true;
      if (req.file) {
        body.image_url = `/uploads/banners/${req.file.filename}`;
      }
      const data = await webBannerService.create(body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };
      if (body.urutan !== undefined) body.urutan = parseInt(body.urutan) || 0;
      if (body.is_active !== undefined) body.is_active = body.is_active === '1' || body.is_active === 'true' || body.is_active === true;
      
      if (req.file) {
        body.image_url = `/uploads/banners/${req.file.filename}`;
        
        const existing = await webBannerService.getById(req.params.id);
        if (existing && existing.image_url) {
          const fs = require('fs');
          const path = require('path');
          const oldPath = path.join(__dirname, '../../', existing.image_url);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      const data = await webBannerService.update(req.params.id, body);
      res.json({ success: true, data });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Banner tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const existing = await webBannerService.getById(req.params.id);
      if (existing && existing.image_url) {
        const filePath = path.join(__dirname, '../../', existing.image_url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      await webBannerService.delete(req.params.id);
      res.json({ success: true, message: 'Banner berhasil dihapus' });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Banner tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = webBannerController;
