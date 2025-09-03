/* js/quiz.js
   Shared quiz engine used by page-specific quiz files.
   - Expects window.PAGE.meta: id, title, quizWeightPct, quizAttemptsAllowed
   - Expects a per-page questions array injected by page JS files: window.QUESTIONS
   - Uses Firestore to save attempts per user and updates global progress
*/

(function(){
  // utilities
  function el(tag, cls){ const d = document.createElement(tag); if(cls) d.className = cls; return d; }

  function renderUI() {
    const root = document.getElementById('app-root');
    root.innerHTML = '';

    // inject sidebar & topbar for authenticated users
    const sb = el('nav','sidebar card');
    sb.innerHTML = `
      <h3>Course</h3>
      <ul>
        <li><a href="../index.html">Home</a></li>
        <li><a href="../Unit-0-[Course Introduction]/0_quiz_0.html">Unit 0</a></li>
        <li><a href="../Unit-1-[Computational Design in Architecture]/1.1_[Introduction to Computational Design]/1.1.1_introduction_Computational_Design.html">1.1.1</a></li>
        <li><a href="../Unit-1-[Computational Design in Architecture]/1.2_handles_Manipulators.html">1.2</a></li>
        <li><a href="../Unit-2-[Topological Design Process and Form Finding]/2.1_contemporary_Geometries.html">2.1</a></li>
        <li><a href="../Unit-3-[Digital and analog fabrication Techniques]/3.1_digital_fabrication.html">3.1</a></li>
        <li><a href="../Unit-4-[Building Iniformation Modeling (BIM)]/4.1_introduction_BIM.html">4.1</a></li>
        <li><a href="../final_project.html">Final Project</a></li>
        <li><a href="../complete.html">Complete</a></li>
      </ul>
      <hr/>
      <div style="font-size:12px;color:var(--muted)">Logged as: ${window.currentUser ? window.currentUser.name : 'Guest'}</div>
    `;
    const top = el('header','topbar card');
    top.innerHTML = `<div><strong>${window.PAGE.title}</strong></div><div><button id="logoutBtn">Logout</button></div>`;

    const main = el('main','main');
    main.innerHTML = `
      <section class="card content">
        <h2>${window.PAGE.title}</h2>
        <p class="muted">Lesson plan, learning objectives, and quiz below.</p>
        <div id="quizArea"></div>
        <div id="liveProgress" style="margin-top:12px"></div>
        <div id="forum-container" style="margin-top:18px"></div>
      </section>
    `;

    document.body.prepend(sb);
    document.body.prepend(top);
    document.body.appendChild(main);

    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('cd_user');
      location.href = '../index.html';
    });
  }

  // quiz logic
  async function mountQuiz() {
    renderUI();
    const quizArea = document.getElementById('quizArea');
    if(!window.currentUser) {
      quizArea.innerHTML = '<p class="muted">Please login to take the quiz.</p>';
      return;
    }

    const attemptsRef = window.db.collection('attempts').doc(`${window.PAGE.id}_${window.currentUser.email}`);
    const attemptsDoc = await attemptsRef.get();
    const attemptsData = attemptsDoc.exists ? attemptsDoc.data() : { attempts: [] };
    const attemptsLeft = (window.PAGE.quizAttemptsAllowed || 3) - attemptsData.attempts.length;
    const info = el('div','muted');
    info.textContent = `Attempts left: ${attemptsLeft}`;
    quizArea.appendChild(info);

    if(attemptsLeft <= 0){
      quizArea.innerHTML += '<p class="danger">No attempts left for this quiz.</p>';
      return;
    }

    const form = el('div');
    window.QUESTIONS = window.QUESTIONS || [];
    window.QUESTIONS.forEach((q, idx) => {
      const qbox = el('div','quiz-q');
      qbox.innerHTML = `<strong>Q${idx+1}.</strong> ${q.q}`;
      const opts = el('div','quiz-opts');
      q.options.forEach((opt, oi) => {
        const id = `q${idx}_o${oi}`;
        const label = el('label');
        label.innerHTML = `<input type="radio" name="q${idx}" value="${oi}" id="${id}"> ${opt}`;
        opts.appendChild(label);
      });
      qbox.appendChild(opts);
      form.appendChild(qbox);
    });

    const submitBtn = el('button');
    submitBtn.textContent = 'Submit Quiz';
    submitBtn.className = 'btn';
    form.appendChild(submitBtn);
    quizArea.appendChild(form);

    // realtime live progress UI
    const liveProgress = document.getElementById('liveProgress');
    const progressBarWrap = document.createElement('div');
    progressBarWrap.innerHTML = `<div class="progress-bar" style="margin-top:8px"><i id="progressFill"></i></div><div class="muted" id="progressLabel">Progress: 0%</div>`;
    liveProgress.appendChild(progressBarWrap);

    // update live as user answers
    const total = window.QUESTIONS.length;
    const progressFill = document.getElementById('progressFill');
    const progressLabel = document.getElementById('progressLabel');
    function updateLive(){
      let answered = 0;
      for(let i=0;i<total;i++){
        const radios = document.querySelectorAll(`input[name=q${i}]`);
        if([...radios].some(r=>r.checked)) answered++;
      }
      const pct = Math.round((answered/total)*100);
      progressFill.style.width = pct + '%';
      progressLabel.textContent = `Answered: ${answered}/${total} (${pct}%)`;
    }
    form.addEventListener('change', updateLive);

    // on submit: evaluate, save attempt to Firestore, update overall progress
    submitBtn.addEventListener('click', async () => {
      // score count
      let correct = 0;
      const answers = [];
      for(let i=0;i<total;i++){
        const sel = document.querySelector(`input[name=q${i}]:checked`);
        const chosen = sel ? parseInt(sel.value) : null;
        answers.push({ chosen });
        if(chosen === window.QUESTIONS[i].ans) correct++;
      }
      // live feedback: mark each question
      const qboxes = document.querySelectorAll('.quiz-q');
      qboxes.forEach((box, i) => {
        box.style.borderColor = '#eef3fb';
        const sel = document.querySelector(`input[name=q${i}]:checked`);
        const chosen = sel ? parseInt(sel.value) : null;
        if(chosen === window.QUESTIONS[i].ans){
          box.style.boxShadow = '0 4px 10px rgba(16,185,129,0.08)';
          box.style.borderLeft = '6px solid var(--success)';
        } else {
          box.style.boxShadow = '0 4px 10px rgba(239,68,68,0.05)';
          box.style.borderLeft = '6px solid var(--danger)';
        }
      });

      const rawScore = correct;
      // Map raw score to weight percentage: Q count equals weight percent (like 14 questions -> 14%).
      const weightPct = window.PAGE.quizWeightPct || 0;
      // weightPct corresponds to number of percent points when full score.
      // compute earned percent contribution: (raw/total) * weightPct
      const contribution = (rawScore / total) * weightPct;
      const attempt = {
        user: window.currentUser.email,
        name: window.currentUser.name,
        quizId: window.PAGE.id,
        createdAt: Date.now(),
        correct: rawScore,
        total,
        contribution,
        answers
      };

      // save attempt
      await attemptsRef.set({ attempts: firebase.firestore.FieldValue.arrayUnion(attempt) }, { merge: true });

      // update user's global progress doc
      const userDoc = window.db.collection('users').doc(window.currentUser.email);
      const udoc = await userDoc.get();
      const udata = udoc.exists ? udoc.data() : { progress: 0, quizzes: {} };
      const newQuizzes = udata.quizzes || {};
      // store best attempt contribution for quiz
      const prev = newQuizzes[window.PAGE.id] ? newQuizzes[window.PAGE.id].contribution : 0;
      newQuizzes[window.PAGE.id] = { contribution: Math.max(prev, contribution), lastAttempt: Date.now() };

      // compute total progress: per spec the student gets 1% for visiting a page; we will combine stored visit bonuses and quiz contributions
      let pageBonus = udata.pageBonus || 0; // stored visits
      // recompute sum of quiz contributions across their saved quizzes
      let totalQuizContrib = 0;
      for(const k in newQuizzes){ totalQuizContrib += newQuizzes[k].contribution || 0; }
      const newProgress = Math.min(100, Math.round(pageBonus + totalQuizContrib));

      await userDoc.set({ quizzes: newQuizzes, progress: newProgress, updatedAt: Date.now(), pageBonus }, { merge: true });

      // notify admin via an admin collection
      await window.db.collection('reports').add({
        type: 'attempt',
        user: window.currentUser.email,
        quizId: window.PAGE.id,
        correct: rawScore,
        total,
        contribution,
        timestamp: Date.now(),
        name: window.currentUser.name
      });

      // show results summary
      const res = document.createElement('div');
      res.className = 'card';
      res.innerHTML = `<h3>Results</h3><p>Score: ${rawScore}/${total}. Quiz contribution: ${contribution.toFixed(2)}%.</p>`;
      quizArea.appendChild(res);

      // redirect to next page or update UI
      // increment attempt info
      const newAttempts = (await attemptsRef.get()).data();
      info.textContent = `Attempts left: ${(window.PAGE.quizAttemptsAllowed || 3) - (newAttempts.attempts?.length || 0)}`;

      // persist updated currentUser progress locally
      window.currentUser.progress = newProgress;
      localStorage.setItem('cd_user', JSON.stringify(window.currentUser));
    });

    // increment page visit bonus once (1% per page view) for user
    try{
      const userDoc = window.db.collection('users').doc(window.currentUser.email);
      const udoc = await userDoc.get();
      const udata = udoc.exists ? udoc.data() : {};
      // simple page visit tracker: if hasn't visited this page before, add 1%
      const visited = udata.visitedPages || {};
      if(!visited[window.PAGE.id]){
        visited[window.PAGE.id] = true;
        const pageBonus = (udata.pageBonus || 0) + 1;
        await userDoc.set({ visitedPages: visited, pageBonus, progress: firebase.firestore.FieldValue.increment(1) }, { merge: true });
        window.currentUser.progress = (window.currentUser.progress || 0) + 1;
        localStorage.setItem('cd_user', JSON.stringify(window.currentUser));
      }
    }catch(e){ console.warn('page bonus update failed', e); }
  } // mountQuiz()

  // create forum area
  async function mountForum() {
    // reused by forum.js; no-op here
  }

  // initialize when DOM ready
  document.addEventListener('DOMContentLoaded', async () => {
    if(!window.currentUser){
      // attempt to read local session (already set by auth.js)
      try{ window.currentUser = JSON.parse(localStorage.getItem('cd_user')); }catch(e){ window.currentUser = null; }
    }
    await mountQuiz();
    // mount forum
    if(window.forumMount) window.forumMount(document.getElementById('forum-container'));
  });
})();
