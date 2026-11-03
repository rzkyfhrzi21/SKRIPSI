# 🎓 AGENT.md - STANDAR OPERASIONAL & PANDUAN PENULISAN SKRIPSI

> **Dokumen Panduan Mutlak (Single Source of Truth / SSOT)** untuk asisten akademik dalam memelihara, menulis, memformat, dan mengembangkan naskah tugas akhir/skripsi **Rizky Fahrezi**.

---

## 👤 1. IDENTITAS AKADEMIK & TUGAS AKHIR
* **Nama Mahasiswa:** Rizky Fahrezi
* **NPM:** 2311010133
* **Program Studi:** S1 Teknik Informatika
* **Fakultas:** Fakultas Ilmu Komputer (FIK)
* **Institusi:** Institut Informatika dan Bisnis (IIB) Darmajaya Bandar Lampung
* **Judul Tugas Akhir:**  
  `IMPLEMENTASI METODE HAVERSINE DISTANCE DAN SIMPLE ADDITIVE WEIGHTING (SAW) UNTUK REKOMENDASI KOS STUDI KASUS INSTITUT INFORMATIKA DAN BISNIS DARMAJAYA`
* **Metodologi Pengembangan:** *Model Prototype Siklik (5 Tahapan: Komunikasi, Perencanaan Cepat, Pemodelan Cepat, Konstruksi Prototipe, Penyerahan & Evaluasi)*
* **Algoritma Utama:**
  1. *Haversine Distance*: Kalkulasi jarak lingkaran besar (*great-circle distance*) berbasis trigonometri sferis dari titik koordinat acuan gerbang kampus IIB Darmajaya (-5.3789° LS, 105.2538° BT) ke seluruh rumah kos.
  2. *Simple Additive Weighting (SAW)*: Metode pengambilan keputusan multikriteria (*MADM*) berbasis 6 kriteria:
     - Kriteria Biaya (*Cost*): Harga Sewa (C1) dan Jarak Geografis (C2).
     - Kriteria Keuntungan (*Benefit*): Fasilitas (C3), Luas Kamar (C4), Kebersihan (C5), dan Keamanan (C6).
* **Tech Stack Implementasi:**
  - *Frontend Client*: *Mobile Android* murni menggunakan *Framework Flutter / Dart* (digunakan oleh mahasiswa dan administrator; tidak ada *web dashboard*).
  - *Backend Services*: *REST API Microservices* menggunakan bahasa pemrograman Go (*Golang*).
  - *Database Engine*: MySQL *Relational Database Management System*.
  - *Testing*: *Black Box Testing* (*Boundary Value Analysis* dan *Equivalence Partitioning*).

---

## 📚 2. DAFTAR JURNAL REFERENSI YANG DIIZINKAN (SSOT 11 JURNAL ACUAN)
Seluruh kutipan dan landasan teori naskah **WAJIB HANYA BERSUMBER** dari 11 jurnal ilmiah acuan resmi yang tersimpan di direktori `C:\Users\rizky\OneDrive\Dokumen\SKRIPSI\REFERENSI`. **DILARANG KERAS** menyisipkan sitasi dari luar 11 jurnal ini (misalnya mengutip buku Sugiyono atau sumber acak lainnya) tanpa persetujuan eksplisit dari King!

