const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Website Management database...");
  
  // 1. Hospital Info
  const infoKeys = {
    'namaRs': 'RS Taman Harapan Baru (Live Data)',
    'alamat': 'Jl. Pulo Ribung Raya No.1, Bekasi',
    'email': 'layanan@rsthb.co.id',
    'heroSubtitle': 'Rumah Sakit Pilihan Cerdas Keluarga Anda',
    'jamBuka': 'IGD 24 Jam',
    'telepon': '(021) 888-9999',
    'whatsapp': '628111222333'
  };
  for (const [key, val] of Object.entries(infoKeys)) {
    // Check if exists
    const existing = await prisma.$queryRawUnsafe(`SELECT id FROM hospital_info WHERE \`key\` = ?`, key);
    if (existing.length === 0) {
      await prisma.$executeRawUnsafe(`INSERT INTO hospital_info (\`key\`, \`value\`) VALUES (?, ?)`, key, val);
    } else {
      await prisma.$executeRawUnsafe(`UPDATE hospital_info SET \`value\` = ? WHERE \`key\` = ?`, val, key);
    }
  }

  // 2. Doctor Schedules
  const doctorsCount = await prisma.$queryRawUnsafe(`SELECT count(*) as total FROM doctor_schedules`);
  if (Number(doctorsCount[0].total) === 0) {
     await prisma.$executeRawUnsafe(`INSERT INTO doctor_schedules (nama_dokter, spesialis, poli, hari, jam, is_active) VALUES (?, ?, ?, ?, ?, ?)`, 
       'Dr. Budi Santoso', 'Spesialis Penyakit Dalam', 'Poli Penyakit Dalam', 'Senin', '08:00 - 14:00', 1);
     await prisma.$executeRawUnsafe(`INSERT INTO doctor_schedules (nama_dokter, spesialis, poli, hari, jam, is_active) VALUES (?, ?, ?, ?, ?, ?)`, 
       'Dr. Ayu Lestari', 'Spesialis Anak', 'Poli Anak', 'Selasa', '09:00 - 15:00', 1);
  }

  // 3. Facilities
  const facCount = await prisma.$queryRawUnsafe(`SELECT count(*) as total FROM facilities`);
  if (Number(facCount[0].total) === 0) {
    await prisma.$executeRawUnsafe(`INSERT INTO facilities (title, description, icon_code) VALUES (?, ?, ?)`, 
      'Instalasi Gawat Darurat (IGD) 24 Jam', 'Pusat penanganan kasus kegawatdaruratan yang dilengkapi tim medis handal.', '🚑');
    await prisma.$executeRawUnsafe(`INSERT INTO facilities (title, description, icon_code) VALUES (?, ?, ?)`, 
      'Laboratorium Sentral', 'Fasilitas diagnostik modern dengan akurasi tinggi.', '🔬');
  }

  // 4. Web Banners
  const bannerCount = await prisma.$queryRawUnsafe(`SELECT count(*) as total FROM web_banners`);
  if (Number(bannerCount[0].total) === 0) {
     await prisma.$executeRawUnsafe(`INSERT INTO web_banners (image_url, link_url, is_active, urutan, created_at) VALUES (?, ?, ?, ?, NOW())`, 
       'https://images.unsplash.com/photo-1538108149393-cebb47ac8dcd?q=80&w=600&auto=format&fit=crop', '#', 1, 1);
  }

  // 5. News Articles
  const newsCount = await prisma.$queryRawUnsafe(`SELECT count(*) as total FROM news_articles`);
  if (Number(newsCount[0].total) === 0) {
     await prisma.$executeRawUnsafe(`INSERT INTO news_articles (title, content, image_url, published_at, is_published, created_at) VALUES (?, ?, ?, NOW(), ?, NOW())`, 
       'Layanan Pendaftaran Online Kini Hadir di RS THB', 'Untuk memudahkan pasien, kini aplikasi pendaftaran online RS THB sudah bisa diunduh.', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop', 1);
  }

  console.log("Database seeded successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
