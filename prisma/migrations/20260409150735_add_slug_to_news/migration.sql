-- CreateTable
CREATE TABLE `accreditation_docs` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `standar_code` VARCHAR(50) NOT NULL,
    `ep_code` VARCHAR(50) NULL,
    `deskripsi` TEXT NULL,
    `file_url` TEXT NULL,
    `input_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `user_id` INTEGER UNSIGNED NULL,

    INDEX `fk_accred_user`(`user_id`),
    INDEX `idx_accreditation_standar`(`standar_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NULL,
    `action` ENUM('Create', 'Update', 'Delete') NOT NULL,
    `module` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `timestamp` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_audit_timestamp`(`timestamp` DESC),
    INDEX `idx_audit_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certificates` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `personnel_id` INTEGER UNSIGNED NOT NULL,
    `nama_sertifikat` VARCHAR(200) NOT NULL,
    `tanggal_terbit` DATE NULL,
    `tanggal_expired` DATE NULL,
    `file_url` TEXT NULL,

    INDEX `idx_certificates_personnel`(`personnel_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `discharge_indicators` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama_pasien` VARCHAR(200) NOT NULL,
    `no_rm` VARCHAR(50) NOT NULL,
    `tgl_masuk` DATE NOT NULL,
    `tgl_keluar` DATE NULL,
    `status_kepulangan` VARCHAR(100) NULL,
    `user_id` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_discharge_user`(`user_id`),
    INDEX `idx_discharge_no_rm`(`no_rm`),
    INDEX `idx_discharge_tgl_masuk`(`tgl_masuk`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `doctor_schedules` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama_dokter` VARCHAR(200) NOT NULL,
    `spesialis` VARCHAR(150) NULL,
    `poli` VARCHAR(150) NULL,
    `hari` ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu') NOT NULL,
    `jam` VARCHAR(50) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facilities` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `icon_code` VARCHAR(100) NULL,
    `urutan` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hospital_info` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(100) NOT NULL,
    `value` TEXT NULL,
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `internal_memos` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `tanggal` DATE NOT NULL DEFAULT (curdate()),
    `perihal` VARCHAR(300) NOT NULL,
    `kepada` VARCHAR(300) NOT NULL,
    `dari` VARCHAR(300) NOT NULL,
    `kategori` ENUM('Undangan', 'Informasi', 'Pengumuman') NOT NULL,
    `status` ENUM('Draft', 'Terkirim') NOT NULL DEFAULT 'Draft',
    `content_text` TEXT NULL,
    `created_by` INTEGER UNSIGNED NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_memo_user`(`created_by`),
    INDEX `idx_memos_tanggal`(`tanggal` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `legal_pks` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `jenis_pengajuan` ENUM('Baru', 'Perpanjang') NOT NULL,
    `nama_mitra` VARCHAR(200) NOT NULL,
    `jenis_kerjasama` VARCHAR(200) NULL,
    `unit_pengusul_id` INTEGER UNSIGNED NULL,
    `tanggal_mulai` DATE NULL,
    `tanggal_berakhir` DATE NULL,
    `status` ENUM('Aktif', 'Proses', 'Selesai') NOT NULL DEFAULT 'Proses',
    `file_pks_url` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_pks_unit`(`unit_pengusul_id`),
    INDEX `idx_legal_pks_status`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medical_personnel` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(200) NOT NULL,
    `unit_id` INTEGER UNSIGNED NULL,
    `status` ENUM('Tetap', 'Kontrak') NOT NULL,
    `nira` VARCHAR(100) NULL,
    `str` VARCHAR(100) NULL,
    `sip` VARCHAR(100) NULL,
    `kewenangan_klinis` TEXT NULL,
    `pks_sk` VARCHAR(200) NULL,
    `input_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_personnel_unit`(`unit_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news_articles` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(300) NOT NULL,
    `slug` VARCHAR(300) NULL,
    `category` VARCHAR(100) NULL,
    `summary` TEXT NULL,
    `content` LONGTEXT NULL,
    `image_url` TEXT NULL,
    `published_at` DATETIME(0) NULL,
    `author_id` INTEGER UNSIGNED NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `idx_news_slug`(`slug`),
    INDEX `fk_news_author`(`author_id`),
    INDEX `idx_news_published`(`published_at` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `units` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama_unit` VARCHAR(150) NOT NULL,

    UNIQUE INDEX `nama_unit`(`nama_unit`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password_hash` TEXT NOT NULL,
    `full_name` VARCHAR(200) NOT NULL,
    `role` ENUM('Admin', 'Medis', 'Legal', 'Sekretariat') NOT NULL,
    `last_login` DATETIME(0) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `username`(`username`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `web_banners` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(200) NULL,
    `description` TEXT NULL,
    `image_url` TEXT NOT NULL,
    `link_url` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `urutan` INTEGER NULL DEFAULT 0,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accreditation_docs` ADD CONSTRAINT `fk_accred_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `certificates` ADD CONSTRAINT `fk_cert_personnel` FOREIGN KEY (`personnel_id`) REFERENCES `medical_personnel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `discharge_indicators` ADD CONSTRAINT `fk_discharge_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `internal_memos` ADD CONSTRAINT `fk_memo_user` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `legal_pks` ADD CONSTRAINT `fk_pks_unit` FOREIGN KEY (`unit_pengusul_id`) REFERENCES `units`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `medical_personnel` ADD CONSTRAINT `fk_personnel_unit` FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `news_articles` ADD CONSTRAINT `fk_news_author` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;
