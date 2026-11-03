# FIX TIPS SEMPRO

*Garis Besar Penelitian • Bank Tanya Jawab • Penjelasan Perhitungan*

**SKRIPSI**

**IMPLEMENTASI METODE HAVERSINE DISTANCE DAN SIMPLE ADDITIVE WEIGHTING (SAW) UNTUK REKOMENDASI KOS STUDI KASUS INSTITUT INFORMATIKA DAN BISNIS DARMAJAYA**

Disusun oleh

**RIZKY FAHREZI**

NPM 2311010133

Program Studi S1 Teknik Informatika

Fakultas Ilmu Komputer

Institut Informatika dan Bisnis (IIB) Darmajaya

Bandar Lampung

*Edisi 3 November 2026*

## TENTANG DOKUMEN — Cara memakai file ini

*Dokumen kerja pribadi — bukan bagian dari naskah skripsi yang diserahkan.*

File ini menggabungkan tiga sumber yang sebelumnya terpisah, lalu menyelaraskannya dengan workbook perhitungan yang benar-benar dipakai saat ini. Tujuannya satu: pada hari-H, Anda tidak lagi mencari-cari angka atau merangkai jawaban dari nol.

| Sumber | Isi yang diambil | Perlakuan dalam file ini |
| --- | --- | --- |
| PANDUAN GARIS BESAR.txt | Alur logika penelitian 7 langkah | Ditaruh di Bagian I, tetapi angka dan satuannya dikoreksi agar sama dengan workbook. |
| PANDUAN_TANYA_JAWAB_SEMPRO.txt | 9 pertanyaan + jawaban | Dipertahankan substansinya, diperbarui contoh dan angkanya, lalu digabung ke bank Q&A. |
| 16 pertanyaan teman saat sempro | Daftar pertanyaan mentah | Dirapikan, dikelompokkan, dan dijawab secara akademik (Bagian III). |
| Workbook dummy terbaru | Bobot, jarak, matriks, peringkat | Menjadi satu-satunya sumber angka. Semua angka di file ini diambil dari sana. |

> **ATURAN MAIN ANGKA**
>
> Mulai sekarang, satu angka hanya boleh punya satu sumber: workbook "DUMMY Survei Kebutuhan dan Preferensi Pemilihan Tempat Kos Mahasiswa IIB Darmajaya (Jawaban).xlsx". File .txt lama, naskah, dan slide boleh berbeda kalimat, tetapi tidak boleh berbeda angka. Jika berbeda, workbook yang menang — lalu naskah dan slide yang diperbaiki.

Status data perlu dinyatakan jujur sejak awal. Workbook saat ini berisi 10 responden dan 10 alternatif kos bertanda TES 1 sampai TES 10 / KOS A sampai KOS J. Data ini adalah data uji coba (dummy) untuk memastikan pipeline Haversine dan SAW berjalan benar, bukan hasil survei lapangan final. Kalimat itu bukan kelemahan; justru menunjukkan Anda memahami beda antara menguji alat dan mengklaim temuan empiris.

**Peta dokumen**

| Bagian | Isi | Dipakai kapan |
| --- | --- | --- |
| I | Garis besar 7 langkah, peta langkah ke sheet Excel, dan peta data: unit yang diranking, alur admin vs mahasiswa, variabel tiap algoritma | Membuka presentasi; menjawab "alurnya bagaimana?" |
| II | Temuan ketidakselarasan naskah vs workbook + tindakan perbaikan | Sebelum mencetak/mengumpulkan berkas; saat penguji menemukan angka berbeda |
| III | Bank 40 tanya jawab: konsep, metode, perhitungan, perancangan, jebakan | Latihan tanya jawab; dibaca ulang 30 menit sebelum sidang |
| IV | Tips, checklist H-1, skrip pembuka 60 detik, cheat sheet angka | Hari-H |
| V | Lampiran angka: bobot, jarak, matriks X, R, Vi, contoh hitung manual | Saat penguji minta "coba tunjukkan angkanya" |

## BAGIAN I — Garis Besar Alur Logika Penelitian

*Tujuh langkah emas — versi yang sudah diselaraskan dengan implementasi workbook.*

Alur di bawah ini adalah rantai sebab-akibat penelitian Anda. Setiap langkah menghasilkan sesuatu yang menjadi masukan langkah berikutnya; tidak ada langkah yang berdiri sendiri. Kuasai urutannya, karena hampir semua pertanyaan penguji pada akhirnya adalah pertanyaan "di langkah mana ini terjadi?"

| Langkah | Kegiatan | Keluaran | Lokasi di workbook |
| --- | --- | --- | --- |
| 1 | Pengumpulan data | Jawaban kuesioner, koordinat, atribut kos | Form Responses 1 |
| 2 | Haversine Distance | Jarak kampus–kos (meter) = C2 | Tahap 2 - Haversine Distance |
| 3 | Menyusun matriks keputusan X | Matriks 10 × 6 nilai asli | Tahap 3, blok B3:G12 |
| 4 | Menetapkan bobot W | Enam bobot dengan total 1,000000 | Tahap 1 - Bobot Kriteria (W) |
| 5 | Normalisasi matriks R | Matriks 10 × 6 berskala 0–1 | Tahap 3, blok B16:G25 |
| 6 | Menghitung Vi | Satu skor preferensi per kos | Tahap 4 & 5, kolom B |
| 7 | Perangkingan | Urutan rekomendasi 1–10 | Tahap 4 & 5, kolom D |

### Langkah 1 — Pengumpulan Data

Inti langkah ini: mengubah masalah "mahasiswa sulit membandingkan kos" menjadi data yang bisa dihitung. Instrumen yang dipakai adalah kuesioner digital (Google Forms) yang menghimpun tiga kelompok data:

1. **Profil —** profil mahasiswa perantau (asal daerah, angkatan, moda transportasi);

2. **Preferensi —** tingkat kepentingan enam kriteria, yang nantinya menjadi dasar bobot W;

3. **Data objek —** data fisik kos dan tautan titik koordinat Google Maps, yang nantinya menjadi alternatif dan nilai C2.

Satu hal yang harus Anda hafal: skala instrumen tidak seragam, dan itu disengaja. C1 memakai skala 1–4 (rentang tarif), C2 memakai skala kepentingan 1–5 pada kuesioner tetapi nilainya diganti jarak meter pada matriks keputusan, C3 memakai 1–9 (jumlah item fasilitas terpenuhi), C4 memakai 1–3 (kelas luas), serta C5 dan C6 memakai 1–5 (persepsi). Perbedaan ini bukan kesalahan ketik; ia mengikuti granularitas atribut masing-masing. Yang menyatukan semuanya nanti adalah normalisasi pada Langkah 5.

> **REALISASI SAAT INI**
>
> 10 responden (TES 1–TES 10) dan 10 alternatif kos (KOS A–KOS J). Target naskah 30–50 responden dan 30–50 kos. Karena itu, di sidang sebut data ini sebagai data uji coba pipeline, bukan hasil survei final.

### Langkah 2 — Menghitung Jarak dengan Haversine Distance (C2)

Haversine menghitung panjang busur lingkaran besar (great-circle) antara dua titik di permukaan bola bumi. Masukannya koordinat; keluarannya jarak. Titik acuan yang dipakai workbook adalah titik Institut Informatika dan Bisnis Darmajaya pada -5,3774079 LS dan 105,2496447 BT.

Perhitungannya dipecah menjadi lima kolom agar dapat diaudit satu per satu: F (selisih lintang dalam radian), G (selisih bujur dalam radian), H (nilai a), I (sudut pusat c), dan J (jarak d). Setiap kolom hanya bergantung pada kolom di sebelah kirinya. Pemecahan ini disengaja: jika penguji menanyakan satu langkah, Anda bisa menunjuk satu kolom, bukan satu formula raksasa.

```text
RANTAI FORMULA PADA SHEET TAHAP 2

F2 : =RADIANS(B2-$D$2)                        ' delta phi (radian)
G2 : =RADIANS(C2-$E$2)                        ' delta lambda (radian)
H2 : =SIN(F2/2)^2 + COS(RADIANS($D$2))*COS(RADIANS(B2))*SIN(G2/2)^2   ' nilai a
I2 : =2*ASIN(SQRT(H2))                        ' sudut pusat c (radian)
J2 : =6371000*I2                              ' jarak d (meter)
```

Contoh konkret KOS B: selisih lintang -0,0039061° dan selisih bujur 0,0026313°, sehingga a = 1,68457 × 10⁻⁹, c = 8,20871 × 10⁻⁵ radian, dan d = 522,98 meter. Angka inilah yang menjadi nilai C2 untuk KOS B — sekaligus nilai terbaik pada kriteria jarak, karena KOS B adalah kos terdekat dari kampus.

> **KALIMAT UNTUK SIDANG**
>
> "Jarak tidak saya taksir secara verbal, Pak/Bu. Saya ubah koordinat menjadi angka meter dengan Haversine, lalu angka itu langsung masuk sebagai kriteria C2. Jadi ketika saya bilang KOS B paling dekat, itu 522,98 meter dan bisa dihitung ulang dari koordinatnya."

### Langkah 3 — Membentuk Matriks Keputusan (X)

Matriks X adalah tabel nilai asli: 10 baris alternatif kos dan 6 kolom kriteria. Di sinilah semua data dari langkah 1 dan 2 bertemu untuk pertama kali. Isinya sengaja tidak diseragamkan, karena justru perbedaan satuan itulah yang akan diselesaikan pada Langkah 5.

| Kode | Kriteria | Sifat | Skala / satuan | Sumber nilai |
| --- | --- | --- | --- | --- |
| C1 | Harga sewa | Cost | 1–4 (rentang tarif per bulan) | Rubrik tarif pada Tahap 3 |
| C2 | Jarak ke kampus | Cost | meter (kontinu) | Luaran Haversine, Tahap 2 kolom J |
| C3 | Fasilitas kamar | Benefit | 1–9 (jumlah item terpenuhi) | Rubrik fasilitas, Tahap 3 |
| C4 | Luas kamar | Benefit | 1–3 (kelas luas) | Rubrik luas, Tahap 3 |
| C5 | Kebersihan | Benefit | 1–5 (persepsi) | Kuesioner |
| C6 | Keamanan | Benefit | 1–5 (persepsi) | Kuesioner |

Contoh baris KOS B pada matriks X: C1 = 3, C2 = 522,98 meter, C3 = 8, C4 = 3, C5 = 5, C6 = 5. Baris lengkap untuk kesepuluh kos ada di Lampiran C.

### Langkah 4 — Menetapkan Bobot Preferensi (W)

Bobot bukan ditetapkan sendiri oleh peneliti. Bobot dihitung dari rata-rata skor kepentingan yang diberikan responden pada setiap kriteria, lalu dinormalisasi agar totalnya tepat 1. Prosedurnya:

1. **Rata-rata —** hitung rata-rata setiap kolom kriteria pada Tahap 1;

2. **Total —** jumlahkan keenam rata-rata tersebut (hasilnya 22,8);

3. **Normalisasi —** bagi setiap rata-rata dengan total tersebut;

4. **Verifikasi —** pastikan penjumlahan keenam bobot sama dengan 1,000000 (sel C16).

| Kriteria | Rata-rata skor | Bobot (Wj) | Persentase |
| --- | --- | --- | --- |
| C1 Harga | 2,1 | 0,092105 | 9,21% |
| C2 Jarak | 4,5 | 0,197368 | 19,74% |
| C3 Fasilitas | 5,8 | 0,254386 | 25,44% |
| C4 Luas | 2,6 | 0,114035 | 11,40% |
| C5 Kebersihan | 3,7 | 0,162281 | 16,23% |
| C6 Keamanan | 4,1 | 0,179825 | 17,98% |
| Total | 22,8 | 1,000000 | 100% |

Temuan yang perlu Anda pahami, bukan sekadar hafal: responden menempatkan fasilitas sebagai prioritas tertinggi (25,44%) dan harga justru sebagai prioritas terendah (9,21%). Ini masuk akal untuk populasi mahasiswa yang sebagian besar sudah menyewa kos dan lebih peduli kenyamanan; tetapi begitu penguji bertanya "kok harga paling rendah?", Anda harus bisa menjelaskan bahwa itu hasil survei, bukan keputusan subjektif Anda. Dan karena aplikasi menyediakan slider preferensi, pengguna yang sensitif terhadap harga tetap bisa menaikkan bobot C1 secara personal.

### Langkah 5 — Normalisasi Matriks Keputusan (R)

Normalisasi adalah jantung SAW. Tanpa langkah ini, menjumlahkan rupiah dengan meter dan skor 1–9 adalah operasi yang tidak bermakna. Normalisasi memaksa semua kriteria berbicara dalam bahasa yang sama: rentang 0–1.

```text
DUA RUMUS, DUA LOGIKA

Cost     (C1, C2) :  Rij = MIN(Xij) / Xij
Benefit  (C3–C6)  :  Rij = Xij / MAX(Xij)

Nilai acuan yang dipakai:
  MIN C1 = 1        MIN C2 = 522,976872 meter
  MAX C3 = 9        MAX C4 = 3        MAX C5 = 5        MAX C6 = 5
```

Logikanya sederhana. Untuk kriteria biaya, nilai terkecil adalah yang terbaik, sehingga kos termurah atau terdekat mendapat nilai 1, dan kos lain memperoleh pecahan di bawahnya. Untuk kriteria keuntungan, nilai terbesar adalah yang terbaik, sehingga kos dengan fasilitas terlengkap atau keamanan tertinggi mendapat 1. Perhatikan konsekuensinya: pada setiap kolom pasti ada minimal satu kos yang bernilai tepat 1. Itu bukan kebetulan, melainkan sifat matematis dari kedua rumus tersebut.

Contoh baris KOS B: C1 = 1/3 = 0,333333; C2 = 522,976872/522,976872 = 1,000000; C3 = 8/9 = 0,888889; C4 = 3/3 = 1,000000; C5 = 5/5 = 1,000000; C6 = 5/5 = 1,000000. Baris inilah yang kemudian menghasilkan skor tertinggi pada Langkah 6.

### Langkah 6 — Menghitung Nilai Preferensi Akhir (Vi)

Vi adalah satu angka ringkasan per kos: jumlah dari seluruh nilai ternormalisasi yang sudah dikalikan bobotnya. Secara matematis, Vi = Σ (Wj × Rij), dengan j bergerak dari 1 sampai 6.

```text
CONTOH LENGKAP — SATU BARIS, ENAM SUKU

Vi = (W1 x R1) + (W2 x R2) + (W3 x R3) + (W4 x R4) + (W5 x R5) + (W6 x R6)

KOS B:
  C1  0,092105 x 0,333333 = 0,030702
  C2  0,197368 x 1,000000 = 0,197368
  C3  0,254386 x 0,888889 = 0,226121
  C4  0,114035 x 1,000000 = 0,114035
  C5  0,162281 x 1,000000 = 0,162281
  C6  0,179825 x 1,000000 = 0,179825
  ------------------------------------
  Vi KOS B                = 0,910331
```

Perhatikan bahwa KOS B tidak unggul di harga: sumbangan C1-nya hanya 0,0307, paling kecil di antara enam suku. KOS B menang karena menyapu bersih lima kriteria lain. Ini bukti bahwa model tidak memihak kos mahal; ia hanya konsisten dengan bobot yang diberikan responden.

### Langkah 7 — Kesimpulan dan Perangkingan

Langkah terakhir adalah mengurutkan Vi dari terbesar ke terkecil. Kos dengan Vi tertinggi menjadi rekomendasi utama pada antarmuka aplikasi; sisanya menjadi alternatif berurutan.

| Rank | Alternatif | Tipe | Vi |
| --- | --- | --- | --- |
| 1 | KOS B | VIP | 0,9103 |
| 2 | KOS F | VIP | 0,8418 |
| 3 | KOS G | Eksklusif | 0,7361 |
| 4 | KOS J | VIP | 0,7116 |
| 5 | KOS E | Standar | 0,6664 |
| 6 | KOS C | Eksklusif | 0,6554 |
| 7 | KOS A | Standar | 0,6317 |
| 8 | KOS H | Ekonomis | 0,6160 |
| 9 | KOS D | Ekonomis | 0,6080 |
| 10 | KOS I | Standar | 0,5762 |

Satu pola yang layak Anda tunjukkan: tiga besar ditempati kos bertipe VIP dan Eksklusif, tetapi bukan semata karena harganya. KOS G dan KOS C sama-sama Eksklusif dan berbagi skor fasilitas serta luas yang identik; yang memisahkan keduanya adalah jarak (1.530,11 m vs 1.759,95 m) dan keamanan (5 vs 3). Di sisi lain, KOS D dan KOS H yang termurah justru berada di peringkat 8–9 karena jarak dan fasilitasnya lemah. Artinya, ranking ini adalah hasil trade-off, bukan ranking harga.

> **RANGKUMAN SATU KALIMAT**
>
> Data menjadi matriks, jarak menjadi C2, bobot menjadi W, keduanya bertemu di normalisasi R, lalu diringkas menjadi Vi dan diurutkan menjadi rekomendasi. Tujuh langkah, satu rantai.

### Peta Data — Nama Kos, Tipe Kamar, dan Apa yang Sebenarnya Diranking

Tujuh langkah di atas menjelaskan urutan perhitungan. Ada satu lapisan yang belum terlihat: bagaimana data itu hidup di dalam sistem — siapa yang mengisinya, kapan dihitung, dan variabel apa yang benar-benar dipakai setiap algoritma. Subbab ini menjawab pertanyaan penguji yang biasa menembak di area itu, termasuk satu hal kecil yang kalau salah akan langsung terlihat di layar: apa yang sebenarnya masuk ke kolom alternatif.

#### Satu alternatif = nama kos + tipe kamar, dalam satu variabel

Yang diranking sistem ini bukan "kos" sebagai bangunan, melainkan penawaran kamar. Karena itu kolom identitas di seluruh workbook bernama Alternatif Tipe Kos, dan nilainya menggabungkan dua hal menjadi satu variabel: nama tempat kos dan tipe kamarnya.

```text
SATU VARIABEL, DUA INFORMASI

Alternatif Tipe Kos = nama_kos + " - Tipe " + tipe_kamar + " (" + rincian + ")"

KOS B - Tipe VIP (Kamar Mandi Dalam + AC)
  |        |                          |
  |        |                          +-- rincian fasilitas penanda tipe
  |        +----------------------------- tipe kamar
  +-------------------------------------- nama tempat kos
```

| Nilai variabel Alternatif Tipe Kos | Nama | Tipe | C1 |
| --- | --- | --- | --- |
| KOS D - Tipe Ekonomis (Kipas Angin) | KOS D | Ekonomis | 1 |
| KOS A - Tipe Standar (Kamar Mandi Luar) | KOS A | Standar | 2 |
| KOS B - Tipe VIP (Kamar Mandi Dalam + AC) | KOS B | VIP | 3 |
| KOS C - Tipe Eksklusif (AC + Water Heater + WiFi) | KOS C | Eksklusif | 4 |

Empat baris di atas mewakili empat kelas tipe yang berbeda; sepuluh baris workbook memakai pola penulisan yang sama. Perhatikan bahwa C1 bergerak searah tipe: Ekonomis 1, Standar 2, VIP 3, Eksklusif 4. Itu bukan kebetulan — tarif dan tipe kamar memang satu paket.

**Mengapa digabung, bukan dipisah menjadi dua kolom?**

1. **Atribut melekat pada kamar.** Tarif, fasilitas, luas, kebersihan, dan keamanan melekat pada kamar, bukan pada bangunan. Kalau nama kos dijadikan kunci, dua kamar berbeda tipe akan saling menimpa.

2. **Satu bangunan boleh punya beberapa baris.** Kalau satu bangunan punya dua tipe, akan ada dua baris dengan nama sama, koordinat sama, C2 sama, tetapi C1, C3, C4, C5, dan C6 berbeda. Keduanya alternatif yang sah dan harus diranking terpisah.

