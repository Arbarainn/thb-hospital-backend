const prisma = require('../lib/prisma');

const hospitalInfoService = {
  async getAll() {
    return prisma.hospital_info.findMany({
      orderBy: { key: 'asc' },
    });
  },

  async getByKey(key) {
    return prisma.hospital_info.findUnique({
      where: { key },
    });
  },

  async getById(id) {
    return prisma.hospital_info.findUnique({
      where: { id: Number(id) },
    });
  },

  async create(data) {
    return prisma.hospital_info.create({ data });
  },

  async update(id, data) {
    return prisma.hospital_info.update({
      where: { id: Number(id) },
      data: { ...data, updated_at: new Date() },
    });
  },

  async upsertByKey(key, value) {
    return prisma.hospital_info.upsert({
      where: { key },
      update: { value, updated_at: new Date() },
      create: { key, value },
    });
  },

  async delete(id) {
    return prisma.hospital_info.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = hospitalInfoService;
