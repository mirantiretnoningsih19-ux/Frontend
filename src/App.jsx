
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/siswa";

const formAwal = {
    kode_siswa: "",
    nama_siswa: "",
    alamat_siswa: "",
    tgl_siswa: "",
    jurusan_siswa: ""
};

function App() {
    const [siswa, setSiswa] = useState([]);
    const [form, setForm] = useState(formAwal);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mengambil data siswa dari backend
    const ambilData = async () => {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Gagal mengambil data siswa");
            }

            const data = await response.json();
            setSiswa(data);
        } catch (error) {
            alert("Backend belum terhubung. Pastikan server berjalan.");
        }
    };

    useEffect(() => {
        ambilData();
    }, []);

    // Mengubah isi input form
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Menambah dan mengedit data
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editId
                ? `${API_URL}/${editId}`
                : API_URL;

            const method = editId ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Gagal menyimpan data");
            }

            alert(result.message);

            setForm(formAwal);
            setEditId(null);

            await ambilData();

        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Mengisi form saat tombol edit diklik
    const handleEdit = (data) => {
        setEditId(data.id);

        setForm({
            kode_siswa: data.kode_siswa,
            nama_siswa: data.nama_siswa,
            alamat_siswa: data.alamat_siswa,
            tgl_siswa: data.tgl_siswa?.slice(0, 10),
            jurusan_siswa: data.jurusan_siswa
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Menghapus data siswa
    const handleDelete = async (id) => {
        const konfirmasi = window.confirm(
            "Apakah kamu yakin ingin menghapus data ini?"
        );

        if (!konfirmasi) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            alert(result.message);
            await ambilData();

        } catch (error) {
            alert(error.message);
        }
    };

    // Membatalkan proses edit
    const handleBatal = () => {
        setForm(formAwal);
        setEditId(null);
    };

    return (
        <div className="container">

            <header className="header">
                <h1>Aplikasi Data Siswa</h1>
                <p>Pengelolaan Data Siswa Sekolah</p>
            </header>

            <section className="form-section">
                <h2>
                    {editId ? "Edit Data Siswa" : "Tambah Data Siswa"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Kode Siswa</label>
                            <input
                                type="text"
                                name="kode_siswa"
                                value={form.kode_siswa}
                                onChange={handleChange}
                                placeholder="Masukkan kode siswa"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Nama Siswa</label>
                            <input
                                type="text"
                                name="nama_siswa"
                                value={form.nama_siswa}
                                onChange={handleChange}
                                placeholder="Masukkan nama siswa"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Alamat Siswa</label>
                            <input
                                type="text"
                                name="alamat_siswa"
                                value={form.alamat_siswa}
                                onChange={handleChange}
                                placeholder="Masukkan alamat siswa"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Tanggal Lahir Siswa</label>
                            <input
                                type="date"
                                name="tgl_siswa"
                                value={form.tgl_siswa}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group full">
                            <label>Jurusan Siswa</label>
                            <input
                                type="text"
                                name="jurusan_siswa"
                                value={form.jurusan_siswa}
                                onChange={handleChange}
                                placeholder="Masukkan jurusan siswa"
                                required
                            />
                        </div>

                    </div>

                    <div className="button-group">

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading
                                ? "Menyimpan..."
                                : editId
                                    ? "Update Data"
                                    : "Tambah Data"}
                        </button>

                        {editId && (
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={handleBatal}
                            >
                                Batal
                            </button>
                        )}

                    </div>
                </form>
            </section>

            <section className="table-section">
                <h2>Daftar Data Siswa</h2>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Kode Siswa</th>
                                <th>Nama Siswa</th>
                                <th>Alamat</th>
                                <th>Tanggal</th>
                                <th>Jurusan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {siswa.length > 0 ? (
                                siswa.map((data, index) => (
                                    <tr key={data.id}>
                                        <td>{index + 1}</td>
                                        <td>{data.kode_siswa}</td>
                                        <td>{data.nama_siswa}</td>
                                        <td>{data.alamat_siswa}</td>
                                        <td>{data.tgl_siswa?.slice(0, 10)}</td>
                                        <td>{data.jurusan_siswa}</td>

                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => handleEdit(data)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(data.id)}
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="empty">
                                        Belum ada data siswa
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

        </div>
    );
}

export default App;