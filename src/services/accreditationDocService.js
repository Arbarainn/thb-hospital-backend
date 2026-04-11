const prisma = require('../lib/prisma');

const accreditationDocService = {
  async getAll(query = {}) {
    const { page = 1, limit = 10, search, standar_code } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { standar_code: { contains: search } },
        { ep_code: { contains: search } },
        { deskripsi: { contains: search } },
      ];
    }
    if (standar_code) where.standar_code = standar_code;

    const [data, total] = await Promise.all([
      prisma.accreditation_docs.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { input_time: 'desc' },
        include: { users: { select: { id: true, full_name: true } } },
      }),
      prisma.accreditation_docs.count({ where }),
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
  },

  async getById(id) {
    return prisma.accreditation_docs.findUnique({
      where: { id: Number(id) },
      include: { users: { select: { id: true, full_name: true } } },
    });
  },

  async create(data) {
    return prisma.accreditation_docs.create({ data });
  },

  async update(id, data) {
    return prisma.accreditation_docs.update({
      where: { id: Number(id) },
      data,
    });
  },

  async delete(id) {
    return prisma.accreditation_docs.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = accreditationDocService;
