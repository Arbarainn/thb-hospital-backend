const certificateService = require('../services/certificateService');

const certificateController = {
  async getAll(req, res) {
    try {
      const result = await certificateService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await certificateService.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Sertifikat tidak ditemukan' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const body = { ...req.body };
      
      // Parse numbers and handle field mapping from frontend
      if (body.medical_personnel_id) {
        body.personnel_id = Number(body.medical_personnel_id);
        delete body.medical_personnel_id;
      } else if (body.personnel_id) {
        body.personnel_id = Number(body.personnel_id);
      }
      
      // Handle file upload
      if (req.file) {
        body.file_url = `/uploads/sertifikat/${req.file.filename}`;
      }

      // Parse dates if they exist
      if (body.tanggal_terbit) body.tanggal_terbit = new Date(body.tanggal_terbit);
      if (body.tanggal_expired) body.tanggal_expired = new Date(body.tanggal_expired);

      const data = await certificateService.create(body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const data = await certificateService.update(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Sertifikat tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await certificateService.delete(req.params.id);
      res.json({ success: true, message: 'Sertifikat berhasil dihapus' });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Sertifikat tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = certificateController;
