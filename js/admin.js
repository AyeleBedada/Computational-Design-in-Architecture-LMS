
document.addEventListener('DOMContentLoaded', () => {
    const session = AUTH.getSession();
    if(!session || session.role !== 'admin') return alert('Access denied: Admin only.');

    const reportsEl = document.getElementById('adminReports');
    const csvExportBtn = document.getElementById('exportCSV');
    const quizToggleEls = document.querySelectorAll('.quiz-toggle');

    function renderReports(){
        const reports = AUTH.getReports();
        if(!reportsEl) return;
        reportsEl.innerHTML = reports.length ? reports.map(rep =>
            `<div class="report-item">
                <strong>${rep.email}</strong> — ${rep.quizId} — Attempt ${rep.attempt} — Score: ${rep.score}% — Best: ${rep.best}%
            </div>`).join('') : '<div>No reports yet</div>';
    }

    function exportCSV(){
        const reports = AUTH.getReports();
        const csvRows = ['Email,Quiz,Attempt,Score,Best,Timestamp'];
        reports.forEach(r => {
            csvRows.push([r.email, r.quizId, r.attempt, r.score, r.best, new Date(r.ts).toLocaleString()].join(','));
        });
        const blob = new Blob([csvRows.join('\n')], {type:'text/csv'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lms_reports.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    csvExportBtn?.addEventListener('click', exportCSV);
    renderReports();

    // Quiz availability toggles
    quizToggleEls.forEach(el => {
        const quizId = el.dataset.quiz;
        const open = AUTH.getQuizOpen();
        el.checked = !!open[quizId];
        el.addEventListener('change', () => {
            open[quizId] = el.checked;
            AUTH.setQuizOpen(open);
        });
    });
});


const Admin = {
    renderDashboard: () => {
        const container = document.getElementById('admin-dashboard');
        if (!container) return;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        container.innerHTML = users.map(u => {
            const score = localStorage.getItem(`score_${u.username}`) || 0;
            return `<tr>
                <td>${u.username}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
                <td>${score}</td>
            </tr>`;
        }).join('');
    },
    exportCSV: () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        let csv = 'Username,Email,Role,Score\n';
        users.forEach(u => {
            const score = localStorage.getItem(`score_${u.username}`) || 0;
            csv += `${u.username},${u.email},${u.role},${score}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'users_report.csv';
        link.click();
    },
    toggleQuiz: (quizKey, active) => {
        localStorage.setItem(`quiz_active_${quizKey}`, active ? '1' : '0');
        alert(`Quiz ${quizKey} is now ${active ? 'active' : 'inactive'}`);
    }
};
