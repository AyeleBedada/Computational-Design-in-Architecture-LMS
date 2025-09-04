const SESSION_KEY = 'SESSION_USER';

const AUTH = {
    login: async (email, password) => {
        const res = await fetch('../data/users.json');
        const users = await res.json();
        const localPw = localStorage.getItem(`pw_${email}`);
        const user = users.find(u => u.email === email && (u.password === password || localPw === password));
        if (user) {
            localStorage.setItem(SESSION_KEY, user.username);
            localStorage.setItem('SESSION_ROLE', user.role);
            localStorage.setItem('SESSION_NAME', user.name);
            return true;
        }
        return false;
    },
    logout: () => {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem('SESSION_ROLE');
        localStorage.removeItem('SESSION_NAME');
        window.location.href = '../index.html';
    },
    changePassword: (email, newPassword) => {
        localStorage.setItem(`pw_${email}`, newPassword);
        alert('Password updated locally.');
    },
    getCurrentUser: () => localStorage.getItem(SESSION_KEY),
    renderChrome: (page) => {
        if (!AUTH.getCurrentUser() && page !== 'index') {
            window.location.href = '../index.html';
        }
    }
};
