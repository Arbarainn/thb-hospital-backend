const prisma = require('../lib/prisma');

const legalPksService = {
  async getAll(query = {}) {
    const { page = 1, limit = 10, search, status, jenis_pengajuan } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { nama_mitra: { contains: search } },
        { jenis_kerjasama: { contains: search } },
      ];
    }
    if (status) where.status = status;
    if (jenis_pengajuan) where.jenis_pengajuan = jenis_pengajuan;

    const [data, total] = await Promise.all([
      prisma.legal_pks.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { created_at: 'desc' },
        include: { units: { select: { id: true, nama_unit: true } } },
      }),
      prisma.legal_pks.count({ where }),
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
  },

  async getById(id) {
    return prisma.legal_pks.findUnique({
      where: { id: Number(id) },
      include: { units: { select: { id: true, nama_unit: true } } },
    });
  },

  async create(data) {
    return prisma.legal_pks.create({ data });
  },

  async update(id, data) {
    return prisma.legal_pks.update({
      where: { id: Number(id) },
      data,
    });
  },

  async delete(id) {
    return prisma.legal_pks.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = legalPksService;