| No | File Jurnal di Folder `REFERENSI` | Penulis & Tahun (APA 7th) | Topik Pembahasan & Peran dalam Naskah |
|:--:|:---|:---|:---|
| **1** | `1 Ref2 SISTEM REKOMENDASI PEMILIHAN TEMPAT KOS MAHASISWA DI WILAYAH SLEMAN MENGGUNAKAN SIMPLE ADDITIVE WEIGHTING BERBASIS MOBILE.pdf` | **Purwanto, C. I., & Ujianto, E. I. H. (2025)** | Landasan utama SPK rekomendasi tempat kos mahasiswa berbasis mobile menggunakan metode *Simple Additive Weighting* (SAW). Digunakan pada Bab I, Subbab 2.6 (SAW), dan Bab III. |
| **2** | `2 Ref3 METODE HAVERSINE FORMULA PADA PENCARIAN RUMAH SAKIT DI WILAYAH JAKARTA SELATAN BERBASIS ANDROID.pdf` | **Puspita, Z. A., Fauziah, & Sholihati, I. D. (2023)** | Landasan teori dan formula matematis *Haversine Distance* untuk pencarian lokasi terdekat berbasis Android. Digunakan pada Bab I, Subbab 2.5 (Haversine), dan Bab III. |
| **3** | `3 Ref5 Implementasi Metode Haversine pada Marketplace Jasa.pdf` | **Laila, S. N., Azima, M. F., & Fania, A. N. (2022)** | Implementasi perhitungan jarak geografis *Haversine Formula* pada aplikasi mobile. Digunakan pada Subbab 2.5 (Haversine). |
| **4** | `4 Ref6 Analisa Perbandingan Metode SMART dan SAW dalam Rekomendasi.pdf` | **Gudiato, C., Mira, & Noviyanti, P. (2025)** | Analisis perbandingan efektivitas dan perangkingan SAW dalam pemilihan tempat kos. Digunakan pada Bab I dan Subbab 2.6 (SAW). |
| **5** | `5 Ref7 Decision Support System For Selecting Rental Houses Using The Simple Additive Weighting Method (Case Study Bojong Indah Village).pdf` | **Putri, S. R., & Maulana, A. (2024)** | Teori klasifikasi kriteria *benefit* dan *cost* serta tahapan normalisasi matriks keputusan SAW untuk hunian sewa. Digunakan pada Bab I dan Subbab 2.6 (SAW). |
| **6** | `6 Ref8 PENERAPAN METODE AHP DAN SAW PADA REKOMENDASI RUMAH KOST MAHASISWA (STUDI KASUS STMIK DHARMA WACANA METRO).pdf` | **Septiana, P., & Apsiswanto, U. (2023)** | Penerapan metode pembobotan dan perangkingan SAW pada rekomendasi rumah kost mahasiswa. Digunakan pada Subbab 2.6 (SAW) dan Tabel 2.3. |
| **7** | `7 Ref9 Implementasi Teknologi Geolocation Pada Aplikasi.pdf` | **Kurniawan, F. D., & Laila, S. N. (2023)** | Integrasi teknologi *Geolocation*, penentuan titik koordinat latitude/longitude, dan kalkulasi jarak spasial. Digunakan pada Bab I dan Subbab 2.7 (GPS/Geolocation). |
| **8** | `8 Ref10 SISTEM REKOMENDASI BUKU DENGANMETODEK-NEAREST NEIGHBOR(K-NN)PADA GRAMEDIA.pdf` | **Dharmawan, H., Tukino, Hilabi, S. S., & Kaniawulan, I. (2023)** | Konsep fundamental sistem rekomendasi dan penyaringan informasi. Digunakan pada Subbab 2.2 (Sistem Rekomendasi). |
| **9** | `9 Ref11 PENERAPAN UML DALAM PERANCANGAN SISTEM INFORMASI PEMINJAMAN INVENTARIS BERBASIS WEB DI BEM FASILKOM UNSIKA.pdf` | **Khairunnisa, G., & Voutama, A. (2024)** | Standar pemodelan *Unified Modeling Language* (UML) meliputi *Use Case Diagram*, *Activity Diagram*, dan *Class Diagram*. Digunakan pada Subbab 2.12 dan seluruh perancangan UML. |
| **10** | `10 Ref12 PENGUJIAN FUNGSIONAL PERANGKAT LUNAK SISTEM INFORMASI PERPUSTAKAAN DENGAN METODE BLACK BOX TESTING BAGI PEMULA .pdf` | **Uminingsih, Ichsanudin, M. N., Yusuf, M., & Suraya. (2022)** | Metodologi dan tahapan pengujian fungsionalitas perangkat lunak menggunakan *Black Box Testing*. Digunakan pada Subbab 2.14 dan Subbab 3.8. |
| **11** | `11 Ref13 PEMANFAATAN METODE PROTOTYPE DALAM PERANCANGAN SISTEM INFORMASI PENJUALAN BERBASIS WEBSITE.pdf` | **Syarif, M., & Risdiansyah, D. (2024)** | Tahapan dan kerangka kerja metodologi *Prototype* (*Communication, Quick Plan, Quick Design, Construction of Prototype, Deployment*). Digunakan pada Subbab 2.13 dan Subbab 3.3. |

