const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            // Data dari dataBahanAjar.js
            upbjjList: dataBahanAjar.upbjjList,
            kategoriList: dataBahanAjar.kategoriList,
            stok: dataBahanAjar.stok,

            // Reactive state untuk filter, sort, dan tampilan tabel
            selectedUpbjj: "",
            selectedKategori: "",
            isSafety: false,
            sortBy: "",

            // Data untuk form tambah stok
            newData: {
                kode: "",
                judul: "",
                kategori: "",
                upbjj: "",
                lokasiRak: "",
                harga: 0,
                stok: 0,
                catatanHTML: ""
            }
        };
    },
    computed: {
        // untuk menampilkan kategori yang hanya muncul di UPBJJ yang dipilih
        kategoriListFiltered() {
            if (!this.selectedUpbjj) return [];
            // ambil kategori dari stok yang sesuai dengan UPBJJ yang dipilih, lalu hilangkan duplikat
            const filtered = this.stok
                .filter(item => item.upbjj === this.selectedUpbjj)
                .map(item => item.kategori);
            return [...new Set(filtered)]; // hilangkan duplikat
        },

        // untuk menampilkan data stok yang sudah difilter dan disortir sesuai pilihan user
        filteredData() {
            let data = [...this.stok];
            console.log("🚀 ~ data:", data)

            // filter UPBJJ jika ada yang dipilih
            if (this.selectedUpbjj)
                data = data.filter(i => i.upbjj === this.selectedUpbjj);

            // filter kategori berdasarkan UPBJJ yang dipilih
            if (this.selectedKategori)
                data = data.filter(i => i.kategori === this.selectedKategori);

            // filter safety stock
            if (this.isSafety)
                data = data.filter(i => i.qty <= i.safety || i.qty === 0);

            // sorting
            if (this.sortBy === "judul")
                data.sort((a, b) => a.judul.localeCompare(b.judul));
            else if (this.sortBy === "qty")
                data.sort((a, b) => a.qty - b.qty);
            else if (this.sortBy === "harga")
                data.sort((a, b) => a.harga - b.harga);

            return data;
        }
    },
    methods: {
        // reset filter
        resetFilter() {
            this.selectedUpbjj = "";
            this.selectedKategori = "";
            this.isSafety = false;
            this.sortBy = "";
        },
        statusText(item) {
            if (item.qty === 0) return "Kosong";
            else if (item.qty < item.safety) return "Menipis";
            else return "Aman";
        },
        statusKelas(item) {
            if (item.qty === 0) return "danger";
            else if (item.qty < item.safety) return "warning";
            else return "success";
        },

        // ====== ADD ITEM ======
        async openAddForm() {
            const upbjjOptions = this.upbjjList.map(
                (u) => `<option value="${u}">${u}</option>`
            ).join("");

            const kategoriOptions = this.kategoriList.map(
                (k) => `<option value="${k}">${k}</option>`
            ).join("");

            const { value: formValues } = await Swal.fire({
                title: 'Tambah Bahan Ajar',
                width: 600,
                html: `
          <input id="kode" class="swal2-input" placeholder="Kode">
          <input id="judul" class="swal2-input" placeholder="Judul">
          <select id="kategori" class="swal2-select">
                <option value="">Pilih Kategori</option>${kategoriOptions}
            </select>
            <select id="upbjj" class="swal2-select">
                <option value="">Pilih Kategori</option>${upbjjOptions}
            </select>
          <input id="lokasiRak" class="swal2-input" placeholder="Lokasi Rak">
          <input id="harga" class="swal2-input" type="number" placeholder="Harga">
          <input id="qty" class="swal2-input" type="number" placeholder="Jumlah">
          <textarea id="catatanHTML" class="swal2-textarea" type="text" placeholder="Catatan"></textarea>
          `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Simpan",
                cancelButtonText: "Batal",
                preConfirm: () => {
                    return {
                        kode: document.getElementById('kode').value.trim(),
                        judul: document.getElementById('judul').value.trim(),
                        kategori: document.getElementById('kategori').value,
                        upbjj: document.getElementById('upbjj').value,
                        lokasiRak: document.getElementById('lokasiRak').value.trim(),
                        harga: Number(document.getElementById('harga').value),
                        qty: Number(document.getElementById('qty').value),
                        catatanHTML: document.getElementById('catatanHTML').value.trim(),
                        safety: 10
                    };
                }
            });

            if (formValues) {
                if (!formValues.kode || !formValues.judul) {
                    Swal.fire("Gagal", "Semua field wajib diisi!", "error");
                    return;
                }

                // Cek kode duplikat
                if (this.stok.some(i => i.kode === formValues.kode)) {
                    Swal.fire("Gagal", "Kode sudah terdaftar!", "error");
                    return;
                }

                this.stok.push(formValues);
                Swal.fire("Berhasil", "Data bahan ajar ditambahkan!", "success");
            }
        },

        // ====== EDIT ITEM ======
        async editItem(item) {
            const upbjjOptions = this.upbjjList.map(
                (u) => `<option value="${u}" ${u === item.upbjj ? "selected" : ""}>${u}</option>`
            ).join("");

            const kategoriOptions = this.kategoriList.map(
                (k) => `<option value="${k}" ${k === item.kategori ? "selected" : ""}>${k}</option>`
            ).join("");

            const { value: formValues } = await Swal.fire({
                title: 'Edit Data Bahan Ajar',
                width: 600,
                html: `
          <input id="judul" class="swal2-input" value="${item.judul}">
          <select id="kategori" class="swal2-select">${kategoriOptions}</select>
          <select id="upbjj" class="swal2-select">${upbjjOptions}</select>
          <input id="lokasiRak" class="swal2-input" value="${item.lokasiRak}">
          <input id="harga" class="swal2-input" type="number" value="${item.harga}">
          <input id="qty" class="swal2-input" type="number" value="${item.qty}">
          <textarea id="catatanHTML" class="swal2-textarea">${item.catatanHTML || ""}</textarea>
        `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Simpan Perubahan",
                cancelButtonText: "Batal",
                preConfirm: () => ({
                    judul: document.getElementById('judul').value.trim(),
                    kategori: document.getElementById('kategori').value,
                    upbjj: document.getElementById('upbjj').value,
                    lokasiRak: document.getElementById('lokasiRak').value.trim(),
                    harga: Number(document.getElementById('harga').value),
                    qty: Number(document.getElementById('qty').value),
                    catatanHTML: document.getElementById('catatanHTML').value.trim()
                })
            });
            if (formValues) {
                Object.assign(item, formValues);
                Swal.fire("Berhasil", "Data bahan ajar telah diperbarui!", "success");
            }
        },
        // ====== DELETE ITEM ======
        deleteItem(item) {
            Swal.fire({
                title: 'Yakin ingin menghapus?',
                text: `Data ${item.judul} akan dihapus!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Batal'
            }).then(result => {
                if (result.isConfirmed) {
                    this.stok = this.stok.filter(i => i.kode !== item.kode);
                    Swal.fire("Terhapus!", "Data telah dihapus.", "success");
                }
            });
        }
    }
});

app.mount("#stockApp");