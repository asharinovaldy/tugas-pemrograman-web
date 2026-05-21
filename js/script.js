//  login
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // ambil nilai email dan password dari form login
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // cek kecocokan email dan password dengan data pengguna
        const user = dataPengguna.find(
            // cari pengguna yang email dan passwordnya sesuai dengan input dari form login
            (u) => u.email === email && u.password === password
        );

        // jika ditemukan, simpan nama pengguna di localStorage dan tampilkan pesan sukses dan redirect ke dashboard
        if (user) {
            localStorage.setItem('namaUser', user.nama);
            Swal.fire({
                title: 'Login Berhasil!',
                text: `Selamat datang, ${user.nama}!`,
                icon: 'success',
                confirmButtonText: 'Lanjutkan',
            }).then(() => window.location.href = 'dashboard.html');
            // alert(`Login Berhasil! Selamat datang, ${user.nama}!`);
            // window.location.href = 'dashboard.html';
        } else {
            // jika tidak ditemukan, tampilkan pesan error
            Swal.fire({
                title: 'Login Gagal!',
                text: 'Email atau password salah. Silakan coba lagi!',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            // alert('Login Gagal! Email atau password salah. Silakan coba lagi.');
        }
    });
}

// Pop up lupa password
const forgetPassword = document.getElementById('forgetPassword');
const btnRegister = document.getElementById('btnRegister');
if (forgetPassword) {
    forgetPassword.addEventListener('click', () => {
        Swal.fire({
            title: 'Lupa Password?',
            text: 'Silakan hubungi admin UT untuk reset password.',
            icon: 'question'
        });
        // alert('Lupa Password? Silakan hubungi admin UT untuk reset password.');
    });
}

// pop up buat akun baru
if (btnRegister) {
    btnRegister.addEventListener('click', () => {
        Swal.fire({
            title: 'Buat Akun Baru',
            text: 'Kunjungi laman MyUT untuk membuat akun baru.',
            icon: 'info'
        });
        // alert('Buat Akun Baru? Kunjungi laman MyUT untuk membuat akun baru.');
    });
}

// Halaman dashboard
const greeting = document.getElementById('greeting');
if (greeting) {

    // ambil nama pengguna dari localStorage untuk menampilkan pesan selamat datang yang personal
    const namaUser = localStorage.getItem('namaUser');

    // tentukan waktu saat ini untuk menampilkan salam yang sesuai (pagi, siang, sore, malam)
    const hour = new Date().getHours();
    let timeOfDay;

    if (hour < 11) {
        timeOfDay = 'Selamat Pagi';
    } else if (hour < 15) {
        timeOfDay = 'Selamat Siang';
    } else if (hour < 19) {
        timeOfDay = 'Selamat Sore';
    } else {
        timeOfDay = 'Selamat Malam';
    }

    // tampilkan pesan selamat datang dengan nama pengguna dan salam waktu yang sesuai
    greeting.textContent = namaUser ? `${timeOfDay}, ${namaUser}! \nSelamat datang di Dashboard SITTA UT` : `${timeOfDay}!`;
}

const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
    // console.log("ok");
    Swal.fire({
        title: 'Yakin ingin logout?',
        text: 'Anda akan keluar dari sistem.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Logout',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('namaUser');
            Swal.fire({
                title: 'Logout Berhasil',
                text: 'Anda telah keluar dari sistem.',
                icon: 'info',
                confirmButtonText: 'OK'
            }).then(() => window.location.href = 'login.html');
        }
    });
});

// tracking
const findBtn = document.getElementById('findBtn');

if (findBtn) {
    findBtn.addEventListener('click', () => {

        // ambil nomor DO dari input dan cari data tracking berdasarkan nomor DO tersebut
        const doNumber = document.getElementById('inputDO').value.trim();
        const resultContainer = document.getElementById('trackingResult');

        // validasi input nomor DO
        if (!doNumber) {
            Swal.fire({
                title: 'Nomor DO Kosong',
                text: 'Masukkan Nomor DO terlebih dahulu.',
                icon: 'warning'
            });
            return;
        }

        // cari data tracking berdasarkan nomor DO yang dimasukkan
        const data = dataTracking[doNumber];

        // jika data tidak ditemukan, tampilkan pesan error
        if (!data) {
            Swal.fire({
                title: 'Data Tidak Ditemukan',
                text: `Nomor DO ${doNumber} tidak tersedia dalam sistem.`,
                icon: 'error'
            });
            return;
        }

        // untuk data tracking
        let perjalananHTML = '';
        data.perjalanan.forEach(item => {
            perjalananHTML += `
        <li>
          <div class="timeline-dot"></div>
          <div class="timeline-info">
            <span class="timeline-time">${item.waktu}</span>
            <p class="timeline-text">${item.keterangan}</p>
          </div>
        </li>`;
        });

        resultContainer.innerHTML = `
      <div class="tracking-card">
        <h3>Detail Pengiriman - ${data.nomorDO}</h3>
        <h4 style="text-align: center;">Status : ${data.status}</h4>
        <div class="tracking-info">
            <div class="recipient">
                <p><b>Nomor DO:</b> ${data.nomorDO}</p>
                <p><b>Nama:</b> ${data.nama}</p>
                <p><b>Total Pembayaran:</b> ${data.total}</p>
            </div>
            <div class="expedisi">
                <p><b>Kode Paket:</b> ${data.paket}</p>
                <p><b>Ekspedisi:</b> ${data.ekspedisi}</p>
                <p><b>Tanggal Kirim:</b> ${data.tanggalKirim}</p>
               
            </div>
        </div>

        <h4>Riwayat Perjalanan</h4>
        <ul class="timeline">
          ${perjalananHTML}
        </ul>
      </div>`;
    });
}

