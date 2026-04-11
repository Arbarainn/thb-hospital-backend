const prisma = require('../lib/prisma');

const dashboardController = {
  async getStats(req, res) {
    try {
      // 1. Counts for Cards (Basic error protection with default 0)
      const counts = await Promise.all([
        prisma.discharge_indicators.count({ where: { status_kepulangan: 'Rawat Inap' } }).catch(() => 0),
        prisma.discharge_indicators.count({ where: { status_kepulangan: 'Rencana Pulang' } }).catch(() => 0),
        prisma.discharge_indicators.count({ where: { status_kepulangan: 'Telat Pulang' } }).catch(() => 0),
        prisma.legal_pks.count({ where: { status: 'Aktif' } }).catch(() => 0),
        prisma.medical_personnel.count().catch(() => 0),
        prisma.internal_memos.count({ where: { status: 'Draft' } }).catch(() => 0)
      ]);

      const [totalInpatients, plannedDischarges, lateDischarges, activePks, totalPersonnel, pendingMemos] = counts;

      // 2. Data for Charts (Simple fallback for now to avoid date-fns errors)
      const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
      const chartData = days.map(day => ({
        name: day,
        visits: 0,
        discharges: 0
      }));

      // Try to get actual chart counts if possible
      try {
        const now = new Date();
        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(now.getDate() - (6 - i));
          d.setHours(0, 0, 0, 0);
          
          const nextD = new Date(d);
          nextD.setDate(d.getDate() + 1);

          const visits = await prisma.discharge_indicators.count({
            where: { tgl_masuk: { gte: d, lt: nextD } }
          }).catch(() => 0);

          const discharges = await prisma.discharge_indicators.count({
            where: { tgl_keluar: { gte: d, lt: nextD } }
          }).catch(() => 0);

          chartData[i].visits = visits;
          chartData[i].discharges = discharges;
          chartData[i].name = d.toLocaleDateString('id-ID', { weekday: 'short' });
        }
      } catch (e) {
        console.error('Chart processing error:', e);
      }

      // 3. Recent Discharge indicators
      const recentDischarges = await prisma.discharge_indicators.findMany({
        take: 5,
        orderBy: { created_at: 'desc' }
      }).catch(() => []);

      res.json({
        success: true,
        stats: {
          inpatients: totalInpatients,
          planned: plannedDischarges,
          late: lateDischarges,
          activePks,
          personnel: totalPersonnel,
          pendingMemos
        },
        chartData,
        recentDischarges
      });
    } catch (error) {
      console.error('Dashboard Stats Error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = dashboardController;