---

## 🔗 3. KAIDAH SITASI & INTEGRASI MENDELEY CITE
1. **Standar Sitasi:** Wajib format **APA 7th Edition (Bahasa Indonesia)**.
   - Contoh format: `(Purwanto dkk., 2025)` atau `Khairunnisa dkk. (2024)`.
   - Dilarang keras menggunakan penomoran kurung siku IEEE seperti `[1]` atau format selain APA.
2. **Larangan Keras Sitasi Jamak dalam Satu Kalimat / Tanda Kurung (Single-Source Citation Policy):**
   - **DILARANG KERAS** menggabungkan dua atau lebih jurnal dalam satu kalimat atau dalam satu tanda kurung sitasi (misalnya: `(Puspita dkk., 2023; Laila dkk., 2022)` atau `(Purwanto dkk., 2025; Putri dkk., 2024)`).
   - Setiap kalimat pernyataan, klaim, atau teori ilmiah wajib merujuk secara mandiri pada **SATU jurnal rujukan tunggal** (Kaidah Mutlak: **1 Kalimat = 1 Sitasi Jurnal Tunggal**).
   - Apabila terdapat dua atau lebih jurnal rujukan untuk suatu topik, uraian wajib dipecah menjadi kalimat-kalimat terpisah yang masing-masing mendeskripsikan secara spesifik peran, temuan, atau fokus dari masing-masing jurnal acuan tersebut.
3. **Koneksi Mendeley Cite (Sakral / Non-Destruktif):**
   - Sitasi pada dokumen master Word dibuat menggunakan *Mendeley Cite add-in* yang menyuntikkan *XML Content Control* (`<w:sdt>`).
   - **DILARANG KERAS** menghapus, menimpa, atau memodifikasi paragraf yang telah memiliki elemen `<w:sdt>` Mendeley dari King!
   - Untuk sitasi yang baru ditambahkan secara naratif, arahkan King untuk mengklik dan memasukkannya via Mendeley Cite (`References -> Mendeley Cite -> Insert Citation`).
3. **Daftar Pustaka Otomatis:**
   - Bagian Bab `DAFTAR PUSTAKA` harus di-generate melalui tombol **Insert Bibliography** pada panel Mendeley Cite, tersusun alfabetis (A–Z) dengan format *hanging indent* (1.27 cm / 0.5 inci).

---

## 🔤 4. KAIDAH TIPOGRAFI BAHASA INGGRIS & ISTILAH ASING
1. **Kewajiban Huruf Miring (*Italics*):**
   - Setiap kata, singkatan panjang, atau istilah teknis berbahasa Inggris **WAJIB dicetak miring (*italic*)**.
   - Berlaku menyeluruh pada: teks paragraf isi, sel tabel, *caption* tabel & gambar, *numbered lists*, dan judul/subbab.
2. **Format pada Judul / Heading:**
   - Jika judul bab/subbab menggunakan huruf tebal (**bold**), maka istilah asing di dalamnya menjadi **tebal-miring (*bold-italic*)**.
   - Contoh:
     - `2.5 `***Haversine Distance***
     - `2.6 `***Simple Additive Weighting***` (SAW)`
     - `2.6.2 Kriteria `***Benefit***` dan `***Cost***
     - `2.12.1 `***Use Case Diagram***
     - `2.14 `***Black Box Testing***
     - `3.6.1 Rancangan Antarmuka `***Mobile***` Mahasiswa`
