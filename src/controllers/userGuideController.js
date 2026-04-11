const prisma = require('../lib/prisma');
const fs = require('fs');
const path = require('path');

const userGuideController = {
  async getAll(req, res) {
    try {
      const data = await prisma.user_guides.findMany({
        orderBy: { created_at: 'desc' }
      });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await prisma.user_guides.findUnique({
        where: { id: parseInt(req.params.id) }
      });
      if (!data) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const { judul, deskripsi } = req.body;
      const fileUrl = req.file ? `/uploads/panduan/${req.file.filename}` : null;
      
      if (!fileUrl) {
         return res.status(400).json({ success: false, message: 'File dokumen (PDF/Word) wajib diupload' });
      }

      const data = await prisma.user_guides.create({
        data: {
          judul,
          deskripsi,
          file_url: fileUrl
        }
      });
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { judul, deskripsi } = req.body;
      const fileUrl = req.file ? `/uploads/panduan/${req.file.filename}` : null;

      const current = await prisma.user_guides.findUnique({ where: { id: parseInt(id) } });
      if (!current) {
         return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
      }

      const updateData = { judul, deskripsi };
      if (fileUrl) {
        updateData.file_url = fileUrl;
        
        // Hapus file lama jika ada file baru diupload
        if (current.file_url) {
          const oldPath = path.join(__dirname, '../../', current.file_url);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      }

      const data = await prisma.user_guides.update({
        where: { id: parseInt(id) },
        data: updateData
      });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const current = await prisma.user_guides.findUnique({ where: { id: parseInt(id) } });

      if (!current) {
        return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
      }

      // Hapus file
      if (current.file_url) {
        const filePath = path.join(__dirname, '../../', current.file_url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await prisma.user_guides.delete({ where: { id: parseInt(id) } });
      res.json({ success: true, message: 'Data berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = userGuideController;