3. **Kunci primer adalah kode alternatif.** Kode alternatif (A sampai J pada data dummy) yang menjamin setiap baris unik dan dapat dirujuk saat audit. Nama kos hanyalah label tampilan.

4. **Haversine dihitung sekali per bangunan.** Karena koordinatnya sama, satu perhitungan jarak dipakai untuk semua tipe kamar di bangunan itu. Ini contoh paling konkret dari pemisahan data tetap dan data berulang pada subbab berikutnya.

5. **Kartu wajib menampilkan nama + tipe.** Kalau kartu hanya menampilkan nama, dua hasil bisa terlihat identik padahal harganya berbeda. Label yang benar: nama kos, strip, tipe kamar.

> **JAWABAN 20 DETIK**
>
> "Yang diranking adalah penawaran kamar, bukan bangunan. Satu baris sama dengan satu pasangan nama kos dan tipe kamar, dan pasangan itu saya simpan dalam satu variabel: Alternatif Tipe Kos. Bangunan menentukan jarak; tipe kamar menentukan harga, fasilitas, dan luas."

Satu catatan jujur: pada data dummy sekarang, sepuluh baris kebetulan mewakili sepuluh bangunan berbeda, sehingga duplikasi nama belum muncul. Model datanya sudah siap; yang belum ada hanya contohnya. Sebutkan itu apa adanya kalau ditanya — penguji lebih menghargai jawaban yang tahu batas datanya sendiri.

#### Alur data: sisi admin dan sisi mahasiswa

Sistem punya dua peran dengan pekerjaan yang berbeda. Admin menyiapkan bahan; mahasiswa memakai hasilnya. Yang mahal dihitung sekali oleh admin; yang murah dihitung ulang setiap kali mahasiswa mengubah preferensi.

| Tahap | Sisi admin | Sisi mahasiswa |
| --- | --- | --- |
| Masukan | Data master kos: nama + tipe, alamat, koordinat, fasilitas, tarif, luas. Ditambah respons kuesioner tingkat kepentingan. | Tidak ada. Mahasiswa hanya membuka aplikasi dan memilih. |
| Pengolahan awal (sekali) | Hitung bobot default Wj dari rata-rata kepentingan, lalu simpan. Hitung dan simpan jarak Haversine setiap bangunan. | — |
| Permintaan | — | Buka aplikasi: sistem memakai W default hasil kuesioner. Bila perlu, geser slider untuk memakai bobot pribadi. |
| Perhitungan saat diminta | — | Backend menghitung Vi dengan bobot yang sedang aktif, lalu mengurutkan dari terbesar ke terkecil. |
| Keluaran | Basis data siap pakai + bobot default tervalidasi. | Daftar ranking dan kartu "nama kos - tipe kamar". |

Pembagian inilah yang membuat klaim performa bisa dipertanggungjawabkan. Bobot default dihitung sekali secara batch, karena datanya tidak berubah selama tidak ada respons baru. Vi harus dihitung ulang pada setiap permintaan, karena bergantung pada bobot yang sedang dipakai. Jarak tidak perlu dihitung ulang setiap permintaan, karena koordinat kos dan kampus tidak berubah: cukup dihitung saat data master disentuh, lalu hasilnya disimpan. Jika admin mengubah koordinat, hasil lama dibuang dan dihitung lagi — inilah cache invalidation, dan menyebutnya menunjukkan Anda paham sistem, bukan hanya rumus.

Beban komputasinya kecil dan mudah dihitung di depan penguji. Haversine adalah O(1) per pasangan titik: sekitar sepuluh operasi trigonometri, tidak bergantung pada jumlah data. SAW adalah O(m × n): untuk 10 kos dan 6 kriteria ada 60 perkalian-tambahan; untuk 1.000 kos ada 6.000. Normalisasi menambah satu lintasan O(m × n) untuk mencari nilai minimum dan maksimum tiap kolom. Tidak ada proses iteratif semacam eigenvector pada AHP yang tumbuh O(n³).

> **KLAIM YANG BOLEH DAN BELUM BOLEH**
>
> Boleh: "kompleksitasnya linier terhadap jumlah kos dan jumlah kriteria, dan tidak ada iterasi numerik." Belum boleh: "terbukti di bawah satu detik", karena uji beban belum dijalankan. Bedakan target rancangan dari hasil pengukuran; penguji menghargai kejujuran itu lebih daripada angka bulat.

> **KALIMAT SIAP PAKAI UNTUK PERTANYAAN BEBAN**
>
> "Data master fisik kos saya simpan sekali. Perhitungan Haversine dan SAW berjalan stateless: setiap permintaan membawa bobot yang aktif, backend menghitung Vi di memori, lalu mengembalikan ranking. Karena SAW hanya penjumlahan berbobot — O(m × n), tanpa iterasi — biaya komputasinya linier, bukan eksponensial. Yang belum saya lakukan adalah uji beban formal; itu masuk tahap pengujian."

#### Data tetap, data masukan, dan data turunan

Pembagian yang paling sering diminta penguji: mana data yang disimpan, mana yang dihitung, dan mana yang hanya ditempel di kartu. Ada tiga kelompok, bukan dua.

| Kelompok | Isi | Disimpan | Masuk rumus | Contoh nilai |
| --- | --- | --- | --- | --- |
| Label identitas | Nama kos + tipe kamar, alamat/patokan, fasilitas (teks), rentang tarif asli, luas asli (teks) | Ya | Tidak | Rp 600.000 - Rp 900.000; 3 × 3 m |
| Masukan komputasi | Koordinat kos (lat2, lon2) dan koordinat kampus (lat1, lon1) | Ya | Ya, sebagai input Haversine | -5,3813140 ; 105,2522760 |
| Variabel turunan | C1 sampai C6, matriks R, bobot W, Vi, dan peringkat | Boleh di-cache | Ya | 522,98 m; 0,910331 |

Satu koreksi yang perlu Anda pegang: koordinat bukan "data yang tidak dipakai menghitung". Koordinat adalah data master yang disimpan sekali, tetapi nilainya menjadi input Haversine. Rumusan yang tepat: disimpan sekali, dipakai berulang. Bedanya penting, karena penguji akan langsung bertanya "kalau koordinat tidak dipakai, dari mana C2 Anda?".

Sebaliknya, tarif asli dan luas asli memang tidak masuk rumus. Yang masuk adalah skornya, yaitu C1 dan C4. Tetapi skor itu tidak boleh muncul dari langit: ia diturunkan dari tarif dan luas melalui rubrik pada Lampiran F. Jadi rantainya: tarif Rp 600.000 - Rp 900.000, menjadi kelas 3, menjadi C1 = 3, dinormalisasi, lalu dikali bobot. Kalau penguji menanyakan asal skor, Anda menunjuk rubrik, bukan mengarang.

#### Kuantitatif vs kualitatif, dan mengapa harus dikonversi

Penelitian ini mencampur dua jenis data, dan itu bukan cacat; hampir semua penelitian sistem pendukung keputusan begitu. Yang harus bisa Anda jelaskan adalah di mana data kualitatif berhenti menjadi kualitatif.

| Kriteria | Sifat data asli | Tingkat ukur | Perlakuan | Skala di X |
| --- | --- | --- | --- | --- |
| C1 Harga sewa | Kuantitatif (rupiah) | Rasio | Dikelaskan ke 4 band tarif | 1-4 |
| C2 Jarak | Kuantitatif (meter) | Rasio | Dipertahankan apa adanya | meter |
| C3 Fasilitas | Kualitatif (ada/tidak) | Nominal | Dihitung jumlah item terpenuhi | 1-9 |
| C4 Luas kamar | Kuantitatif (m²) | Rasio | Dikelaskan ke 3 kelas luas | 1-3 |
| C5 Kebersihan | Kualitatif (persepsi) | Ordinal | Diskalakan Likert | 1-5 |
| C6 Keamanan | Kualitatif (persepsi) | Ordinal | Diskalakan Likert | 1-5 |
| W Bobot | Kuantitatif turunan | Rasio | Rata-rata dibagi total (22,8) | 0-1, Σ = 1 |

**Mengapa harus dikonversi?**

1. **Karena SAW hanya bisa menjumlahkan angka.** Vi = Σ Wj Rij tidak punya tempat untuk "AC" atau "cukup bersih" di dalam penjumlahan. Konversi bukan kemalasan metodologis; ia syarat agar metode bisa dijalankan.

2. **Karena skala harus sebanding.** Skor membuat data bisa dihitung; normalisasi membuatnya bisa dibandingkan. Dua tahap dengan dua alasan berbeda, dan keduanya tidak boleh dilewatkan. Tanpa skor, data kualitatif tidak masuk; tanpa normalisasi, meter dan skor tidak bisa dijumlahkan.

3. **Karena rubrik membuat penilaian dapat diaudit.** Kalau C3 hanya dinilai "bagus", tidak ada yang bisa diperiksa. Kalau C3 = 8 dari 9 item dengan daftar item yang eksplisit, penguji bisa menghitung ulang sendiri di depan Anda.

Mengapa C2 tidak diklasifikasikan padahal C1 dan C4 diklasifikasikan? Karena jarak sudah dalam satuan yang seragam dan presisi, sehingga mengklasifikasikannya justru membuang informasi. Sebaliknya, tarif dan luas di lapangan sering hanya diketahui sebagai rentang atau perkiraan; memaksakan angka presisi akan memberi kesan palsu. Prinsipnya: klasifikasikan ketika data aslinya kasar, pertahankan ketika data aslinya presisi.

Satu hal yang perlu Anda akui: rata-rata dari skor ordinal — termasuk bobot yang berasal dari tingkat kepentingan 1-5 — secara teori tidak sepenuhnya sah, karena jarak antar kategori belum tentu sama. Dalam praktik penelitian, rata-rata Likert lazim dipakai dan dipertahankan. Cukup sebutkan itu sebagai batasan; tidak perlu dibela mati-matian.

#### Variabel tiap algoritma: Haversine dan SAW

Ini bagian yang paling sering diminta di papan tulis: sebutkan variabel masuk, variabel antara, dan variabel keluar untuk masing-masing algoritma. Haversine punya satu keluaran; SAW punya satu keluaran. Keduanya bertemu hanya di satu titik: d menjadi C2.

**Haversine Distance — satu keluaran, sepuluh simbol**

| Simbol | Nama | Nilai pada KOS B | Satuan |
| --- | --- | --- | --- |
| φ1 (phi-1) | Lintang kampus | -5,3774079 | derajat |
| λ1 (lambda-1) | Bujur kampus | 105,2496447 | derajat |
| φ2 (phi-2) | Lintang kos | -5,3813140 | derajat |
| λ2 (lambda-2) | Bujur kos | 105,2522760 | derajat |
| Δφ | Selisih lintang | -0,0000681743 | radian |
| Δλ | Selisih bujur | 0,0000459248 | radian |
| a | Tali busur (haversine) | 1,6846 × 10⁻⁹ | tanpa satuan |
| c | Sudut pusat | 0,0000820871 | radian |
| R | Jari-jari bumi | 6.371.000 | meter |
| d | Jarak great-circle | 522,98 | meter |

```text
RANTAI HAVERSINE

delta_phi = phi2 - phi1            (dalam radian)
delta_lam = lambda2 - lambda1      (dalam radian)

a = sin^2(delta_phi/2) + cos(phi1) * cos(phi2) * sin^2(delta_lam/2)
c = 2 * atan2( sqrt(a), sqrt(1 - a) )
d = R * c                          (R dalam meter, d dalam meter)
```

Dua kesalahan yang paling sering terjadi. Pertama, sudut dimasukkan dalam derajat, padahal fungsi trigonometri meminta radian — itulah gunanya kolom Δφ dan Δλ. Kedua, R ditulis 6.371 sehingga keluaran menjadi kilometer; karena naskah sudah dikoreksi ke meter, R harus 6.371.000.

**SAW — tiga tahap, delapan simbol**

| Simbol | Nama | Nilai pada data ini | Catatan |
| --- | --- | --- | --- |
| m | Jumlah alternatif | 10 | Banyaknya baris matriks X |
| n | Jumlah kriteria | 6 | Banyaknya kolom matriks X |
| Xij | Nilai asli alternatif i pada kriteria j | Lampiran C | Campuran skor dan meter |
| B, C | Himpunan benefit dan cost | B = {C3, C4, C5, C6}; C = {C1, C2} | Menentukan arah normalisasi |
| max, min | Nilai terbaik tiap kolom | Lampiran D | Dihitung per kolom, bukan per baris |
| Rij | Nilai ternormalisasi | 0 sampai 1 | Benefit X dibagi max; cost min dibagi X |
| Wj | Bobot kriteria | 0,0921 sampai 0,1798; Σ = 1 | Rata-rata dibagi 22,8 |
| Vi | Skor preferensi akhir | 0,5762 sampai 0,9103 | Σ Wj × Rij |

```text
RANTAI SAW

BENEFIT (C3, C4, C5, C6) :  Rij = Xij / max(Xij)
COST    (C1, C2)         :  Rij = min(Xij) / Xij
BOBOT                    :  Wj  = rata-rata_j / total_rata-rata
SKOR AKHIR               :  Vi  = SUM(j=1..n) Wj * Rij
```

Perhatikan asimetri yang mudah tertukar: pada benefit pembilangnya nilai alternatif, pada cost pembilangnya nilai minimum kolom. Keduanya menghasilkan angka 0 sampai 1 dengan arah yang sama — semakin besar, semakin baik. Setelah arahnya disamakan, penjumlahan berbobot menjadi sah.

Contoh KOS B pada C2 yang bersifat cost: min kolom C2 adalah 522,98 — KOS B sendiri — sehingga R = 522,98 / 522,98 = 1,000000. Contoh KOS B pada C1 yang juga cost: min kolom C1 adalah 1 milik KOS D, sehingga R = 1 / 3 = 0,333333. Jadi kos termurah mendapat 1 pada kriteria biaya, dan kos terdekat mendapat 1 pada kriteria jarak. Bukan sebaliknya.

> **PETA CEPAT**
>
> Haversine menjawab "berapa meter?"; SAW menjawab "seberapa cocok?". Haversine punya satu keluaran, d, yang langsung menjadi C2. SAW punya satu keluaran, Vi, yang menjadi urutan. Tidak ada tumpang tindih: Haversine tidak menilai, SAW tidak mengukur jarak.

## BAGIAN II — Temuan Ketidakselarasan Naskah vs Workbook

*Baca sebelum mencetak berkas. Ini daftar hal yang akan terlihat oleh penguji jika tidak diperbaiki.*

Kedua file panduan lama — panduan garis besar dan panduan tanya jawab — disusun sebelum workbook final. Keduanya masih memakai contoh lama: koordinat gerbang -5,3789/105,2538, satuan kilometer, harga dalam rupiah per tahun, bobot tetap 25/25/20/10/10/10, dan nama kos Mawar/Melati/Anggrek. Workbook sekarang berbeda pada hampir semua hal itu. Jika Anda menjawab dengan versi lama sementara layar menampilkan versi baru, penguji akan melihat inkonsistensinya dalam hitungan detik.

Tabel berikut memetakan perbedaan itu beserta tindakannya. Prioritas ditandai: MERAH wajib beres sebelum sempro, KUNING sebaiknya, HIJAU sudah beres.

| Prioritas | Item | Versi dokumen lama | Versi workbook terkini | Tindakan |
| --- | --- | --- | --- | --- |
| MERAH | Titik acuan kampus | -5,3789 LS; 105,2538 BT (gerbang utama) | -5,3774079 LS; 105,2496447 BT (titik place IIB) | Pilih satu. Rekomendasi: pakai titik workbook, lalu perbarui Bab 3.2, 3.8.1, 3.8.2, Tabel 3.3, dan slide. |
| MERAH | Satuan jarak | Kilometer, R = 6.371 | Meter, R = 6.371.000 | Sudah diperbaiki di workbook. Perbarui teks naskah yang masih menulis km. |
| MERAH | Skala C1 | Nominal rupiah per tahun | Skor 1–4 dari rentang tarif per bulan | Selaraskan Tabel 3.2 dan Subbab 3.4 (masih menulis "tahunan"). |
| MERAH | Skala C3 | Likert 1–5 | 1–9 (jumlah item fasilitas) | Perbarui Tabel 3.2; sebutkan rubriknya di lampiran. |
| MERAH | Skala C4 | Likert 1–5 | 1–3 (kelas luas kamar) | Perbarui Tabel 3.2; jelaskan ambang 9 m² dan 15 m². |
| MERAH | Bobot kriteria | 0,25 / 0,25 / 0,20 / 0,10 / 0,10 / 0,10 (contoh) | 0,0921 / 0,1974 / 0,2544 / 0,1140 / 0,1623 / 0,1798 (hasil survei) | Angka 0,25 hanyalah ilustrasi di panduan lama. Jangan pernah menyebutnya sebagai bobot penelitian. |
| KUNING | Jumlah alternatif | 3 kos contoh | 10 kos (KOS A–KOS J) | Sesuaikan narasi "tiga alternatif" jika masih ada. |
| KUNING | Contoh Vi | KOS Mawar 0,8528 | KOS B 0,9103 | Ganti seluruh contoh nama dan angka lama. |
| MERAH | Daftar Pustaka | Belum ter-generate (bagian kosong) | 11 jurnal acuan | Buka Mendeley Cite, klik Insert Bibliography. Tanpa ini, daftar pustaka naskah kosong. |
| MERAH | ERD dan Class Diagram | Baru dibahas sebagai teori (2.12.3); belum ada gambarnya | Use Case (Gambar 3.2) dan Activity (Gambar 3.3) sudah ada | Siapkan ERD dan Class Diagram. Penguji teman Anda menanyakan keduanya. |
| KUNING | Jumlah responden | Target 30–50 | Dummy 10 | Sebut sebagai uji coba pipeline; jangan klaim representatif. |
| HIJAU | Nama responden | Nama mahasiswa | TES 1–TES 10 | Wajar untuk dummy; ganti saat data asli masuk. |

Satu temuan yang paling berisiko adalah koordinat kampus. Jarak antara kedua titik acuan itu 489 meter — cukup besar untuk menggeser nilai C2 secara signifikan. Saya sudah menguji dampaknya: dengan koordinat lama, seluruh nilai Vi berubah, tetapi urutan sepuluh alternatif tetap identik (B, F, G, J, E, C, A, H, D, I). Itu kabar baik untuk Anda: perubahan titik acuan tidak mengubah kesimpulan. Tetapi angka yang Anda sebut di sidang tetap harus angka yang tampil di layar. Jangan sampai Anda menyebut 317 meter untuk KOS B sementara proyektor menampilkan 522,98 meter.

> **JAWABAN JIKA PENGUJI MENEMUKAN ANGKA BERBEDA**
>
> "Terima kasih, Pak/Bu. Angka pada naskah adalah versi draf dengan titik acuan gerbang utama. Setelah verifikasi ulang di Google Maps, titik acuan saya perbaiki menjadi titik place kampus, dan seluruh perhitungan saya ulang di workbook. Peringkatnya tidak berubah; yang berubah hanya nilai jarak dan Vi. Saya akan menyelaraskan naskah pada revisi." — jujur, spesifik, dan menunjukkan Anda menguasai dampaknya.

### Rencana perbaikan sebelum cetak

Kerjakan berurutan. Totalnya sekitar 2,5 jam, dan semuanya bisa selesai sebelum berkas dikumpulkan. Centang satu per satu; jangan lompat ke nomor 5 sebelum nomor 1 selesai, karena daftar pustaka adalah satu-satunya item yang tidak bisa diperbaiki di menit terakhir.

