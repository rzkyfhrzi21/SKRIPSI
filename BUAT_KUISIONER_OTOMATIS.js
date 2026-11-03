/**
 * ============================================================================
 * SCRIPT OTOMATIS PEMBUATAN GOOGLE FORM KUISIONER SKRIPSI RIZKY FAHREZI
 * JUDUL : IMPLEMENTASI METODE HAVERSINE DISTANCE DAN SIMPLE ADDITIVE WEIGHTING (SAW)
 * PRODI : TEKNIK INFORMATIKA IIB DARMAJAYA (NPM: 2311010133)
 * ============================================================================
 * 
 * CARA MENGGUNAKAN (HANYA 3 LANGKAH):
 * 1. Buka Google Form Anda di browser:
 *    https://docs.google.com/forms/d/1uR8l1KDijDSAPlxb4xZEsEw4H7yWmy9HIM69Bj9Rr0k/edit
 * 2. Di pojok kanan atas Google Form, klik ikon titik tiga (⋮) lalu pilih "Editor Skrip" (Script editor).
 * 3. Hapus semua tulisan di editor tersebut, PASTE seluruh isi kode ini, lalu klik tombol "Jalankan" (Run / ikon ▶).
 *    (Jika muncul permintaan izin akses Google, klik "Tinjau Izin" -> Pilih akun Anda -> "Lanjutan" -> "Buka (tidak aman)").
 * 
 * Seketika seluruh 21 pertanyaan, 4 bagian, dan skala 1-5 akan otomatis terbuat sempurna!
 */

