---
judul: Latihan TKA PPLG — Elemen Jaringan Komputer (TCP/IP)
mapel: Pengembangan Perangkat Lunak dan Gim
tahun: 2026
waktu: 30
---

1. Admin jaringan sekolah memiliki blok 192.168.10.0/24 dan perlu membaginya menjadi empat subnet sama besar untuk laboratorium, kantor, perpustakaan, dan wifi tamu. Ia menentukan panjang prefix baru yang paling tepat.

Prefix subnet baru yang tepat adalah ...

A. /30
B. /26
C. /25
D. /27
E. /28

Kunci: B
Pembahasan:
- /24 dibagi 4 subnet sama besar → butuh 2 bit host dipinjam (2² = 4 subnet).
- Prefix baru = 24 + 2 = /26; tiap subnet berisi 64 alamat.
- Jawaban benar: **B (/26)**
---

2. Sebuah komputer memiliki alamat 192.168.1.130/26. Teknisi jaringan ingin mengetahui alamat jaringan (network ID) subnet tersebut untuk mengisi tabel perutean router sekolah.

Network ID subnet tersebut adalah ...

A. 192.168.1.64
B. 192.168.1.192
C. 192.168.1.130
D. 192.168.1.128
E. 192.168.1.0

Kunci: D
Pembahasan:
- /26 → blok ukuran 64: .0, .64, .128, .192.
- Alamat .130 jatuh di blok .128–.191 → network ID 192.168.1.128.
- Jawaban benar: **D (192.168.1.128)**
---

3. Pada subnet 192.168.1.128/26, administrator menentukan alamat broadcast untuk konfigurasi perangkat dan menandai rentang alamat host yang dapat dipakai oleh komputer di subnet tersebut.

Alamat broadcast subnet tersebut adalah ...

A. 192.168.1.191
B. 192.168.1.255
C. 192.168.1.129
D. 192.168.1.190
E. 192.168.1.127

Kunci: A
Pembahasan:
- Blok .128–.191; alamat terakhir blok = broadcast.
- Broadcast = 192.168.1.191.
- Jawaban benar: **A (192.168.1.191)**
---

4. Jaringan kantor memakai subnet /27. Manajer TI ingin mengetahui jumlah host yang dapat dipakai pada setiap subnet agar perencanaan alamat IP untuk komputer, printer, dan server tidak kekurangan.

Jumlah host yang dapat dipakai per subnet adalah ...

A. 62
B. 254
C. 30
D. 32
E. 28

Kunci: C
Pembahasan:
- /27 → sisa bit host = 32 − 27 = 5 → 2⁵ = 32 alamat.
- Dikurangi network + broadcast → 32 − 2 = 30 host terpakai.
- Jawaban benar: **C (30)**
---

5. Pengguna melaporkan komputernya dapat membuka situs dengan alamat IP, tetapi gagal membuka situs dengan nama domain. Teknisi menduga ada masalah pada layanan penerjemah nama domain pada konfigurasi komputer tersebut.

Konfigurasi yang perlu diperiksa adalah ...

A. alamat gateway cadangan
B. subnet mask pada router lain
C. kabel listrik komputer
D. resolusi layar komputer
E. pengaturan server DNS

Kunci: E
Pembahasan:
- Kegagalan menerjemahkan nama domain menunjuk pada konfigurasi DNS.
---

6. Komputer klien mendapat alamat 169.254.x.x padahal jaringan seharusnya memakai DHCP. Teknisi menjelaskan arti alamat tersebut dan langkah pemeriksaan awal yang paling tepat untuk memulihkan koneksi pengguna.

Penjelasan dan langkah yang tepat adalah ...

A. klien telah diblokir oleh antivirus
B. klien gagal memperoleh alamat dari DHCP
C. klien sengaja diberi alamat publik oleh ISP
D. alamat tersebut berarti jaringan sangat cepat
E. alamat tersebut khusus untuk server DNS

