
//change password

document.addEventListener('DOMContentLoaded', () => {
    const changeBtn = document.getElementById('change-pass-btn');
    const modal = document.getElementById('change-pass-modal');
    const closeBtn = document.getElementById('close-pass-modal');
    const submitBtn = document.getElementById('submit-pass-change');
    const msg = document.getElementById('pass-msg');

    if (!changeBtn || !modal) return;

    changeBtn.addEventListener('click', () => modal.style.display = 'block');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', e => { if(e.target === modal) modal.style.display = 'none'; });

    submitBtn.addEventListener('click', async () => {
        const username = document.getElementById('username-pass').value.trim();
        const newPass = document.getElementById('new-pass').value.trim();

        if(!username || !newPass) {
            msg.textContent = "Please enter both username and new password.";
            return;
        }

        try {
            const response = await fetch('data/users.json');
            if(!response.ok) throw new Error("Failed to load users.json");

            const users = await response.json();
            const user = users.find(u => u.username === username);

            if(!user) {
                msg.textContent = "Username not found.";
                return;
            }

            localStorage.setItem(`pw_${user.email}`, newPass);
            msg.style.color = 'green';
            msg.textContent = "Password successfully updated!";
            setTimeout(() => modal.style.display = 'none', 1500);

        } catch(err) {
            console.error(err);
            msg.textContent = "Error updating password.";
        }
    });
});



