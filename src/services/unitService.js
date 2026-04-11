const prisma = require('../lib/prisma');

const unitService = {
  async getAll(query = {}) {
    const { page = 1, limit = 50, search } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.nama_unit = { contains: search };
    }

    const [data, total] = await Promise.all([
      prisma.units.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { nama_unit: 'asc' },
      }),
      prisma.units.count({ where }),
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
  },

  async getById(id) {
    return prisma.units.findUnique({
      where: { id: Number(id) },
      include: {
        medical_personnel: true,
        legal_pks: true,
      },
    });
  },

  async create(data) {
    return prisma.units.create({ data });
  },

  async update(id, data) {
    return prisma.units.update({
      where: { id: Number(id) },
      data,
    });
  },

  async delete(id) {
    return prisma.units.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = unitService;
