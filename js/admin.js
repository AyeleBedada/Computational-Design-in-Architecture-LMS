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
