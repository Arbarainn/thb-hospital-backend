const prisma = require('../lib/prisma');

const facilityService = {
  async getAll(query = {}) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.facilities.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { id: 'asc' },
      }),
      prisma.facilities.count({ where }),
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
  },

  async getById(id) {
    return prisma.facilities.findUnique({
      where: { id: Number(id) },
    });
  },

  async create(data) {
    return prisma.facilities.create({ data });
  },

  async update(id, data) {
    return prisma.facilities.update({
      where: { id: Number(id) },
      data,
    });
  },

  async delete(id) {
    return prisma.facilities.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = facilityService;