| No | Tindakan | Rincian | Estimasi |
| --- | --- | --- | --- |
| 1 | Generate Daftar Pustaka | Mendeley Cite → Insert Bibliography; cek 11 jurnal, APA 7th | 10 menit |
| 2 | Samakan koordinat kampus | Ganti -5,3789/105,2538 menjadi -5,3774079/105,2496447 di Bab 3.2, 3.8.1, 3.8.2, Tabel 3.3, dan slide | 20 menit |
| 3 | Perbaiki Tabel 3.2 | Tulis C1 1–4, C3 1–9, C4 1–3, C5/C6 1–5; ganti "tahunan" menjadi "per bulan" | 20 menit |
| 4 | Seragamkan satuan jarak | Semua km menjadi meter; R = 6.371.000 | 15 menit |
| 5 | Tambahkan ERD | Lima entitas: users, kos, kriteria, bobot_preferensi, hasil_rekomendasi | 45 menit |
| 6 | Tambahkan Class Diagram | Lima kelas: User, Kos, Kriteria, BobotPreferensi, HasilRekomendasi | 30 menit |
| 7 | Sinkronkan slide | Semua angka mengikuti workbook; hapus contoh Kos Mawar/Melati/Anggrek | 15 menit |
| 8 | Uji tautan referensi | Klik 11 tautan di slide, pastikan terbuka sebelum sidang | 10 menit |

## BAGIAN III — Bank Tanya Jawab Sempro

*40 pertanyaan: 9 dari panduan lama, 16 dari pengalaman teman, 15 turunan perhitungan dan jebakan.*

Setiap jawaban disusun dengan pola yang sama: definisi singkat, alasan, bukti angka, lalu batasan. Pola ini penting karena penguji jarang berhenti di "apa", ia hampir selalu lanjut ke "kenapa" dan "bukannya bisa dengan cara lain?". Jika Anda menjawab hanya definisi, Anda akan terus dicecar.

Jangan menghafal kata per kata. Hafalkan urutan argumen dan tiga angka kunci: 0,9103 (Vi tertinggi), 522,98 meter (jarak terdekat), dan 0,0921–0,1798 (rentang bobot). Sisanya bisa Anda susun sendiri di tempat.

> **EMPAT LANGKAH MENJAWAB PENGUJI**
>
> 1) Nyatakan posisi: ini pertanyaan tentang apa. 2) Beri alasan metodologis. 3) Tunjukkan angka dari workbook. 4) Tutup dengan batasan atau rencana perbaikan. Jawaban yang mengakui batasan justru lebih sulit dibantah daripada jawaban yang mengklaim sempurna.

#### Pertanyaan 1 — Cara kerja sistem secara sederhana

*Sumber: PANDUAN_TANYA_JAWAB_SEMPRO.txt, Pertanyaan 1 (diperbarui)*

**Pertanyaan penguji:** *"Coba jelaskan alur logika dan cara kerja sistem Anda dengan bahasa sederhana, tanpa berbelit-belit."*

**Arah jawaban:**

Sistem ini melakukan tiga pekerjaan berurutan: mengukur, menilai, lalu mengurutkan.

1. **Mengukur jarak.** Sistem mengubah dua titik koordinat — kampus dan kos — menjadi satu angka jarak dalam meter. Ini pekerjaan Haversine.

2. **Menilai.** Sistem menyusun enam kriteria ke dalam satu tabel, menormalisasinya agar satuannya sama, lalu mengalikannya dengan bobot yang berasal dari survei mahasiswa. Ini pekerjaan SAW.

3. **Mengurutkan.** Skor akhir setiap kos diurutkan dari terbesar ke terkecil. Kos dengan skor tertinggi muncul sebagai kartu rekomendasi utama di aplikasi.

Analogi yang paling mudah dipahami penguji adalah rapor. Setiap mata pelajaran punya skala berbeda; guru tidak bisa menjumlahkan nilai matematika 90 dengan nilai praktik 8. Karena itu nilai dinormalisasi lebih dulu, baru diberi bobot dan dijumlahkan menjadi satu nilai akhir. SAW melakukan hal yang sama terhadap enam kriteria kos.

Satu hal yang harus Anda tegaskan di akhir: sistem tidak memilihkan kos untuk mahasiswa. Sistem mengurutkan alternatif berdasarkan bobot yang diberikan. Keputusan tetap berada di tangan pengguna. Kalimat ini memindahkan posisi Anda dari "pembuat ramalan" menjadi "pembangun alat bantu keputusan", dan itu posisi yang jauh lebih aman di sidang.

> **KALIMAT KUNCI**
>
> "Sistem saya mengukur jarak dengan Haversine, menilai enam kriteria dengan SAW, lalu mengurutkan hasilnya. Sistem tidak memilih, ia memberi urutan. Keputusan tetap milik mahasiswa."

#### Pertanyaan 2 — Metode berperan sebagai apa dalam penelitian

*Sumber: 16 pertanyaan teman sempro, nomor 1*

**Pertanyaan penguji:** *"Sebenarnya metode di penelitian Anda ini berperan sebagai apa? Sebagai objek yang diteliti, atau alat?"*

**Arah jawaban:**

Jawaban terbaik adalah: keduanya, tetapi pada tingkat yang berbeda. Ada peran ganda yang harus Anda pisahkan dengan rapi.

| Peran | Penjelasan | Konsekuensi metodologis |
| --- | --- | --- |
| Sebagai objek implementasi | Judul penelitian adalah "implementasi metode", sehingga metode harus diwujudkan menjadi kode yang benar-benar berjalan di backend dan aplikasi. | Metode wajib dijelaskan definisi matematisnya dan dibuktikan terpasang di sistem. |
| Sebagai instrumen komputasi | Haversine dan SAW adalah mesin transformasi data: koordinat menjadi jarak, matriks menjadi peringkat. | Kebenaran komputasi harus dapat diaudit dan direplikasi. |
| Bukan sebagai hipotesis yang diuji | Metode ini sudah mapan (established method); penelitian Anda bukan eksperimen untuk membuktikan metode itu benar secara matematis. | Yang diuji adalah artefak dan konsistensi implementasinya, bukan teori di balik metode. |

Analogi yang sering saya pakai: metode itu mesin di dalam mobil. Insinyur tidak perlu membuktikan ulang hukum termodinamika; yang ia uji adalah apakah mesin yang ia pasang menyala, apakah tenaganya sesuai spesifikasi, dan apakah konsumsinya wajar. Di penelitian ini, Haversine dan SAW adalah mesin; aplikasi adalah mobilnya; validasi terhadap Excel adalah uji dyno-nya.

Konsekuensi praktisnya: Anda tidak perlu mempertahankan "keunggulan Haversine" seolah-olah itu temuan baru. Yang Anda pertahankan adalah tiga hal — implementasinya benar, hasilnya konsisten dengan perhitungan manual, dan integrasi keduanya menghasilkan rekomendasi yang masuk akal.

> **KALIMAT KUNCI**
>
> "Metode berperan ganda: sebagai objek yang saya implementasikan dan sebagai mesin komputasi sistem. Tetapi yang saya uji bukan kebenaran matematis metodenya — metode itu sudah mapan — melainkan kebenaran implementasinya pada aplikasi."

#### Pertanyaan 3 — Yang diuji: metode atau hasil aplikasi

*Sumber: 16 pertanyaan teman sempro, nomor 2*

**Pertanyaan penguji:** *"Berarti yang diuji bukan metodenya, tetapi hasil aplikasinya — apakah sudah sesuai dengan metode yang dibahas atau tidak, dan apakah sama dengan perhitungan manual?"*

**Arah jawaban:**

Betul, dan itu memang desain yang saya pilih secara sadar. Dalam rekayasa perangkat lunak, ada dua istilah yang harus Anda bedakan dan sebutkan:

- **Verification —** apakah sistem dibangun sesuai spesifikasi? Apakah rumus yang tertulis di Bab III benar-benar diterjemahkan menjadi kode, tanpa salah indeks kolom, salah referensi sel, atau salah satuan?

- **Validation —** apakah keluaran sistem sesuai dengan acuan yang benar? Di sini acuannya adalah perhitungan manual di Excel yang dibangun dari rumus yang sama.

Mengapa metodenya tidak diuji ulang? Karena Haversine dan SAW bersifat deterministik dan sudah mapan. Untuk masukan yang sama, keluarannya selalu sama. Tidak ada variabilitas yang perlu diuji dengan statistik. Yang rentan salah justru implementasinya: salah menulis RADIANS, lupa mengunci sel absolut, menukar cost dengan benefit, atau membulatkan terlalu dini.

Rancangan pengujiannya karena itu terdiri dari dua lapis:

1. **Black Box Testing —** menguji fungsi antarmuka dan alur sistem — login, katalog, slider bobot, tampilan hasil — dengan Equivalence Partitioning dan Boundary Value Analysis (Uminingsih dkk., 2022).

2. **Validasi akurasi —** membandingkan tiga keluaran kunci antara backend Go dan Excel: jarak d, matriks ternormalisasi R, dan skor Vi. Toleransi pembulatan 0,0001. Sistem dinyatakan valid jika urutan peringkat 1 sampai n identik 100%.

Perlu Anda siapkan jika ditanya "berapa toleransinya?". Jawab: untuk nilai numerik, selisih maksimum yang dapat diterima adalah galat pembulatan empat desimal; untuk peringkat, tidak ada toleransi — harus identik. Alasannya, peringkat adalah keluaran substantif sistem; pergeseran satu posisi berarti rekomendasi berubah.

> **KALIMAT KUNCI**
>
> "Metodenya sudah mapan dan deterministik, jadi tidak saya uji ulang. Yang saya uji adalah implementasinya: apakah kode menghasilkan jarak, normalisasi, dan peringkat yang sama dengan perhitungan manual. Kalau berbeda, yang salah adalah implementasi saya, bukan metodenya."

#### Pertanyaan 4 — Pengertian metode dan urgensinya

*Sumber: 16 pertanyaan teman sempro, nomor 13*

**Pertanyaan penguji:** *"Jelaskan pengertian metode yang Anda pakai, dan apa urgensinya sampai metode itu yang dipilih."*

**Arah jawaban:**

Haversine Distance adalah formula trigonometri sferis untuk menghitung panjang busur lingkaran besar (great-circle distance) antara dua titik di permukaan bola. Karena bumi diperlakukan sebagai bola, jarak dihitung dari sudut pusat yang dibentuk dua vektor posisi, bukan dari selisih koordinat pada bidang datar.

```text
HAVERSINE — TIGA LANGKAH INTI

a = sin^2(dphi/2) + cos(phi1) * cos(phi2) * sin^2(dlambda/2)
c = 2 * asin(sqrt(a))
d = R * c        dengan R = 6.371.000 meter
```

Urgensinya: jarak adalah kriteria yang paling sulit diukur secara objektif oleh mahasiswa. Tanpa perhitungan, jarak hanya bisa dinyatakan sebagai "dekat", "sedang", atau "jauh" — dan itu persepsi. Haversine mengubah persepsi itu menjadi angka meter yang dapat direproduksi siapa pun dari koordinat yang sama.

Simple Additive Weighting adalah metode MADM yang menghasilkan skor akhir melalui penjumlahan terbobot dari nilai kriteria yang telah dinormalisasi. Rumusnya Vi = Σ (Wj × Rij). Sifatnya aditif dan kompensatoris: kekurangan pada satu kriteria dapat ditutup oleh kelebihan pada kriteria lain.

Urgensinya: enam kriteria Anda memiliki satuan yang tidak bisa dijumlahkan langsung. SAW adalah jembatan yang mengubah rupiah, meter, dan skor persepsi menjadi satu indeks 0–1 yang dapat diurutkan. Tanpa SAW, Anda hanya punya enam kolom angka tanpa kesimpulan.

Mengapa keduanya harus berpasangan? Haversine tanpa SAW hanya menghasilkan satu kolom jarak; ia tidak bisa membandingkan kos yang dekat tapi mahal dengan kos yang jauh tapi lengkap. SAW tanpa Haversine hanya mengandalkan penilaian jarak yang subjektif. Integrasi keduanya adalah kontribusi penelitian ini: jarak menjadi kriteria biaya yang terukur, dan SAW menjadi agregator yang transparan.

#### Pertanyaan 5 — Objek penelitian dan permasalahannya

*Sumber: 16 pertanyaan teman sempro, nomor 14*

**Pertanyaan penguji:** *"Ceritakan objek penelitian Anda. Apa masalah nyata dari objek itu, misalnya soal waktu dan biaya observasi kos?"*

**Arah jawaban:**

Objek material penelitian ini adalah rumah kos di kawasan permukiman sekitar kampus IIB Darmajaya — Gedong Meneng dan Rajabasa — dalam radius 1 sampai 3 kilometer. Unit analisisnya adalah alternatif kos (10 pada data uji coba, target 30–50), sedangkan respondennya adalah mahasiswa perantau yang sedang atau pernah menyewa kos.

Permasalahan objeknya dapat dijelaskan dalam lima titik:

1. **Asimetri informasi —** informasi yang tersebar di media sosial dan grup WhatsApp sering tidak sesuai kondisi riil — harga, fasilitas, dan kebersihan berbeda dari yang dipromosikan.

2. **Biaya dan waktu observasi —** mahasiswa harus mendatangi banyak lokasi untuk membandingkan. Sebagai ilustrasi aritmetika: 10 kos, dua kunjungan per kos, 30 menit per kunjungan, sudah 10 jam, belum termasuk perjalanan dan waktu tunggu.

3. **Jarak tidak terukur —** jarak ke kampus umumnya ditaksir secara verbal, padahal jarak adalah faktor yang paling langsung memengaruhi waktu tempuh dan biaya transportasi harian.

4. **Kriteria tidak terstandar —** setiap kos punya kombinasi harga, fasilitas, luas, kebersihan, dan keamanan yang berbeda, sehingga perbandingan "apel dengan apel" sulit dilakukan secara manual.

5. **Data cepat kedaluwarsa —** data kos berubah cepat; kos yang sudah penuh atau berubah tarif masih dipromosikan di unggahan lama.

Dari lima masalah itu, tiga pertama adalah masalah pengukuran dan pembandingan — di situlah Haversine dan SAW masuk. Dua masalah terakhir adalah masalah tata kelola data — di situlah peran admin sebagai kurator diperlukan. Pemisahan ini penting: tidak semua masalah diselesaikan algoritma, dan mengakui hal itu menunjukkan Anda memahami batas peran metode.

> **KALIMAT KUNCI**
>
> "Objeknya kos, masalahnya keputusan, solusinya sistem. Kos tidak saya ubah; yang saya ubah adalah cara mahasiswa membandingkannya — dari kesan subjektif menjadi enam kriteria terukur."

#### Pertanyaan 6 — Target pengguna secara to the point

*Sumber: 16 pertanyaan teman sempro, nomor 12*

**Pertanyaan penguji:** *"Siapa target pengguna aplikasi Anda? Jawab to the point, jangan panjang lebar."*

**Arah jawaban:**

Tiga kalimat sudah cukup:

- **Pengguna utama —** mahasiswa aktif IIB Darmajaya, terutama mahasiswa perantau yang sedang atau akan menyewa kos dalam radius 3 km dari kampus.

- **Pengguna kedua —** administrator atau kurator data kos yang memverifikasi harga, fasilitas, dan titik koordinat sebelum data tayang.

- **Bukan pengguna —** pemilik kos. Mereka adalah sumber data dan penerima manfaat tidak langsung, tetapi bukan pengguna aplikasi dan tidak memiliki akun.

Mengapa pemilik kos tidak diberi akun? Karena jika mereka mengunggah data sendiri tanpa verifikasi, risiko promosi berlebihan dan data palsu meningkat. Admin berfungsi sebagai penjaga kualitas data — dan itulah yang membedakan sistem ini dari direktori kos biasa.

| Aktor | Yang dilakukan | Hak akses |
| --- | --- | --- |
| Mahasiswa | Melihat rekomendasi, mengatur bobot preferensi, membuka detail dan rute peta | Baca data, ubah bobot personal |
| Administrator | Menambah, mengubah, memverifikasi kos dan koordinat | Kelola data master |
| Pemilik kos | Memberi informasi saat verifikasi lapangan | Tidak ada akun |

#### Pertanyaan 7 — Gap dengan aplikasi yang sudah ada (Mamikos)

*Sumber: 16 pertanyaan teman sempro, nomor 15*

**Pertanyaan penguji:** *"Apa bedanya dengan aplikasi atau web yang sudah ada, misalnya Mamikos? Apa gap penelitian Anda?"*

**Arah jawaban:**

Pertanyaan ini harus dijawab dengan posisi yang jelas, bukan dengan mengklaim lebih baik di segala hal. Mamikos adalah marketplace properti: kekuatannya pada kelengkapan listing, merek, dan fitur transaksi. Penelitian Anda bukan marketplace, dan tidak perlu bersaing di wilayah itu.

| Dimensi | Aplikasi marketplace (mis. Mamikos) | Sistem dalam penelitian ini |
| --- | --- | --- |
| Tujuan | Mempertemukan pencari kos dengan pemilik kos | Membantu mahasiswa memeringkat kos sesuai preferensi |
| Titik acuan jarak | Lokasi pengguna atau alamat umum | Titik kampus IIB Darmajaya sebagai acuan tetap |
| Dasar peringkat | Kelayakan listing dan fitur platform; mekanisme tidak dirancang untuk diaudit akademik | SAW dengan bobot eksplisit dan rumus yang dapat dihitung ulang |
| Transparansi | Pengguna melihat hasil, tidak melihat perhitungan | Pengguna dapat melihat bobot dan skor tiap kriteria |
| Cakupan | Nasional dan luas | Lokal, radius 1–3 km, dikurasi admin |
| Model | Komersial | Akademik, non-komersial |

Gap penelitiannya dapat dirumuskan dalam satu kalimat: aplikasi yang ada menjawab pertanyaan "kos apa saja yang tersedia di sekitar saya", sedangkan penelitian ini menjawab "kos mana yang paling sesuai untuk saya, dengan bobot yang saya tentukan, diukur dari kampus". Pertanyaan pertama adalah masalah direktori; pertanyaan kedua adalah masalah pengambilan keputusan multikriteria.

Perlu dicatat secara jujur: sistem ini tidak memiliki basis data sebesar Mamikos, tidak memiliki ulasan pengguna, dan tidak menangani pembayaran atau pemesanan. Itu bukan kelemahan yang harus disembunyikan, melainkan konsekuensi ruang lingkup. Anda meneliti metode dan pipeline komputasinya, bukan membangun perusahaan prop-tech.

> **KALIMAT KUNCI**
>
> "Mamikos membantu saya menemukan kos yang tersedia. Sistem ini membantu saya memutuskan kos mana yang paling sesuai — dengan bobot yang saya tentukan sendiri dan perhitungan yang bisa saya audit."

#### Pertanyaan 8 — Kontribusi dan manfaat praktis

*Sumber: PANDUAN_TANYA_JAWAB_SEMPRO.txt, Pertanyaan 9 (diperbarui)*

**Pertanyaan penguji:** *"Apa kontribusi dan manfaat nyata penelitian ini dibandingkan survei manual atau aplikasi pencari kos yang sudah ada?"*

**Arah jawaban:**

Kontribusinya paling tepat dijelaskan pada tiga tingkat.

1. **Bagi mahasiswa —** waktu dan biaya survei turun karena mahasiswa dapat membandingkan banyak kos sebelum mendatangi lokasi; informasi jarak, harga, dan fasilitas tersaji dalam satu tampilan; dan urutan rekomendasi tidak ditentukan oleh promosi berbayar.

2. **Bagi pemilik kos —** kos yang layak memperoleh eksposur yang setara, tidak bergantung pada besarnya anggaran promosi. Verifikasi admin menjaga agar data yang tayang sesuai kondisi lapangan.

3. **Bagi akademisi —** memberi bukti empiris bahwa Haversine dapat diintegrasikan sebagai kriteria biaya kontinu di dalam SAW pada aplikasi mobile, dan bahwa pipeline komputasinya dapat direplikasi serta diaudit.

Ada satu kontribusi metodologis yang jarang disadari dan layak Anda tonjolkan: penelitian ini tidak memperlakukan jarak sebagai kategori ordinal (dekat/sedang/jauh), melainkan sebagai besaran rasio dalam meter yang dinormalisasi dengan MIN/x. Artinya, perbedaan 100 meter antara dua kos tetap terlihat pada skor akhir, tidak hilang karena keduanya masuk keranjang kategori yang sama.

