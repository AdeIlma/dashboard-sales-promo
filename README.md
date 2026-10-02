# Dashboard Sales & Promo DTG × HWG — Juli s/d September 2026

Website statis (HTML + CSS + JavaScript murni, tanpa build, tanpa framework).

## Struktur
```
index.html          halaman utama
assets/style.css    tampilan (otomatis mode terang/gelap)
assets/app.js       logika dashboard, grafik SVG, filter, klasifikasi trend
assets/data.js      data hasil olahan (window.__D) dari Daily Sales Menu Report ESB 1 Jul – 30 Sep 2026
netlify.toml        konfigurasi Netlify (opsional)
.nojekyll           agar GitHub Pages menyajikan file apa adanya
```

## Deploy ke Netlify
1. Buka https://app.netlify.com → **Add new site → Deploy manually**.
2. Drag & drop **folder ini** (yang berisi `index.html`) ke area upload.
3. Selesai — Netlify memberi link `https://nama-situs.netlify.app`.

Atau lewat GitHub: push folder ini ke repo, lalu di Netlify pilih **Import from Git**, build command dikosongkan, publish directory `.`.

## Deploy ke GitHub Pages
1. Buat repository baru (disarankan **Private** bila akun mendukung Pages privat; repo publik berarti data bisa dilihat siapa saja yang tahu link).
2. Upload semua isi folder ini ke root repository (`index.html` harus di root).
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch**, pilih branch `main` dan folder `/ (root)`, Save.
4. Tunggu 1–2 menit, link muncul: `https://<username>.github.io/<nama-repo>/`.

## Update data bulan berikutnya
Cukup ganti `assets/data.js` dengan hasil olahan periode baru (struktur sama). `index.html` dan `app.js` tidak perlu diubah.

## Catatan
- Membuka `index.html` langsung dari komputer (double click) juga bisa, tanpa server.
- Font diambil dari Google Fonts; bila offline otomatis memakai font sistem.
- Data berisi angka penjualan internal. Situs memakai `noindex` agar tidak muncul di Google, tetapi siapa pun yang punya link tetap bisa membuka. Untuk akses terbatas gunakan Netlify password protection (paket berbayar) atau repo/Pages privat.
