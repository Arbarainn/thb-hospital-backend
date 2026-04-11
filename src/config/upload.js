const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploadDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const doctorUploadDir = path.join(__dirname, '../../uploads/doctors');
const bannerUploadDir = path.join(__dirname, '../../uploads/banners');
const newsUploadDir = path.join(__dirname, '../../uploads/news');
const panduanUploadDir = path.join(__dirname, '../../uploads/panduan');
const sertifikatUploadDir = path.join(__dirname, '../../uploads/sertifikat');
const legalUploadDir = path.join(__dirname, '../../uploads/legal');

createUploadDir(doctorUploadDir);
createUploadDir(bannerUploadDir);
createUploadDir(newsUploadDir);
createUploadDir(panduanUploadDir);
createUploadDir(sertifikatUploadDir);
createUploadDir(legalUploadDir);

const createStorage = (destPath, prefix) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  },
});

const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (JPEG, PNG, WebP, GIF) yang diperbolehkan'), false);
  }
};

const documentFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file dokumen (PDF, DOC, DOCX) yang diperbolehkan'), false);
  }
};

const multerConfig = (storage, filter = imageFilter) => ({
  storage,
  fileFilter: filter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max for docs
});

const uploadDoctorPhoto = multer(multerConfig(createStorage(doctorUploadDir, 'doctor')));
const uploadBannerImage = multer(multerConfig(createStorage(bannerUploadDir, 'banner')));
const uploadNewsImage = multer(multerConfig(createStorage(newsUploadDir, 'news')));
const uploadDocument = multer(multerConfig(createStorage(panduanUploadDir, 'panduan'), documentFilter));
const uploadCertificate = multer(multerConfig(createStorage(sertifikatUploadDir, 'cert'), documentFilter));
const uploadLegalDocument = multer(multerConfig(createStorage(legalUploadDir, 'legal'), documentFilter));

module.exports = { uploadDoctorPhoto, uploadBannerImage, uploadNewsImage, uploadDocument, uploadCertificate, uploadLegalDocument };
