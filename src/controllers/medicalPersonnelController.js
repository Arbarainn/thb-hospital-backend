const medicalPersonnelService = require('../services/medicalPersonnelService');

const medicalPersonnelController = {
  async getAll(req, res) {
    try {
      const result = await medicalPersonnelService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await medicalPersonnelService.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Tenaga medis tidak ditemukan' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const body = { ...req.body };
      
      // Parse dates
      const dateFields = [
        'sip_start_date', 'sip_end_date', 
        'pks_start_date', 'pks_end_date',
        'sk_start_date', 'sk_end_date'
      ];
      dateFields.forEach(field => {
        if (body[field]) body[field] = new Date(body[field]);
      });

      // Handle unit relation
      if (body.unit_id) {
        body.units = { connect: { id: Number(body.unit_id) } };
        delete body.unit_id;
      }

      // Handle files
      if (req.files) {
        if (req.files.str_file) body.str_file_url = `/uploads/personnel/${req.files.str_file[0].filename}`;
        if (req.files.sip_file) body.sip_file_url = `/uploads/personnel/${req.files.sip_file[0].filename}`;
        if (req.files.pks_file) body.pks_file_url = `/uploads/personnel/${req.files.pks_file[0].filename}`;
        if (req.files.sk_file) body.sk_file_url = `/uploads/personnel/${req.files.sk_file[0].filename}`;
      }

      const data = await medicalPersonnelService.create(body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const body = { ...req.body };
      
      // Parse dates
      const dateFields = [
        'sip_start_date', 'sip_end_date', 
        'pks_start_date', 'pks_end_date',
        'sk_start_date', 'sk_end_date'
      ];
      dateFields.forEach(field => {
        if (body[field]) body[field] = new Date(body[field]);
      });

      // Handle unit relation
      if (body.unit_id) {
        body.units = { connect: { id: Number(body.unit_id) } };
        delete body.unit_id;
      }

      // Handle files
      if (req.files) {
        if (req.files.str_file) body.str_file_url = `/uploads/personnel/${req.files.str_file[0].filename}`;
        if (req.files.sip_file) body.sip_file_url = `/uploads/personnel/${req.files.sip_file[0].filename}`;
        if (req.files.pks_file) body.pks_file_url = `/uploads/personnel/${req.files.pks_file[0].filename}`;
        if (req.files.sk_file) body.sk_file_url = `/uploads/personnel/${req.files.sk_file[0].filename}`;
      }

      const data = await medicalPersonnelService.update(req.params.id, body);
      res.json({ success: true, data });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Tenaga medis tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await medicalPersonnelService.delete(req.params.id);
      res.json({ success: true, message: 'Tenaga medis berhasil dihapus' });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'Tenaga medis tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = medicalPersonnelController;
