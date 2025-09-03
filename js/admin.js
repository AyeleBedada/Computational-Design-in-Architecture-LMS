/* js/admin.js
   Admin controls and CSV export
*/
document.addEventListener('DOMContentLoaded', async () => {
  // ensure admin
  const cu = JSON.parse(localStorage.getItem('cd_user') || 'null');
  if(!cu || cu.role !== 'admin'){ document.body.innerHTML = '<div class="card" style="padding:24px"><h3>Access denied</h3><p>Administrator access required.</p></div>'; return; }

  const studentFilter = document.getElementById('studentFilter');
  const reportTableBody = document.querySelector('#reportTable tbody');
  const exportCSV = document.getElementById('exportCSV');
  const toggleAll = document.getElementById('toggleAllQuizzes');

  async function loadStudents(){
    const snap = await window.db.collection('users').get();
    studentFilter.innerHTML = '<option value="">All</option>';
    reportTableBody.innerHTML = '';
    snap.forEach(doc => {
      const d = doc.data();
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${d.email}</td><td>${d.name||''}</td><td>${d.progress||0}</td><td>${d.updatedAt?new Date(d.updatedAt).toLocaleString():''}</td>`;
      reportTableBody.appendChild(tr);
      const opt = document.createElement('option'); opt.value = d.email; opt.textContent = d.name || d.email;
      studentFilter.appendChild(opt);
    });
  }

  studentFilter.addEventListener('change', async () => {
    const email = studentFilter.value;
    const snap = email ? await window.db.collection('users').doc(email).get() : await window.db.collection('users').get();
    reportTableBody.innerHTML = '';
    if(email){
      const d = snap.exists ? snap.data() : null;
      if(d) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${d.email}</td><td>${d.name||''}</td><td>${d.progress||0}</td><td>${d.updatedAt?new Date(d.updatedAt).toLocaleString():''}</td>`;
        reportTableBody.appendChild(tr);
      }
    } else {
      snap.forEach(doc => {
        const d = doc.data();
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${d.email}</td><td>${d.name||''}</td><td>${d.progress||0}</td><td>${d.updatedAt?new Date(d.updatedAt).toLocaleString():''}</td>`;
        reportTableBody.appendChild(tr);
      });
    }
  });

  exportCSV.addEventListener('click', async () => {
    const snap = await window.db.collection('users').get();
    const rows = [];
    snap.forEach(doc => {
      const d = doc.data();
      rows.push({ email: d.email, name: d.name || '', progress: d.progress || 0, updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : '' });
    });
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'students_report.csv';
    a.click(); URL.revokeObjectURL(url);
  });

  toggleAll.addEventListener('click', async () => {
    // simple toggle: set a flag in config doc
    const conf = await window.db.collection('admin').doc('config').get();
    const current = conf.exists ? conf.data().quizzesOpen : true;
    await window.db.collection('admin').doc('config').set({ quizzesOpen: !current }, { merge: true });
    alert(`Quizzes are now ${!current ? 'open' : 'closed'}`);
  });

  // initial load
  await loadStudents();
  // listen for updates
  window.db.collection('users').onSnapshot(loadStudents);
});
