const prisma = require('../lib/prisma');

const webBannerService = {
  async getAll(query = {}) {
    const { page = 1, limit = 10, is_active } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const [data, total] = await Promise.all([
      prisma.web_banners.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { urutan: 'asc' },
      }),
      prisma.web_banners.count({ where }),
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
  },

  async getById(id) {
    return prisma.web_banners.findUnique({
      where: { id: Number(id) },
    });
  },

  async create(data) {
    return prisma.web_banners.create({ data });
  },

  async update(id, data) {
    return prisma.web_banners.update({
      where: { id: Number(id) },
      data,
    });
  },

  async delete(id) {
    return prisma.web_banners.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = webBannerService;
