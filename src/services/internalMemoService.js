const prisma = require('../lib/prisma');

const internalMemoService = {
  async getAll(query = {}) {
    const { page = 1, limit = 10, search, kategori, status } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { perihal: { contains: search } },
        { kepada: { contains: search } },
        { dari: { contains: search } },
      ];
    }
    if (kategori) where.kategori = kategori;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.internal_memos.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { tanggal: 'desc' },
        include: { users: { select: { id: true, full_name: true } } },
      }),
      prisma.internal_memos.count({ where }),
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
  },

  async getById(id) {
    return prisma.internal_memos.findUnique({
      where: { id: Number(id) },
      include: { users: { select: { id: true, full_name: true } } },
    });
  },

  async create(data) {
    return prisma.internal_memos.create({ data });
  },

  async update(id, data) {
    return prisma.internal_memos.update({
      where: { id: Number(id) },
      data,
    });
  },

  async delete(id) {
    return prisma.internal_memos.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = internalMemoService;