Kunci: B
Pembahasan:
- 169.254.x.x adalah alamat APIPA, artinya klien gagal memperoleh alamat dari DHCP.
---

7. Teknisi menguji koneksi dengan ping ke gateway berhasil, tetapi ping ke alamat internet 8.8.8.8 gagal. Ia menyimpulkan bagian tertentu dari jalur jaringan yang kemungkinan bermasalah dan perlu diperiksa berikutnya.

Bagian yang perlu diperiksa berikutnya adalah ...

A. konfigurasi warna desktop
B. pengaturan keyboard
C. kecepatan printer lokal
D. koneksi dari router ke penyedia layanan internet atau rute default
E. kabel antara komputer dan monitor

Kunci: D
Pembahasan:
- Gateway terjangkau tetapi internet tidak → masalah ada di jalur router ke ISP / rute default.
---

8. Administrator membuka port 22 pada firewall server untuk pengelolaan jarak jauh. Seorang asisten bertanya layanan yang memakai port tersebut pada server Linux yang sedang dikonfigurasi di laboratorium sekolah.

Layanan pada port 22 adalah ...

A. SSH untuk akses jarak jauh yang terenkripsi
B. HTTP untuk halaman web biasa
C. FTP untuk transfer berkas tanpa enkripsi
D. SMTP untuk pengiriman surel
E. DNS untuk penerjemahan nama domain

Kunci: A
Pembahasan:
- Port 22 dipakai SSH.
---

9. Dalam model OSI, teknisi menjelaskan bahwa switch bekerja membaca alamat MAC untuk meneruskan bingkai data. Siswa diminta menyebut lapisan OSI yang menjadi tempat kerja utama switch standar tersebut.

Lapisan kerja utama switch adalah ...

A. lapisan transport (lapisan 4)
B. lapisan aplikasi (lapisan 7)
C. lapisan data link (lapisan 2)
D. lapisan fisik (lapisan 1)
E. lapisan jaringan (lapisan 3)

Kunci: C
Pembahasan:
- Switch bekerja di data link (lapisan 2).
---

10. Router sekolah memiliki rute default ke penyedia layanan dan beberapa rute statis ke subnet lab. Seorang teknisi menambahkan rute statis yang salah sehingga paket ke subnet lab terkirim ke internet. Admin menentukan tindakan perbaikan.

Tindakan perbaikan yang tepat adalah ...

A. menghapus seluruh konfigurasi router tanpa cadangan
B. mengganti kabel listrik router
C. menambah jumlah komputer klien
D. menonaktifkan seluruh antarmuka jaringan
E. memperbaiki atau menghapus rute statis yang salah lalu menguji ulang

Kunci: E
Pembahasan:
- Perbaikan dilakukan pada rute statis yang salah, lalu diuji ulang.
---

11. Admin ingin membatasi akses tamu ke jaringan internal tetapi tetap mengizinkan internet. Ia membuat VLAN terpisah untuk tamu dan menerapkan daftar kontrol akses pada router. Siswa bertanya manfaat utama pemisahan VLAN tersebut.

Manfaat pemisahan VLAN adalah ...

A. mengurangi jumlah kabel menjadi nol
B. memisahkan domain broadcast
C. menambah kecepatan internet secara otomatis
D. menghilangkan kebutuhan firewall
E. membuat semua perangkat memiliki IP sama

Kunci: B
Pembahasan:
- VLAN memisahkan domain broadcast sekaligus membatasi akses antar-segmen.
---

12. Seratus komputer di sekolah memakai alamat IP privat 192.168.x.x dan mengakses internet melalui satu alamat IP publik milik router. Siswa magang bertanya teknik yang dipakai router agar banyak perangkat privat dapat berbagi satu alamat publik.

Teknik tersebut disebut ...

A. VLAN trunking
B. spanning tree
C. port mirroring
D. NAT (network address translation)
E. DHCP snooping

Kunci: D
Pembahasan:
- NAT menerjemahkan banyak alamat privat ke satu alamat publik.
