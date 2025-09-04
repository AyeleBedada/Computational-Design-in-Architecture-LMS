const FORUM = {
    post: (pageId, message) => {
        if (!message) return;
        const key = `forum_${pageId}`;
        const posts = JSON.parse(localStorage.getItem(key)) || [];
        posts.push({ user: localStorage.getItem(SESSION_USER), text: message, date: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(posts));
        FORUM.render(pageId);
    },
    render: (pageId) => {
        const key = `forum_${pageId}`;
        const posts = JSON.parse(localStorage.getItem(key)) || [];
        const container = document.getElementById(`${pageId}-forum-messages`);
        if (!container) return;
        container.innerHTML = posts.map(p => `<p><strong>${p.user}</strong>: ${p.text}</p>`).join('');
    }
};
