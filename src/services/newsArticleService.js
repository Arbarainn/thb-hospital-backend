const prisma = require('../lib/prisma');

const newsArticleService = {
  async getAll(query = {}) {
    const { page = 1, limit = 10, search, is_published } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }
    if (is_published !== undefined) where.is_published = is_published === 'true';

    const [data, total] = await Promise.all([
      prisma.news_articles.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { created_at: 'desc' },
        include: { users: { select: { id: true, full_name: true } } },
      }),
      prisma.news_articles.count({ where }),
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
  },

  async getById(id) {
    return prisma.news_articles.findUnique({
      where: { id: Number(id) },
      include: { users: { select: { id: true, full_name: true } } },
    });
  },

  async create(data) {
    return prisma.news_articles.create({ data });
  },

  async update(id, data) {
    return prisma.news_articles.update({
      where: { id: Number(id) },
      data,
    });
  },

  async delete(id) {
    return prisma.news_articles.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = newsArticleService;