Yang tidak boleh Anda klaim: bahwa sistem ini lebih baik daripada Mamikos secara umum, atau bahwa rekomendasinya terbukti meningkatkan kepuasan mahasiswa. Untuk klaim kedua, Anda memerlukan uji pengguna dan data empiris yang belum ada. Klaim yang aman adalah klaim tentang kebenaran komputasi dan kelayakan integrasi metode.

#### Pertanyaan 9 — Batasan masalah

*Sumber: 16 pertanyaan teman sempro, nomor 11*

**Pertanyaan penguji:** *"Apa batasan masalah penelitian Anda? Sebutkan dengan tegas."*

**Arah jawaban:**

Bedakan dua jenis batasan. Yang pertama tertulis di naskah (Subbab 1.3) dan wajib Anda sebut persis. Yang kedua adalah batasan teknis yang muncul dari pilihan metode, dan harus Anda akui jika ditanya.

**Batasan yang tertulis di ruang lingkup:**

1. Kos di sekitar kampus IIB Darmajaya, Bandar Lampung;

2. aplikasi berbasis mobile Android;

3. Haversine untuk jarak dan SAW untuk peringkat, dengan enam kriteria: harga, jarak, fasilitas, luas, kebersihan, keamanan;

4. data kos diperoleh dari kuesioner mahasiswa dan observasi lapangan.

**Batasan teknis yang harus siap Anda akui:**

- **Model bumi —** bumi dimodelkan sebagai bola; ellipsoid WGS-84 dan elevasi diabaikan.

- **Jarak —** yang dihitung adalah jarak garis lurus great-circle, bukan jarak tempuh jalan.

- **Kriteria —** hanya enam kriteria; faktor lain seperti keamanan gender, akses air, atau parkir tidak dimodelkan.

- **Aktor —** hanya dua peran; pemilik kos tidak memiliki akun.

- **Transaksi —** tidak ada pembayaran, pemesanan, atau kontrak sewa.

- **Koordinat —** titik koordinat berasal dari pin Google Maps, sehingga ketelitiannya bergantung pada akurasi pin.

- **Model —** SAW bersifat kompensatoris; kelemahan satu kriteria dapat tertutup kriteria lain. Model tidak memodelkan interaksi antar kriteria.

- **Data —** 10 responden dan 10 kos adalah data uji coba pipeline, bukan sampel representatif.

Mengapa batasan ini penting disebut lebih dulu? Karena batasan adalah kontrak ruang lingkup. Penguji yang menyerang di luar batasan itu sedang menguji hal yang tidak Anda janjikan. Anda boleh menjawab: "Itu di luar ruang lingkup penelitian saya, Pak/Bu, dan sudah saya nyatakan pada Subbab 1.3. Untuk hal itu, saya cantumkan sebagai saran penelitian lanjutan."

#### Pertanyaan 10 — Haversine vs Euclidean vs Google Directions

*Sumber: PANDUAN_TANYA_JAWAB_SEMPRO.txt, Pertanyaan 3 (dikoreksi)*

**Pertanyaan penguji:** *"Kenapa memakai Haversine, bukan Euclidean atau Google Maps Directions API?"*

**Arah jawaban:**

Mulailah dengan jawaban yang jujur, karena inilah yang membedakan Anda dari mahasiswa yang menghafal brosur. Untuk radius kota, Euclidean yang diproyeksikan dengan benar sebenarnya cukup dekat dengan Haversine. Perbedaannya tidak dramatis. Jadi alasan memilih Haversine bukan karena Euclidean "salah total", melainkan karena Haversine lebih tepat secara konsep dan lebih praktis.

| Pendekatan | Kelebihan | Keterbatasan untuk kasus ini |
| --- | --- | --- |
| Euclidean pada bidang datar | Paling sederhana dan cepat | Memerlukan proyeksi dan asumsi bidang datar; skala tidak seragam antara arah utara–selatan dan timur–barat; tidak dapat dipakai lintas wilayah tanpa koreksi |
| Google Directions API | Memberi jarak tempuh jalan yang realistis | Berbayar per panggilan, bergantung kuota dan jaringan, latensi tinggi; jarak berubah mengikuti lalu lintas sehingga tidak deterministik |
| Haversine | Tanpa proyeksi, tanpa API, deterministik, langsung dari derajat WGS-84, stabil untuk jarak dekat | Mengabaikan bentuk ellipsoid dan topografi; menghasilkan jarak garis lurus |

Alasan kedua, yang lebih substantif: penelitian ini membutuhkan ukuran kedekatan yang stabil dan dapat direproduksi, bukan estimasi waktu tempuh. Jika saya memakai Directions API, nilai C2 akan berubah ketika ada kemacetan atau ketika rute ditutup — padahal data kos tidak berubah. Jarak great-circle adalah atribut geografis yang tetap, sehingga cocok menjadi kriteria dalam model keputusan.

Alasan ketiga, arsitektural: perhitungan harus dapat berjalan di backend tanpa ketergantungan pihak ketiga. Dengan Haversine, seluruh perangkingan dapat dieksekusi lokal, gratis, dan offline. Google Maps tetap diintegrasikan, tetapi hanya untuk navigasi rute ketika pengguna sudah memilih kos — bukan untuk perhitungan C2.

Jika penguji menekan "jadi jarak Anda tidak realistis karena bukan jarak jalan?", jawab: "Betul, dan itu saya nyatakan sebagai batasan. Untuk skala di bawah 10 km, galat model bola terhadap ellipsoid kecil, dan korelasi jarak garis lurus dengan jarak tempuh cukup tinggi untuk keperluan perangkingan. Untuk navigasi sebenarnya, aplikasi membuka rute Google Maps."

#### Pertanyaan 11 — Haversine vs skor jarak 1–5

*Sumber: 16 pertanyaan teman sempro, nomor 5*

**Pertanyaan penguji:** *"Kenapa harus memakai Haversine? Kenapa tidak cukup memberi skor 1–5 untuk jarak, seperti kriteria lain?"*

**Arah jawaban:**

Ada dua alasan yang saling menguatkan: alasan pengukuran, dan alasan matematis.

Alasan pengukuran. Skor 1–5 adalah skala ordinal: ia hanya menyatakan urutan, bukan jarak antar-nilai. Dua kos dengan jarak 510 meter dan 990 meter bisa sama-sama masuk kategori "dekat" dan memperoleh skor 5. Padahal selisih 480 meter itu nyata bagi mahasiswa yang berjalan kaki. Haversine menghasilkan skala rasio dalam meter, sehingga setiap perbedaan jarak tetap terlihat.

Alasan matematis. Normalisasi cost SAW memakai pembagian, Rij = MIN(X)/X. Pembagian hanya bermakna pada skala rasio yang memiliki titik nol sejati. Membagi skor ordinal 5 dengan 3 tidak menghasilkan "1,67 kali lebih baik"; ia hanya menghasilkan angka yang kebetulan bisa dihitung. Dengan jarak meter, rasio 522,98 : 1.058,49 benar-benar bermakna: kos B memang dua kali lebih dekat daripada kos E.

Ada satu kekeliruan yang sering muncul dan harus Anda luruskan. Pada kuesioner, C2 memang ditanyakan dengan skala 1–5 — tetapi itu adalah tingkat kepentingan jarak menurut responden, bukan nilai jarak kos. Skala 1–5 itu dipakai untuk menghitung bobot W2. Nilai jarak aktual setiap kos diambil dari koordinat dan dihitung dengan Haversine. Jadi keduanya tidak bertentangan; keduanya menjawab pertanyaan berbeda.

> **KALIMAT KUNCI**
>
> "Skor 1–5 menjawab 'seberapa penting jarak bagi responden'. Haversine menjawab 'seberapa jauh kos ini dari kampus'. Yang pertama menjadi bobot; yang kedua menjadi nilai kriteria. Tidak bisa saling menggantikan."

#### Pertanyaan 12 — SAW vs AHP dan TOPSIS

*Sumber: PANDUAN_TANYA_JAWAB_SEMPRO.txt, Pertanyaan 4 + 16 pertanyaan teman sempro nomor 6*

**Pertanyaan penguji:** *"Kenapa memilih SAW? Bukankah AHP atau TOPSIS lebih canggih dan lebih ilmiah?"*

**Arah jawaban:**

"Lebih canggih" bukan kriteria pemilihan metode. Kriteria yang benar adalah kesesuaian antara sifat masalah, kebutuhan sistem, dan biaya komputasi. Pada tiga dimensi itu, SAW menang untuk kasus ini.

| Aspek | SAW | AHP | TOPSIS |
| --- | --- | --- | --- |
| Struktur | Penjumlahan terbobot | Perbandingan berpasangan | Jarak ke solusi ideal positif dan negatif |
| Kompleksitas | O(m × n), linier | O(n³) untuk eigenvector | O(m × n), tetapi lebih banyak tahap |
| Konsistensi | Tidak diperlukan | Wajib CR ≤ 0,1 | Tidak diperlukan |
| Bobot dinamis | Sangat mudah (slider) | Sulit; matriks harus disusun ulang | Mudah |
| Transparansi | Tinggi; setiap suku dapat diaudit | Sedang; bobot berasal dari eigenvector | Sedang; konsep solusi ideal lebih abstrak |
| Cocok untuk | Kriteria aditif dan kompensatoris | Sedikit kriteria, penilaian pakar | Perbandingan relatif terhadap solusi ideal |

Tiga alasan operasional:

1. **Kecepatan —** aplikasi harus merespons dalam hitungan milidetik di ponsel. SAW hanya melakukan perkalian dan penjumlahan matriks 10 × 6.

2. **Bobot dinamis —** bobot dapat diubah pengguna kapan saja melalui slider. Pada AHP, perubahan satu bobot menuntut penyusunan ulang matriks perbandingan dan uji konsistensi; itu tidak mungkin dilakukan pengguna awam.

3. **Auditabilitas —** setiap suku Vi dapat ditunjukkan kepada pengguna dan dihitung ulang secara manual. Ini penting karena penelitian Anda memakai Excel sebagai acuan validasi.

Kelemahan SAW yang harus Anda akui: model ini mengandaikan kriteria saling independen dan dapat saling mengompensasi. Kos yang mahal bisa menang karena fasilitasnya sangat lengkap. Itu bukan bug, melainkan sifat model yang sesuai dengan cara mahasiswa menimbang pilihan. Jika penelitian ini tentang kesetaraan akses, model kompensatoris justru perlu dipertanyakan — dan itu menjadi saran penelitian lanjutan.

Untuk sitasi, gunakan pola satu kalimat satu sumber: SAW telah dipakai untuk rekomendasi kos mahasiswa berbasis mobile (Purwanto dkk., 2025). Perbandingan SMART dan SAW menunjukkan SAW konsisten untuk perangkingan kos (Gudiato dkk., 2025). Klasifikasi cost dan benefit pada hunian sewa dijelaskan oleh Putri dan Maulana (2024).

> **KALIMAT KUNCI**
>
> "Saya tidak memilih metode yang paling rumit, saya memilih metode yang paling sesuai. SAW cocok karena bobotnya harus bisa diubah pengguna, komputasinya ringan di ponsel, dan setiap angkanya bisa saya pertanggungjawabkan di depan penguji."

#### Pertanyaan 13 — Mengapa kebersihan dan keamanan tidak masuk fasilitas

*Sumber: 16 pertanyaan teman sempro, nomor 3*

**Pertanyaan penguji:** *"Kenapa keamanan dan kebersihan tidak dimasukkan ke dalam fasilitas saja? Bukankah itu juga bagian dari fasilitas kos?"*

**Arah jawaban:**

Karena ketiganya mengukur konstruk yang berbeda, dan mencampurnya akan menimbulkan penghitungan ganda. Dalam perancangan instrumen, kriteria harus saling lepas (mutually exclusive) agar setiap atribut hanya dihitung satu kali.

| Kriteria | Pertanyaan yang dijawab | Sifat pengukuran | Contoh indikator |
| --- | --- | --- | --- |
| C3 Fasilitas | Apa saja yang tersedia? | Hitungan item (ada/tidak), skala 1–9 | Kasur, lemari, meja, kursi, KM dalam, WiFi, AC, water heater, listrik & air |
| C5 Kebersihan | Seberapa bersih dan sehat? | Persepsi terukur, skala 1–5 | Kondisi kamar mandi, saluran air, sampah, ventilasi |
| C6 Keamanan | Seberapa terlindungi penghuni? | Persepsi terukur, skala 1–5 | Pagar, kunci, CCTV, penjaga, penerangan, akses tamu |

Jika keamanan dimasukkan ke fasilitas, kos yang memasang CCTV akan otomatis mendapat skor fasilitas lebih tinggi — padahal CCTV bukan fasilitas kamar, melainkan atribut proteksi. Jika kebersihan dimasukkan ke fasilitas, ia tidak bisa dihitung sebagai item karena kebersihan bukan benda yang ada atau tidak ada; ia adalah kualitas. Memaksakannya menjadi checklist akan menghasilkan pengukuran yang tidak valid.

Ada dua akibat metodologis jika digabung. Pertama, terjadi double counting: satu atribut (misalnya kamar mandi dalam) bisa memengaruhi fasilitas sekaligus kebersihan, sehingga bobot efektifnya menjadi dua kali lipat. Kedua, bobot fasilitas yang sekarang 25,44% akan membengkak dan mendominasi seluruh model, karena ia menyerap dua konstruk sekaligus.

Pemisahan ini juga menjaga agar pengguna dapat menimbang secara berbeda. Mahasiswa yang pernah mengalami kehilangan barang akan menaikkan bobot C6; mahasiswa yang rentan sakit akan menaikkan C5. Jika keduanya dilebur ke C3, preferensi seperti itu tidak lagi bisa dinyatakan.

> **KALIMAT KUNCI**
>
> "Fasilitas menjawab 'apa yang ada'. Kebersihan menjawab 'seberapa bersih'. Keamanan menjawab 'seberapa terlindungi'. Tiga pertanyaan berbeda, tiga kriteria berbeda. Kalau saya gabung, saya menghitung satu hal dua kali."

#### Pertanyaan 14 — Parameter apa yang masuk kriteria fasilitas

*Sumber: 16 pertanyaan teman sempro, nomor 4*

**Pertanyaan penguji:** *"Atas dasar apa item-item itu masuk ke fasilitas? Kenapa WiFi dan kamar mandi dalam tidak berdiri sendiri sebagai kriteria?"*

**Arah jawaban:**

Saya memakai lima syarat inklusi. Sebuah atribut masuk C3 hanya jika memenuhi semuanya:

1. **Keterikatan —** melekat pada unit kamar atau disediakan pengelola sebagai bagian dari sewa;

2. **Verifiabilitas —** keberadaannya dapat diverifikasi secara biner: ada atau tidak ada;

3. **Keterhitungan —** dapat dihitung sebagai item, sehingga skor C3 adalah jumlah item terpenuhi;

4. **Non-overlap —** bukan ukuran biaya, jarak, kebersihan, atau keamanan;

5. **Relevansi —** relevan bagi mahasiswa sebagai pertimbangan memilih kamar.

| Item | Ekonomis | Standar | VIP | Eksklusif | Alasan masuk fasilitas |
| --- | --- | --- | --- | --- | --- |
| Kasur | Ada | Ada | Ada | Ada | Perabot inti kamar, biner |
| Lemari | Ada | Ada | Ada | Ada | Perabot inti kamar, biner |
| Meja belajar | Ada | Ada | Ada | Ada | Perabot inti kamar, biner |
| Kursi | Ada | Ada | Ada | Ada | Perabot inti kamar, biner |
| Kamar mandi dalam | – | – | Ada | Ada | Melekat pada unit, biner, bukan biaya/jarak |
| WiFi | – | Ada | Ada | Ada | Utilitas yang disediakan pengelola, biner |
| AC | – | – | Ada | Ada | Utilitas kamar, biner |
| Water heater | – | – | – | Ada | Utilitas kamar, biner |
| Listrik & air | Ada | Ada | Ada | Ada | Utilitas dasar, biner |
| Total skor C3 | 5 | 6 | 8 | 9 |  |

Mengapa WiFi dan kamar mandi dalam tidak berdiri sendiri? Ada tiga alasan.

Pertama, alasan konstruk. Keduanya adalah bagian dari satu konstruk yang sama, yaitu kelengkapan fasilitas kamar. Memecahnya menjadi kriteria terpisah berarti mengukur konstruk yang sama berkali-kali dengan nama berbeda — dan itu melanggar prinsip unidimensionalitas instrumen.

Kedua, alasan statistik. Item-item fasilitas saling berkorelasi kuat karena dijual dalam paket tipe kamar. Ekonomis hampir selalu tanpa AC; Eksklusif hampir selalu dengan water heater. Jika setiap item dijadikan kriteria, terjadi multikolinearitas: model akan menghitung informasi yang sama berulang kali, dan bobot efektif item tersebut menjadi tidak terkendali.

Ketiga, alasan beban kognitif. Jika 9 item fasilitas dipecah menjadi 9 kriteria, total kriteria menjadi 14. Responden harus memberi bobot 14 hal, pengguna harus menggeser 14 slider, dan penguji akan bertanya mengapa studi Anda tiba-tiba menjadi begitu rumit. Prinsip parsimoni menuntut model sesederhana mungkin selama masih menjelaskan masalah.

Kapan item tunggal layak berdiri sendiri? Jika pertanyaan penelitiannya memang tentang item itu — misalnya "pengaruh ketersediaan WiFi terhadap preferensi kos" — atau jika item tersebut tidak berkorelasi dengan item lain. Untuk penelitian ini, keduanya tidak berlaku. Karena itu pengelompokan adalah pilihan yang tepat, bukan sekadar kemudahan.

#### Pertanyaan 15 — Harga skala 1–4, jarak tetap meter

*Sumber: PANDUAN_TANYA_JAWAB_SEMPRO.txt, Pertanyaan 5 (disesuaikan dengan instrumen)*

**Pertanyaan penguji:** *"Harga dikonversi ke skala 1–4, tetapi jarak tetap dalam meter. Bukankah itu tidak konsisten? Kenapa tidak disamakan saja?"*

**Arah jawaban:**

Justru sebaliknya: ketidakseragaman itu mengikuti tingkat ketelitian data yang tersedia. Prinsipnya, jangan menciptakan presisi yang tidak dimiliki data.

Harga. Responden tidak memilih nominal rupiah yang tepat; mereka memilih rentang tarif. Pilihannya memang berupa band: Rp 400.000–600.000, Rp 600.001–800.000, Rp 800.001–1.000.000, dan Rp 1.000.001–1.400.000 per bulan. Jika saya memaksakan nominal rupiah, saya harus mengarang angka di tengah rentang — dan itu presisi palsu. Skala 1–4 adalah representasi paling jujur dari resolusi data yang benar-benar dikumpulkan.

Jarak. Sebaliknya, jarak tidak berasal dari persepsi responden. Ia dihitung dari koordinat, sehingga resolusinya bisa mencapai satuan meter. Mengubahnya menjadi skor 1–5 justru membuang informasi yang sudah dimiliki. Prinsipnya: pertahankan data pada resolusi tertinggi yang tersedia, lalu seragamkan lewat normalisasi.

Mengapa perbedaan ini tidak merusak perhitungan? Karena keduanya dinormalisasi ke rentang 0–1 sebelum dijumlahkan. Setelah normalisasi, C1 dan C2 berada pada skala yang sama; yang berbeda hanyalah asal-usul datanya. Normalisasi adalah tempat semua perbedaan satuan diselesaikan, bukan tempat ia diperparah.