3. **Daftar Kosakata Asing Wajib Miring:**
   - *Haversine Distance*, *Simple Additive Weighting*, *great-circle distance*, *Multi-Attribute Decision Making (MADM)*.
   - *Prototype*, *prototyping*, *Black Box Testing*, *boundary value analysis*, *equivalence partitioning*, *test case*.
   - *Mobile*, *backend*, *frontend*, *REST API*, *database*, *framework*, *cross-platform*, *microservices*, *endpoint*, *stateless*, *routing*, *middleware*.
   - *Use case diagram*, *activity diagram*, *class diagram*, *actor*, *decision*, *initial node*, *final node*, *control flow*, *swimlane*, *association*.
   - *Wireframe*, *user interface (UI)*, *dashboard*, *login*, *logout*, *input*, *output*, *scoring*, *ranking*, *benefit*, *cost*, *reverse geolocation*, *real-time*.

---

## 🧮 6. KAIDAH PENULISAN RUMUS / PERSAMAAN MATEMATIKA
1. **Format Native Equation Word (OMML / MathML):**
   - Rumus matematika (*Haversine Distance* dan *Simple Additive Weighting*) ditulis menggunakan fitur *Native Equation* Word (bukan teks polos seperti `a = sin^2(...)`).
   - Formula ditampilkan **murni rata tengah (*Center-Aligned*)**.
   - **Tanpa Penomoran Persamaan:** Rumus tidak menggunakan nomor persamaan tepi kanan seperti `(2.1)` atau `(2.4)`. Formula disajikan langsung di tengah paragraf secara elegan dan bersih.
2. **Keterangan Variabel (Definisi Simbol):**
   - Setiap rumus diikuti oleh blok *di mana:* dengan daftar simbol miring (*italic*) berjarak spasi 1.0 (*single spacing*) yang menjelaskan arti fisik dan satuan masing-masing variabel.

---

## 📏 7. KAIDAH FORMAT, TATA LETAK, SPASI & JUMLAH ENTER (TEMPLATE RESMI KAMPUS)

### A. Dimensi Kertas & Margin
* **Ukuran Kertas:** A4 (21 cm x 29.7 cm).
* **Margin Halaman Depan (Section 0: Cover s.d. Daftar Simbol):**
  - Atas: 3 cm
  - Bawah: 4 cm
  - Kiri: 4 cm
  - Kanan: 3 cm
* **Margin Naskah Utama (Section 1 s.d. 9: Bab I s.d. Lampiran):**
  - Atas: 4 cm
  - Bawah: 3 cm
  - Kiri: 4 cm
  - Kanan: 3 cm
  - *Catatan Khusus:* Section tabel komparasi penelitian terdahulu (Tabel 2.3) menggunakan orientasi **Landscape** agar kolom terbaca lega dan tidak terpotong.

### B. Font & Spasi Teks Isi
* **Jenis Font:** Times New Roman (TNR).
* **Ukuran Font Isi:** 12pt.
* **Spasi Baris Teks Isi:** Spasi 1.5 (`line="360"` / `lineRule="auto"`).
* **Perataan Teks:** Rata Kanan-Kiri (*Justified* / `jc="both"`).
* **Paragraf Berturut-turut:** Berjalan menyambung normal dengan spasi 1.5 **tanpa ada baris kosong (enter) tambahan** di antara paragraf (*Spacing Before 0, Spacing After 0*).

### C. Hierarki Judul & Aturan Spasi Enter Antar-Elemen
1. **Judul BAB (`Heading 1`):**
   - Font Times New Roman 14pt, Tebal (**Bold**), Rata Tengah (*Center*).
   - Penulisan judul bab menggunakan 1 paragraf dengan *manual line break* (`Shift+Enter` / `<w:br/>`), misalnya:
     `BAB I`  
     `PENDAHULUAN`
   - **Heading 1 WAJIB selalu mulai di halaman baru.**
   - **Jarak dari Judul BAB ke Subbab pertama:**
     - Bab I: Tepat **4 kali enter kosong** (line 240 / 1 spasi).
     - Bab II & Bab III: Tepat **2 kali enter kosong** (line 240 / 1 spasi).
