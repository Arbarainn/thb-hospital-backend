const prisma = require('../lib/prisma');

const dischargeIndicatorService = {
  async getAll(query = {}) {
    const { page = 1, limit = 10, search, no_rm } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { nama_pasien: { contains: search } },
        { no_rm: { contains: search } },
      ];
    }
    if (no_rm) where.no_rm = no_rm;

    const [data, total] = await Promise.all([
      prisma.discharge_indicators.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { created_at: 'desc' },
        include: { users: { select: { id: true, full_name: true } } },
      }),
      prisma.discharge_indicators.count({ where }),
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
  },

  async getById(id) {
    return prisma.discharge_indicators.findUnique({
      where: { id: Number(id) },
      include: { users: { select: { id: true, full_name: true } } },
    });
  },

  async create(data) {
    return prisma.discharge_indicators.create({ data });
  },

  async update(id, data) {
    return prisma.discharge_indicators.update({
      where: { id: Number(id) },
      data,
    });
  },

  async delete(id) {
    return prisma.discharge_indicators.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = dischargeIndicatorService;