Namun ada batasan yang harus Anda akui jika ditanya lebih dalam. Rumus MIN/x mengandaikan skala rasio. Skala 1–4 pada C1 adalah ordinal: rasio antara skor 1 dan 2 tidak benar-benar berarti "dua kali lebih murah". Ini kelemahan nyata. Mitigasinya tiga: pertama, urutan band bersifat monoton, sehingga arah preferensi tetap benar; kedua, bobot C1 hanya 9,21%, sehingga dampaknya terhadap Vi terbatas; ketiga, untuk penelitian lanjutan, titik tengah setiap band dapat dipakai sebagai nilai kontinu sehingga skala rasio benar-benar terpenuhi.

> **KALIMAT KUNCI**
>
> "Saya tidak menyeragamkan skala di hulu, karena data harga memang hanya tersedia dalam bentuk rentang. Saya menyeragamkannya di hilir, lewat normalisasi. Yang penting bukan skala awalnya sama, tetapi skala akhirnya sama."

#### Pertanyaan 16 — Asal bobot dan siapa yang menentukan

*Sumber: PANDUAN_TANYA_JAWAB_SEMPRO.txt, Pertanyaan 2 (diperbarui)*

**Pertanyaan penguji:** *"Bobot kriteria Anda patok sendiri sebagai peneliti, atau ditentukan pengguna?"*

**Arah jawaban:**

Jawabannya: keduanya, pada dua lapisan yang berbeda. Ada bobot default penelitian, dan ada bobot personal pengguna. Jangan mencampur keduanya saat menjawab.

Lapisan pertama, bobot default. Bobot ini tidak saya tentukan. Ia dihitung dari rata-rata skor kepentingan yang diberikan responden pada setiap kriteria, lalu dinormalisasi:

```text
DARI SKOR RESPONDEN MENJADI BOBOT

mean_j   = AVERAGE(skor responden pada kriteria j)
total    = SUM(mean_1 ... mean_6) = 22,8
Wj       = mean_j / total

W1 = 2,1 / 22,8 = 0,092105
W2 = 4,5 / 22,8 = 0,197368
W3 = 5,8 / 22,8 = 0,254386
W4 = 2,6 / 22,8 = 0,114035
W5 = 3,7 / 22,8 = 0,162281
W6 = 4,1 / 22,8 = 0,179825
CEK: SUM(W1:W6) = 1,000000
```

Lapisan kedua, bobot personal. Pada aplikasi, mahasiswa dapat mengubah bobot melalui slider. Mahasiswa yang membawa kendaraan sendiri dapat menurunkan W2 dan menaikkan W3; mahasiswa dengan anggaran ketat dapat menaikkan W1 dan W2. Bobot personal ini tidak mengubah bobot default penelitian; ia hanya mengubah perhitungan pada sesi pengguna tersebut.

Yang perlu Anda tegaskan: peneliti hanya memilih cara mengagregasi (rata-rata lalu proporsi), bukan menentukan nilai bobotnya. Ini penting karena pertanyaan tersembunyi di balik "siapa yang menentukan" adalah "apakah bobot Anda subjektif?". Jawabannya: bobot default berasal dari responden; bobot personal berasal dari pengguna; peneliti tidak menanam preferensinya sendiri.

Jika ditanya "berapa respondennya?", jawab jujur: data saat ini 10 responden uji coba, target 30–50. Jangan mengklaim 30–50 sudah terkumpul. Untuk sempro, yang diuji adalah mekanismenya; untuk skripsi, jumlahnya harus dipenuhi.

#### Pertanyaan 17 — Mengapa hanya dua peran pengguna

*Sumber: PANDUAN_TANYA_JAWAB_SEMPRO.txt, Pertanyaan 6 (diperbarui)*

**Pertanyaan penguji:** *"Kenapa penggunanya hanya mahasiswa dan admin? Kenapa pemilik kos tidak diberi akses, dan kenapa tidak ada web dashboard?"*

**Arah jawaban:**

Tiga alasan, dan semuanya bermuara pada kualitas data serta ruang lingkup.

1. **Integritas data —** jika pemilik kos dapat mendaftar dan mengunggah data sendiri tanpa verifikasi, muncul insentif untuk melebih-lebihkan fasilitas atau menurunkan harga di iklan. Admin berfungsi sebagai kurator yang memverifikasi kondisi fisik, fasilitas, dan titik koordinat. Satu peran tambahan di sisi pengguna berarti satu pintu masuk data yang tidak terkontrol.

2. **Fokus penelitian —** penelitian ini tentang rancang bangun dan pengujian algoritma, bukan tentang marketplace. Setiap peran tambahan menuntut fitur tambahan: verifikasi akun, manajemen langganan, moderasi, sengketa. Itu akan menggeser fokus penelitian dari metode ke administrasi platform.

3. **Kesesuaian media —** baik mahasiswa maupun admin bekerja di lapangan dengan ponsel: mencari kos, memotret, menandai koordinat. Web dashboard akan menambah satu basis kode yang harus dibangun, diuji, dan dipertanggungjawabkan tanpa manfaat langsung bagi inti penelitian.

Jika penguji bertanya "lalu bagaimana pemilik kos memperbarui datanya?", jawab: melalui admin, dengan mekanisme verifikasi. Itu keputusan desain yang disengaja, bukan keterbatasan yang tidak disadari. Untuk penelitian lanjutan, peran pemilik kos dapat ditambahkan beserta alur verifikasi berjenjang.

#### Pertanyaan 18 — Urutan perhitungan Haversine langkah demi langkah

*Sumber: Tambahan perhitungan — diambil dari audit workbook*

**Pertanyaan penguji:** *"Coba jelaskan urutan menghitung jarak Haversine. Kenapa rumusnya berlapis-lapis begitu?"*

**Arah jawaban:**

Rumus Haversine sengaja dipecah menjadi lima kolom, bukan satu formula panjang, supaya setiap langkah dapat diperiksa sendiri. Urutannya wajib: F → G → H → I → J. Setiap kolom hanya bergantung pada kolom di sebelah kirinya.

| Kolom | Nama | Rumus | Arti |
| --- | --- | --- | --- |
| F | Δφ (radian) | =RADIANS(B2-$D$2) | Selisih lintang kos dan kampus, dikonversi ke radian |
| G | Δλ (radian) | =RADIANS(C2-$E$2) | Selisih bujur kos dan kampus, dikonversi ke radian |
| H | a | =SIN(F2/2)^2 + COS(RADIANS($D$2))*COS(RADIANS(B2))*SIN(G2/2)^2 | Komponen haversine (kuadrat setengah tali busur) |
| I | c | =2*ASIN(SQRT(H2)) | Sudut pusat antara dua titik, dalam radian |
| J | d | =6371000*I2 | Jarak di permukaan bumi, dalam meter |

Sekarang contoh konkret KOS B. Koordinat kos: -5,381314 dan 105,252276. Koordinat kampus: -5,3774079 dan 105,2496447.

```text
CONTOH LENGKAP — KOS B

LANGKAH 1  delta phi
  = RADIANS(-5,381314 - (-5,3774079))
  = RADIANS(-0,0039061)
  = -0,0000681743 radian

LANGKAH 2  delta lambda
  = RADIANS(105,252276 - 105,2496447)
  = RADIANS(0,0026313)
  =  0,0000459248 radian

LANGKAH 3  nilai a
  suku 1 = SIN(-0,0000681743 / 2)^2            = 0,00000000116193
  faktor = COS(-5,3774079) x COS(-5,381314)    = 0,99121100
  suku 3 = SIN(0,0000459248 / 2)^2             = 0,00000000052727
  a      = 0,00000000116193 + (0,99121100 x 0,00000000052727)
         = 0,00000000168457

LANGKAH 4  sudut pusat c
  akar(a) = 0,0000410435
  ASIN    = 0,0000410435 radian
  c       = 2 x 0,0000410435 = 0,0000820871 radian

LANGKAH 5  jarak d
  d = 6.371.000 x 0,0000820871 = 522,98 meter
```

Mengapa langkahnya harus begitu? Karena yang dihitung bukan jarak pada bidang datar, melainkan sudut yang dibentuk dua titik dari pusat bumi. Langkah 1–3 menghitung fungsi sudut itu (a); Langkah 4 mengembalikannya menjadi sudut (c); Langkah 5 mengubah sudut menjadi panjang busur dengan mengalikannya dengan jari-jari bumi. Tidak ada langkah yang bisa dilewati, karena setiap langkah adalah invers atau komposisi dari langkah sebelumnya.

Satu detail yang sering ditanya: mengapa Δφ dan Δλ harus dalam radian? Karena fungsi SIN, COS, dan ASIN di Excel maupun di Go bekerja dalam radian. Jika Anda memasukkan derajat, hasilnya salah secara sistematis. Fungsi RADIANS() mengalikan dengan π/180, dan itulah satu-satunya alasan konversi itu ada.

#### Pertanyaan 19 — Mengapa nilai a terlihat nol

*Sumber: Tambahan perhitungan — pertanyaan yang paling mungkin muncul saat menampilkan sheet Haversine*

**Pertanyaan penguji:** *"Di kolom a, semua nilainya nol. Berarti ada yang salah, ya?"*

**Arah jawaban:**

Nilai a bukan nol. Ia sangat kecil, dan tampilan enam desimal membulatkannya menjadi nol. Ini soal format, bukan soal nilai.

Secara matematis, a bukan jarak. Ia adalah kuadrat dari jarak yang telah dinormalkan terhadap diameter bumi:

```text
a = (d / 2R)^2

KOS A: d = 1.556,84 m; 2R = 12.742.000 m
a = (1.556,84 / 12.742.000)^2 = 1,4928 x 10^-8
ditampilkan 6 desimal: 0,000000
ditampilkan 10 desimal: 0,0000000149
```

Mengapa nilainya sekecil itu? Karena jarak kota (1–2 km) sangat kecil dibandingkan keliling bumi (±40.000 km). Kuadrat dari perbandingan yang kecil pasti menjadi jauh lebih kecil. Ini normal, bukan anomali. Untuk jarak 1.500 meter dengan R = 6.371.000 meter, a berada pada orde 10⁻⁸.

| Kos | Nilai a (asli) | Tampilan 6 desimal | Tampilan 10 desimal |
| --- | --- | --- | --- |
| KOS A | 1,4928335 × 10⁻⁸ | 0,000000 | 0,0000000149 |
| KOS B | 1,6845727 × 10⁻⁹ | 0,000000 | 0,0000000017 |
| KOS C | 1,9077701 × 10⁻⁸ | 0,000000 | 0,0000000191 |
| KOS D | 1,4874467 × 10⁻⁸ | 0,000000 | 0,0000000149 |
| KOS E | 6,9007407 × 10⁻⁹ | 0,000000 | 0,0000000069 |
| KOS F | 2,5227959 × 10⁻⁹ | 0,000000 | 0,0000000025 |
| KOS G | 1,4420164 × 10⁻⁸ | 0,000000 | 0,0000000144 |
| KOS H | 1,3067417 × 10⁻⁸ | 0,000000 | 0,0000000131 |
| KOS I | 3,4965672 × 10⁻⁸ | 0,000000 | 0,0000000350 |
| KOS J | 1,6229732 × 10⁻⁸ | 0,000000 | 0,0000000162 |

Analogi yang mudah dipahami: mengukur tebal kertas 0,1 mm dengan penggaris berskala meter. Hasilnya tampak "0 meter", padahal kertasnya ada. Alat ukurnya yang kurang teliti untuk skala itu, bukan bendanya yang tidak ada. Di workbook, format kolom H sudah diubah ke sepuluh desimal agar nilainya terlihat.

Yang tidak boleh dilakukan: mengalikan a dengan 10⁶ agar "kelihatan", atau menghapus kolomnya. Nilai a dipakai apa adanya pada Langkah 4 (c = 2·asin(√a)). Mengubahnya berarti merusak seluruh perhitungan jarak.

#### Pertanyaan 20 — Mengapa satuan meter, dan apakah mengubah hasil

*Sumber: Tambahan perhitungan — keputusan teknis yang sudah diterapkan*

**Pertanyaan penguji:** *"Kenapa jaraknya meter, bukan kilometer? Dan apakah mengganti satuan mengubah peringkat?"*

**Arah jawaban:**

Alasannya sederhana dan operasional: jarak antar-kos di sekitar kampus berada pada orde ratusan sampai ribuan meter. Jika dinyatakan dalam kilometer, nilainya menjadi 0,52 km; 1,06 km; 2,38 km — angka yang kurang informatif dan rawan salah baca. Meter memberi resolusi yang sesuai dengan skala objek.

Secara teknis, yang berubah hanya konstanta jari-jari bumi:

```text
kilometer : d = 6371 x c

meter     : d = 6371000  x c

Keduanya identik, karena 6371 km = 6.371.000 m.
Yang berubah hanya faktor 1000 pada keluaran.
```

Apakah peringkat berubah? Tidak. Ini poin yang paling sering ditanyakan dan paling mudah dibuktikan. Normalisasi cost memakai R = MIN(x)/x. Jika semua nilai x dikalikan 1000, maka:

```text
R' = MIN(1000x) / (1000x) = 1000 MIN(x) / 1000 x = MIN(x) / x = R

Faktor 1000 saling menghilangkan. R tidak berubah,
maka Vi tidak berubah, maka peringkat tidak berubah.
```

Sifat ini disebut scale-invariant. Ia bukan kebetulan, melainkan konsekuensi dari penggunaan rasio, bukan selisih. Bandingkan dengan normalisasi (MAX − x)/(MAX − MIN): rumus itu tidak scale-invariant untuk semua transformasi, dan hasilnya bergantung pada satuan. Inilah salah satu alasan MIN/x dipakai pada SAW.

Saat sidang, cukup tunjukkan satu baris: KOS B 522,98 meter; jika ditulis 0,52298 km, R2 tetap 1,000000 karena ia adalah jarak terdekat. Tidak ada satu pun nilai R yang berubah, sehingga tidak ada satu pun peringkat yang bergeser.

#### Pertanyaan 21 — Dari mana angka bobot 0,0921 dan seterusnya

*Sumber: Tambahan perhitungan — verifikasi Tahap 1*

**Pertanyaan penguji:** *"Coba jelaskan asal angka 0,0921; 0,1974; 0,2544; dan seterusnya. Jangan-jangan itu angka yang Anda karang."*

**Arah jawaban:**

Angka itu berasal dari pembagian sederhana: rata-rata skor tiap kriteria dibagi total seluruh rata-rata. Tidak ada angka yang dikarang; semuanya dapat dihitung ulang dari kolom jawaban responden.

| Kriteria | Skor responden (10 orang) | Jumlah | Rata-rata | Rata-rata / 22,8 |
| --- | --- | --- | --- | --- |
| C1 Harga | 1, 2, 2, 3, 2, 3, 4, 1, 2, 1 | 21 | 2,1 | 0,092105 |
| C2 Jarak | 5, 4, 5, 4, 4, 5, 5, 4, 5, 4 | 45 | 4,5 | 0,197368 |
| C3 Fasilitas | 4, 7, 5, 8, 3, 4, 8, 7, 8, 4 | 58 | 5,8 | 0,254386 |
| C4 Luas | 1, 3, 2, 2, 3, 3, 3, 3, 3, 3 | 26 | 2,6 | 0,114035 |
| C5 Kebersihan | 3, 3, 3, 5, 3, 4, 5, 4, 4, 3 | 37 | 3,7 | 0,162281 |
| C6 Keamanan | 5, 5, 3, 3, 4, 5, 3, 3, 5, 5 | 41 | 4,1 | 0,179825 |
| Total |  |  | 22,8 | 1,000000 |

Perhatikan bahwa total 22,8 bukan angka bulat yang kebetulan; ia adalah jumlah dari enam rata-rata. Karena setiap bobot adalah bagian dari total itu, penjumlahan keenam bobot pasti 1. Di workbook, sel C16 melakukan pemeriksaan ini secara otomatis dan menampilkan 1,000000. Jika suatu saat hasilnya bukan 1, berarti ada kolom yang salah referensi.

Satu hal yang harus Anda antisipasi: angka 22,8 tampak "kecil" karena C1 hanya berskala 1–4 dan C4 hanya 1–3, sedangkan C3 berskala 1–9. Perbedaan lebar skala ini membuat rata-rata C3 secara struktural lebih besar. Ini keterbatasan yang nyata dan saya bahas khusus pada Pertanyaan 34.

#### Pertanyaan 22 — Mengapa Cost memakai MIN/x dan Benefit memakai x/MAX

*Sumber: Tambahan perhitungan — inti normalisasi SAW*

**Pertanyaan penguji:** *"Kenapa rumus normalisasinya berbeda untuk cost dan benefit? Kenapa tidak memakai satu rumus saja?"*

**Arah jawaban:**

Karena arah preferensinya berlawanan, dan rumus harus mencerminkan arah itu. Satu rumus untuk keduanya akan menghasilkan peringkat yang salah pada salah satu kelompok kriteria.

```text
COST C1, C2 Rij = MIN(Xij) / Xij

BENEFIT  C3..C6      Rij = Xij / MAX(Xij)

Sifat yang dihasilkan:
  Cost    : nilai terkecil  -> R = 1   (terbaik)
  Benefit : nilai terbesar  -> R = 1   (terbaik)
  Semua R berada pada rentang 0 < R <= 1
```

Logika cost. Harga dan jarak adalah beban; semakin kecil semakin baik. Dengan membagi nilai minimum dengan nilai setiap alternatif, kos termurah atau terdekat memperoleh 1, dan kos yang dua kali lebih mahal memperoleh 0,5. Angkanya langsung dapat dibaca sebagai proporsi: "kos ini dua kali lebih mahal daripada yang termurah".

Logika benefit. Fasilitas, luas, kebersihan, dan keamanan adalah keuntungan; semakin besar semakin baik. Dengan membagi nilai setiap alternatif dengan nilai maksimum, kos terbaik memperoleh 1, dan kos yang fasilitasnya setengah dari yang terlengkap memperoleh 0,5.

Mengapa tidak memakai (x − MIN)/(MAX − MIN) untuk keduanya? Rumus itu juga menghasilkan rentang 0–1, tetapi ia mengubah jarak antar-nilai secara linear dan tidak menjaga proporsi. Pada MIN/x, kos yang jaraknya dua kali lipat tetap bernilai setengah; pada (x − MIN)/(MAX − MIN), hubungan itu hilang. Untuk kriteria biaya yang ingin dibaca sebagai proporsi, MIN/x lebih tepat.

Mengapa tidak memakai (MAX − x)/(MAX − MIN) untuk cost? Bisa, dan secara matematis sah. Namun MIN/x memiliki keunggulan tambahan: ia scale-invariant. Jika satuan berubah dari kilometer ke meter, hasilnya tidak berubah. Rumus selisih tidak memiliki sifat itu. Karena penelitian ini berpindah dari km ke meter, sifat tersebut menjadi penting.

Satu konsekuensi yang harus Anda pahami: pada setiap kolom, minimal satu alternatif bernilai tepat 1. Itu bukan kecurangan; itu definisi dari rumus. Kos B memperoleh 1 pada C2, C4, C5, dan C6 karena ia terbaik pada keempat kriteria tersebut.

#### Pertanyaan 23 — Apa beda matriks X dan matriks R

*Sumber: Tambahan perhitungan — sering ditanya saat menampilkan sheet Tahap 3*

**Pertanyaan penguji:** *"Di sheet yang sama ada dua matriks. Apa bedanya, dan mengapa harus ada dua?"*

**Arah jawaban:**

Matriks X adalah kenyataan; matriks R adalah bahasa yang bisa dibandingkan. Keduanya diperlukan karena angka mentah tidak bisa dijumlahkan, sedangkan angka ternormalisasi tidak lagi menunjukkan kondisi asli.

| Aspek | Matriks X (keputusan) | Matriks R (normalisasi) |
| --- | --- | --- |
| Isi | Nilai asli setiap kos pada setiap kriteria | Nilai yang sudah dipetakan ke rentang 0–1 |
| Satuan | Bermacam-macam: skor, meter, skor | Tidak bersatuan (dimensionless) |
| Contoh KOS B | 3 \| 522,98 \| 8 \| 3 \| 5 \| 5 | 0,333333 \| 1,000000 \| 0,888889 \| 1,000000 \| 1,000000 \| 1,000000 |
| Bisa dijumlahkan? | Tidak; menjumlahkan meter dengan skor tidak bermakna | Ya; semua kolom berada pada skala yang sama |
| Peran | Menyimpan data faktual | Menjadi masukan perhitungan Vi |

