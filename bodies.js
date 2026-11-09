window.ATLAS = (function(){
  function rng(seed){
    return () => {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function bandedCanvas(stops, opts = {}){
    const c = document.createElement('canvas'); c.width = 512; c.height = 256;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 256);
    stops.forEach(s => g.addColorStop(s[0], s[1]));
    x.fillStyle = g; x.fillRect(0, 0, 512, 256);
    const r = rng(opts.seed || 7);
    for (let i = 0; i < (opts.streaks || 0); i++){
      const y = r() * 256, h = 3 + r() * 16, light = r() > .5;
      x.beginPath(); x.moveTo(0, y);
      for (let px = 0; px <= 448; px += 64)
        x.quadraticCurveTo(px + 32, y + (r() - .5) * 10, px + 64, y + (r() - .5) * 6);
      x.lineTo(512, y + h); x.lineTo(0, y + h); x.closePath();
      x.fillStyle = light ? `rgba(255,244,224,${.05 + r() * .1})` : `rgba(40,25,10,${.05 + r() * .12})`;
      x.fill();
    }
    for (let i = 0; i < (opts.grain || 0); i++){
      const s = 1 + r() * 2, dark = r() > .45;
      x.fillStyle = dark ? `rgba(20,15,10,${.06 + r() * .12})` : `rgba(255,250,240,${.04 + r() * .1})`;
      x.fillRect(r() * 512, r() * 256, s, s);
    }
    if (opts.icecaps){
      const cap = x.createLinearGradient(0, 0, 0, 26);
      cap.addColorStop(0, 'rgba(240,240,238,.85)'); cap.addColorStop(1, 'rgba(240,240,238,0)');
      x.fillStyle = cap; x.fillRect(0, 0, 512, 26);
      const cap2 = x.createLinearGradient(0, 230, 0, 256);
      cap2.addColorStop(0, 'rgba(240,240,238,0)'); cap2.addColorStop(1, 'rgba(240,240,238,.7)');
      x.fillStyle = cap2; x.fillRect(0, 230, 512, 26);
    }
    if (opts.blobs){
      for (let i = 0; i < 46; i++){
        const bx = r() * 512, by = 40 + r() * 176, rx = 10 + r() * 42, ry = 8 + r() * 22;
        x.beginPath(); x.ellipse(bx, by, rx, ry, r() * 3, 0, Math.PI * 2);
        x.fillStyle = r() > .35 ? 'rgba(78,116,66,.5)' : 'rgba(148,130,86,.45)';
        x.fill();
      }
    }
    if (opts.spot){
      x.beginPath(); x.ellipse(opts.spot.x, opts.spot.y, opts.spot.rx, opts.spot.ry, 0, 0, Math.PI * 2);
      x.fillStyle = opts.spot.col; x.fill();
    }
    return c;
  }

  function ringCanvas(){
    const c = document.createElement('canvas'); c.width = 256; c.height = 256;
    const x = c.getContext('2d'), r = rng(11);
    for (let rad = 118; rad < 256; rad += 2){
      x.beginPath(); x.arc(128, 128, rad / 2, 0, Math.PI * 2);
      x.strokeStyle = `rgba(216,201,168,${.12 + r() * .55})`;
      x.lineWidth = 2.4;
      x.stroke();
    }
    x.beginPath(); x.arc(128, 128, 82, 0, Math.PI * 2);
    x.strokeStyle = 'rgba(216,201,168,.14)'; x.lineWidth = 4; x.stroke();
    return c;
  }

  function glowCanvas(){
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,214,150,.95)');
    g.addColorStop(.35, 'rgba(255,170,70,.45)');
    g.addColorStop(1, 'rgba(255,150,50,0)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    return c;
  }

  const BODIES = [
    { id: 'matahari', name: 'Matahari', kind: 'Bintang', size: 6, dist: 0, period: 0, spin: .35, tilt: 7,
      dot: '#f0b35c',
      desc: 'Bintang di pusat tata surya, sumber hampir semua energi yang mencapai Bumi.',
      rows: [['Diameter', '1,39 juta km'], ['Suhu permukaan', 'sekitar 5.500 °C'], ['Usia', 'sekitar 4,6 miliar tahun']],
      note: 'Matahari menampung sekitar 99,8% massa seluruh tata surya.',
      long: [
        'Matahari adalah bintang di pusat tata surya, sebuah bola plasma panas yang energinya lahir dari reaksi fusi nuklir di intinya. Setiap saat, inti mengubah sekitar 600 juta ton hidrogen menjadi helium dan membebaskan cahaya yang butuh delapan menit untuk sampai ke Bumi.',
        'Hampir 99,8% massa seluruh tata surya berada di Matahari. Gravitasinya menahan delapan planet, ratusan dunia kecil, dan awan komet pada orbitnya masing-masing, sekaligus menjadi jangkar yang mempertahankan bentuk tata surya.',
        'Permukaannya tampak bertekstur granulasi, jejak semburan panas dari dalam ke atas. Aktivitasnya naik dan turun dalam siklus sekitar 11 tahun: di puncaknya muncul lebih banyak bintik matahari dan badai, yang sesekali mengirim partikel ke Bumi dan menyalakan aurora.',
      ],
      details: [
        ['Diameter', '1,39 juta km'], ['Massa', '99,8% massa tata surya'],
        ['Suhu permukaan', 'sekitar 5.500 °C'], ['Suhu inti', 'sekitar 15 juta °C'],
        ['Periode rotasi', 'sekitar 27 hari'], ['Gravitasi', '274 m/s², sekitar 28 kali Bumi'],
        ['Komposisi', 'hidrogen 73%, helium 25%'], ['Usia', 'sekitar 4,6 miliar tahun'],
      ],
      dnote: 'Tanpa panasnya, suhu di Bumi akan jatuh jauh di bawah titik beku dalam hitungan minggu.' },
    { id: 'merkurius', name: 'Merkurius', kind: 'Planet pertama', size: .9, dist: 17, period: .24, spin: .35, tilt: 0,
      dot: '#9c9488',
      desc: 'Planet terkecil sekaligus yang paling dekat dengan Matahari. Permukaannya penuh kawah.',
      rows: [['Diameter', '4.879 km'], ['Jarak dari Matahari', '58 juta km'], ['Periode orbit', '88 hari'], ['Satu hari', '59 hari Bumi']],
      note: 'Selisih suhu siang dan malamnya bisa mencapai 600 °C.',
      long: [
        'Merkurius adalah planet terkecil, hanya sedikit lebih besar dari Bulan. Tanpa atmosfer yang berarti, siang di permukaannya memanggang hingga 430 °C sebelum malam menjatuhkannya ke −180 °C, gelombang suhu paling ekstrem di antara semua planet.',
        'Wajahnya dipenuhi kawah dan tampak mirip Bulan, catatan tumbukan yang terbaca jelas karena angin dan erosi hampir tidak bekerja di sana. Di cekungan kutubnya, radar wahana antariksa menemukan lapisan es yang tidak pernah mencair.',
      ],
      details: [
        ['Diameter', '4.879 km'], ['Jarak rata-rata', '58 juta km'],
        ['Periode orbit', '88 hari'], ['Periode rotasi', '59 hari Bumi'],
        ['Kemiringan sumbu', '0,03°'], ['Gravitasi', '3,7 m/s²'],
        ['Suhu', '−180 °C hingga 430 °C'],
        ['Atmosfer', 'eksosfer tipis: oksigen, natrium, hidrogen'], ['Satel', '0'],
      ],
      dnote: 'Dari satu fajar ke fajar berikutnya di Merkurius berlalu 176 hari Bumi, dua kali panjang tahunnya.' },
    { id: 'venus', name: 'Venus', kind: 'Planet kedua', size: 1.4, dist: 25, period: .62, spin: -.12, tilt: 177,
      dot: '#d8b47a',
      desc: 'Planet terpanas di tata surya karena atmosfernya yang tebal menahan panas.',
      rows: [['Diameter', '12.104 km'], ['Jarak dari Matahari', '108 juta km'], ['Periode orbit', '225 hari'], ['Satu hari', '243 hari Bumi']],
      note: 'Venus berputar terbalik dibanding planet lain, dan satu harinya lebih panjang dari satu tahunnya.',
      long: [
        'Meski Merkurius yang paling dekat, Venus yang memegang gelar planet terpanas: rata-rata 464 °C, tahanan rumah kaca dari atmosfer karbon dioksida yang tebal dan tekanan permukaan 92 kali Bumi, cukup untuk meremukkan kapal sel.',
        'Lapisan atas atmosfernya berupa awan asam sulfat yang memantulkan cahaya matahari, menyembunyikan permukaan berbatu dari teleskop biasa. Peta radar misi Magellan pada 1990an akhirnya mewujudkan peta permukaannya: dataran lava, gunung berapi, dan kawah yang luas.',
        'Venus berputar terbalik (retrograde) dan sangat melambat: satu putarannya 243 hari Bumi, sedangkan orbitnya hanya 225 hari.',
      ],
      details: [
        ['Diameter', '12.104 km'], ['Jarak rata-rata', '108 juta km'],
        ['Periode orbit', '225 hari'], ['Periode rotasi', '243 hari (retrograde)'],
        ['Kemiringan sumbu', '177°'], ['Gravitasi', '8,9 m/s²'],
        ['Suhu rata-rata', '464 °C'],
        ['Atmosfer', 'karbon dioksida 96%, nitrogen 3,5%'],
        ['Tekanan permukaan', '92 kali Bumi'], ['Satel', '0'],
      ],
      dnote: 'Setelah Matahari dan Bulan, Venus adalah objek alami terterang di langit Bumi.' },
    { id: 'bumi', name: 'Bumi', kind: 'Planet ketiga', size: 1.5, dist: 34, period: 1, spin: .4, tilt: 23,
      dot: '#4a7fb5', hasMoon: true,
      desc: 'Rumah kita. Satu-satunya dunia yang diketahui memiliki lautan cair dan kehidupan.',
      rows: [['Diameter', '12.742 km'], ['Jarak dari Matahari', '150 juta km'], ['Periode orbit', '365 hari'], ['Satel', '1, yaitu Bulan']],
      note: 'Bumi melintas mengelilingi Matahari dengan kecepatan sekitar 107.000 km/jam.',
      long: [
        'Bumi adalah planet ketiga dan satu-satunya dunia yang diketahui menopang kehidupan. Sekitar 70% permukaannya tertutup lautan cair, dan atmosfernya menyediakan oksigen bagi hampir semua makhluk hidup di darat maupun laut.',
        'Medan magnetnya membelokkan partikel bermuatan dari Matahari, sementara lapisan ozon menahan radiasi ultraviolet. Kombinasi ini dan siklus karbonnya menjaga iklim tetap stabil cukup lama bagi kehidupan untuk berkembang.',
        'Bulan memantapkan kemiringan sumbu Bumi sehingga musim berjalan relatif stabil selama jutaan tahun. Tarik-menariknya dengan lautan menimbulkan pasang surut yang ikut membentuk pantai dan ekosistem pesisir.',
      ],
      details: [
        ['Diameter', '12.742 km'], ['Jarak rata-rata', '150 juta km'],
        ['Periode orbit', '365 hari'], ['Periode rotasi', '23,9 jam'],
        ['Kemiringan sumbu', '23,4°'], ['Gravitasi', '9,8 m/s²'],
        ['Suhu rata-rata', '15 °C'],
        ['Atmosfer', 'nitrogen 78%, oksigen 21%'], ['Satel', '1 (Bulan)'],
      ],
      dnote: 'Aurora di kutub utara dan selatan adalah jejak tumbukan partikel Matahari dengan medan magnet Bumi.' },
    { id: 'mars', name: 'Mars', kind: 'Planet keempat', size: 1.1, dist: 43, period: 1.88, spin: .4, tilt: 25,
      dot: '#b0603a',
      desc: 'Planet merah dengan gurun besi berkarat dan gunung tertinggi di tata surya.',
      rows: [['Diameter', '6.779 km'], ['Jarak dari Matahari', '228 juta km'], ['Periode orbit', '687 hari'], ['Satel', '2, yaitu Phobos dan Deimos']],
      note: 'Gunung Olympus Mons tingginya sekitar 21 km, hampir tiga kali Gunung Everest.',
      long: [
        'Warna merah Mars berasal dari besi oksida, karat yang menghiasi gurunnya. Atmosfernya sangat tipis, jauh lebih tipis dari Bumi, sehingga suhu rata-ratanya turun ke −65 °C di sebagian besar wilayahnya.',
        'Mars menyimpan catatan geologi yang dramatis: Olympus Mons, gunung berapi setinggi sekitar 21 km, dan lembah Valles Marineris yang membentang sekitar 4.000 km. Bekas sungai dan delta kuno menunjukkan air pernah mengalir di permukaannya.',
        'Sekarang, armada robot menjelajahnya: dari pengorbit hingga penjelajah seperti Perseverance yang menyimpan sampel batuan untuk diteliti jejak kehidupan kuno.',
      ],
      details: [
        ['Diameter', '6.779 km'], ['Jarak rata-rata', '228 juta km'],
        ['Periode orbit', '687 hari'], ['Periode rotasi', '24,6 jam'],
        ['Kemiringan sumbu', '25,2°'], ['Gravitasi', '3,7 m/s²'],
        ['Suhu rata-rata', '−65 °C'],
        ['Atmosfer', 'karbon dioksida 95%, nitrogen 2,8%'], ['Satel', '2 (Phobos, Deimos)'],
      ],
      dnote: 'Tudung es di kutub Mars berisi serangkaian es air dan es karbon dioksida yang menyusut dan membesar mengikuti musim.' },
    { id: 'jupiter', name: 'Jupiter', kind: 'Planet kelima', size: 4, dist: 60, period: 11.9, spin: .9, tilt: 3,
      dot: '#c39a6b',
      desc: 'Raksasa gas terbesar di tata surya, dengan pita awan yang terus berputar.',
      rows: [['Diameter', '139.820 km'], ['Jarak dari Matahari', '778 juta km'], ['Periode orbit', '11,9 tahun'], ['Satel', '95 dikenal']],
      note: 'Badai Besar Merahnya berukuran cukup besar untuk menampung seluruh permukaan Bumi.',
      long: [
        'Jupiter menampung massa lebih dari dua kali gabungan seluruh planet lain. Karena tersusun dari hidrogen dan helium, ia tidak memiliki permukaan yang bisa diinjak; yang kita lihat hanyalah puncak awan yang mengalir dalam pita.',
        'Pita terang dan gelapnya adalah arus angin yang mengalir berlawanan arah dengan kecepatan hingga ratusan km/jam. Di antaranya berputar Badai Besar Merah, pusaran lebih besar dari Bumi yang tercatat sejak abad ke-17.',
        'Empat bulan terbesar (Io, Europa, Ganymedes, Callisto) ditemukan Galileo pada 1610 dan menjadi bukti awal bahwa bukan semua benda langit mengelilingi Bumi. Europa menyimpan laut asin di bawah esnya, salah satu target pencarian kehidupan.',
      ],
      details: [
        ['Diameter', '139.820 km'], ['Jarak rata-rata', '778 juta km'],
        ['Periode orbit', '11,9 tahun'], ['Periode rotasi', '9,9 jam'],
        ['Kemiringan sumbu', '3,1°'], ['Gravitasi', '24,8 m/s²'],
        ['Suhu puncak awan', 'sekitar −110 °C'],
        ['Atmosfer', 'hidrogen 90%, helium 10%'], ['Satel', '95 dikenal'],
      ],
      dnote: 'Bulan Ganymedes lebih besar dari planet Merkurius, bulan terbesar di tata surya.' },
    { id: 'saturnus', name: 'Saturnus', kind: 'Planet keenam', size: 3.4, dist: 78, period: 29.5, spin: .85, tilt: 27,
      dot: '#d6c091', hasRing: true,
      desc: 'Raksasa gas dengan sistem cincin es paling mencolok di tata surya.',
      rows: [['Diameter', '116.460 km'], ['Jarak dari Matahari', '1,4 miliar km'], ['Periode orbit', '29,5 tahun'], ['Satel', '146 dikenal']],
      note: 'Kepadatan Saturnus lebih rendah dari air, sehingga secara teori bisa mengapung.',
      long: [
        'Cincin Saturnus adalah dekorasi paling ikonik di tata surya: triliunan potongan es dan batu, dari butiran debu hingga gunung kecil, mengorbit secara teratur dalam cakram tipis. Bentangannya ratusan ribu kilometer, tetapi tebalnya di banyak tempat hanya puluhan meter.',
        'Atmosfernya mirip Jupiter, hidrogen dan helium dengan pita awan yang lebih pucat karena kabut. Bintik-badai raksasa muncul berkala, terutama saat musim panas belahan utama.',
        'Sistem bulannya luar biasa: Titan punya atmosfer tebal dan danau metana cair, sementara Enceladus menyemburkan air dari laut bawah es melalui retakan di kutub selatannya. Mis Cassini mempelajarinya dari dekat pada 2004 hingga 2017.',
      ],
      details: [
        ['Diameter', '116.460 km'], ['Jarak rata-rata', '1,4 miliar km'],
        ['Periode orbit', '29,5 tahun'], ['Periode rotasi', '10,7 jam'],
        ['Kemiringan sumbu', '26,7°'], ['Gravitasi', '10,4 m/s²'],
        ['Suhu puncak awan', 'sekitar −140 °C'],
        ['Atmosfer', 'hidrogen 96%, helium 3%'], ['Satel', '146 dikenal'],
      ],
      dnote: 'Cincinnya diperkirakan sisa bulan atau komet yang terpecah oleh gaya pasang surut Saturnus.' },
    { id: 'uranus', name: 'Uranus', kind: 'Planet ketujuh', size: 2.2, dist: 93, period: 84, spin: -.55, tilt: 98,
      dot: '#9fd4d9',
      desc: 'Raksasa es berwarna hijau kebiruan yang menggelinding pada sisinya mengitari Matahari.',
      rows: [['Diameter', '50.724 km'], ['Jarak dari Matahari', '2,9 miliar km'], ['Periode orbit', '84 tahun'], ['Satel', '28 dikenal']],
      note: 'Sumbu rotasinya miring hampir 98 derajat, hampir sejajar dengan bidang orbitnya.',
      long: [
        'Uranus adalah raksasa es: di balik atmosfer hidrogen dan helium terdapat lapisan berat air, metana, dan amonia dalam bentuk fluida panas. Metana di puncak awan menyerap warna merah, menyisakan pantulan hijau kebiruan yang khas.',
        'Keunikan utamanya adalah kemiringan sumbu hampir 98 derajat, diduga bekas tumbukan besar. Uranus praktis menggelinding pada orbitnya, sehingga tiap kutub mengalami 21 tahun siang berturut-turut, lalu 21 tahun malam.',
        'Ia satu-satunya planet yang penemuannya tercatat dalam sejarah modern: William Herschel melihatnya dengan teleskop pada 1781, awalnya mengira bintang, sebelum dunia menyadari tata surya ternyata lebih luas.',
      ],
      details: [
        ['Diameter', '50.724 km'], ['Jarak rata-rata', '2,9 miliar km'],
        ['Periode orbit', '84 tahun'], ['Periode rotasi', '17,2 jam (retrograde)'],
        ['Kemiringan sumbu', '97,8°'], ['Gravitasi', '8,9 m/s²'],
        ['Suhu rata-rata', 'sekitar −195 °C'],
        ['Atmosfer', 'hidrogen, helium, metana'], ['Satel', '28 dikenal'],
      ],
      dnote: 'Uranus adalah planet terdingin di tata surya, mencapai sekitar −224 °C di lapisan tertentu.' },
    { id: 'neptunus', name: 'Neptunus', kind: 'Planet kedelapan', size: 2.1, dist: 106, period: 164.8, spin: .5, tilt: 28,
      dot: '#3d63c9',
      desc: 'Planet terjauh dari Matahari, biru pekat dan bergejolak dengan angin tercepat di tata surya.',
      rows: [['Diameter', '49.244 km'], ['Jarak dari Matahari', '4,5 miliar km'], ['Periode orbit', '165 tahun'], ['Satel', '16 dikenal']],
      note: 'Angin di Neptunus bisa bertiup sekitar 2.100 km/jam.',
      long: [
        'Neptunus adalah planet pertama yang ditemukan lewat perhitungan, bukan kebetulan: para astronom memprediksi posisinya dari gangguan pada orbit Uranus, dan pada 1846 ia ditemukan tepat di dekat titik yang diramalkan.',
        'Warna birunya berasal dari metana, tetapi yang membuatnya istimewa adalah cuacanya: angin tercepat di tata surya mencapai sekitar 2.100 km/jam, dan badai gelap raksasa muncul lalu menghilang dalam hitungan tahun.',
        'Hanya satu wahana yang pernah mendekat, Voyager 2 pada 1989. Bulan terbesar Triton mengorbit terbalik dan menyemburkan semburan nitrogen dari kutubnya, jejak dunia es yang aktif.',
      ],
      details: [
        ['Diameter', '49.244 km'], ['Jarak rata-rata', '4,5 miliar km'],
        ['Periode orbit', '165 tahun'], ['Periode rotasi', '16,1 jam'],
        ['Kemiringan sumbu', '28,3°'], ['Gravitasi', '11,2 m/s²'],
        ['Suhu rata-rata', 'sekitar −200 °C'],
        ['Atmosfer', 'hidrogen, helium, metana'], ['Satel', '16 dikenal'],
      ],
      dnote: 'Neptunus menyelesaikan satu putaran pertama Matahari sejak penemuannya pada 2011.' },
  ];

  const PAINT = {
    matahari: () => bandedCanvas([[0, '#ffdda0'], [.45, '#ffb54d'], [.75, '#ff9a3a'], [1, '#f27c28']], { seed: 3, streaks: 26, grain: 2600 }),
    merkurius: () => bandedCanvas([[0, '#9c9488'], [.5, '#7d7568'], [1, '#5b544a']], { seed: 21, grain: 2400 }),
    venus: () => bandedCanvas([[0, '#e2c28c'], [.4, '#d3ad72'], [.7, '#c49a5e'], [1, '#a97f4a']], { seed: 9, streaks: 20, grain: 400 }),
    bumi: () => bandedCanvas([[0, '#2a5c94'], [.5, '#294e7c'], [1, '#1f3d64']], { seed: 5, blobs: 46, grain: 700, icecaps: true }),
    mars: () => bandedCanvas([[0, '#c87a4b'], [.5, '#b26135'], [1, '#8a4327']], { seed: 15, grain: 2000, icecaps: true }),
    jupiter: () => bandedCanvas([[0, '#c9a882'], [.15, '#b48a5e'], [.25, '#d9bd97'], [.35, '#9b7250'], [.45, '#d3b28a'], [.55, '#a67a52'], [.65, '#cbae8b'], [.8, '#8f6a49'], [1, '#6e523b']], { seed: 2, streaks: 55, grain: 300, spot: { x: 390, y: 168, rx: 32, ry: 15, col: '#b05a3c' } }),
    saturnus: () => bandedCanvas([[0, '#d8c39a'], [.3, '#c7ae83'], [.55, '#d9c8a4'], [.8, '#b89c72'], [1, '#9c835e']], { seed: 4, streaks: 30, grain: 200 }),
    uranus: () => bandedCanvas([[0, '#b7dde0'], [.5, '#9ccfd6'], [1, '#7fbcc7']], { seed: 30, streaks: 6, grain: 120 }),
    neptunus: () => bandedCanvas([[0, '#3f63c9'], [.4, '#2f4fb2'], [.75, '#29439c'], [1, '#1e3280']], { seed: 12, streaks: 9, grain: 150 }),
  };

  return { BODIES, PAINT, ringCanvas, glowCanvas };
})();