2. **Judul Subbab (`Heading 2` - misal: 1.1, 2.1, 3.1):**
   - Font Times New Roman 12pt, Tebal (**Bold**), Rata Kiri.
   - Wajib memiliki `<w:keepNext/>` agar tidak menjadi anak judul yang terpotong di dasar halaman (*orphan heading*).
   - **Jarak dari akhir paragraf sebelumnya ke Judul Subbab baru:** Tepat **2 kali enter kosong** (line 240 / 1 spasi).
3. **Judul Sub-subbab (`Heading 3` - misal: 2.6.1, 3.5.1):**
   - Font Times New Roman 12pt, Tebal (**Bold**), Rata Kiri.
   - Wajib memiliki `<w:keepNext/>`.
   - **Jarak dari Subbab (`Heading 2`) ke Sub-subbab (`Heading 3`):** Rapat (**0 atau 1 enter rapat** / line 240), dilarang diberi jeda 2 enter kosong agar tidak renggang.
   - **Jarak antar Sub-subbab berurutan:** Transisi rapat 1 baris normal.

### D. Aturan Jeda Enter Pasca-Tabel (Kaidah Mutlak)
* Setiap kali sebuah tabel (`<w:tbl>`) berakhir:
* **WAJIB diberi jeda 1 kali enter (1 baris kosong spasi 1.5)** sebelum memulai judul subbab baru ataupun memulai paragraf teks isi baru.
* Tabel dilarang keras menempel langsung ke teks/subbab berikutnya dengan jarak 0.

### E. Aturan Tabel & Gambar
1. **Tabel:**
   - **Posisi Judul Tabel:** Diletakkan di **ATAS tabel**.
   - **Format Judul Tabel:** Rata Tengah (*Center*), Times New Roman **11pt**, **Normal** (tanpa bold, tanpa italic, tanpa underline).
   - **Isi Sel Tabel:** Seluruh teks, angka, dan header di dalam setiap sel tabel WAJIB menggunakan font Times New Roman **11pt** (Spasi 1.0 atau 1.15).