Analogi: X adalah daftar nilai mentah dalam berbagai mata uang; R adalah nilai yang sudah dikonversi ke satu mata uang. Anda tidak bisa menjumlahkan 500 rupiah dengan 3 dolar, tetapi setelah dikonversi ke satu mata uang, penjumlahan menjadi sah. Normalisasi adalah kursnya.

Satu hal yang sering tertukar: R bukan "nilai akhir". R masih per kriteria. Nilai akhir baru muncul setelah R dikalikan bobot dan dijumlahkan menjadi Vi. Jadi urutannya X → R → Vi, bukan X → Vi.

#### Pertanyaan 24 — Hitung manual Vi KOS B

*Sumber: Tambahan perhitungan — permintaan yang sangat umum di sempro*

**Pertanyaan penguji:** *"Coba hitung manual salah satu skor akhir di depan saya. Jangan hanya menunjukkan hasil Excel."*

**Arah jawaban:**

Ambil KOS B. Dari matriks R, barisnya adalah 0,333333; 1,000000; 0,888889; 1,000000; 1,000000; 1,000000. Bobotnya 0,092105; 0,197368; 0,254386; 0,114035; 0,162281; 0,179825.

```text
PERHITUNGAN MANUAL — KOS B

Vi = (0,092105 x 0,333333)
   + (0,197368 x 1,000000)
   + (0,254386 x 0,888889)
   + (0,114035 x 1,000000)
   + (0,162281 x 1,000000)
   + (0,179825 x 1,000000)

   = 0,030702
   + 0,197368
   + 0,226121
   + 0,114035
   + 0,162281
   + 0,179825
   = 0,910331

Dibulatkan 4 desimal: 0,9103
```

Perhatikan tiga hal yang bisa Anda tunjukkan sambil menghitung. Pertama, suku C2 sebesar 0,197368 adalah sumbangan terbesar kedua setelah C3; artinya jarak benar-benar berperan, bukan sekadar pelengkap. Kedua, suku C1 hanya 0,030702 — KOS B memang tidak unggul di harga. Ketiga, jumlah seluruh suku tepat 0,910331, yang berarti Vi tidak pernah melebihi 1 selama semua R ≤ 1 dan total bobot = 1.

Jika penguji meminta kos lain, polanya sama. Yang berubah hanya baris R. Misalnya KOS I memiliki R2 = 0,219495 karena jaraknya terjauh (2.382,64 m), sehingga sumbangan C2-nya hanya 0,043318 — dan itulah sebabnya KOS I berada di peringkat terakhir meskipun fasilitasnya standar.

#### Pertanyaan 25 — Bagaimana membuktikan sistem dan Excel tidak salah

*Sumber: PANDUAN_TANYA_JAWAB_SEMPRO.txt, Pertanyaan 8 + tambahan audit*

**Pertanyaan penguji:** *"Bagaimana Anda membuktikan bahwa aplikasi dan rumus Anda benar? Jangan-jangan Excel-nya juga salah."*

**Arah jawaban:**

Pertanyaan ini adalah kesempatan Anda menunjukkan proses, bukan hanya hasil. Jawab dengan dua lapis pengujian dan satu contoh temuan.

Lapis pertama, Black Box Testing. Seluruh fungsi antarmuka diuji dengan Equivalence Partitioning dan Boundary Value Analysis: login, katalog, slider bobot, tampilan hasil, dan navigasi peta. Tujuannya memastikan sistem berjalan sesuai kebutuhan fungsional (Uminingsih dkk., 2022).

Lapis kedua, validasi numerik terhadap Excel. Excel diperlakukan sebagai acuan (golden standard) karena rumusnya transparan dan dapat diperiksa sel demi sel. Yang dibandingkan bukan hanya Vi, tetapi tiga tingkat: jarak d, matriks R, dan skor Vi. Toleransi numerik 0,0001; untuk urutan peringkat, tidak ada toleransi.

Pertanyaannya kemudian: bagaimana jika Excel-nya yang salah? Di sinilah audit internal berperan. Saya memeriksa workbook dengan tujuh belas pemeriksaan, antara lain: apakah koordinat di Tahap 2 identik dengan kolom Q pada Form; apakah bobot di Tahap 4 benar-benar menunjuk baris 15 Tahap 1; apakah normalisasi dimulai dari baris yang benar; apakah jumlah bobot tepat 1; dan apakah tidak ada sel error.

Audit itu menemukan lima kesalahan nyata yang kemudian diperbaiki. Tiga contoh yang boleh Anda ceritakan: ada referensi melingkar pada Tahap 4; bobot menunjuk baris kosong alih-alih baris hasil; dan normalisasi bergeser satu baris sehingga membaca sel judul. Semua sudah diperbaiki, dan hasil akhirnya lulus 17 dari 17 pemeriksaan.

Mengapa cerita ini kuat? Karena menunjukkan bahwa Anda tidak sekadar percaya pada Excel, tetapi mengauditnya. Penguji yang mencurigai "Excel bisa saja salah" akan berhenti ketika Anda menunjukkan daftar pemeriksaan dan bukti bahwa kesalahan sudah ditemukan lalu diperbaiki.

> **KALIMAT KUNCI**
>
> "Saya tidak menganggap Excel otomatis benar. Saya memeriksa tujuh belas hal, menemukan lima kesalahan, memperbaikinya, dan sekarang seluruh pemeriksaan lulus. Validasi bukan ritual; validasi adalah mencari kesalahan sebelum penguji menemukannya."

#### Pertanyaan 26 — Bagaimana jika ada nilai Vi yang sama

*Sumber: Tambahan perhitungan — kasus tepi yang jarang ditanyakan, tetapi mematikan jika tidak siap*

**Pertanyaan penguji:** *"Kalau ada dua kos dengan skor Vi identik, siapa yang berhak peringkat satu?"*

**Arah jawaban:**

Pada data saat ini tidak ada nilai Vi yang identik; kesepuluh nilai berbeda. Namun secara metodologis, kasus itu mungkin terjadi, dan sistem harus memiliki kebijakan yang eksplisit.

Perilaku Excel. Fungsi RANK memberikan peringkat yang sama untuk nilai yang sama, lalu melompati peringkat berikutnya. Jika dua kos bernilai 0,8000 dan berada di posisi teratas, keduanya mendapat peringkat 1, dan kos berikutnya mendapat peringkat 3. Ini disebut competition ranking.

Kebijakan yang saya sarankan untuk aplikasi. Gunakan urutan tie-break yang deterministik dan dapat dijelaskan:

1. Vi lebih besar menang;

2. jika Vi sama, jarak C2 lebih kecil menang — alasan substantif: jarak adalah kriteria yang paling langsung memengaruhi biaya harian;

3. jika masih sama, C1 lebih kecil menang;

4. jika masih sama, urutkan berdasarkan nama kos secara alfabetis agar hasil selalu dapat direproduksi.

Mengapa tie-break perlu dijelaskan, bukan hanya diimplementasikan? Karena tanpa kebijakan, hasil bisa berubah-ubah antar-run apabila algoritma pengurutan tidak stabil. Penguji yang teliti akan bertanya "apakah hasil Anda deterministik?". Jawaban yang benar: ya, karena urutan tie-break ditetapkan.

Satu jebakan teknis: jangan memeringkat berdasarkan nilai yang sudah dibulatkan empat desimal jika masih ingin membedakan nilai yang sangat dekat. Tetapi untuk tampilan, gunakan nilai yang sama dengan yang dipakai untuk memeringkat, agar pengguna tidak melihat dua angka identik dengan peringkat berbeda. Kebijakan yang paling aman: hitung dengan presisi penuh, tampilkan empat desimal, dan pastikan tidak ada dua nilai yang tampak sama namun berbeda peringkat.

#### Pertanyaan 27 — Titik acuan kampus: mana yang benar

*Sumber: Tambahan perhitungan — temuan audit koordinat*

**Pertanyaan penguji:** *"Di naskah tertulis -5,3789 dan 105,2538. Di Excel tertulis -5,3774079 dan 105,2496447. Yang mana yang benar?"*

**Arah jawaban:**

Keduanya adalah titik yang berbeda, dan perbedaannya bukan salah ketik. Yang pertama adalah gerbang utama kampus; yang kedua adalah titik place Institut Informatika dan Bisnis Darmajaya pada Google Maps. Jarak antara keduanya 489 meter.

| Titik acuan | Koordinat | Sumber | Konsekuensi |
| --- | --- | --- | --- |
| Gerbang utama (versi naskah) | -5,3789 ; 105,2538 | Panduan lama dan Bab 3 naskah | Jarak lebih pendek untuk kos di sisi utara; KOS B menjadi 317 m |
| Titik place IIB (versi workbook) | -5,3774079 ; 105,2496447 | Google Maps place point, dipakai di Excel | Jarak KOS B menjadi 522,98 m; seluruh Vi berubah |

Mana yang sebaiknya dipakai? Titik acuan harus memenuhi tiga syarat: mewakili lokasi yang benar-benar dituju mahasiswa, dapat diverifikasi ulang oleh siapa pun, dan dipakai konsisten di seluruh dokumen. Titik place lebih mudah diverifikasi karena berasal dari objek tempat (place) di Google Maps, bukan dari pin manual. Karena workbook sudah memakainya, rekomendasi saya: pertahankan titik place, lalu perbarui naskah dan slide.

Yang tidak boleh dilakukan adalah membiarkan dua angka hidup berdampingan. Jika penguji membuka Bab 3.2 dan melihat -5,3789, lalu meminta Anda menghitung ulang di depan, hasilnya tidak akan sama dengan layar. Itu bukan kesalahan kecil; itu merusak kredibilitas seluruh perhitungan.

Kabar baiknya, dampaknya sudah saya uji. Dengan koordinat lama, seluruh nilai Vi bergeser, tetapi urutan kesepuluh alternatif tetap identik: B, F, G, J, E, C, A, H, D, I. Artinya, pilihan titik acuan tidak mengubah kesimpulan penelitian. Ini argumen yang kuat jika penguji menekan: "Perubahan titik acuan menggeser nilai, tetapi tidak menggeser kesimpulan."

> **TINDAKAN SEBELUM SEMPRO**
>
> 1) Tetapkan satu koordinat. 2) Perbarui Bab 3.2, 3.8.1, 3.8.2, dan Tabel 3.3. 3) Perbarui slide yang memuat koordinat. 4) Jalankan ulang Excel dan pastikan angka di layar sama dengan angka di naskah. Empat langkah ini menghilangkan satu kategori pertanyaan sekaligus.

#### Pertanyaan 28 — Data dummy: apakah sah dipakai

*Sumber: 16 pertanyaan teman sempro, nomor 8*

**Pertanyaan penguji:** *"Mana data Anda? Jangan-jangan hanya data karangan. Apakah data dummy itu sah dipakai di sempro?"*

**Arah jawaban:**

Data dummy sah dipakai untuk satu tujuan: menguji apakah pipeline perhitungan berjalan benar. Ia tidak sah dipakai untuk mengklaim temuan empiris tentang populasi mahasiswa. Perbedaan dua tujuan itu harus Anda nyatakan lebih dulu, sebelum penguji menanyakannya.

Apa yang sudah tersedia:

- **Kuesioner —** 10 responden (TES 1–TES 10) dengan jawaban enam kriteria;

- **Objek —** 10 alternatif kos (KOS A–KOS J) dengan koordinat, tipe kamar, dan atribut;

- **Workbook —** lima sheet perhitungan: Form Responses, Tahap 1 bobot, Tahap 2 Haversine, Tahap 3 matriks dan normalisasi, Tahap 4 perangkingan;

- **Audit —** 17 pemeriksaan internal yang seluruhnya lulus, tanpa satu sel error.

Mengapa data dummy mencukupi untuk sempro? Karena yang diuji pada tahap ini adalah mekanisme, bukan populasi. Matriks 10 × 6 sudah cukup untuk membuktikan bahwa Haversine menghasilkan jarak, normalisasi menghasilkan rentang 0–1, dan SAW menghasilkan peringkat yang konsisten dengan hitungan manual. Menambah menjadi 50 kos tidak mengubah kebenaran logika; ia hanya menambah baris.

Bagaimana cara mengganti dengan data asli nanti? Tiga langkah: timpa jawaban pada Form Responses 1; perbarui kolom R, S, T (rentang tarif, luas, fasilitas) sesuai jawaban; lalu sesuaikan nilai C1–C6 di Tahap 3 blok B3:G12 mengikuti rubrik di baris 27–55. Seluruh sheet lain akan menghitung sendiri.

Yang harus Anda hindari: menyebut data dummy sebagai "hasil survei". Cukup katakan "data uji coba pipeline". Kejujuran ini justru memperkuat posisi Anda, karena menunjukkan Anda tahu bedanya validasi sistem dan generalisasi temuan.

#### Pertanyaan 29 — Use case, activity, class diagram, dan ERD

*Sumber: 16 pertanyaan teman sempro, nomor 7*

**Pertanyaan penguji:** *"Jelaskan beda use case, activity diagram, class diagram, dan ERD. Mana yang sudah ada di naskah Anda?"*

**Arah jawaban:**

Empat diagram itu menjawab empat pertanyaan berbeda. Jika Anda bisa memisahkannya dengan satu kalimat masing-masing, pertanyaan ini selesai dalam satu menit.

| Diagram | Menjawab pertanyaan | Isi utama | Ada di naskah? |
| --- | --- | --- | --- |
| Use Case | Siapa melakukan apa? | Aktor, use case, asosiasi | Ya — Gambar 3.2 |
| Activity | Bagaimana urutan langkahnya? | Aktivitas, decision, alur kontrol | Ya — Gambar 3.3 |
| Class | Bagaimana struktur kode dan objeknya? | Kelas, atribut, metode, relasi | Belum — baru teori 2.12.3 |
| ERD | Bagaimana data disimpan? | Entitas, atribut, PK/FK, kardinalitas | Belum ada |

Use Case Diagram memodelkan batas fungsional sistem dari sudut pandang aktor. Ia tidak menunjukkan urutan waktu; ia menunjukkan siapa boleh melakukan apa. Pada sistem ini: mahasiswa dapat melihat rekomendasi, mengatur bobot, dan membuka detail; admin dapat mengelola dan memverifikasi data kos.

Activity Diagram memodelkan alur kerja. Ia menjawab urutan: mulai dari input bobot, sistem membaca koordinat, menghitung jarak Haversine, menyusun matriks, menormalisasi, menghitung Vi, lalu menampilkan peringkat. Di sinilah terlihat bahwa Haversine berjalan sebelum SAW.

Class Diagram memodelkan struktur statis perangkat lunak: kelas, atribut, metode, dan hubungannya. Contoh kelas yang masuk akal untuk sistem ini: User, Kos, Kriteria, BobotPreferensi, dan HasilRekomendasi. Class diagram menjadi dasar penulisan kode berorientasi objek dan struktur backend.

ERD memodelkan struktur basis data relasional: entitas, atribut, primary key, foreign key, dan kardinalitas. Contoh entitas: users, kos, kriteria, bobot_preferensi, dan hasil_rekomendasi. ERD menjadi dasar pembuatan tabel di MySQL.

Apa beda class diagram dan ERD? Keduanya terlihat mirip karena sama-sama berisi kotak dan garis. Bedanya: class diagram memodelkan perilaku dan struktur kode (termasuk metode), sedangkan ERD memodelkan penyimpanan data (tanpa metode, tetapi dengan kunci dan normalisasi). Satu kelas dapat dipetakan menjadi satu tabel, tetapi tidak selalu satu banding satu.

> **TEMUAN YANG HARUS DIPERBAIKI**
>
> Naskah Anda sudah memuat Use Case dan Activity Diagram, tetapi Class Diagram baru dibahas sebagai teori dan ERD belum ada gambarnya. Padahal penguji teman Anda menanyakan keduanya. Siapkan dua gambar tambahan sebelum sempro: ERD lima entitas dan class diagram lima kelas. Tanpa itu, Anda akan menjawab dengan mulut sementara penguji mencari gambarnya di naskah.

#### Pertanyaan 30 — Prioritas pengerjaan penelitian

*Sumber: 16 pertanyaan teman sempro, nomor 10*

**Pertanyaan penguji:** *"Dari semua tahapan penelitian Anda, mana yang dikerjakan lebih dulu? Apa prioritasnya?"*

**Arah jawaban:**

Urutan prioritas mengikuti ketergantungan, bukan selera. Ada empat hal yang harus selesai lebih dulu karena menjadi masukan bagi yang lain.

| Prioritas | Pekerjaan | Alasan | Risiko jika dilewati |
| --- | --- | --- | --- |
| 1 | Instrumen dan data: kuesioner, koordinat, atribut kos | Semua perhitungan bergantung pada data | Matriks kosong; seluruh tahap berikutnya tidak bisa dijalankan |
| 2 | Mesin komputasi di Excel: Haversine, bobot, normalisasi, Vi | Menjadi acuan validasi (golden standard) | Tidak ada pembanding; bug di backend tidak akan terdeteksi |
| 3 | Backend Go dan API | Tempat algoritma dijalankan | Aplikasi tidak dapat menghitung |
| 4 | Frontend Flutter mahasiswa dan admin | Antarmuka penyajian hasil | Sistem benar tetapi tidak dapat dipakai |
| 5 | Integrasi, Black Box, validasi sistem vs Excel | Membuktikan kebenaran artefak | Klaim validitas tidak punya bukti |
| 6 | Dokumentasi dan naskah | Merekam seluruh proses | Hasil kerja tidak dapat dipertanggungjawabkan |

Mengapa Excel didahulukan daripada aplikasi? Karena Excel adalah alat audit. Jika Excel dan aplikasi dibangun bersamaan, ketika hasilnya berbeda Anda tidak tahu mana yang salah. Dengan Excel lebih dulu, Anda memiliki acuan yang dapat diperiksa sel demi sel, lalu aplikasi diuji terhadap acuan itu.

Khusus persiapan sempro, prioritasnya berbeda dan lebih sempit: pertama, konsistensi angka antara naskah, slide, dan workbook; kedua, kesiapan data dummy dan alur demonstrasi; ketiga, latihan tanya jawab. Jangan menghabiskan waktu menambah fitur baru yang tidak akan sempat diuji.

#### Pertanyaan 31 — Jumlah artikel dan penelitian terdahulu

*Sumber: 16 pertanyaan teman sempro, nomor 9*

**Pertanyaan penguji:** *"Berapa jumlah artikel yang mendukung penelitian Anda, dan berapa yang masuk penelitian terdahulu? Daftar pustakanya bisa diklik di PPT?"*

**Arah jawaban:**

Angka yang harus Anda sebut: 11 jurnal acuan. Sembilan di antaranya dibahas sebagai penelitian terdahulu pada Tabel 2.3; dua sisanya menjadi pendukung metodologi.

| Kelompok | Jumlah | Jurnal | Peran |
| --- | --- | --- | --- |
| Rekomendasi, SPK, dan SAW | 5 | Purwanto dkk. (2025); Gudiato dkk. (2025); Putri & Maulana (2024); Septiana & Apsiswanto (2023); Dharmawan dkk. (2023) | Landasan SAW, sistem rekomendasi, klasifikasi cost–benefit |
| Haversine dan geolokasi | 3 | Puspita dkk. (2023); Laila dkk. (2022); Kurniawan & Laila (2023) | Formula jarak, penerapan pada mobile, koordinat GPS |
| UML | 1 | Khairunnisa & Voutama (2024) | Standar pemodelan use case, activity, class |
| Black Box Testing | 1 | Uminingsih dkk. (2022) | Metode pengujian fungsional |
| Prototype | 1 | Syarif & Risdiansyah (2024) | Kerangka kerja pengembangan sistem |
| Total | 11 |  |  |

