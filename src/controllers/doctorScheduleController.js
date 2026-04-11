const doctorScheduleService = require('../services/doctorScheduleService');
const path = require('path');
const fs = require('fs');

const doctorScheduleController = {
  async getAll(req, res) {
    try {
      const result = await doctorScheduleService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await doctorScheduleService.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Jadwal dokter tidak ditemukan' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const body = { ...req.body };

      // Normalize is_active from FormData string to boolean
      if (body.is_active !== undefined) {
        body.is_active = body.is_active === '1' || body.is_active === 'true' || body.is_active === true;
      }

      // If a file was uploaded via multer, build the public URL
      if (req.file) {
        body.foto_dokter = `/uploads/doctors/${req.file.filename}`;
      }

      const data = await doctorScheduleService.create(body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };

      // Normalize is_active from FormData string to boolean
      if (body.is_active !== undefined) {
        body.is_active = body.is_active === '1' || body.is_active === 'true' || body.is_active === true;
      }
      // If a new file was uploaded, build URL and delete old photo
      if (req.file) {
        body.foto_dokter = `/uploads/doctors/${req.file.filename}`;

        // Try to delete the old photo file
        const existing = await doctorScheduleService.getById(req.params.id);
        if (existing && existing.foto_dokter) {
          const oldPath = path.join(__dirname, '../../', existing.foto_dokter);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      }

      const data = await doctorScheduleService.update(req.params.id, body);
      res.json({ success: true, data });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Jadwal dokter tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      // Delete the photo file before removing DB record
      const existing = await doctorScheduleService.getById(req.params.id);
      if (existing && existing.foto_dokter) {
        const photoPath = path.join(__dirname, '../../', existing.foto_dokter);
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
        }
      }

      await doctorScheduleService.delete(req.params.id);
      res.json({ success: true, message: 'Jadwal dokter berhasil dihapus' });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Jadwal dokter tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = doctorScheduleController;
