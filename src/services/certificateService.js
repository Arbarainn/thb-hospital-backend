const prisma = require('../lib/prisma');

const certificateService = {
  async getAll(query = {}) {
    const { page = 1, limit = 10, search, personnel_id } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.nama_sertifikat = { contains: search };
    }
    if (personnel_id) where.personnel_id = Number(personnel_id);

    const [data, total] = await Promise.all([
      prisma.certificates.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { tanggal_terbit: 'desc' },
        include: {
          medical_personnel: { select: { id: true, nama: true } },
        },
      }),
      prisma.certificates.count({ where }),
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
  },

  async getById(id) {
    return prisma.certificates.findUnique({
      where: { id: Number(id) },
      include: {
        medical_personnel: { select: { id: true, nama: true } },
      },
    });
  },

  async create(data) {
    return prisma.certificates.create({ data });
  },

  async update(id, data) {
    return prisma.certificates.update({
      where: { id: Number(id) },
      data,
    });
  },

  async delete(id) {
    return prisma.certificates.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = certificateService;
