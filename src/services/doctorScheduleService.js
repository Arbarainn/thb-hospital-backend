const prisma = require('../lib/prisma');

const doctorScheduleService = {
  async getAll(query = {}) {
    const { page = 1, limit = 10, search, hari, poli, is_active } = query;
    const offset = (page - 1) * limit;

    let whereSql = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereSql += ' AND (nama_dokter LIKE ? OR spesialis LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (hari) {
      whereSql += ' AND hari LIKE ?';
      params.push(`%${hari}%`);
    }
    if (poli) {
      whereSql += ' AND poli LIKE ?';
      params.push(`%${poli}%`);
    }
    if (is_active !== undefined) {
      whereSql += ' AND is_active = ?';
      params.push(is_active === 'true' ? 1 : 0);
    }

    const data = await prisma.$queryRawUnsafe(
      `SELECT * FROM doctor_schedules ${whereSql} ORDER BY nama_dokter ASC LIMIT ? OFFSET ?`,
      ...params, Number(limit), Number(offset)
    );

    const countResult = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) as total FROM doctor_schedules ${whereSql}`,
      ...params
    );
    const total = Number(countResult[0].total);

    // Convert BigInt IDs if necessary
    const processedData = data.map(item => {
      if (item.id && typeof item.id === 'bigint') item.id = Number(item.id);
      return item;
    });

    return { data: processedData, total, page: Number(page), limit: Number(limit) };
  },

  async getById(id) {
    const rows = await prisma.$queryRawUnsafe(`SELECT * FROM doctor_schedules WHERE id = ?`, Number(id));
    const item = rows[0];
    if (item && typeof item.id === 'bigint') item.id = Number(item.id);
    return item;
  },

  async create(data) {
    const { 
      nama_dokter, 
      spesialis, 
      poli, 
      hari, 
      jam, 
      jam_mulai, 
      jam_selesai, 
      kuota, 
      kuota_pasien, 
      foto_dokter, 
      is_active 
    } = data;
    
    // Map kuota from frontend 'kuota' or 'kuota_pasien'
    const finalKuota = Number(kuota || kuota_pasien || 20);
    // Map jam from frontend 'jam' or combine mulai/selesai
    const finalJam = jam || (jam_mulai && jam_selesai ? `${jam_mulai} - ${jam_selesai}` : '');
    const hariStr = Array.isArray(hari) ? hari.join(', ') : (hari || '');
    
    await prisma.$executeRawUnsafe(
      `INSERT INTO doctor_schedules (nama_dokter, spesialis, poli, hari, jam, jam_mulai, jam_selesai, kuota_pasien, foto_dokter, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      nama_dokter, spesialis, poli, hariStr, finalJam, jam_mulai || null, jam_selesai || null, finalKuota, foto_dokter || null, is_active ? 1 : 0
    );
    
    const rows = await prisma.$queryRawUnsafe(`SELECT * FROM doctor_schedules ORDER BY id DESC LIMIT 1`);
    const item = rows[0];
    if (item && typeof item.id === 'bigint') item.id = Number(item.id);
    return item;
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    
    // Handle special field mapping
    const processedData = { ...data };
    if (processedData.kuota !== undefined) {
      processedData.kuota_pasien = Number(processedData.kuota);
      delete processedData.kuota;
    }
    if (processedData.jam !== undefined && (processedData.jam_mulai === undefined || processedData.jam_selesai === undefined)) {
      // Keep jam as is
    } else if (processedData.jam_mulai && processedData.jam_selesai) {
      processedData.jam = `${processedData.jam_mulai} - ${processedData.jam_selesai}`;
    }

    for (let [key, value] of Object.entries(processedData)) {
      if (key === 'id') continue;
      if (key === 'hari' && Array.isArray(value)) value = value.join(', ');
      
      fields.push(`\`${key}\` = ?`);
      values.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
    }
    
    if (fields.length > 0) {
      values.push(Number(id));
      await prisma.$executeRawUnsafe(
        `UPDATE doctor_schedules SET ${fields.join(', ')} WHERE id = ?`,
        ...values
      );
    }
    
    return this.getById(id);
  },

  async delete(id) {
    return prisma.$executeRawUnsafe(`DELETE FROM doctor_schedules WHERE id = ?`, Number(id));
  },
};

module.exports = doctorScheduleService;
