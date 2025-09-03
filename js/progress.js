/* js/progress.js
   Handles global progress UI (linear, circular stub, stepped)
   Displays checkmarks as steps complete.
*/
(function(){
  function renderProgressWidget(){
    const main = document.querySelector('.main') || document.body;
    const wrapper = document.createElement('div');
    wrapper.className = 'card';
    wrapper.style.marginBottom = '12px';
    wrapper.innerHTML = `
      <h4>My Progress</h4>
      <div id="globalProgressBar" class="progress-bar" style="height:18px"><i id="globalProgressFill"></i></div>
      <div style="display:flex;gap:8px;margin-top:8px" id="stepper"></div>
    `;
    main.prepend(wrapper);

    // stepper items (pages in order)
    const steps = ['Unit0','1.1','1.2','2.1','3.1','4.1','Final'];
    const stepper = wrapper.querySelector('#stepper');
    steps.forEach((s,i)=>{
      const it = document.createElement('div');
      it.style.minWidth = '80px';
      it.style.padding = '8px';
      it.style.background = '#fff';
      it.style.border = '1px solid #eef3fb';
      it.style.borderRadius = '8px';
      it.id = 'step_'+s;
      it.innerHTML = `<div style="font-size:12px">${s}</div><div class="muted" id="stepchk_${s}">○</div>`;
      stepper.appendChild(it);
    });
  }

  async function updateProgress(){
    const fill = document.getElementById('globalProgressFill');
    if(!fill) return;
    let progress = 0;
    try{
      if(window.currentUser && window.currentUser.email){
        const doc = await window.db.collection('users').doc(window.currentUser.email).get();
        if(doc.exists){
          const data = doc.data();
          progress = data.progress || 0;
          const visited = data.visitedPages || {};
          // assign step checkmarks if visited any page mapping
          const map = {
            'Unit0': '0_quiz_0',
            '1.1': '1.1.1_introduction_Computational_Design',
            '1.2': '1.2_handles_Manipulators',
            '2.1': '2.1_contemporary_Geometries',
            '3.1': '3.1_digital_fabrication',
            '4.1': '4.1_introduction_BIM',
            'Final': 'final_project'
          };
          for(const step in map){
            const chk = document.getElementById('stepchk_'+step);
            if(!chk) continue;
            if(visited[map[step]]) chk.textContent = '✔'; else chk.textContent = '○';
          }
        }
      } else {
        // guest
        progress = parseInt(localStorage.getItem('guest_progress') || '0');
      }
    }catch(e){ console.warn(e); }
    fill.style.width = Math.min(100,progress) + '%';
    const lbl = document.querySelector('#globalProgressFill').parentElement.nextElementSibling;
    if(lbl) lbl.textContent = `Global progress: ${Math.round(progress)}%`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderProgressWidget();
    updateProgress();
    // poll progress periodically
    setInterval(updateProgress, 5000);
  });

  // expose small API
  window.updateGlobalProgress = updateProgress;
})();