function buatKuisionerOtomatis() {
  var form = FormApp.getActiveForm();
  
  // 1. Judul & Deskripsi Utama
  form.setTitle("Survei Kebutuhan dan Preferensi Pemilihan Tempat Kos Mahasiswa IIB Darmajaya");
  form.setDescription(
    "Halo rekan mahasiswa IIB Darmajaya!\n\n" +
    "Kuesioner ini bertujuan untuk mengumpulkan data penelitian tugas akhir mengenai preferensi pencarian dan pemilihan tempat kos di sekitar kampus Institut Informatika dan Bisnis (IIB) Darmajaya Bandar Lampung.\n\n" +
    "Penelitian: Implementasi Metode Haversine Distance dan Simple Additive Weighting (SAW) untuk Rekomendasi Kos\n" +
    "Peneliti  : Rizky Fahrezi (NPM: 2311010133) - Teknik Informatika IIB Darmajaya\n\n" +
    "Data yang Anda berikan bersifat rahasia dan murni digunakan untuk keperluan analisis akademis. Terima kasih atas partisipasi dan kerja samanya!"
  );

  // ==========================================
  // BAGIAN 1: PROFIL & KARAKTERISTIK RESPONDEN
  // ==========================================
  
  // Q1
  var q1 = form.addTextItem();
  q1.setTitle("Nama Lengkap / Inisial");
  q1.setHelpText("Boleh menuliskan inisial nama jika ingin anonim.");
  q1.setRequired(true);

  // Q2
  var q2 = form.addTextItem();
  q2.setTitle("Nomor Pokok Mahasiswa (NPM)");
  q2.setHelpText("Contoh: 2311010133");
  q2.setRequired(true);

  // Q3
  var q3 = form.addMultipleChoiceItem();
  q3.setTitle("Program Studi");
  q3.setChoiceValues([
    "S1 Teknik Informatika",
    "S1 Sistem Informasi",
    "S1 Sistem Komputer",
    "S1 Manajemen",
    "S1 Akuntansi",
    "S1 Desain Komunikasi Visual (DKV)",
    "S1 Sains Data",
    "Lainnya"
  ]);
  q3.setRequired(true);

  // Q4
  var q4 = form.addMultipleChoiceItem();
  q4.setTitle("Tahun Angkatan Kuliah");
  q4.setChoiceValues([
    "2021",
    "2022",
    "2023",
    "2024",
    "2025 / 2026"
  ]);
  q4.setRequired(true);

  // Q5
  var q5 = form.addMultipleChoiceItem();
  q5.setTitle("Asal Daerah Tempat Tinggal Asli");
  q5.setChoiceValues([
    "Luar Kota Bandar Lampung (Mahasiswa Perantau)",
    "Dalam Kota Bandar Lampung"
  ]);
  q5.setRequired(true);

  // Q6
  var q6 = form.addMultipleChoiceItem();
  q6.setTitle("Status Tempat Tinggal Saat Menempuh Kuliah");
  q6.setChoiceValues([
    "Menyewa Kamar Kos di Sekitar Kampus",
    "Tinggal Bersama Orang Tua / Keluarga",
    "Mengontrak Rumah Bersama Teman",
    "Lainnya"
  ]);
  q6.setRequired(true);

  // Q7
  var q7 = form.addMultipleChoiceItem();
  q7.setTitle("Moda Transportasi Utama Menuju Kampus IIB Darmajaya");
  q7.setChoiceValues([
    "Jalan Kaki",
    "Sepeda Motor Pribadi",
    "Mobil Pribadi",
    "Ojek Online / Angkutan Umum"
  ]);
  q7.setRequired(true);

  // ==========================================
  // BAGIAN 2: TINGKAT KEPENTINGAN 6 KRITERIA SAW
  // ==========================================
  var sec2 = form.addPageBreakItem();
  sec2.setTitle("BAGIAN 2: TINGKAT KEPENTINGAN 6 KRITERIA PEMILIHAN KOS (SKALA 1 - 5)");
  sec2.setHelpText(
    "Silakan berikan penilaian seberapa penting faktor-faktor berikut bagi Anda saat mencari dan menentukan tempat kos di sekitar kampus IIB Darmajaya.\n" +
    "Skala Penilaian:\n" +
    "1 = Sangat Tidak Penting\n" +
    "2 = Tidak Penting\n" +
    "3 = Cukup Penting\n" +
    "4 = Penting\n" +
    "5 = Sangat Penting"
  );

  // Q8 (C1 Cost)
  var q8 = form.addScaleItem();
  q8.setTitle("[C1 - Kriteria Biaya] Seberapa penting faktor TARIF HARGA SEWA KOS yang murah dan terjangkau bagi kondisi finansial Anda?");
  q8.setBounds(1, 5);
  q8.setLabels("Sangat Tidak Penting", "Sangat Penting");
  q8.setRequired(true);

  // Q9 (C2 Cost)
  var q9 = form.addScaleItem();
  q9.setTitle("[C2 - Kriteria Biaya] Seberapa penting JARAK TEMPUH YANG DEKAT dari lokasi kos menuju gerbang kampus IIB Darmajaya?");
  q9.setBounds(1, 5);
  q9.setLabels("Sangat Tidak Penting", "Sangat Penting");
  q9.setRequired(true);

  // Q10 (C3 Benefit)
  var q10 = form.addScaleItem();
  q10.setTitle("[C3 - Kriteria Keuntungan] Seberapa penting KELENGKAPAN FASILITAS KAMAR KOS (misal: kasur, lemari, meja belajar, AC/kipas, Wi-Fi gratis, kamar mandi dalam)?");
  q10.setBounds(1, 5);
  q10.setLabels("Sangat Tidak Penting", "Sangat Penting");
  q10.setRequired(true);

  // Q11 (C4 Benefit)
  var q11 = form.addScaleItem();
  q11.setTitle("[C4 - Kriteria Keuntungan] Seberapa penting UKURAN LUAS KAMAR KOS yang lega dan leluasa untuk aktivitas belajar/istirahat?");
  q11.setBounds(1, 5);
  q11.setLabels("Sangat Tidak Penting", "Sangat Penting");
  q11.setRequired(true);

  // Q12 (C5 Benefit)
  var q12 = form.addScaleItem();
  q12.setTitle("[C5 - Kriteria Keuntungan] Seberapa penting KONDISI KEBERSIHAN & SANITASI lingkungan kos (saluran air bersih lancar, bebas banjir/bau, tempat sampah tertata)?");
  q12.setBounds(1, 5);
  q12.setLabels("Sangat Tidak Penting", "Sangat Penting");
  q12.setRequired(true);

  // Q13 (C6 Benefit)
  var q13 = form.addScaleItem();
  q13.setTitle("[C6 - Kriteria Keuntungan] Seberapa penting TINGKAT KEAMANAN HUNIAN KOS (misal: pintu gerbang terkunci malam hari, CCTV 24 jam, pengawasan penjaga/pemilik kos)?");
  q13.setBounds(1, 5);
  q13.setLabels("Sangat Tidak Penting", "Sangat Penting");
  q13.setRequired(true);

  // ==========================================
  // BAGIAN 3: PENGUMPULAN DATA TEMPAT KOS SAAT INI
  // ==========================================
  var sec3 = form.addPageBreakItem();
  sec3.setTitle("BAGIAN 3: DATA PENGALAMAN TEMPAT KOS SAAT INI (DATA ALTERNATIF)");
  sec3.setHelpText("Khusus bagi Anda yang saat ini sedang menyewa kos di sekitar kampus IIB Darmajaya. Data ini berguna untuk melengkapi basis data kos pada sistem rekomendasi.");

  // Q14
  var q14 = form.addTextItem();
  q14.setTitle("Nama Tempat Kos Anda Saat Ini");
  q14.setHelpText("Contoh: Kos Mawar Indah / Kos Pak Joko / Kos Rajawali (Boleh dilewati jika tidak nge-kos)");
  q14.setRequired(false);

  // Q15
  var q15 = form.addParagraphTextItem();
  q15.setTitle("Alamat Lengkap atau Patokan Jalan Tempat Kos");
  q15.setHelpText("Contoh: Jl. ZA. Pagar Alam, Gg. Rajawali No. 15, samping minimarket");
  q15.setRequired(false);

  // Q16
  var q16 = form.addMultipleChoiceItem();
  q16.setTitle("Rentang Tarif Sewa Kos Anda Saat Ini");
  q16.setChoiceValues([
    "< Rp 4.000.000 per tahun (< Rp 350.000 / bulan)",
    "Rp 4.000.000 – Rp 6.000.000 per tahun (Rp 350.000 – Rp 500.000 / bulan)",
    "Rp 6.000.000 – Rp 8.500.000 per tahun (Rp 500.000 – Rp 700.000 / bulan)",
    "> Rp 8.500.000 per tahun (> Rp 700.000 / bulan)"
  ]);
  q16.setRequired(false);

  // Q17
  var q17 = form.addMultipleChoiceItem();
  q17.setTitle("Perkiraan Ukuran Luas Kamar Kos Anda");
  q17.setChoiceValues([
    "Kamar Kecil (< 3 x 3 meter / < 9 m²)",
    "Kamar Standar (3 x 3 meter s.d. 3 x 4 meter / 9 - 12 m²)",
    "Kamar Luas (> 3 x 4 meter / > 12 m²)"
  ]);
  q17.setRequired(false);

  // Q18
  var q18 = form.addCheckboxItem();
  q18.setTitle("Fasilitas yang Tersedia di Kos Anda Saat Ini (Pilih Semua yang Ada)");
  q18.setChoiceValues([
    "Kasur / Tempat Tidur",
    "Lemari Pakaian",
    "Meja & Kursi Belajar",
    "Kamar Mandi di Dalam",
    "Kamar Mandi di Luar",
    "AC (Air Conditioner)",
    "Kipas Angin",
    "Wi-Fi / Internet Gratis",
    "Dapur Bersama",
    "Area Parkir Motor Berpagar",
    "Area Parkir Mobil",
    "CCTV 24 Jam"
  ]);
  q18.setRequired(false);

  // ==========================================
  // BAGIAN 4: VALIDASI MASALAH & KEBUTUHAN APLIKASI
  // ==========================================
  var sec4 = form.addPageBreakItem();
  sec4.setTitle("BAGIAN 4: KEBUTUHAN PENGEMBANGAN APLIKASI REKOMENDASI KOS");
  sec4.setHelpText("Tanggapan Anda akan menjadi bukti empiris kebutuhan sistem pada Bab I skripsi.");

  // Q19
  var q19 = form.addMultipleChoiceItem();
  q19.setTitle("Bagaimana cara utama Anda mencari informasi kos selama ini?");
  q19.setChoiceValues([
    "Survei fisik langsung keliling gang dan jalan sekitar kampus",
    "Bertanya rekomendasi kepada teman kuliah atau senior kampus",
    "Mencari postingan promosi di media sosial (Instagram / WhatsApp / Facebook)",
    "Aplikasi pencari kos nasional (namun informasi kos sekitar Darmajaya sangat minim)"
  ]);
  q19.setRequired(true);

  // Q20
  var q20 = form.addCheckboxItem();
  q20.setTitle("Kendala terbesar apa yang Anda hadapi saat mencari tempat kos? (Boleh pilih lebih dari satu)");
  q20.setChoiceValues([
    "Menghabiskan banyak waktu, tenaga, dan biaya bensin untuk survei keliling",
    "Informasi foto dan fasilitas di media sosial sering tidak sesuai kondisi aslinya",
    "Sulit mengetahui jarak akurat dari tempat kos menuju kampus Darmajaya",
    "Sulit membandingkan perimbangan harga dengan fasilitas yang didapat",
    "Nomor kontak pemilik kos tidak tertera atau sulit dihubungi"
  ]);
  q20.setRequired(true);

  // Q21
  var q21 = form.addScaleItem();
  q21.setTitle("Apakah Anda merasa sangat terbantu jika tersedia Aplikasi Mobile Android khusus yang dapat merekomendasikan kos sekitar IIB Darmajaya berdasarkan jarak koordinat GPS terdekat dan kriteria anggaran Anda secara otomatis?");
  q21.setBounds(1, 5);
  q21.setLabels("Sangat Tidak Terbantu", "Sangat Terbantu");
  q21.setRequired(true);

  Logger.log("SUKSES: Seluruh 21 Pertanyaan Kuesioner Telah Berhasil Dibuat ke Google Form!");
}
