const newsArticleService = require('../services/newsArticleService');

const newsArticleController = {
  async getAll(req, res) {
    try {
      const result = await newsArticleService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await newsArticleService.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const body = { ...req.body };
      if (body.is_published !== undefined) body.is_published = body.is_published === '1' || body.is_published === 'true' || body.is_published === true;
      if (req.file) {
        body.image_url = `/uploads/news/${req.file.filename}`;
      }
      const data = await newsArticleService.create(body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };
      if (body.is_published !== undefined) body.is_published = body.is_published === '1' || body.is_published === 'true' || body.is_published === true;
      
      if (req.file) {
        body.image_url = `/uploads/news/${req.file.filename}`;
        
        const existing = await newsArticleService.getById(req.params.id);
        if (existing && existing.image_url) {
          const fs = require('fs');
          const path = require('path');
          const oldPath = path.join(__dirname, '../../', existing.image_url);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      const data = await newsArticleService.update(req.params.id, body);
      res.json({ success: true, data });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const existing = await newsArticleService.getById(req.params.id);
      if (existing && existing.image_url) {
        const filePath = path.join(__dirname, '../../', existing.image_url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      await newsArticleService.delete(req.params.id);
      res.json({ success: true, message: 'Berita berhasil dihapus' });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = newsArticleController;