// stok
if (typeof dataBahanAjar !== 'undefined') {
    const tbody = document.querySelector('#tabelStok tbody');
    const btnViewCover = document.getElementById('btnViewCover');

    // fungsi untuk merender tabel stok bahan ajar
    const renderTable = () => {
        tbody.innerHTML = '';
        dataBahanAjar.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${item.kodeBarang}</td>
        <td>${item.namaBarang}</td>
        <td>${item.stok}</td>
        <td>${item.kodeLokasi}</td>
        <td>
            <button type="button" id="btnViewCover" class="btn btnViewCover" title="Lihat Cover">
                <i class="fa fa-solid fa-book"></i>
            </button>
        </td>
      `;
            tbody.appendChild(row);

            // ketika tombol view cover diklik, tampilkan modal dengan informasi bahan ajar dan gambar covernya menggunakan SweetAlert2
            row.querySelector('#btnViewCover').addEventListener('click', () => {
                Swal.fire({
                    title: item.namaBarang,
                    text: `Edisi: ${item.edisi}\nJenis: ${item.jenisBarang}`,
                    imageUrl: item.cover,
                    imageWidth: 200,
                    imageHeight: 300,
                    imageAlt: 'Cover Bahan Ajar',
                });
            });
        });
    };

    // render tabel saat halaman pertama kali dimuat
    renderTable();

    // tambah data stok bahan ajar baru melalui form input dan tampilkan di tabel
    document.getElementById('btnTambah').addEventListener('click', () => {
    
    // SweetAlert2 untuk menampilkan form input data bahan ajar baru
    Swal.fire({
        title: 'Tambah Stok Bahan Ajar',
        html: `
            <form id="formTambahStok">
                <input type="text" id="kode" placeholder="Kode" required>
                <input type="text" id="nama" placeholder="Nama Bahan Ajar" required>
                <input type="number" id="stok" placeholder="Jumlah" required>
                <input type="text" id="lokasi" placeholder="Lokasi" required>
                <input type="file" id="cover" placeholder="Cover" required>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Tambah',
        cancelButtonText: 'Batal',
        focusConfirm: false,

        // preConfirm untuk mengambil data dari form input dan validasi sebelum menambahkan ke dataBahanAjar
        preConfirm: () => {
            const kodeBarang = document.getElementById('kode').value;
            console.log("🚀 ~ kodeBarang:", kodeBarang)
            const namaBarang = document.getElementById('nama').value;
            const stok = document.getElementById('stok').value;
            const kodeLokasi = document.getElementById('lokasi').value;
            const cover = document.getElementById('cover').value;

            // validasi input, pastikan semua field diisi
            if (!kodeBarang || !namaBarang || !stok || !kodeLokasi || !cover) {
                Swal.showValidationMessage('Semua field harus diisi.');
                return false;
            }

            // jika validasi berhasil, kembalikan data sebagai objek untuk ditambahkan ke dataBahanAjar
            return { kodeBarang, namaBarang, stok, kodeLokasi, cover };
        }

        // setelah user mengisi form dan klik tambah, data akan ditambahkan ke dataBahanAjar dan tabel akan dirender ulang untuk menampilkan data baru
    }).then((result) => {
        if (result.isConfirmed) {

            // menambahkan data baru ke dataBahanAjar
            dataBahanAjar.push(result.value);
            Swal.fire({
                title: 'Data Ditambahkan!',
                text: 'Stok bahan ajar baru berhasil ditambahkan.',
                icon: 'success'
            });

            // render ulang tabel untuk menampilkan data baru
            renderTable();
        }
    });
});

    // document.getElementById('formTambah').addEventListener('submit', e => {
    //     e.preventDefault();
    //     const kodeBarang = document.getElementById('kode').value;
    //     const namaBarang = document.getElementById('nama').value;
    //     const stok = document.getElementById('stok').value;
    //     const kodeLokasi = document.getElementById('lokasi').value;
    //     const cover = document.getElementById('cover').value;

    //     dataBahanAjar.push({ kodeBarang, namaBarang, stok, kodeLokasi, cover });
    //     renderTable();

    //     console.log(dataBahanAjar);

    //     Swal.fire({
    //         title: 'Data Ditambahkan!',
    //         text: 'Stok bahan ajar baru berhasil ditambahkan.',
    //         icon: 'success',
    //         timer: 2000,
    //         showConfirmButton: false
    //     });

    //     e.target.reset();
    // });
}