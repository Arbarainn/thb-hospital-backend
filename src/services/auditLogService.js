const prisma = require('../lib/prisma');

const auditLogService = {
  async getAll(query = {}) {
    const { page = 1, limit = 10, module, action, user_id } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (module) where.module = { contains: module };
    if (action) where.action = action;
    if (user_id) where.user_id = Number(user_id);

    const [data, total] = await Promise.all([
      prisma.audit_logs.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { timestamp: 'desc' },
        include: { users: { select: { id: true, full_name: true } } },
      }),
      prisma.audit_logs.count({ where }),
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
  },

  async getById(id) {
    return prisma.audit_logs.findUnique({
      where: { id: Number(id) },
      include: { users: { select: { id: true, full_name: true } } },
    });
  },

  async create(data) {
    return prisma.audit_logs.create({ data });
  },

  async delete(id) {
    return prisma.audit_logs.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = auditLogService;