Jadi jika penguji bertanya "berapa penelitian terdahulu?", jawab sembilan. Jika bertanya "berapa artikel pendukung?", jawab sebelas, karena dua jurnal metodologi tetap menjadi rujukan meskipun tidak dibahas pada tabel penelitian terdahulu.

Satu temuan penting: bagian DAFTAR PUSTAKA pada naskah Anda masih kosong. Sitasi di dalam teks ada, tetapi daftarnya belum di-generate. Sebelum mencetak, buka Mendeley Cite, klik Insert Bibliography, dan pastikan kesebelas jurnal muncul dalam format APA 7th. Ini pekerjaan lima menit yang mencegah pertanyaan besar.

Untuk PPT, buat satu slide "Referensi" yang memuat sebelas judul dengan tautan yang dapat diklik. Cara paling aman: tautkan ke DOI atau ke berkas PDF di folder REFERENSI. Jika penguji mengklik dan berkasnya terbuka, kredibilitas Anda naik dalam hitungan detik. Uji tautan sebelum sidang, bukan saat sidang.

#### Pertanyaan 32 — Jumlah sampel responden dan kos

*Sumber: PANDUAN_TANYA_JAWAB_SEMPRO.txt, Pertanyaan 7 (diperbarui)*

**Pertanyaan penguji:** *"Berapa jumlah sampel rumah kos dan responden yang Anda butuhkan agar penelitian ini absah secara metodologi?"*

**Arah jawaban:**

Target penelitian: 30–50 responden mahasiswa dan 30–50 alternatif kos. Data saat ini: 10 dan 10, berstatus uji coba. Sebutkan keduanya secara berurutan agar tidak tampak mengelak.

Responden. Untuk membentuk bobot, yang dibutuhkan adalah rata-rata skor kepentingan yang stabil. N ≥ 30 lazim dipakai sebagai ambang pendekatan distribusi normal berdasarkan Central Limit Theorem. Namun angka 30 bukan jimat; yang lebih penting adalah keragaman responden: angkatan, program studi, moda transportasi, dan status tempat tinggal. Responden yang semuanya berasal dari satu angkatan akan menghasilkan bobot yang bias.

Kos. Untuk alternatif, yang dibutuhkan adalah keragaman atribut, bukan sekadar jumlah. Sepuluh kos sudah cukup untuk menguji matriks 10 × 6 dan seluruh rantai perhitungan. Untuk klaim empiris, 30–50 kos dalam radius 1–3 km memberi sebaran harga, jarak, dan fasilitas yang lebih realistis. Teknik pengambilannya purposive: kos yang berada dalam radius, masih beroperasi, dan bersedia diverifikasi.

Mengapa tidak memakai seluruh kos yang ada? Karena setiap kos harus diverifikasi lapangan: harga, fasilitas, luas, kebersihan, keamanan, dan koordinat. Biaya verifikasi tumbuh linear terhadap jumlah kos, sedangkan nilai tambahnya menurun setelah sebaran atribut tercapai.

Jika penguji menekan "kenapa 30, bukan 100?", jawab: "30 adalah ambang kecukupan statistik untuk pendekatan distribusi normal, bukan angka mutlak. Yang saya jaga adalah keterwakilan angkatan dan keragaman moda transportasi. Menambah responden tanpa menambah keragaman tidak otomatis memperbaiki bobot."

#### Pertanyaan 33 — Apa itu Golang dan Flutter

*Sumber: 16 pertanyaan teman sempro, nomor 16*

**Pertanyaan penguji:** *"Apa itu Golang dan Flutter? Kenapa memakai keduanya?"*

**Arah jawaban:**

| Aspek | Go (Golang) | Flutter |
| --- | --- | --- |
| Jenis | Bahasa pemrograman kompilasi | Framework antarmuka (UI) lintas platform |
| Bahasa | Go | Dart |
| Karakter | Statically typed, cepat, konkurensi ringan (goroutine), binary kecil | Widget-based, hot reload, satu basis kode untuk Android dan iOS |
| Peran di sistem | Backend REST API, mesin Haversine dan SAW, akses MySQL | Aplikasi mobile mahasiswa dan admin |
| Alasan dipilih | Performa dan konkurensi untuk komputasi serta layanan API | Efisiensi pengembangan dan konsistensi tampilan di perangkat mobile |

Go dipilih untuk backend karena tiga hal: eksekusinya cepat, ia mendukung konkurensi dengan goroutine sehingga banyak permintaan dapat dilayani bersamaan, dan hasil kompilasinya berupa satu binary yang mudah dideploy. Untuk perhitungan Haversine dan SAW yang ringan tetapi sering dipanggil, karakter itu sesuai.

Flutter dipilih untuk antarmuka karena satu basis kode dapat menghasilkan aplikasi Android dan iOS, memiliki hot reload sehingga iterasi prototipe cepat, dan menyediakan widget yang konsisten. Karena metodologi penelitian Anda adalah Prototype yang iteratif, kecepatan iterasi antarmuka adalah nilai tambah yang nyata.

Dua kekeliruan yang harus Anda hindari saat menjawab. Pertama, Flutter bukan bahasa pemrograman; bahasanya Dart. Kedua, Go bukan framework; ia bahasa pemrograman dengan standard library yang kuat. Penguji yang menguasai kedua hal ini akan langsung menilai ketepatan Anda.

Jika ditanya "kenapa tidak memakai satu bahasa saja?", jawab: "Bisa, tetapi saya memisahkan tanggung jawab. Go menangani komputasi dan API; Flutter menangani presentasi. Pemisahan ini juga membuat backend dapat diuji terpisah dari antarmuka, yang penting untuk validasi numerik."

#### Pertanyaan 34 — Bobot dinilai tidak adil karena skala berbeda

*Sumber: Pertanyaan jebakan — turunan dari Tabel 3.2 dan instrumen*

**Pertanyaan penguji:** *"Skala kriteria Anda tidak seragam: ada 1–4, 1–9, 1–3, dan 1–5. Berarti bobot Anda tidak adil, karena kriteria dengan skala lebih lebar otomatis lebih dominan. Bagaimana Anda menjawab itu?"*

**Arah jawaban:**

Ini kritik yang benar, dan cara terbaik menjawabnya adalah mengakuinya lebih dulu, lalu menunjukkan seberapa besar dampaknya. Jangan mencoba membantah bahwa skalanya seragam, karena memang tidak.

Masalahnya begini. Bobot dihitung dari rata-rata skor mentah. Rata-rata C3 yang berskala 1–9 secara struktural lebih besar daripada rata-rata C4 yang berskala 1–3, meskipun responden memberi penilaian yang setara secara persepsi. Akibatnya, sebagian dari bobot C3 mencerminkan lebar skala, bukan semata tingkat kepentingan.

Namun dampaknya terhadap kesimpulan dapat diuji. Saya membandingkan tiga skema bobot: bobot hasil survei (yang dipakai), bobot RII yang menyeragamkan skala dengan membagi rata-rata dengan nilai maksimum skala, dan bobot seragam 1/6.

| Skema | C1 | C2 | C3 | C4 | C5 | C6 | Lima besar |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Survei (dipakai) | 0,0921 | 0,1974 | 0,2544 | 0,1140 | 0,1623 | 0,1798 | B, F, G, J, E |
| RII (skala disetarakan) | 0,1168 | 0,2002 | 0,1433 | 0,1928 | 0,1646 | 0,1824 | B, F, G, J, E |
| Seragam | 0,1667 | 0,1667 | 0,1667 | 0,1667 | 0,1667 | 0,1667 | B, F, G, J, E |

Hasilnya: kelima besar tetap sama pada ketiga skema. Artinya, untuk dataset ini, kesimpulan peringkat tidak bergantung pada cara pembobotan. Ini bukan bukti bahwa masalahnya tidak ada; ini bukti bahwa dampaknya tidak mengubah rekomendasi utama. Itu jawaban yang jujur dan sekaligus kuat.

Langkah perbaikan yang saya rencanakan: menyeragamkan skala instrumen menjadi 1–5 untuk semua kriteria, atau memakai RII sebagai bobot utama. Untuk skripsi, saya akan melaporkan uji sensitivitas ini pada bab pembahasan agar pembaca dapat menilai sendiri.

> **KALIMAT KUNCI**
>
> "Kritik itu benar: skala saya tidak seragam. Saya sudah mengujinya dengan bobot RII dan bobot seragam; lima besar tetap sama. Jadi saya laporkan sebagai keterbatasan, tetapi kesimpulan utama tidak berubah."

#### Pertanyaan 35 — KOS B menang: apakah sistem memihak kos mahal

*Sumber: Pertanyaan jebakan — menguji pemahaman atas hasil*

**Pertanyaan penguji:** *"Pemenangnya kos VIP yang mahal. Berarti sistem Anda memihak kos mahal, dan bobot harga Anda terlalu kecil. Benar, kan?"*

**Arah jawaban:**

Mari kita bedah angkanya, karena jawaban terbaik adalah menunjukkan bahwa hasilnya bukan karena harga.

| Kriteria | Nilai KOS B | R | Bobot | Sumbangan ke Vi |
| --- | --- | --- | --- | --- |
| C1 Harga (skor 3 dari 4) | 3 | 0,333333 | 0,092105 | 0,030702 |
| C2 Jarak | 522,98 m | 1,000000 | 0,197368 | 0,197368 |
| C3 Fasilitas | 8 dari 9 | 0,888889 | 0,254386 | 0,226121 |
| C4 Luas | 3 dari 3 | 1,000000 | 0,114035 | 0,114035 |
| C5 Kebersihan | 5 dari 5 | 1,000000 | 0,162281 | 0,162281 |
| C6 Keamanan | 5 dari 5 | 1,000000 | 0,179825 | 0,179825 |
| Total |  |  | 1,000000 | 0,910331 |

Perhatikan: sumbangan harga hanya 0,030702, atau 3,4% dari total Vi. KOS B menang bukan karena harganya, tetapi karena ia menyapu bersih lima kriteria lain: terdekat, fasilitas tertinggi kedua, luas maksimum, kebersihan maksimum, dan keamanan maksimum. Jika harga dihapus dari model, KOS B tetap menang.

Sekarang lihat sisi sebaliknya. Kos termurah adalah KOS D dan KOS H (C1 = 1). Keduanya berada di peringkat 9 dan 8, bukan karena sistem menghukum kos murah, tetapi karena jarak dan fasilitasnya lemah. KOS D berjarak 1.554,03 meter dengan fasilitas 5 dari 9; KOS H berjarak 1.456,57 meter dengan fasilitas 5 dari 9. Model tidak anti-kos-murah; ia hanya konsisten dengan enam kriteria.

Mengapa bobot harga paling kecil? Karena responden memberi skor kepentingan harga paling rendah (rata-rata 2,1 dari 4), bukan karena saya menetapkannya. Jika penguji ingin melihat sensitivitas harga, jawab: "Pengguna dapat menaikkan W1 melalui slider; sistem akan menghitung ulang. Yang saya laporkan adalah bobot default hasil survei."

#### Pertanyaan 36 — Jarak garis lurus dianggap tidak realistis

*Sumber: Pertanyaan jebakan — menguji batasan Haversine*

**Pertanyaan penguji:** *"Haversine hanya menghitung jarak garis lurus. Padahal jalan berkelok. Berarti jarak Anda tidak realistis, dong?"*

**Arah jawaban:**

Jawaban singkat: betul bahwa itu bukan jarak tempuh, dan saya tidak mengklaim demikian. Yang saya klaim adalah jarak geografis great-circle, dan untuk keperluan perangkingan kedekatan, ukuran itu memadai.

Tiga alasan. Pertama, untuk jarak di bawah 10 km, galat model bola terhadap ellipsoid kecil, di bawah 0,5%. Kedua, jarak garis lurus berkorelasi tinggi dengan jarak tempuh pada skala kota; kos yang lebih dekat secara geografis hampir selalu lebih dekat secara tempuh, meskipun angka meternya berbeda. Ketiga, yang dibutuhkan model adalah urutan kedekatan yang stabil, bukan estimasi waktu tempuh yang berubah setiap kali ada kemacetan.

Jika yang dihitung adalah jarak jalan, hasilnya justru tidak deterministik: bergantung pada rute yang dipilih, kondisi lalu lintas, dan waktu pemanggilan API. Untuk kriteria dalam model keputusan, stabilitas lebih penting daripada ketelitian rute. Karena itu Haversine dipakai untuk C2, sedangkan rute jalan tetap disediakan melalui tautan Google Maps ketika pengguna memilih kos.

Penerapan Haversine untuk pencarian lokasi terdekat juga lazim pada penelitian sejenis (Puspita dkk., 2023; Laila dkk., 2022). Jika penelitian lanjutan ingin memakai jarak jalan, itu mungkin dilakukan dengan menambahkan matriks jarak dari layanan rute; tetapi kebutuhan API dan biayanya harus dihitung ulang.

#### Pertanyaan 37 — Bagaimana jika koordinat kos salah

*Sumber: Pertanyaan jebakan — menguji tata kelola data*

**Pertanyaan penguji:** *"Koordinat kos bisa salah, bisa dipindah, atau bisa berubah. Kalau begitu, seluruh hasil Anda bisa salah. Bagaimana Anda mengendalikannya?"*

**Arah jawaban:**

Betul, kualitas keluaran bergantung pada kualitas koordinat. Karena itu pengendaliannya bukan pada algoritma, melainkan pada tata kelola data.

Sumber kesalahan yang mungkin: pin manual yang tidak tepat, alamat yang tidak sesuai, koordinat diambil dari unggahan lama, atau kos yang berpindah/berubah nama. Mitigasinya berlapis:

1. **Pengambilan —** koordinat diambil dari tautan place atau drop pin di lokasi, bukan diketik manual dari ingatan;

2. **Verifikasi —** admin memverifikasi koordinat terhadap alamat dan patokan sebelum data tayang;

3. **Validasi —** sistem memeriksa rentang valid (lintang -90 sampai 90, bujur -180 sampai 180) dan menolak nilai di luar rentang;

4. **Pemeliharaan —** data kos ditinjau ulang secara berkala, terutama jika ada laporan dari pengguna.

Seberapa besar dampak satu kesalahan? Sudah saya uji secara tidak sengaja saat menemukan perbedaan titik acuan kampus sebesar 489 meter. Seluruh nilai Vi bergeser, tetapi urutan kesepuluh alternatif tetap sama. Ini menunjukkan bahwa model cukup robust terhadap pergeseran titik acuan pada skala ratusan meter. Namun jika satu koordinat kos salah secara ekstrem, kos itu dapat berpindah peringkat. Karena itu verifikasi tetap diperlukan; robustness bukan alasan untuk malas.

#### Pertanyaan 38 — Mengapa hanya 10 kos

*Sumber: Pertanyaan jebakan — menguji kesadaran atas keterbatasan data*

**Pertanyaan penguji:** *"Kos di sekitar kampus pasti lebih dari 10. Kenapa Anda hanya memakai 10? Apakah hasilnya bisa digeneralisasi?"*

**Arah jawaban:**

Dua jawaban, dan keduanya harus disebut bersamaan: 10 adalah jumlah untuk uji coba pipeline, dan hasilnya memang tidak dapat digeneralisasi.

Mengapa 10 cukup untuk tahap ini? Karena yang diuji adalah kebenaran komputasi, bukan distribusi populasi. Matriks 10 × 6 sudah memperlihatkan seluruh operasi: perhitungan jarak, perbandingan cost dan benefit, normalisasi, perkalian bobot, dan perangkingan. Menambah baris tidak mengubah logika; ia hanya menambah pekerjaan verifikasi.

Mengapa target 30–50 untuk penelitian final? Karena klaim empiris membutuhkan keragaman. Dengan 30–50 kos dalam radius 1–3 km, sebaran harga (Rp 400 ribu sampai 1,4 juta), jarak (ratusan meter sampai lebih dari 2 km), dan fasilitas (5 sampai 9 item) akan lebih terwakili. Dengan 10 kos, sebaran itu ada tetapi belum cukup untuk menyimpulkan pola populasi.

Jika penguji bertanya "apakah hasil Anda bisa digeneralisasi?", jawab tegas: "Tidak, dan saya tidak mengklaim itu. Ini validasi sistem pada data uji coba. Generalisasi memerlukan sampel yang lebih besar dan teknik pengambilan sampel yang lebih ketat, yang saya rencanakan pada penelitian lanjutan."

#### Pertanyaan 39 — Yang diranking kos atau tipe kamar

*Sumber: Tambahan — muncul setelah membahas arsitektur data dan isi kolom alternatif*

**Pertanyaan penguji:** *"Yang sistem Anda urutkan itu kos sebagai bangunan, atau kamar? Kalau satu kos punya beberapa tipe, apa yang terjadi?"*

**Arah jawaban:**

Yang diranking adalah penawaran kamar, bukan bangunan. Satu baris alternatif adalah satu pasangan nama kos dan tipe kamar, dan pasangan itu disimpan dalam satu variabel bernama Alternatif Tipe Kos. Jadi nama dan tipe tidak terpisah: keduanya adalah identitas satu alternatif.

Kalau satu bangunan punya dua tipe, akan muncul dua baris seperti ini:

| Alternatif Tipe Kos | Koordinat | C2 | C1 | C3 | Vi |
| --- | --- | --- | --- | --- | --- |
| KOS B - Tipe VIP (Kamar Mandi Dalam + AC) | sama | 522,98 | 3 | 8 | 0,9103 |
| KOS B - Tipe Standar (Kamar Mandi Luar) | sama | 522,98 | 2 | 5 | lebih rendah |

Perhatikan polanya: koordinat dan C2 identik karena bangunannya sama, tetapi C1, C3, C4, C5, dan C6 berbeda karena kamarnya berbeda. Vi-nya pun berbeda, sehingga keduanya menempati peringkat yang berbeda. Yang menjaga keduanya tidak saling menimpa adalah kode alternatif, bukan nama kos. Baris kedua pada tabel itu ilustrasi, bukan data workbook; yang nyata hanya baris pertama.

Konsekuensi teknisnya tiga kalimat. Pertama, Haversine dihitung sekali per bangunan, lalu hasilnya dipakai untuk semua tipe kamar di bangunan itu. Kedua, kartu di aplikasi wajib menampilkan nama kos beserta tipe kamar; kalau hanya nama, dua hasil bisa tampak duplikat padahal harganya berbeda. Ketiga, pada data dummy sekarang sepuluh baris kebetulan mewakili sepuluh bangunan berbeda, sehingga kasus ini belum terlihat — tetapi model datanya sudah mendukung.

> **KALIMAT KUNCI**
>
> "Satu alternatif adalah satu penawaran kamar: nama kos dan tipe kamar dalam satu variabel. Bangunan menentukan jarak; tipe kamar menentukan harga, fasilitas, dan luas. Karena itu Haversine dihitung per bangunan, sedangkan SAW menilai per tipe kamar."

#### Pertanyaan 40 — Apa kelemahan penelitian ini

*Sumber: Pertanyaan penutup — hampir selalu muncul, dan paling menentukan kesan akhir*

**Pertanyaan penguji:** *"Setelah semua penjelasan Anda, apa kelemahan penelitian ini? Jangan bilang tidak ada."*

**Arah jawaban:**

Pertanyaan ini bukan jebakan untuk menjatuhkan Anda; ia menguji kedewasaan akademik. Mahasiswa yang mengatakan "tidak ada kelemahan" dianggap belum memahami penelitiannya. Sebutkan enam, lalu tutup dengan rencana perbaikan.