2. **Gambar & Wireframe:**
   - **Posisi Elemen Gambar:** Gambar diletakkan **Rata Tengah (*Center*)**.
   - **Posisi Judul Gambar:** Diletakkan di **BAWAH gambar**.
   - **Format Judul Gambar:** Rata Tengah (*Center*), Times New Roman **11pt**, **Normal** (istilah asing di dalamnya dicetak miring).
   - **Larangan Mutlak Menggabungkan Gambar (Bentuk a, b, c, d):** **DILARANG KERAS** menggabungkan beberapa rancangan gambar/layar ke dalam bentuk kolase gabungan dengan penomoran anak `(a)`, `(b)`, `(c)`, `(d)` atau sejenisnya. Setiap gambar antarmuka (*wireframe*), arsitektur, dan diagram alur **WAJIB BERDIRI SENDIRI** sebagai satu nomor gambar individual berurutan (misal: Gambar 3.5, Gambar 3.6, Gambar 3.7, Gambar 3.8, Gambar 3.9, Gambar 3.10) dengan *caption* resmi masing-masing dan terdaftar mandiri pada Daftar Gambar. Seluruh berkas gambar gabungan/kolase lama wajib dihapus bersih.
   - **Kaidah Kejelasan Diagram & Mentahan Draw.io:** Seluruh diagram sistem (Arsitektur, *Use Case*, *Activity*, *Pipeline* Integrasi, *Prototype*) dan rancangan *wireframe* antarmuka **WAJIB** memiliki berkas mentahan `.drawio` yang valid, presisi, dan tersimpan rapi di direktori `C:\Users\rizky\OneDrive\Dokumen\SKRIPSI\GAMBAR & DIAGRAM\`. Citra hasil ekspor PNG wajib beresolusi tinggi (*high-definition* / 300 DPI), tajam, dengan tipografi yang sangat terbaca jelas tanpa blur atau distorsi saat dicetak maupun dibuka di Word/PDF.
   - **Penempatan Halaman Sendiri (*Dedicated Page*):** Diagram sistem berdimensi besar seperti Gambar 3.1 (Arsitektur), Gambar 3.3 (*Activity Diagram*), dan Gambar 3.4 (*Pipeline* Integrasi Algoritma) ditempatkan berdiri sendiri pada halaman khusus satu halaman penuh dengan *caption* di bawahnya.

### F. Aturan Penomoran Poin / Numbered Lists (Subbab 3.4.1 dsb)
* Indentasi kiri poin penomoran (angka `1., 2.` maupun huruf `a., b.`) wajib **rata/sejajar dengan teks paragraf normal** (`ind left="426" hanging="426"`).
* **DILARANG KERAS** menggunakan style bawaan Word `List Paragraph` yang menjorok jauh ke kanan (1.27 cm / 720 dxa) karena membuat tata letak timpang dari kalimat pengantarnya.
* Setiap butir poin dihubungkan menggunakan pemisah baris manual (`<w:br/>`) dan tabulasi (`<w:tab/>`), bukan teks bersambung dalam satu baris datar.

### G. Aturan Penomoran Halaman (Page Numbering System)
1. **Halaman Cover Luar:** Dilarang menampilkan nomor halaman sama sekali.
2. **Halaman Bagian Depan (Daftar Isi s.d. Daftar Simbol):**
   - Menggunakan angka Romawi kecil (`i, ii, iii...`).
   - Dimulai tepat dari angka **i** pada halaman `DAFTAR ISI`.
   - Posisi nomor halaman: **BAWAH TENGAH (*Bottom Center*)**.
   - Teks "COVER" dilarang berstatus `Heading 1` agar tidak masuk ke Daftar Isi.
3. **Halaman Naskah Utama (Bab I s.d. Daftar Pustaka & Lampiran):**
   - Menggunakan angka Arab (`1, 2, 3...`).
   - Dimulai tepat dari angka **1** pada halaman pertama `BAB I PENDAHULUAN`.
   - Penomoran berjalan kontinu tanpa reset hingga lembar terakhir dokumen.
   - **Posisi Nomor Halaman Berdasarkan Keberadaan Judul BAB:**
     - Halaman yang memuat Judul BAB (`Heading 1` - Bab I, Bab II, Bab III, Daftar Pustaka): Nomor halaman terletak di **BAWAH TENGAH (*Bottom Center*)**.
     - Halaman lanjutan (halaman isi yang tidak memuat Heading 1): Nomor halaman terletak di **KANAN ATAS (*Top Right*)**.

---

## 🛠️ 6. STRUKTUR BERKAS & PENYIMPANAN
* **Naskah Master Aktif:** `C:\Users\rizky\OneDrive\Dokumen\SKRIPSI\PROPOSAL SKRIPSI_RIZKY FAHREZI_2311010133.docx`
* **Cadangan / Backup Naskah:** `C:\Users\rizky\OneDrive\Dokumen\SKRIPSI\PROPOSAL SKRIPSI_RIZKY FAHREZI_2311010133.docx.bak`
* **Template Acuan Resmi Kampus (Sacred - Dilarang Diubah):** `C:\Users\rizky\OneDrive\Dokumen\SKRIPSI\[Draft] Template Skirpsi Prodi TI.docx`
* **Folder Diagram & Aset Visual:** `C:\Users\rizky\OneDrive\Dokumen\SKRIPSI\GAMBAR & DIAGRAM\`
  - Berkas master diagram UML: `Diagram_UML_Sistem.drawio` (berisi tab Arsitektur, Use Case, Activity, Class).
  - Berkas wireframe antarmuka: `Wireframe_Rancangan_Antarmuka.drawio`.
* **Folder Jurnal Ilmiah Acuan:** `C:\Users\rizky\OneDrive\Dokumen\SKRIPSI\REFERENSI\` (11 PDF jurnal resmi).
* **Folder Arsip Naskah Lama:** `C:\Users\rizky\OneDrive\Dokumen\SKRIPSI\Zzz\`
