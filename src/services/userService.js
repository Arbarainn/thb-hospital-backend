const prisma = require('../lib/prisma');

const userService = {
  // Get all users
  async getAll(query = {}) {
    const { page = 1, limit = 10, search, role, is_active } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { username: { contains: search } },
        { full_name: { contains: search } },
      ];
    }
    if (role) where.role = role;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const [data, total] = await Promise.all([
      prisma.users.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          username: true,
          full_name: true,
          role: true,
          last_login: true,
          is_active: true,
          created_at: true,
        },
      }),
      prisma.users.count({ where }),
    ]);

    if (data.length > 0) {
      const ids = data.map(u => u.id);
      const emailRows = await prisma.$queryRawUnsafe(`SELECT id, email FROM users WHERE id IN (${ids.join(',')})`);
      const emailMap = {};
      for (const row of emailRows) {
        emailMap[Number(row.id)] = row.email;
      }
      for (const item of data) {
        item.email = emailMap[item.id] || null;
      }
    }

    return { data, total, page: Number(page), limit: Number(limit) };
  },

  // Get user by ID
  async getById(id) {
    const data = await prisma.users.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        username: true,
        full_name: true,
        role: true,
        last_login: true,
        is_active: true,
        created_at: true,
      },
    });

    if (data) {
       const rows = await prisma.$queryRawUnsafe(`SELECT email FROM users WHERE id = ?`, Number(id));
       if (rows && rows.length > 0) data.email = rows[0].email;
    }

    return data;
  },

  // Find by email for auth
  async findByEmail(email) {
    const defaultCheck = await prisma.$queryRaw`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
    if (defaultCheck.length > 0) {
      const user = defaultCheck[0];
      if (typeof user.id === 'bigint') user.id = Number(user.id);
      return user;
    }
    return null;
  },

  // Create user
  async create(data) {
    const { username, email, password_hash, full_name, role, is_active } = data;
    await prisma.$executeRawUnsafe(
      `INSERT INTO users (username, email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)`,
      username, email, password_hash, full_name, role, is_active ? 1 : 0
    );
    const rows = await prisma.$queryRawUnsafe(`SELECT * FROM users WHERE email = ?`, email);
    const user = rows[0];
    if (user && typeof user.id === 'bigint') user.id = Number(user.id);
    return user;
  },

  // Update user
  async update(id, data) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
    }
    values.push(Number(id)); // WHERE id = ?
    
    if (fields.length > 0) {
      await prisma.$executeRawUnsafe(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        ...values
      );
    }
    
    const rows = await prisma.$queryRawUnsafe(`SELECT * FROM users WHERE id = ?`, Number(id));
    const user = rows[0];
    if (user && typeof user.id === 'bigint') user.id = Number(user.id);
    return user;
  },

  // Delete user
  async delete(id) {
    return prisma.users.delete({
      where: { id: Number(id) },
    });
  },
};

module.exports = userService;
