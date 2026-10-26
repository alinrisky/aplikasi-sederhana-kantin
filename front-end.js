
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const rupiah = value => new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0
}).format(value);

const images = {
    mie: "https://i.pinimg.com/1200x/55/9d/34/559d34965d9989abc1b0b0e318c1f447.jpg",
    nasi: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80",
    kwetiau: "https://i.pinimg.com/1200x/3c/a7/ab/3ca7abb8e47cdc745ae24045229c0752.jpg",
    teh: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80",
    jeruk: "https://i.pinimg.com/736x/f8/56/5b/f8565b7442a9df396adc387c8555d8b4.jpg",
    doger: "https://i.pinimg.com/1200x/e4/01/86/e40186d9f5d1bd4319340400121df2da.jpg",
    ayam: "https://i.pinimg.com/1200x/a6/fb/29/a6fb29e53206b849ae18c5e5db939712.jpg",
    kopi: "https://i.pinimg.com/736x/49/69/f7/4969f7bc5abbec27aa52d539070ac08e.jpg",
    kentangGoreng: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    pisangGoreng: "https://i.pinimg.com/1200x/43/2c/3e/432c3e7ba1bb980af60d795103f6d09a.jpg",
    nugget: "https://i.pinimg.com/1200x/11/a7/75/11a7750065240f069c9ecb57ffce22f6.jpg",
    pisang: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
    apel: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
    semangka: "https://i.pinimg.com/736x/f4/cf/6c/f4cf6cb62c57f61b19546d08258a6acf.jpg"
};

let products = [
    { id: 1, name: "Mie Ayam", category: "Makanan", price: 15000, stock: 20, image: images.mie },
    { id: 2, name: "Nasi Goreng", category: "Makanan", price: 15000, stock: 15, image: images.nasi },
    { id: 3, name: "Kwetiau", category: "Makanan", price: 15000, stock: 15, image: images.kwetiau },
    { id: 4, name: "Es Teh", category: "Minuman", price: 5000, stock: 30, image: images.teh },
    { id: 5, name: "Es Jeruk", category: "Minuman", price: 5000, stock: 24, image: images.jeruk },
    { id: 6, name: "Es Doger", category: "Minuman", price: 7000, stock: 12, image: images.doger },
    { id: 7, name: "Ayam Geprek", category: "Makanan", price: 18000, stock: 18, image: images.ayam },
    { id: 8, name: "Kopi Susu", category: "Minuman", price: 10000, stock: 25, image: images.kopi },
    { id: 9, name: "Kentang Goreng", category: "Snack", price: 10000, stock: 20, image: images.kentangGoreng },
    { id: 10, name: "Pisang Goreng", category: "Snack", price: 8000, stock: 20, image: images.pisangGoreng },
    { id: 11, name: "Nugget", category: "Snack", price: 10000, stock: 15, image: images.nugget },
    { id: 12, name: "Pisang", category: "Buah-buahan", price: 3000, stock: 20, image: images.pisang },
    { id: 13, name: "Apel", category: "Buah-buahan", price: 5000, stock: 15, image: images.apel },
    { id: 14, name: "Semangka Potong", category: "Buah-buahan", price: 5000, stock: 12, image: images.semangka }
];

let cart = [];
let transactions = [];
let role = "Kasir";
let currentPage = "dashboard";
let categoryFilter = "Semua";
let menuSearch = "";
let transactionSearch = "";
let nextProductId = 15;
let nextTransactionId = 1;
let lastReceipt = null;

$("#today").textContent = new Date().toLocaleDateString("id-ID", {
    weekday: "short", day: "numeric", month: "short", year: "numeric"
});

function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.remove("hidden");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.add("hidden"), 2500);
}

function openModal(id) { $("#" + id).classList.remove("hidden"); }
function closeModal(id) { $("#" + id).classList.add("hidden"); }

$$("[data-close]").forEach(button => {
    button.addEventListener("click", () => closeModal(button.dataset.close));
});
$$(".modal").forEach(modal => {
    modal.addEventListener("click", e => {
        if (e.target === modal) modal.classList.add("hidden");
    });
});

$$(".role").forEach(button => {
    button.addEventListener("click", () => {
        role = button.dataset.role;
        $$(".role").forEach(item => item.classList.toggle("active", item === button));
    });
});

