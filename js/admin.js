document.addEventListener('DOMContentLoaded', () => {
    const session = AUTH.getSession();
    if(!session || session.role !== 'admin') return alert('Access denied: Admin only.');

    const reportsEl = document.getElementById('adminReports');
    const csvExportBtn = document.getElementById('exportCSV');
    const txtExportBtn = document.getElementById('exportTXT');
    const quizToggleEls = document.querySelectorAll('.quiz-toggle');
    const chartCanvas = document.getElementById('adminChart');

    function renderReports() {
        const reports = AUTH.getReports();
        if(!reportsEl) return;
        reportsEl.innerHTML = reports.length ? reports.map(rep =>
            `<div class="report-item">
                <strong>${rep.email}</strong> — ${rep.quizId} — Attempt ${rep.attempt} — Score: ${rep.score}% — Best: ${rep.best}%
            </div>`).join('') : '<div>No reports yet</div>';
    }

    function exportCSV() {
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

    function exportTXT() {
        const reports = AUTH.getReports();
        const txtRows = reports.map(r => `${r.email} | ${r.quizId} | Attempt ${r.attempt} | Score ${r.score} | Best ${r.best} | ${new Date(r.ts).toLocaleString()}`);
        const blob = new Blob([txtRows.join('\n')], {type:'text/plain'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lms_reports.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    function renderChart() {
        if(!chartCanvas) return;
        const reports = AUTH.getReports();
        const quizMap = {};

        reports.forEach(r => {
            if(!quizMap[r.quizId]) quizMap[r.quizId] = [];
            quizMap[r.quizId].push(r.score);
        });

        const labels = Object.keys(quizMap);
        const avgScores = labels.map(q => {
            const scores = quizMap[q];
            return Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
        });

        new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Average Score (%)',
                    data: avgScores,
                    backgroundColor: '#2ea15a'
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero:true, max:100 } }
            }
        });
    }

    csvExportBtn?.addEventListener('click', exportCSV);
    txtExportBtn?.addEventListener('click', exportTXT);
    renderReports();
    renderChart();

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
