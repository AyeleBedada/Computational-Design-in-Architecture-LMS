/* js/forum.js
   Simple forum using Firestore, per-page threads.
   Exposes forumMount(container)
*/
(function(){
  async function submitPost(pageId, user, text){
    if(!user) throw new Error('login required');
    const collection = window.db.collection('forums').doc(pageId).collection('posts');
    await collection.add({
      userEmail: user.email,
      name: user.name,
      text,
      createdAt: Date.now()
    });
  }

  async function loadPosts(pageId, container){
    container.innerHTML = '<p class="muted">Loading forum...</p>';
    const postsRef = window.db.collection('forums').doc(pageId).collection('posts').orderBy('createdAt','desc');
    postsRef.get().then(snapshot => {
      container.innerHTML = '';
      snapshot.forEach(doc => {
        const d = doc.data();
        const box = document.createElement('div');
        box.className = 'post card';
        box.innerHTML = `<div class="meta">${d.name} • ${new Date(d.createdAt).toLocaleString()}</div><div>${d.text}</div>`;
        container.appendChild(box);
      });
    });
  }

  // live listener
  function attachRealtime(pageId, container){
    const postsRef = window.db.collection('forums').doc(pageId).collection('posts').orderBy('createdAt','desc');
    postsRef.onSnapshot(snapshot => {
      container.innerHTML = '';
      snapshot.forEach(doc => {
        const d = doc.data();
        const box = document.createElement('div');
        box.className = 'post card';
        box.innerHTML = `<div class="meta">${d.name} • ${new Date(d.createdAt).toLocaleString()}</div><div>${d.text}</div>`;
        container.appendChild(box);
      });
    });
  }

  window.forumMount = function(container){
    container.innerHTML = '';
    const mount = document.createElement('div');
    mount.className = 'forum card';
    mount.innerHTML = `
      <h4>Discussion</h4>
      <textarea id="forumText" placeholder="Write a post..."></textarea>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button id="forumPostBtn">Post</button>
      </div>
      <div id="forumPosts" style="margin-top:12px"></div>
    `;
    container.appendChild(mount);
    const postsContainer = mount.querySelector('#forumPosts');

    // attach realtime if possible
    try{
      attachRealtime(window.PAGE.id, postsContainer);
    }catch(e){
      loadPosts(window.PAGE.id, postsContainer);
    }

    mount.querySelector('#forumPostBtn').addEventListener('click', async () => {
      const txtEl = mount.querySelector('#forumText');
      const txt = txtEl.value.trim();
      if(!txt){ alert('Enter text'); return; }
      if(!window.currentUser){ alert('Please login'); return; }
      try{
        await submitPost(window.PAGE.id, window.currentUser, txt);
        txtEl.value = '';
      }catch(e){
        console.error(e); alert('Failed to post - check network');
      }
    });
  };
})();
