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
        window.location.href = "index.html"; // redirect to login page
    },

    getSession: function() {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },

    // <<< NEW FUNCTION >>>
    renderChrome: function() {
        const session = AUTH.getSession();
        if(!session) return;

        // Render topnav
        const topnav = document.querySelector('.topnav');
        if(topnav){
            topnav.innerHTML = `
                <span>Welcome, ${session.name}</span>
                <div>
                    <a href="index.html" id="logout-btn">Logout</a>
                </div>
            `;
            document.getElementById('logout-btn').addEventListener('click', AUTH.logout);
        }

        // Render sidebar if exists
        const sidebar = document.querySelector('.sidebar');
        if(sidebar){
            sidebar.innerHTML = `
                <h2>Navigation</h2>
                <ul>
                    <li><a href="0_quiz_0.html">Unit 0</a></li>
                    <li><a href="1.1.1_introduction_Computational_Design.html">Unit 1.1.1</a></li>
                    <li><a href="1.2_handles_Manipulators.html">Unit 1.2</a></li>
                    <li><a href="2.1_contemporary_Geometries.html">Unit 2.1</a></li>
                    <li><a href="3.1_digital_fabrication.html">Unit 3.1</a></li>
                    <li><a href="4.1_introduction_BIM.html">Unit 4.1</a></li>
                    ${session.role === 'admin' ? '<li><a href="admin.html">Admin Dashboard</a></li>' : ''}
                </ul>
            `;
        }
    }
};
