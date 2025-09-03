/* js/auth.js
   Handles:
   - login via users.json (fallback local)
   - email/code verification via EmailJS
   - password change flow that sends code via EmailJS
   - session persistence using localStorage and Firestore user doc

   Cautions:
   - For real security, do server-side authentication. This is a GitHub Pages friendly client-side approach.
*/

(function(){
  const serviceID = 'service_ozngnh9';
  const templateID = 'template_c6pl9c9';
  const usersPath = 'data/users.json';

  // helper: fetch users.json and cache
  async function loadUsers(){
    const r = await fetch(usersPath, {cache: "no-store"});
    const arr = await r.json();
    return arr;
  }

  // utilities
  function findUserByEmail(users, email){ return users.find(u => u.email.toLowerCase() === email.toLowerCase()); }

  // generate 6-digit code
  function genCode(){ return Math.floor(100000 + Math.random()*900000).toString(); }

  // store code in localStorage temporarily with expiry (10min)
  function storeCode(email, code){
    const obj = {code, expires: Date.now() + 10*60*1000};
    localStorage.setItem('auth_code:'+email, JSON.stringify(obj));
  }
  function verifyCode(email, code){
    try {
      const v = JSON.parse(localStorage.getItem('auth_code:'+email));
      if(!v) return false;
      if(Date.now() > v.expires) return false;
      return v.code === code;
    } catch(e){ return false; }
  }

  // send email via EmailJS (client-side)
  async function sendMail(toEmail, subject, message){
    if(!window.emailjs) throw new Error('EmailJS not loaded');
    return emailjs.send(serviceID, templateID, {
      to_email: toEmail,
      subject,
      message
    });
  }

  // set current user (global)
  function setCurrentUser(user){
    window.currentUser = user;
    localStorage.setItem('cd_user', JSON.stringify(user));
  }
  function clearCurrentUser(){
    window.currentUser = null;
    localStorage.removeItem('cd_user');
  }

  // persistent session restore (simple)
  (function restore(){ const raw = localStorage.getItem('cd_user'); if(raw){ try{ window.currentUser = JSON.parse(raw); }catch(e){ window.currentUser=null; } }} )();

  // DOM interactions on index page
  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    const loginFeedback = document.getElementById('loginFeedback');
    const forgotLink = document.getElementById('forgotLink');

    async function show(msg, isErr=false){ loginFeedback.textContent = msg; loginFeedback.style.color = isErr ? 'var(--danger)' : 'var(--muted)'; }

    sendCodeBtn && sendCodeBtn.addEventListener('click', async () => {
      const email = document.getElementById('email').value.trim();
      if(!email){ show('Enter your email first', true); return; }
      try{
        const users = await loadUsers();
        const u = findUserByEmail(users, email);
        if(!u){ show('Email not found in user list', true); return; }
        const code = genCode();
        storeCode(email, code);
        // send the code using EmailJS template
        await sendMail(email, 'Your login code', `Your login code is ${code}. It expires in 10 minutes.`);
        show('Login code sent to your email.');
      } catch(e){
        console.error(e);
        show('Failed to send code. Check network and EmailJS config.', true);
      }
    });

    loginForm && loginForm.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      if(!email || !password){ show('Enter email and password', true); return; }

      try{
        const users = await loadUsers();
        const u = findUserByEmail(users, email);
        if(!u){ show('Invalid credentials', true); return; }
        // for login, we require a code verification step: user must have received code and entered it as their password OR use the stored password
        // to allow both: if user typed correct password, proceed; otherwise treat password as code
        if(password === u.password){
          // success
          setCurrentUser(u);
          show('Logged in. Redirecting...');
          // create a Firestore user doc for persistence if not exists
          try{
            const docRef = window.db.collection('users').doc(u.email);
            const doc = await docRef.get();
            if(!doc.exists){
              await docRef.set({ email: u.email, name: u.name, role: u.role, progress: 0, quizzes: {}, updatedAt: Date.now() });
            } else {
              // merge role/name if missing
              await docRef.set({ name:u.name, role:u.role }, { merge: true });
            }
          }catch(e){ console.warn('Firestore error', e); }
          // redirect to first protected page
          setTimeout(()=> location.href = 'Unit-0-[Course Introduction]/0_quiz_0.html', 700);
          return;
        } else {
          // maybe they entered code
          const codeOk = verifyCode(email, password);
          if(codeOk){
            setCurrentUser(u);
            show('Code verified. Logged in.');
            // ensure Firestore user exists
            try{ await window.db.collection('users').doc(u.email).set({ email: u.email, name: u.name, role: u.role, progress: 0 }, { merge:true }); }catch(e){}
            setTimeout(()=> location.href = 'Unit-0-[Course Introduction]/0_quiz_0.html', 700);
            return;
          } else {
            show('Invalid password or code.', true);
            return;
          }
        }
      } catch(err){
        console.error(err);
        show('Login failed due to network or server error.', true);
      }
    });

    // Password change flow
    forgotLink && forgotLink.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      if(!email){ show('Enter your email to reset password', true); return; }
      try{
        const users = await loadUsers();
        const u = findUserByEmail(users, email);
        if(!u){ show('Email not found', true); return; }
        const code = genCode();
        storeCode(email, code);
        await sendMail(email, 'Your password reset code', `Your password reset code is ${code}. It expires in 10 minutes. Use it as the password on login to set a new password.`);
        show('Password reset code sent to your email. Log in with the code and then set a new password on your profile.');
      } catch(e){
        console.error(e);
        show('Failed to send reset code.', true);
      }
    });

    // Initialize currentUser from localStorage into window for other scripts
    if(window.currentUser){ window.currentUser = window.currentUser; }
  });
})();