$("#togglePassword").addEventListener("click", () => {
    const input = $("#password");
    input.type = input.type === "password" ? "text" : "password";
    $("#togglePassword").textContent = input.type === "password" ? "👁" : "🙈";
    $("#togglePassword").setAttribute("aria-label",
        input.type === "password" ? "Lihat password" : "Sembunyikan password");
});

$("#loginForm").addEventListener("submit", e => {
    e.preventDefault();
    if (!$("#username").value.trim() || !$("#password").value) return;
    $("#loginPage").classList.add("hidden");
    $("#mainApp").classList.remove("hidden");
    $("#roleLabel").textContent = role;
    toast("Selamat datang di KantinKu!");
    navigate("dashboard");
});

$("#logoutBtn").addEventListener("click", () => {
    cart = [];
    $("#mainApp").classList.add("hidden");
    $("#loginPage").classList.remove("hidden");
    $("#password").value = "";
    toast("Kamu telah keluar.");
});

$$(".bottom-nav button").forEach(button => {
    button.addEventListener("click", () => navigate(button.dataset.page));
});

function navigate(page) {
    currentPage = page;
    $$(".bottom-nav button").forEach(button =>
        button.classList.toggle("active", button.dataset.page === page));
    renderPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function pageTitle(title, subtitle, action = "") {
    return `<div class="page-title"><div><h2>${title}</h2><p>${subtitle}</p></div>${action}</div>`;
}

function statCard(icon, label, value, style) {
    return `<div class="stat-card ${style}">
        <div class="stat-icon">${icon}</div><small>${label}</small>
        <strong>${value}</strong><small>Data aplikasi</small>
    </div>`;
}

function todayTransactions() {
    const now = new Date();
    return transactions.filter(t => new Date(t.date).toDateString() === now.toDateString());
}
function todayRevenue() {
    return todayTransactions().reduce((sum, t) => sum + t.total, 0);
}
function totalItemsSold() {
    return todayTransactions().reduce((sum, t) =>
        sum + t.items.reduce((n, item) => n + item.qty, 0), 0);
}

function renderPage() {
    const content = $("#content");
    if (currentPage === "dashboard") content.innerHTML = renderDashboard();
    if (currentPage === "menu") content.innerHTML = renderMenu();
    if (currentPage === "transactions") content.innerHTML = renderTransactions();
    if (currentPage === "reports") content.innerHTML = renderReports();
    if (currentPage === "profile") content.innerHTML = renderProfile();
    bindPageEvents();
}

function renderDashboard() {
    const recent = [...transactions].slice(-5).reverse();
    return `
    ${pageTitle("Dashboard " + role, "Ringkasan aktivitas KantinKu hari ini")}
    <div class="stats-grid section">
        ${statCard("🧾", "Total Transaksi", todayTransactions().length, "stat-green")}
        ${statCard("💰", "Total Penjualan", rupiah(todayRevenue()), "stat-orange")}
        ${statCard("🍱", "Menu Terjual", totalItemsSold(), "stat-purple")}
    </div>
    <div class="section"><button class="btn primary full" data-go="transactions">＋ Transaksi Baru →</button></div>
    <div class="quick-grid section">
        <button class="quick-link" data-go="transactions"><span>🛒</span>Transaksi</button>
        <button class="quick-link" data-go="menu"><span>🍜</span>Kelola Menu</button>
        <button class="quick-link" data-go="reports"><span>📊</span>Laporan</button>
    </div>
    <div class="dashboard-grid section">
        <div class="panel">
            <div class="panel-title"><h3>🧾 Transaksi Terbaru</h3><button class="btn light" data-go="transactions">Lihat Semua</button></div>
            ${recent.length ? transactionTable(recent) : emptyState("Belum ada transaksi", "Mulai transaksi pertama kamu.")}
        </div>
        <div class="panel">
            <div class="panel-title"><h3>🍽️ Menu Cepat</h3><button class="btn light" data-go="menu">Lihat Menu</button></div>
            ${products.slice(0, 4).map(p => `<div class="cart-row">
                <img src="${p.image}" alt="${p.name}" style="width:52px;height:52px;object-fit:cover;border-radius:12px" onerror="this.style.visibility='hidden'">
                <div class="cart-details"><b>${p.name}</b><small>${p.stock} stok tersisa</small></div>
                <b class="price">${rupiah(p.price)}</b>
            </div>`).join("")}
        </div>
    </div>`;
}

function emptyState(title, subtitle) {
    return `<div class="empty"><span>🍃</span><b>${title}</b><p>${subtitle}</p></div>`;
}

function renderMenu() {
    const isOwner = role === "Owner";
    const action = isOwner
        ? `<button class="btn primary" id="addProductBtn">＋ Tambah Menu</button>` : "";
    const filtered = products.filter(p =>
        (categoryFilter === "Semua" || p.category === categoryFilter) &&
        p.name.toLowerCase().includes(menuSearch.toLowerCase()));
    return `
    ${pageTitle(isOwner ? "Kelola Menu" : "Daftar Menu", "Cari dan lihat menu kantin", action)}
    <div class="panel">
        <div class="search-bar"><span class="search-icon">🔎</span>
            <input id="menuSearch" value="${escapeHTML(menuSearch)}" placeholder="Cari menu makanan atau minuman...">
        </div>
        <div class="filters">
            ${["Semua", "Makanan", "Minuman", "Snack", "Buah-buahan"].map(c =>
                `<button class="filter-btn ${categoryFilter === c ? "active" : ""}" data-category="${c}">${c}</button>`).join("")}
        </div>
        ${filtered.length ? `<div class="menu-grid">${filtered.map(p => productCard(p, isOwner)).join("")}</div>` : emptyState("Menu tidak ditemukan", "Coba kata kunci lain.")}
    </div>`;
}

function productCard(p, isOwner) {
    return `<article class="product-card">
        <img class="product-image" src="${p.image}" alt="${escapeHTML(p.name)}" loading="lazy"
            onerror="this.onerror=null;this.src='https://placehold.co/500x350/f1f4ef/42654f?text=Menu+Kantin'">
        <div class="product-info">
            <h3>${escapeHTML(p.name)}</h3>
            <div class="price">${rupiah(p.price)}</div>
            <small class="stock">${p.category} · Stok ${p.stock}</small>
            <div class="product-actions">
                ${isOwner
                    ? `<button class="edit-btn" data-edit="${p.id}">✎ Edit</button><button class="delete-btn" data-delete="${p.id}">⌫</button>`
                    : `<button class="add-btn" data-add="${p.id}" ${p.stock < 1 ? "disabled" : ""}>＋ Tambah</button>`}
            </div>
        </div>
    </article>`;
}

function renderTransactions() {
    const isOwner = role === "Owner";
    const filtered = [...transactions].reverse().filter(t =>
        t.id.toLowerCase().includes(transactionSearch.toLowerCase()));
    return `
    ${pageTitle("Transaksi Penjualan", "Pilih menu dan proses pembayaran")}
    <div class="transaction-layout section">
        <div class="panel">
            <div class="search-bar"><span class="search-icon">🔎</span>
                <input id="transactionMenuSearch" value="${escapeHTML(menuSearch)}" placeholder="Cari menu...">
            </div>
            <div class="filters">
                ${["Semua", "Makanan", "Minuman", "Snack", "Buah-buahan"].map(c =>
                    `<button class="filter-btn ${categoryFilter === c ? "active" : ""}" data-category="${c}">${c}</button>`).join("")}
            </div>
            <div class="menu-grid">
                ${products.filter(p =>
                    (categoryFilter === "Semua" || p.category === categoryFilter) &&
                    p.name.toLowerCase().includes(menuSearch.toLowerCase()))
                    .map(p => productCard(p, false)).join("") || emptyState("Menu tidak ditemukan", "Cari menu lain.")}
            </div>
        </div>
        <div class="panel cart-panel">
            <div class="panel-title"><h3>🛒 Keranjang</h3><button class="btn light" id="clearCart">Hapus</button></div>
            ${cart.length ? cart.map(item => {
                const p = products.find(x => x.id === item.id);
                if (!p) return "";
                return `<div class="cart-row">
                    <div class="cart-details"><b>${escapeHTML(p.name)}</b><small>${rupiah(p.price)} / item</small></div>
                    <div class="qty"><button data-qty="${p.id}" data-delta="-1">−</button><b>${item.qty}</b><button data-qty="${p.id}" data-delta="1">+</button></div>
                </div>`;
            }).join("") : emptyState("Keranjang kosong", "Pilih menu untuk memulai.")}
            <div class="cart-total"><span>Total</span><span>${rupiah(cartTotal())}</span></div>
            <button class="btn primary full" id="checkoutBtn" ${cart.length ? "" : "disabled"}>Lanjut Pembayaran →</button>
        </div>
    </div>
    <div class="panel">
        <div class="panel-title"><h3>🧾 Riwayat Transaksi</h3></div>
        <div class="search-bar"><span class="search-icon">🔎</span><input id="historySearch" value="${escapeHTML(transactionSearch)}" placeholder="Cari nomor transaksi..."></div>
        ${filtered.length ? transactionTable(filtered, true) : emptyState("Belum ada riwayat", "Transaksi yang selesai akan tampil di sini.")}
    </div>`;
}

function cartTotal() {
    return cart.reduce((sum, item) => {
        const p = products.find(x => x.id === item.id);
        return sum + (p ? p.price * item.qty : 0);
    }, 0);
}

function transactionTable(list, showDetail = false) {
    return `<div class="table-wrap"><table>
        <thead><tr><th>No. Transaksi</th><th>Waktu</th><th>Total</th><th>Metode</th><th>Status</th>${showDetail ? "<th>Detail</th>" : ""}</tr></thead>
        <tbody>${list.map(t => `<tr>
            <td><b>${t.id}</b></td>
            <td>${new Date(t.date).toLocaleString("id-ID")}</td>
            <td><b>${rupiah(t.total)}</b></td><td>${t.method}</td><td><span class="status">Selesai</span></td>
            ${showDetail ? `<td><button class="btn light" data-detail="${t.id}">Lihat</button></td>` : ""}
        </tr>`).join("")}</tbody>
    </table></div>`;
}

function renderReports() {
    const allRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
    const counts = {};
    transactions.forEach(t => t.items.forEach(item => {
        counts[item.name] = (counts[item.name] || 0) + item.qty;
    }));
    const best = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const bars = [0, 1, 2, 3, 4, 5, 6].map(offset => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - offset));
        const total = transactions.filter(t =>
            new Date(t.date).toDateString() === date.toDateString())
            .reduce((sum, t) => sum + t.total, 0);
        return { day: date.toLocaleDateString("id-ID", { day: "numeric", month: "short" }), total };
    });
    const max = Math.max(...bars.map(b => b.total), 1);
    return `
    ${pageTitle("Laporan Penjualan", "Ringkasan hasil transaksi")}
    <div class="stats-grid section">
        ${statCard("💵", "Total Penjualan", rupiah(allRevenue), "stat-green")}
        ${statCard("🧾", "Total Transaksi", transactions.length, "stat-orange")}
        ${statCard("🍱", "Produk Terjual", transactions.reduce((n, t) => n + t.items.reduce((s, i) => s + i.qty, 0), 0), "stat-purple")}
    </div>
    <div class="report-grid section">
        <div class="panel">
            <div class="panel-title"><h3>📈 Grafik Penjualan</h3></div>
            <div class="chart">${bars.map(b => `<div class="bar-column">
                <small>${b.total ? (b.total >= 1000000 ? (b.total / 1000000).toFixed(1) + "jt" : Math.round(b.total / 1000) + "k") : "0"}</small>
                <div class="bar" style="height:${Math.max(5, b.total / max * 75)}%"></div>
                <small>${b.day}</small></div>`).join("")}</div>
        </div>
        <div class="panel">
            <div class="panel-title"><h3>🏆 Menu Terlaris</h3></div>
            ${best.length ? best.map((b, i) => `<div class="cart-row">
                <b style="color:var(--green)">#${i + 1}</b>
                <div class="cart-details"><b>${escapeHTML(b[0])}</b><small>Jumlah terjual</small></div><b>${b[1]}</b>
            </div>`).join("") : emptyState("Belum ada data", "Menu terlaris muncul setelah ada transaksi.")}
        </div>
    </div>
    <div class="panel"><div class="panel-title"><h3>📋 Semua Transaksi</h3></div>
        ${transactions.length ? transactionTable([...transactions].reverse(), true) : emptyState("Belum ada transaksi", "Laporan akan terisi setelah pembayaran.")}</div>`;
}

