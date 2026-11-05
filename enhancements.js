/* PUSTAKA LONTARA — autentikasi demo, langganan, denda, dan admin */
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const money = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n || 0);
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isAdminPage = path === 'admin.html';
  const accountKey='pustakaAccounts', sessionKey='pustakaSession', subKey='pustakaSubscriptions', borrowStoreKey='pustakaBorrowRequests';
  const ADMIN_EMAIL='admin@pustakalontara.id', ADMIN_PASSWORD='LontaraAdmin!2026';
  const FINE_PER_DAY=2000, LOAN_DAYS=7;
  let accounts=read(accountKey,[]), session=read(sessionKey,null);
  if(!accounts.some(a=>a.email===ADMIN_EMAIL)) { accounts.push({name:'Administrator',email:ADMIN_EMAIL,password:ADMIN_PASSWORD,role:'admin'}); write(accountKey,accounts); }
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toastMsg=msg=>{ const el=$('#toast'); if(el){el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2800);} else alert(msg); };

  // Auth panel replaces the previous name/email-only demo login.
  const gate=document.createElement('div'); gate.className='auth-gate'; gate.id='authGate'; gate.innerHTML=`<section class="auth-card">
    <div class="auth-brand">📖 <span>PUSTAKA<br>LONTARA</span></div>
    <p class="auth-kicker">RUANG BACA DIGITAL</p><h1 id="authTitle">Selamat Datang</h1>
    <p class="auth-intro" id="authIntro">Masuk atau buat akun untuk melanjutkan ke perpustakaan.</p>
    <form id="authForm" class="auth-form"><label>Nama lengkap<input id="authName" autocomplete="name" placeholder="Nama lengkap" required></label>
    <label>Email<input id="authEmail" type="email" autocomplete="username" placeholder="nama@email.com" required></label>
    <label>Kata sandi<input id="authPassword" type="password" autocomplete="current-password" minlength="6" placeholder="Minimal 6 karakter" required></label>
    <button class="btn-primary" id="authSubmit" type="submit">Masuk</button></form>
    <p class="auth-switch" id="authSwitch">Belum punya akun? <button type="button" id="authToggle">Daftar</button></p>
    <p class="auth-error" id="authError" aria-live="polite"></p><small class="auth-footnote">Akun demo tersimpan di browser perangkat ini. Untuk website publik, gunakan autentikasi server.</small>
  </section>`;
  document.body.appendChild(gate);
  let authMode='login';
  function renderAuth(){
    $('#authTitle').textContent=authMode==='login'?'Selamat Datang':'Buat Akun';
    $('#authIntro').textContent=authMode==='login'?'Masuk untuk melanjutkan ke Pustaka Lontara.':'Daftarkan akun agar dapat meminjam dan menyimpan buku.';
    $('#authName').parentElement.style.display=authMode==='register'?'grid':'none';
    $('#authName').required=authMode==='register';
    $('#authPassword').autocomplete=authMode==='login'?'current-password':'new-password';
    $('#authSubmit').textContent=authMode==='login'?'Masuk':'Daftar Akun';
    $('#authSwitch').innerHTML=authMode==='login'?'Belum punya akun? <button type="button" id="authToggle">Daftar</button>':'Sudah punya akun? <button type="button" id="authToggle">Masuk</button>';
    $('#authToggle').onclick=()=>{authMode=authMode==='login'?'register':'login';$('#authError').textContent='';renderAuth();};
  }
  function showGate(){gate.classList.add('visible');document.body.classList.add('auth-locked');renderAuth();}
  function hideGate(){gate.classList.remove('visible');document.body.classList.remove('auth-locked');}
  function logout(){localStorage.removeItem(sessionKey);session=null;currentUser=null;showGate();toastMsg('Kamu sudah keluar dari akun.');}
  $('#authForm').addEventListener('submit',e=>{
    e.preventDefault(); const email=$('#authEmail').value.trim().toLowerCase(), password=$('#authPassword').value;
    if(authMode==='register'){
      const name=$('#authName').value.trim();
      if(!name){$('#authError').textContent='Nama lengkap wajib diisi.';return;}
      if(accounts.some(a=>a.email===email)){ $('#authError').textContent='Email sudah terdaftar. Silakan masuk.';return; }
      accounts.push({name,email,password,role:'user'});write(accountKey,accounts);
      session={name,email,role:'user',loginAt:new Date().toISOString()};
    } else {
      const account=accounts.find(a=>a.email===email && a.password===password);
      if(!account){$('#authError').textContent='Email atau kata sandi tidak cocok.';return;}
      session={name:account.name,email:account.email,role:account.role,loginAt:new Date().toISOString()};
    }
    write(sessionKey,session);currentUser={name:session.name,email:session.email,role:session.role};
    hideGate();updateLoginButton();
    if(isAdminPage && session.role!=='admin'){toastMsg('Halaman admin hanya dapat dibuka oleh administrator.');location.href='index.html';return;}
    if(isAdminPage)renderEnhancedAdmin();
  });
  function updateLoginButton(){
    const old=$('#loginBtn'); if(!old)return;
    const replacement=old.cloneNode(false);replacement.id='loginBtn';replacement.className='login-btn';replacement.textContent=session?'Keluar':'Masuk';
    old.replaceWith(replacement);replacement.addEventListener('click',()=>session?logout():showGate());
  }
  if(session){
    const valid=accounts.some(a=>a.email===session.email && a.role===session.role);
    if(!valid){session=null;localStorage.removeItem(sessionKey);}
  }
  if(!session) showGate(); else {currentUser={name:session.name,email:session.email,role:session.role};hideGate();}
  if(isAdminPage && session && session.role!=='admin'){showGate();$('#authError').textContent='Masuk menggunakan akun administrator untuk membuka dashboard.';}
  updateLoginButton();

  // Borrow request: force a signed-in member and attach a seven-day return date.
  const borrowForm=$('#borrowForm');
  if(borrowForm) borrowForm.addEventListener('submit',e=>{
    e.preventDefault();e.stopImmediatePropagation();
    if(!session){showGate();return;}
    const chosen=books.find(b=>b.id===selectedBookId); if(!chosen)return;
    const now=new Date(), due=new Date(now);due.setDate(due.getDate()+LOAN_DAYS);
    const req={id:String(Date.now()),name:session.name,email:session.email,phone:$('#borrowPhone').value.trim(),address:$('#borrowAddress').value.trim(),book:chosen.title,type:chosen.type,status:'Menunggu',date:now.toLocaleDateString('id-ID'),createdAt:now.toISOString(),dueDate:due.toISOString(),finePerDay:FINE_PER_DAY};
    const all=read(borrowStoreKey,[]);all.unshift(req);write(borrowStoreKey,all);
    borrowForm.reset();$('#borrowModal')?.classList.remove('show');toastMsg('Permintaan terkirim. Batas pengembalian 7 hari.');
  },true);

  // Rules modal content is updated to show transparent loan and late-fee terms.
  const rules=$('#rulesModal .rules-list');
  if(rules) rules.innerHTML=`<p>1. Pengguna wajib masuk menggunakan akun masing-masing sebelum meminjam buku.</p><p>2. Setiap peminjaman memiliki masa pinjam ${LOAN_DAYS} hari sejak permintaan disetujui.</p><p>3. Pengguna wajib menunggu persetujuan admin sebelum mengambil buku.</p><p>4. Buku harus dijaga dan dikembalikan dalam kondisi baik.</p><p>5. Keterlambatan dikenakan denda ${money(FINE_PER_DAY)} per hari setelah tanggal jatuh tempo.</p><p>6. Denda dihitung sampai buku ditandai dikembalikan oleh admin.</p><p>7. Pengajuan yang keliru dapat dibatalkan oleh admin.</p><p>8. Langganan premium bersifat opsional dan aktif setelah pembayaran diverifikasi admin.</p>`;

  // Membership page content.
  function renderSubscriptionPage(){
    if(path!=='langganan.html')return;
    const main=$('#membershipMount') || $('main');if(!main)return;
    const subs=read(subKey,[]), mine=subs.filter(s=>s.email===session?.email);
    main.innerHTML=`<div><p class="section-desc">Pilih akses yang sesuai kebutuhan membaca. Langganan diproses setelah admin memverifikasi pembayaran.</p>
    <div class="membership-grid"><article class="membership-card"><span class="plan-label">GRATIS</span><h3>Pembaca</h3><strong>Rp0</strong><p>Menjelajahi katalog, menyimpan favorit, dan mengajukan peminjaman sesuai ketentuan.</p><button class="btn-outline" disabled>Paket Saat Ini</button></article>
    <article class="membership-card featured-plan"><span class="plan-label">PILIHAN</span><h3>Premium</h3><strong>Rp10.000<small>/bulan</small></strong><p>Dukungan untuk pengembangan perpustakaan dan akses prioritas layanan anggota.</p><button class="btn-primary" id="subscribeBtn">Ajukan Langganan</button></article></div>
    <div class="membership-panel"><h3>Status Langganan Saya</h3>${mine.length?mine.map(s=>`<p><strong>${esc(s.plan)}</strong> · ${esc(s.status)} · ${esc(s.date)}</p>`).join(''):'<p>Belum ada pengajuan langganan.</p>'}</div>
    <div class="membership-panel"><h3>Informasi Pembayaran</h3><p>Ajukan langganan terlebih dahulu. Admin akan menghubungi kamu untuk instruksi pembayaran dan mengaktifkan langganan setelah bukti pembayaran diverifikasi.</p><small>Harga paket dan manfaat dapat disesuaikan oleh pengelola.</small></div>`;
    $('#subscribeBtn')?.addEventListener('click',()=>{
      if(!session){showGate();return;}
      const all=read(subKey,[]);if(all.some(s=>s.email===session.email&&s.status==='Menunggu')){toastMsg('Pengajuan langganan kamu masih menunggu verifikasi.');return;}
      all.unshift({id:String(Date.now()),name:session.name,email:session.email,plan:'Premium bulanan',price:10000,status:'Menunggu',date:new Date().toLocaleDateString('id-ID')});write(subKey,all);toastMsg('Pengajuan langganan dikirim.');renderSubscriptionPage();
    });
  }
  renderSubscriptionPage();

  // Admin dashboard: cancellation/deletion, due date and estimated late fine, membership approvals.
  function fineFor(r){
    if(!r.dueDate||r.status==='Dibatalkan')return 0;
    const due=new Date(r.dueDate), end=(r.status==='Dikembalikan'&&r.returnedAt)?new Date(r.returnedAt):new Date();
    return end>due?Math.ceil((end-due)/86400000)*(Number(r.finePerDay)||FINE_PER_DAY):0;
  }
  function renderEnhancedAdmin(){
    if(!isAdminPage||session?.role!=='admin')return;
    const rows=read(borrowStoreKey,[]), tbody=$('#borrowTableBody');if(!tbody)return;
    const q=($('#adminSearch')?.value||'').toLowerCase(), status=$('#statusFilter')?.value||'Semua';
    const shown=rows.filter(r=>(`${r.name} ${r.book} ${r.phone} ${r.email||''}`).toLowerCase().includes(q)&&(status==='Semua'||r.status===status));
    tbody.innerHTML=shown.length?shown.map(r=>{
      const due=r.dueDate?new Date(r.dueDate).toLocaleDateString('id-ID'):'—', fine=fineFor(r);
      return `<tr><td><strong>${esc(r.name)}</strong><small>${esc(r.phone||'')}</small><small>${esc(r.email||'')}</small></td><td>${esc(r.book)}<small>${esc(r.type)}</small></td><td>${esc(r.date||'—')}<small>Jatuh tempo: ${due}</small></td><td><span class="status">${esc(r.status)}</span></td><td><select aria-label="Ubah status" data-status-id="${esc(r.id)}"><option ${r.status==='Menunggu'?'selected':''}>Menunggu</option><option ${r.status==='Disetujui'?'selected':''}>Disetujui</option><option ${r.status==='Dikembalikan'?'selected':''}>Dikembalikan</option><option ${r.status==='Dibatalkan'?'selected':''}>Dibatalkan</option></select></td><td><strong>${money(fine)}</strong></td><td><button class="delete-borrow-btn" data-delete-id="${esc(r.id)}">Hapus</button></td></tr>`;
    }).join(''):'<tr><td colspan="7" class="table-empty">Belum ada data peminjaman.</td></tr>';
    $('#statTotal')&&($('#statTotal').textContent=books.length);$('#statBorrow')&&($('#statBorrow').textContent=rows.length);$('#statWaiting')&&($('#statWaiting').textContent=rows.filter(r=>r.status==='Menunggu').length);$('#statUsers')&&($('#statUsers').textContent=new Set(rows.map(r=>r.email||r.phone)).size);
    let panel=$('#subscriptionAdminPanel');if(!panel){panel=document.createElement('section');panel.id='subscriptionAdminPanel';panel.className='admin-panel subscription-admin-panel';$('.admin-panel')?.after(panel);}
    const subs=read(subKey,[]);panel.innerHTML=`<h3>Pengajuan Langganan</h3><div class="table-wrap"><table class="borrow-table"><thead><tr><th>Anggota</th><th>Paket</th><th>Harga</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${subs.length?subs.map(s=>`<tr><td>${esc(s.name)}<small>${esc(s.email)}</small></td><td>${esc(s.plan)}</td><td>${money(s.price)}</td><td>${esc(s.date)}</td><td>${esc(s.status)}</td><td><button class="approve-sub-btn" data-sub-id="${esc(s.id)}">Aktifkan</button> <button class="delete-borrow-btn" data-sub-delete="${esc(s.id)}">Hapus</button></td></tr>`).join(''):'<tr><td colspan="6">Belum ada pengajuan langganan.</td></tr>'}</tbody></table></div>`;
    tbody.querySelectorAll('[data-status-id]').forEach(sel=>sel.addEventListener('change',()=>{
      const all=read(borrowStoreKey,[]),r=all.find(x=>String(x.id)===sel.dataset.statusId);if(r){r.status=sel.value;if(sel.value==='Disetujui'){r.approvedAt=new Date().toISOString();const due=new Date(r.approvedAt);due.setDate(due.getDate()+LOAN_DAYS);r.dueDate=due.toISOString();}if(sel.value==='Dikembalikan')r.returnedAt=new Date().toISOString();write(borrowStoreKey,all);renderEnhancedAdmin();}
    }));
    tbody.querySelectorAll('[data-delete-id]').forEach(btn=>btn.addEventListener('click',()=>{
      const r=read(borrowStoreKey,[]).find(x=>String(x.id)===btn.dataset.deleteId);if(!r)return;
      if(!confirm(`Hapus/batalkan data pinjaman ${r.book} atas nama ${r.name}?`))return;
      write(borrowStoreKey,read(borrowStoreKey,[]).filter(x=>String(x.id)!==btn.dataset.deleteId));renderEnhancedAdmin();
    }));
    panel.querySelectorAll('[data-sub-id]').forEach(btn=>btn.addEventListener('click',()=>{const all=read(subKey,[]);const s=all.find(x=>String(x.id)===btn.dataset.subId);if(s){s.status='Aktif';s.activatedAt=new Date().toISOString();const expiry=new Date(s.activatedAt);expiry.setDate(expiry.getDate()+30);s.expiresAt=expiry.toISOString();write(subKey,all);renderEnhancedAdmin();}}));
    panel.querySelectorAll('[data-sub-delete]').forEach(btn=>btn.addEventListener('click',()=>{if(confirm('Hapus pengajuan langganan ini?')){write(subKey,read(subKey,[]).filter(x=>String(x.id)!==btn.dataset.subDelete));renderEnhancedAdmin();}}));
  }
  if(isAdminPage){
    const head=$('.borrow-table thead tr');if(head)head.innerHTML='<th>Peminjam</th><th>Buku</th><th>Tanggal / Jatuh Tempo</th><th>Status</th><th>Perbarui Status</th><th>Estimasi Denda</th><th>Aksi</th>';
    if(session?.role==='admin')renderEnhancedAdmin();
    $('#adminSearch')?.addEventListener('input',renderEnhancedAdmin);$('#statusFilter')?.addEventListener('change',renderEnhancedAdmin);
  }
  // Add subscription link to desktop menu and mobile bottom navigation.
  const nav=$('#navMenu');if(nav&&!nav.querySelector('a[href="langganan.html"]')){const a=document.createElement('a');a.href='langganan.html';a.textContent='Langganan';nav.appendChild(a);}
  const mobile=$('.mobile-bottom-nav');if(mobile){const a=document.createElement('a');a.href='langganan.html';a.innerHTML='<span class="mobile-nav-icon">✦</span><span>Premium</span>';mobile.appendChild(a);mobile.style.gridTemplateColumns='repeat(5,1fr)';}
  // Re-run admin rendering when login state becomes available.
  window.addEventListener('storage',()=>{if(isAdminPage)renderEnhancedAdmin();});
})();
