const express = require('express');
const router = express.Router();
const { 
  uploadDoctorPhoto, 
  uploadBannerImage, 
  uploadNewsImage, 
  uploadDocument, 
  uploadCertificate,
  uploadLegalDocument,
  uploadPersonnelDocument 
} = require('../config/upload');

// ─── Controllers ─────────────────────────────────────────────
const userController = require('../controllers/userController');
const accreditationDocController = require('../controllers/accreditationDocController');
const auditLogController = require('../controllers/auditLogController');
const certificateController = require('../controllers/certificateController');
const dischargeIndicatorController = require('../controllers/dischargeIndicatorController');
const doctorScheduleController = require('../controllers/doctorScheduleController');
const facilityController = require('../controllers/facilityController');
const hospitalInfoController = require('../controllers/hospitalInfoController');
const internalMemoController = require('../controllers/internalMemoController');
const legalPksController = require('../controllers/legalPksController');
const medicalPersonnelController = require('../controllers/medicalPersonnelController');
const newsArticleController = require('../controllers/newsArticleController');
const unitController = require('../controllers/unitController');
const webBannerController = require('../controllers/webBannerController');
const userGuideController = require('../controllers/userGuideController');
const dashboardController = require('../controllers/dashboardController');

// ─── Dashboard ────────────────────────────────────────────────
router.get('/dashboard/stats', dashboardController.getStats);

// ─── Users ───────────────────────────────────────────────────
router.post('/users/login', userController.login);
router.get('/users', userController.getAll);
router.get('/users/:id', userController.getById);
router.post('/users', userController.create);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);

// ─── Accreditation Docs ──────────────────────────────────────
router.get('/accreditation-docs', accreditationDocController.getAll);
router.get('/accreditation-docs/:id', accreditationDocController.getById);
router.post('/accreditation-docs', uploadDocument.single('file'), accreditationDocController.create);
router.put('/accreditation-docs/:id', uploadDocument.single('file'), accreditationDocController.update);
router.delete('/accreditation-docs/:id', accreditationDocController.delete);

// ─── Audit Logs ──────────────────────────────────────────────
router.get('/audit-logs', auditLogController.getAll);
router.get('/audit-logs/:id', auditLogController.getById);
router.post('/audit-logs', auditLogController.create);
router.delete('/audit-logs/:id', auditLogController.delete);

// ─── Certificates ────────────────────────────────────────────
router.get('/certificates', certificateController.getAll);
router.get('/certificates/:id', certificateController.getById);
router.post('/certificates', uploadCertificate.single('file'), certificateController.create);
router.put('/certificates/:id', uploadCertificate.single('file'), certificateController.update);
router.delete('/certificates/:id', certificateController.delete);

// ─── Discharge Indicators ────────────────────────────────────
router.get('/discharge-indicators', dischargeIndicatorController.getAll);
router.get('/discharge-indicators/:id', dischargeIndicatorController.getById);
router.post('/discharge-indicators', dischargeIndicatorController.create);
router.put('/discharge-indicators/:id', dischargeIndicatorController.update);
router.delete('/discharge-indicators/:id', dischargeIndicatorController.delete);

// ─── Doctor Schedules ────────────────────────────────────────
router.get('/doctor-schedules', doctorScheduleController.getAll);
router.get('/doctor-schedules/:id', doctorScheduleController.getById);
router.post('/doctor-schedules', uploadDoctorPhoto.single('foto_dokter'), doctorScheduleController.create);
router.put('/doctor-schedules/:id', uploadDoctorPhoto.single('foto_dokter'), doctorScheduleController.update);
router.delete('/doctor-schedules/:id', doctorScheduleController.delete);

// ─── Facilities ──────────────────────────────────────────────
router.get('/facilities', facilityController.getAll);
router.get('/facilities/:id', facilityController.getById);
router.post('/facilities', facilityController.create);
router.put('/facilities/:id', facilityController.update);
router.delete('/facilities/:id', facilityController.delete);

// ─── Hospital Info ───────────────────────────────────────────
router.get('/hospital-info', hospitalInfoController.getAll);
router.get('/hospital-info/key/:key', hospitalInfoController.getByKey);
router.get('/hospital-info/:id', hospitalInfoController.getById);
router.post('/hospital-info', hospitalInfoController.create);
router.put('/hospital-info/upsert', hospitalInfoController.upsertByKey);
router.put('/hospital-info/:id', hospitalInfoController.update);
router.delete('/hospital-info/:id', hospitalInfoController.delete);

// ─── Internal Memos ─────────────────────────────────────────
router.get('/internal-memos', internalMemoController.getAll);
router.get('/internal-memos/:id', internalMemoController.getById);
router.post('/internal-memos', internalMemoController.create);
router.put('/internal-memos/:id', internalMemoController.update);
router.delete('/internal-memos/:id', internalMemoController.delete);

// ─── Legal PKS ───────────────────────────────────────────────
router.get('/legal-pks', legalPksController.getAll);
router.get('/legal-pks/:id', legalPksController.getById);
router.post('/legal-pks', uploadLegalDocument.single('file'), legalPksController.create);
router.put('/legal-pks/:id', uploadLegalDocument.single('file'), legalPksController.update);
router.delete('/legal-pks/:id', legalPksController.delete);

// ─── Medical Personnel ──────────────────────────────────────
router.get('/medical-personnel', medicalPersonnelController.getAll);
router.get('/medical-personnel/:id', medicalPersonnelController.getById);
router.post('/medical-personnel', uploadPersonnelDocument.fields([
  { name: 'str_file', maxCount: 1 },
  { name: 'sip_file', maxCount: 1 },
  { name: 'pks_file', maxCount: 1 },
  { name: 'sk_file', maxCount: 1 },
]), medicalPersonnelController.create);
router.put('/medical-personnel/:id', uploadPersonnelDocument.fields([
  { name: 'str_file', maxCount: 1 },
  { name: 'sip_file', maxCount: 1 },
  { name: 'pks_file', maxCount: 1 },
  { name: 'sk_file', maxCount: 1 },
]), medicalPersonnelController.update);
router.delete('/medical-personnel/:id', medicalPersonnelController.delete);

// ─── News Articles ───────────────────────────────────────────
router.get('/news-articles', newsArticleController.getAll);
router.get('/news-articles/:id', newsArticleController.getById);
router.post('/news-articles', uploadNewsImage.single('image'), newsArticleController.create);
router.put('/news-articles/:id', uploadNewsImage.single('image'), newsArticleController.update);
router.delete('/news-articles/:id', newsArticleController.delete);

// ─── Units ───────────────────────────────────────────────────
router.get('/units', unitController.getAll);
router.get('/units/:id', unitController.getById);
router.post('/units', unitController.create);
router.put('/units/:id', unitController.update);
router.delete('/units/:id', unitController.delete);

// ─── Web Banners ─────────────────────────────────────────────
router.get('/web-banners', webBannerController.getAll);
router.get('/web-banners/:id', webBannerController.getById);
router.post('/web-banners', uploadBannerImage.single('image'), webBannerController.create);
router.put('/web-banners/:id', uploadBannerImage.single('image'), webBannerController.update);
router.delete('/web-banners/:id', webBannerController.delete);

// ─── User Guides ─────────────────────────────────────────────
router.get('/user-guides', userGuideController.getAll);
router.get('/user-guides/:id', userGuideController.getById);
router.post('/user-guides', uploadDocument.single('file'), userGuideController.create);
router.put('/user-guides/:id', uploadDocument.single('file'), userGuideController.update);
router.delete('/user-guides/:id', userGuideController.delete);

module.exports = router;
