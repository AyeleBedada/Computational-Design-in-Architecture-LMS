const SESSION_KEY = "lms_session";

const AUTH = {
    login: async function(email, password) {
        try {
            const response = await fetch("data/users.json");
            if(!response.ok) throw new Error("Failed to load users.json");
            const users = await response.json();
            const user = users.find(u => u.email === email);
            if(!user) return false;

            const storedPw = localStorage.getItem(`pw_${email}`);
            const validPw = storedPw ? storedPw : user.password;

            if(password === validPw) {
                localStorage.setItem(SESSION_KEY, JSON.stringify({
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    name: user.name
                }));
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error("AUTH.login error:", err);
            throw err;
        }
    },

    logout: function() {
        localStorage.removeItem(SESSION_KEY);
    },

    getSession: function() {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },

    getReports: function() {
        return JSON.parse(localStorage.getItem('reports')) || [];
    },

    saveReport: function(report) {
        const reports = AUTH.getReports();
        reports.push(report);
        localStorage.setItem('reports', JSON.stringify(reports));
    },

    getQuizOpen: function() {
        return JSON.parse(localStorage.getItem('quiz_open')) || {};
    },

    setQuizOpen: function(obj) {
        localStorage.setItem('quiz_open', JSON.stringify(obj));
    }
};