function renderProfile() {
    return `
    ${pageTitle("Profil", "Informasi pengguna aplikasi")}
    <div class="panel">
        <div class="profile-card">
            <div class="avatar">👤</div>
            <div><h2>${escapeHTML($("#username").value || "Pengguna")}</h2><p>${role} KantinKu</p><span class="status">Akun demo aktif</span></div>
        </div>
        <div class="profile-links">
            <button class="profile-link" data-profile="account"><span>👤</span><div><b>Informasi Akun</b><small class="muted">Nama pengguna dan peran</small></div></button>
            <button class="profile-link" data-profile="password"><span>🔒</span><div><b>Ubah Password</b><small class="muted">Simulasi pengaturan password</small></div></button>
            <button class="profile-link" data-profile="settings"><span>⚙️</span><div><b>Pengaturan Aplikasi</b><small class="muted">Informasi aplikasi</small></div></button>
            <button class="profile-link" data-profile="help"><span>❔</span><div><b>Bantuan</b><small class="muted">Tentang KantinKu</small></div></button>
        </div>
        <button class="btn danger full" style="margin-top:20px" id="profileLogout">↪ Keluar</button>
    </div>`;
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
}

function bindPageEvents() {
    $$("[data-go]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.go)));

    $("#addProductBtn")?.addEventListener("click", () => openProductForm());

    $("#menuSearch")?.addEventListener("input", e => {
        menuSearch = e.target.value;
        const pos = e.target.selectionStart;
        renderPage();
        const input = $("#menuSearch");
        input?.focus();
        input?.setSelectionRange(pos, pos);
    });

    $("#transactionMenuSearch")?.addEventListener("input", e => {
        menuSearch = e.target.value;
        const pos = e.target.selectionStart;
        renderPage();
        const input = $("#transactionMenuSearch");
        input?.focus();
        input?.setSelectionRange(pos, pos);
    });

    $("#historySearch")?.addEventListener("input", e => {
        transactionSearch = e.target.value;
        const pos = e.target.selectionStart;
        renderPage();
        const input = $("#historySearch");
        input?.focus();
        input?.setSelectionRange(pos, pos);
    });

    $$("[data-category]").forEach(button => button.addEventListener("click", () => {
        categoryFilter = button.dataset.category;
        renderPage();
    }));

    $$("[data-add]").forEach(button => button.addEventListener("click", () => addToCart(Number(button.dataset.add))));
    $$("[data-qty]").forEach(button => button.addEventListener("click", () =>
        changeQty(Number(button.dataset.qty), Number(button.dataset.delta))));
    $$("[data-edit]").forEach(button => button.addEventListener("click", () =>
        openProductForm(Number(button.dataset.edit))));
    $$("[data-delete]").forEach(button => button.addEventListener("click", () =>
        deleteProduct(Number(button.dataset.delete))));
    $$("[data-detail]").forEach(button => button.addEventListener("click", () =>
        showReceipt(transactions.find(t => t.id === button.dataset.detail))));

    $("#clearCart")?.addEventListener("click", () => {
        cart = [];
        renderPage();
        toast("Keranjang dikosongkan.");
    });

    $("#checkoutBtn")?.addEventListener("click", () => {
        if (!cart.length) return;
        $("#paymentTotal").textContent = rupiah(cartTotal());
        $("#cashReceived").value = cartTotal();
        updateChange();
        openModal("paymentModal");
    });

    $("#paymentMethod")?.addEventListener("change", () => {
        $("#cashReceived").disabled = $("#paymentMethod").value !== "Tunai";
        if ($("#paymentMethod").value !== "Tunai") $("#cashReceived").value = 0;
        updateChange();
    });
    $("#cashReceived")?.addEventListener("input", updateChange);
    $("#confirmPayment")?.addEventListener("click", finishPayment);
    $("#profileLogout")?.addEventListener("click", () => $("#logoutBtn").click());

    $$("[data-profile]").forEach(button => button.addEventListener("click", () => {
        const messages = {
            account: `Nama: ${$("#username").value}\nPeran: ${role}`,
            password: "Fitur ubah password belum terhubung ke sistem akun.",
            settings: "KantinKu versi demo. Data hanya tersimpan selama halaman terbuka.",
            help: "Gunakan menu untuk memilih produk, lalu proses pembayaran di halaman Transaksi."
        };
        alert(messages[button.dataset.profile]);
    }));
}

function addToCart(id) {
    const p = products.find(x => x.id === id);
    if (!p || p.stock < 1) return toast("Stok produk habis.");
    const item = cart.find(x => x.id === id);
    if (item && item.qty >= p.stock) return toast("Jumlah melebihi stok.");
    if (item) item.qty++;
    else cart.push({ id, qty: 1 });
    renderPage();
    toast(p.name + " ditambahkan ke keranjang.");
}

function changeQty(id, delta) {
    const item = cart.find(x => x.id === id);
    const p = products.find(x => x.id === id);
    if (!item || !p) return;
    if (delta > 0 && item.qty >= p.stock) return toast("Jumlah melebihi stok.");
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
    renderPage();
}

function openProductForm(id = null) {
    const p = products.find(x => x.id === id);
    $("#productForm").reset();
    $("#productId").value = p ? p.id : "";
    $("#modalTitle").textContent = p ? "Edit Menu" : "Tambah Menu";
    $("#productName").value = p?.name || "";
    $("#productCategory").value = p?.category || "Makanan";
    $("#productPrice").value = p?.price || "";
    $("#productStock").value = p?.stock ?? "";
    $("#productImage").value = p?.image || "";
    openModal("productModal");
}

$("#productForm").addEventListener("submit", e => {
    e.preventDefault();
    const id = Number($("#productId").value);
    const name = $("#productName").value.trim();
    const category = $("#productCategory").value;
    const price = Number($("#productPrice").value);
    const stock = Number($("#productStock").value);
    const image = $("#productImage").value.trim() || images.mie;
    if (!name || price <= 0 || stock < 0) return toast("Periksa kembali data menu.");

    if (id) {
        const p = products.find(x => x.id === id);
        if (p) Object.assign(p, { name, category, price, stock, image });
        toast("Menu berhasil diperbarui.");
    } else {
        products.push({ id: nextProductId++, name, category, price, stock, image });
        toast("Menu berhasil ditambahkan.");
    }
    closeModal("productModal");
    renderPage();
});

function deleteProduct(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    if (!confirm(`Hapus menu "${p.name}"?`)) return;
    products = products.filter(x => x.id !== id);
    cart = cart.filter(x => x.id !== id);
    renderPage();
    toast("Menu dihapus.");
}

function updateChange() {
    const total = cartTotal();
    const method = $("#paymentMethod").value;
    const received = Number($("#cashReceived").value) || 0;
    const change = method === "Tunai" ? received - total : 0;
    $("#changeValue").textContent = rupiah(Math.max(0, change));
    $("#confirmPayment").disabled = method === "Tunai" && received < total;
}

function finishPayment() {
    if (!cart.length) return;
    const total = cartTotal();
    const method = $("#paymentMethod").value;
    const received = Number($("#cashReceived").value) || 0;
    if (method === "Tunai" && received < total) return toast("Uang yang diterima belum cukup.");

    for (const item of cart) {
        const p = products.find(x => x.id === item.id);
        if (!p || p.stock < item.qty) return toast("Stok berubah. Periksa keranjang.");
    }

    const items = cart.map(item => {
        const p = products.find(x => x.id === item.id);
        p.stock -= item.qty;
        return { name: p.name, price: p.price, qty: item.qty };
    });

    const transaction = {
        id: "TRX-" + String(nextTransactionId++).padStart(3, "0"),
        date: new Date().toISOString(),
        items, total, method,
        received: method === "Tunai" ? received : total,
        change: method === "Tunai" ? received - total : 0
    };
    transactions.push(transaction);
    cart = [];
    lastReceipt = transaction;
    closeModal("paymentModal");
    renderPage();
    showReceipt(transaction);
    toast("Transaksi berhasil disimpan.");
}

function showReceipt(t) {
    if (!t) return;
    lastReceipt = t;
    $("#receiptContent").innerHTML = `
        <div class="receipt-line"><span>No. Transaksi</span><b>${t.id}</b></div>
        <div class="receipt-line"><span>Waktu</span><span>${new Date(t.date).toLocaleString("id-ID")}</span></div>
        <hr>
        ${t.items.map(item => `<div class="receipt-line">
            <span>${escapeHTML(item.name)} × ${item.qty}</span><b>${rupiah(item.price * item.qty)}</b>
        </div>`).join("")}
        <div class="receipt-line total"><span>Total</span><span>${rupiah(t.total)}</span></div>
        <div class="receipt-line"><span>Metode</span><span>${t.method}</span></div>
        <div class="receipt-line"><span>Uang diterima</span><span>${rupiah(t.received)}</span></div>
        <div class="receipt-line"><span>Kembalian</span><span>${rupiah(t.change)}</span></div>
        <p style="text-align:center;margin:18px 0 10px;color:var(--green);font-weight:900">Terima kasih telah berbelanja! 💚</p>`;
    openModal("receiptModal");
}

$("#printReceipt").addEventListener("click", () => window.print());

renderPage();
