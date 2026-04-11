const userService = require('../services/userService');

const userController = {
  async getAll(req, res) {
    try {
      const result = await userService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userService.findByEmail(email);
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'Email atau password salah' });
      }

      // Simple password check based on request 
      // (in production, use bcrypt.compare)
      if (user.password_hash !== password) {
        return res.status(401).json({ success: false, message: 'Email atau password salah' });
      }

      // Update last login
      await userService.update(user.id, { last_login: new Date() });

      // Omit password from response
      const { password_hash, ...userData } = user;

      res.json({ success: true, message: 'Login berhasil', data: userData });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const data = await userService.getById(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
      const data = await userService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const data = await userService.update(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await userService.delete(req.params.id);
      res.json({ success: true, message: 'User berhasil dihapus' });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = userController;
