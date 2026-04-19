const prisma = require('../lib/prisma');

const medicalPersonnelService = {
  async getAll(query = {}) {
    const { page = 1, limit = 10, search, status, unit_id } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { nama: { contains: search } },
        { str_number: { contains: search } },
        { sip_number: { contains: search } },
      ];
    }
    if (status) where.status = status;
    if (unit_id) where.unit_id = Number(unit_id);

    const [data, total] = await Promise.all([
      prisma.medical_personnel.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { input_time: 'desc' },
        include: {
          units: { select: { id: true, nama_unit: true } },
          certificates: true,
        },
      }),
      prisma.medical_personnel.count({ where }),
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
  },

  async getById(id) {
    return prisma.medical_personnel.findUnique({
      where: { id: Number(id) },
      include: {
        units: { select: { id: true, nama_unit: true } },
        certificates: true,
      },
    });
  },

  async create(data) {
    return prisma.medical_personnel.create({ data });
  },

  async update(id, data) {
    return prisma.medical_personnel.update({
      where: { id: Number(id) },
      data,
    });
  },

  async delete(id) {
    return prisma.medical_personnel.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = medicalPersonnelService;