| Kelemahan | Dampak | Mitigasi / rencana |
| --- | --- | --- |
| Skala kriteria tidak seragam (1–4, 1–9, 1–3, 1–5) | Bobot sebagian dipengaruhi lebar skala | Uji sensitivitas RII dan bobot seragam; lima besar tetap sama. Perbaikan: seragamkan skala instrumen. |
| Bobot berasal dari 10 responden dummy | Belum representatif untuk populasi mahasiswa | Target 30–50 responden dengan keragaman angkatan dan moda transportasi. |
| Jarak great-circle, bukan jarak jalan | Jarak tempuh sebenarnya bisa berbeda | Dinyatakan sebagai batasan; rute jalan disediakan melalui Google Maps. |
| Bumi dimodelkan sebagai bola | Galat kecil (< 0,5% untuk jarak < 10 km) | Cukup untuk perangkingan; ellipsoid tidak diperlukan pada skala kota. |
| SAW kompensatoris dan kriteria dianggap independen | Kos mahal dapat menang karena fasilitas | Sifat model yang disengaja; bobot dapat diubah pengguna; interaksi kriteria menjadi saran lanjutan. |
| Belum ada evaluasi usability dan kepuasan pengguna | Manfaat bagi mahasiswa belum terukur secara empiris | Rencana uji pengguna pada tahap pengujian akhir. |

Cara menutup jawaban: "Dari enam kelemahan itu, tiga sudah saya uji dampaknya dan tidak mengubah kesimpulan utama; tiga sisanya menjadi agenda penelitian lanjutan. Saya lebih memilih melaporkan batasan secara terbuka daripada mengklaim sistem ini sempurna."

Kalimat itu melakukan tiga hal sekaligus: mengakui batasan, menunjukkan bukti, dan memindahkan percakapan dari "apakah sistem Anda sempurna" ke "apakah Anda memahami sistem Anda". Itu pertukaran yang sangat menguntungkan di akhir sidang.

## BAGIAN IV — Tips, Checklist, dan Cheat Sheet

*Bagian yang dibaca pada hari-H, bukan bagian yang dihafal.*

### Sepuluh tips yang benar-benar berpengaruh

1. **Dengarkan sampai selesai.** Jangan memotong pertanyaan, bahkan ketika Anda sudah tahu arahnya. Penguji sering menambahkan batasan di akhir kalimat, dan batasan itulah yang menentukan jawaban.

2. **Mulai dari posisi.** Satu kalimat pertama harus menyatakan "ini pertanyaan tentang apa". Contoh: "Ini pertanyaan tentang metode, Pak. Saya jawab dari sisi peran metodenya."

3. **Bawa jawaban ke angka.** Setiap klaim sebaiknya ditopang satu angka dari workbook: 522,98 meter; 0,9103; 0,0921. Angka membuat jawaban sulit dibantah.

4. **Akui batasan lebih dulu.** Untuk pertanyaan jebakan, mengakui lebih dulu lalu menunjukkan dampaknya jauh lebih kuat daripada membantah.

5. **Bedakan konsep yang mirip.** Verification vs validation; cost vs benefit; use case vs activity; class vs ERD. Penguji sering menguji kemampuan membedakan, bukan kemampuan menghafal.

6. **Jangan membaca slide.** Slide adalah alat bantu, bukan naskah. Jika Anda membaca, penguji akan berhenti mendengarkan dan mulai mencari celah.

7. **Tunjuk bukti, bukan janji.** Ketika ditanya validasi, tunjukkan sheet dan angka, bukan menjelaskan bahwa "nanti akan diuji".

8. **Sebut sumber dengan tepat.** Satu kalimat, satu sitasi. Jangan menggabungkan beberapa jurnal dalam satu tanda kurung.

9. **Kelola waktu.** Jawaban ideal 30–60 detik. Jika lebih, Anda kehilangan kendali atas arah pertanyaan.

10. **Tutup dengan rencana.** Setiap kelemahan yang Anda akui sebaiknya diikuti satu kalimat rencana perbaikan. Itu mengubah kelemahan menjadi agenda.

### Skrip pembuka 60 detik

Bacakan sampai terasa alami, lalu hentikan. Jangan menambahkan "sebelumnya saya akan menjelaskan..." — itu membuang sepuluh detik pertama.

> **DRAFT PEMBUKA**
>
> "Selamat pagi, Bapak/Ibu penguji. Saya Rizky Fahrezi, NPM 2311010133, dengan judul Implementasi Metode Haversine Distance dan Simple Additive Weighting untuk Rekomendasi Kos, studi kasus IIB Darmajaya. Masalah yang saya angkat: mahasiswa perantau harus mensurvei banyak kos secara manual, informasi tidak terstandar, dan jarak hanya ditaksir. Akibatnya keputusan diambil berdasarkan kesan, bukan perbandingan. Yang saya bangun: aplikasi mobile yang mengubah koordinat menjadi jarak meter dengan Haversine, menilai enam kriteria dengan SAW, lalu mengurutkan rekomendasi. Bobot default berasal dari kuesioner; pengguna dapat menyesuaikannya. Yang saya uji bukan kebenaran metodenya — metode itu sudah mapan — melainkan implementasinya: hasil backend saya bandingkan dengan perhitungan manual Excel, dan fungsionalitasnya diuji dengan black box. Kontribusi saya: integrasi jarak kontinu ke dalam SAW pada aplikasi mobile, dengan pipeline yang dapat diaudit. Saya lanjutkan dengan garis besar alur penelitian."

### Struktur jawaban 30 detik

| Detik | Yang diucapkan | Contoh |
| --- | --- | --- |
| 0–5 | Posisi jawaban | "Ini pertanyaan tentang pemilihan metode, Pak." |
| 5–15 | Alasan utama | "Saya memilih SAW karena bobot harus bisa diubah pengguna dan komputasinya ringan." |
| 15–25 | Bukti angka | "Dengan 10 alternatif dan 6 kriteria, Vi dihitung dalam satu SUMPRODUCT; hasilnya 0,9103 untuk KOS B." |
| 25–30 | Batasan atau penutup | "Kelemahannya SAW kompensatoris; itu saya akui dan saya uji dampaknya." |

### Checklist H-1

Cetak atau buka di ponsel. Centang satu per satu; jangan mengandalkan ingatan pada malam sebelum sidang.

| Kelompok | Item | Kriteria lulus | Cek |
| --- | --- | --- | --- |
| Naskah | Koordinat kampus | Satu nilai di Bab 3.2, 3.8.1, 3.8.2, Tabel 3.3, dan slide | □ |
| Naskah | Satuan jarak | Konsisten meter; tidak ada "km" yang tertinggal | □ |
| Naskah | Skala kriteria | Tabel 3.2 mencantumkan C1 1–4, C3 1–9, C4 1–3, C5/C6 1–5 | □ |
| Naskah | Tarif | Konsisten bulanan; tidak ada "tahunan" yang bertentangan | □ |
| Naskah | Daftar Pustaka | 11 jurnal muncul via Mendeley, APA 7th, hanging indent | □ |
| Naskah | ERD dan Class Diagram | Dua gambar tersedia dan diberi nomor | □ |
| Workbook | Lima sheet | Form, Tahap 1, 2, 3, 4 lengkap | □ |
| Workbook | Bobot | SUM = 1,000000 di sel C16 | □ |
| Workbook | Error | Tidak ada sel #DIV/0!, #REF!, #VALUE! | □ |
| Workbook | Angka kunci | 0,9103; 522,98; 0,0921–0,1798 | □ |
| Slide | Konsistensi | Semua angka sama dengan workbook | □ |
| Slide | Referensi | 11 tautan dapat diklik dan sudah diuji | □ |
| Demo | Berkas | Workbook dan aplikasi terbuka tanpa error | □ |
| Demo | Cadangan | PDF naskah dan tangkapan layar tersimpan offline | □ |
| Latihan | 40 pertanyaan | Minimal 15 pertanyaan dijawab tanpa membaca | □ |
| Latihan | Skrip pembuka | 60 detik, lancar, tanpa mengulang | □ |

### Delapan hal yang jangan dilakukan

- Jangan menyebut bobot 0,25; 0,25; 0,20; 0,10; 0,10; 0,10. Itu contoh di panduan lama, bukan bobot penelitian.

- Jangan menyebut jarak dalam kilometer. Workbook memakai meter.

- Jangan menyebut Kos Mawar, Melati, atau Anggrek. Data Anda KOS A–KOS J.

- Jangan mengklaim 30–50 responden sudah terkumpul. Data saat ini 10 dan berstatus uji coba.

- Jangan mengatakan "tidak ada kelemahan". Itu jawaban yang paling cepat merusak kredibilitas.

- Jangan membantah kritik yang benar. Akui, lalu tunjukkan dampaknya.

- Jangan menyebut angka tanpa bisa menunjukkan asalnya di workbook.

- Jangan menambah fitur baru pada hari-H. Perbaiki yang ada, bukan menambah yang belum diuji.

### Cheat sheet angka

Hafalkan tabel ini. Jika Anda hanya boleh membawa satu halaman ke sidang, bawa halaman ini.

| Angka | Arti | Konteks |
| --- | --- | --- |
| 0,9103 | Vi tertinggi | KOS B, peringkat 1 |
| 0,8418 | Vi peringkat 2 | KOS F |
| 0,7361 | Vi peringkat 3 | KOS G |
| 522,98 m | Jarak terdekat | KOS B |
| 2.382,64 m | Jarak terjauh | KOS I, peringkat 10 |
| 0,0921 | Bobot harga | W1, terkecil |
| 0,2544 | Bobot fasilitas | W3, terbesar |
| 1,000000 | Total bobot | Sel Tahap 1!C16 |
| 22,8 | Total rata-rata skor | Tahap 1!C14 |
| 10 | Jumlah alternatif | KOS A–KOS J |
| 10 | Jumlah responden | TES 1–TES 10 (dummy) |
| 11 | Jumlah jurnal acuan | 9 terdahulu + 2 metodologi |
| 17/17 | Pemeriksaan lulus | Audit workbook |
| -5,3774079 ; 105,2496447 | Titik acuan kampus | Sesuai workbook |

### Jika Anda benar-benar tidak tahu

Suatu saat akan ada pertanyaan yang jawabannya tidak Anda siapkan. Jangan mengarang. Ada tiga kalimat yang menyelamatkan tanpa merusak kredibilitas:

- "Terima kasih, Pak/Bu. Bagian itu belum saya verifikasi secara rinci, jadi saya tidak ingin menjawab spekulatif. Yang dapat saya pastikan adalah [sebut satu hal yang Anda kuasai]."

- "Saya catat sebagai masukan. Rencana saya, hal itu saya periksa dan saya tambahkan pada revisi setelah sidang."

- "Izinkan saya menjawab pada tingkat yang saya kuasai: [jawab bagian yang Anda tahu], dan untuk detail selebihnya saya akan konfirmasi."

Yang tidak boleh: mengarang angka, mengarang nama jurnal, atau mengklaim sudah diuji padahal belum. Penguji lebih menghargai "saya belum cek" daripada jawaban yang terbukti salah tiga menit kemudian.

## BAGIAN V — Lampiran Angka Aktual

*Semua nilai diambil dari workbook edisi 3 November 2026. Desimal memakai koma.*

Lampiran ini berfungsi sebagai sumber cepat ketika penguji meminta angka spesifik. Jika ada perbedaan antara lampiran ini dan workbook, workbook yang benar — dan lampiran ini yang harus diperbarui.

### Lampiran A — Bobot kriteria

| Kriteria | Rata-rata | Bobot (Wj) | Persentase | Sifat |
| --- | --- | --- | --- | --- |
| C1 Harga sewa | 2,1 | 0,092105 | 9,21% | Cost |
| C2 Jarak | 4,5 | 0,197368 | 19,74% | Cost |
| C3 Fasilitas | 5,8 | 0,254386 | 25,44% | Benefit |
| C4 Luas | 2,6 | 0,114035 | 11,40% | Benefit |
| C5 Kebersihan | 3,7 | 0,162281 | 16,23% | Benefit |
| C6 Keamanan | 4,1 | 0,179825 | 17,98% | Benefit |
| Total | 22,8 | 1,000000 | 100% |  |

### Lampiran B — Koordinat dan jarak Haversine

| Kos | Latitude | Longitude | Nilai a | Sudut c (rad) | Jarak d (m) |
| --- | --- | --- | --- | --- | --- |
| KOS A | -5,3912920 | 105,2514580 | 1,4928e-08 | 0,0002443631 | 1.556,84 |
| KOS B | -5,3813140 | 105,2522760 | 1,6846e-09 | 0,0000820871 | 522,98 |
| KOS C | -5,3911180 | 105,2417010 | 1,9078e-08 | 0,0002762441 | 1.759,95 |
| KOS D | -5,3773390 | 105,2636820 | 1,4874e-08 | 0,0002439218 | 1.554,03 |
| KOS E | -5,3679050 | 105,2502040 | 6,9007e-09 | 0,0001661414 | 1.058,49 |
| KOS F | -5,3748510 | 105,2548240 | 2,5228e-09 | 0,0001004549 | 640,00 |
| KOS G | -5,3870290 | 105,2397630 | 1,4420e-08 | 0,0002401680 | 1.530,11 |
| KOS H | -5,3673600 | 105,2580860 | 1,3067e-08 | 0,0002286256 | 1.456,57 |
| KOS I | -5,3873200 | 105,2687260 | 3,4966e-08 | 0,0003739822 | 2.382,64 |
| KOS J | -5,3919940 | 105,2502490 | 1,6230e-08 | 0,0002547919 | 1.623,28 |

Catatan: nilai a ditampilkan dalam notasi ilmiah karena ordenya 10⁻⁹ sampai 10⁻⁸. Nilai aslinya tersimpan penuh di workbook dan dipakai apa adanya pada perhitungan c.

### Lampiran C — Matriks keputusan X

| Kos | C1 | C2 (m) | C3 | C4 | C5 | C6 |
| --- | --- | --- | --- | --- | --- | --- |
| KOS A | 2 | 1.556,84 | 6 | 2 | 4 | 4 |
| KOS B | 3 | 522,98 | 8 | 3 | 5 | 5 |
| KOS C | 4 | 1.759,95 | 9 | 3 | 3 | 3 |
| KOS D | 1 | 1.554,03 | 5 | 1 | 5 | 3 |
| KOS E | 2 | 1.058,49 | 6 | 2 | 3 | 5 |
| KOS F | 3 | 640,00 | 8 | 3 | 4 | 5 |
| KOS G | 4 | 1.530,11 | 9 | 3 | 3 | 5 |
| KOS H | 1 | 1.456,57 | 5 | 1 | 4 | 4 |
| KOS I | 2 | 2.382,64 | 6 | 2 | 3 | 4 |
| KOS J | 3 | 1.623,28 | 8 | 3 | 3 | 5 |

### Lampiran D — Matriks normalisasi R

| Kos | C1 (Cost) | C2 (Cost) | C3 (Benefit) | C4 (Benefit) | C5 (Benefit) | C6 (Benefit) |
| --- | --- | --- | --- | --- | --- | --- |
| KOS A | 0,500000 | 0,335923 | 0,666667 | 0,666667 | 0,800000 | 0,800000 |
| KOS B | 0,333333 | 1,000000 | 0,888889 | 1,000000 | 1,000000 | 1,000000 |
| KOS C | 0,250000 | 0,297154 | 1,000000 | 1,000000 | 0,600000 | 0,600000 |
| KOS D | 1,000000 | 0,336530 | 0,555556 | 0,333333 | 1,000000 | 0,600000 |
| KOS E | 0,500000 | 0,494080 | 0,666667 | 0,666667 | 0,600000 | 1,000000 |
| KOS F | 0,333333 | 0,817154 | 0,888889 | 1,000000 | 0,800000 | 1,000000 |
| KOS G | 0,250000 | 0,341790 | 1,000000 | 1,000000 | 0,600000 | 1,000000 |
| KOS H | 1,000000 | 0,359046 | 0,555556 | 0,333333 | 0,800000 | 0,800000 |
| KOS I | 0,500000 | 0,219495 | 0,666667 | 0,666667 | 0,600000 | 0,800000 |
| KOS J | 0,333333 | 0,322173 | 0,888889 | 1,000000 | 0,600000 | 1,000000 |

### Lampiran E — Skor akhir dan peringkat

| Rank | Kos | Tipe | Vi | Selisih ke peringkat atas |
| --- | --- | --- | --- | --- |
| 1 | KOS B | VIP | 0,9103 | — |
| 2 | KOS F | VIP | 0,8418 | 0,0685 |
| 3 | KOS G | Eksklusif | 0,7361 | 0,1057 |
| 4 | KOS J | VIP | 0,7116 | 0,0245 |
| 5 | KOS E | Standar | 0,6664 | 0,0452 |
| 6 | KOS C | Eksklusif | 0,6554 | 0,0110 |
| 7 | KOS A | Standar | 0,6317 | 0,0237 |
| 8 | KOS H | Ekonomis | 0,6160 | 0,0157 |
| 9 | KOS D | Ekonomis | 0,6080 | 0,0080 |
| 10 | KOS I | Standar | 0,5762 | 0,0318 |

### Lampiran F — Rubrik konversi kriteria

**C1 — Tarif sewa (per bulan, Cost):**

| Rentang tarif per bulan | Skor |
| --- | --- |
| Rp 400.000 – Rp 600.000 | 1 |
| Rp 600.001 – Rp 800.000 | 2 |
| Rp 800.001 – Rp 1.000.000 | 3 |
| Rp 1.000.001 – Rp 1.400.000 | 4 |

**C4 — Luas kamar (Benefit):**

| Luas kamar | Skor |
| --- | --- |
| ≤ 9 m² (3 × 3 m) | 1 |
| 10–15 m² (3 × 4 sampai 3 × 5 m) | 2 |
| > 15 m² (≥ 4 × 4 m) | 3 |

**C3 — Kelengkapan fasilitas (Benefit, skor = jumlah item):**

| Item | Ekonomis | Standar | VIP | Eksklusif |
| --- | --- | --- | --- | --- |
| Kasur | Ya | Ya | Ya | Ya |
| Lemari | Ya | Ya | Ya | Ya |
| Meja belajar | Ya | Ya | Ya | Ya |
| Kursi | Ya | Ya | Ya | Ya |
| Kamar mandi dalam | – | – | Ya | Ya |
| WiFi | – | Ya | Ya | Ya |
| AC | – | – | Ya | Ya |
| Water heater | – | – | – | Ya |
| Listrik & air | Ya | Ya | Ya | Ya |
| Total skor C3 | 5 | 6 | 8 | 9 |

### Lampiran G — Contoh perhitungan lengkap KOS B

```text
DARI KOORDINAT SAMPAI PERINGKAT

INPUT
  Kampus   : -5,3774079 ; 105,2496447
  KOS B    : -5,3813140 ; 105,2522760

TAHAP 1  delta phi      = RADIANS(-0,0039061)      = -0,0000681743
TAHAP 2  delta lambda   = RADIANS( 0,0026313)      =  0,0000459248
TAHAP 3  a              = 0,0000000016845727
TAHAP 4  c              = 2 x ASIN(SQRT(a))        =  0,0000820871
TAHAP 5  d              = 6.371.000 x c            =  522,98 meter

MATRIKS X  C1=3  C2=522,98  C3=8  C4=3  C5=5  C6=5
MATRIKS R  0,333333  1,000000  0,888889  1,000000  1,000000  1,000000
BOBOT      0,092105  0,197368  0,254386  0,114035  0,162281  0,179825
Vi       = 0,030702 + 0,197368 + 0,226121 + 0,114035 + 0,162281 + 0,179825
         = 0,910331  ->  0,9103
```

Lampiran ini adalah jawaban untuk pertanyaan "coba tunjukkan perhitungannya dari awal". Jika Anda menguasai satu baris ini dari koordinat sampai Vi, Anda dapat menjawab hampir semua pertanyaan teknis yang mungkin muncul.

*Dokumen ini disusun sebagai alat persiapan pribadi. Angka di dalamnya diambil dari workbook uji coba dan dapat berubah ketika data lapangan masuk. Perbarui Bagian II dan Lampiran terlebih dahulu jika workbook berubah, karena dua bagian itulah yang paling sering dibandingkan dengan layar saat sidang.*
