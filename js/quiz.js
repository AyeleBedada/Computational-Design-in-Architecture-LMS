const Quiz = {
    initQuizPage: (container, quizKey) => {
        const quizData = JSON.parse(localStorage.getItem(quizKey)) || [];
        container.innerHTML = quizData.map((q, i) => `
            <div class="question">
                <p>${i+1}. ${q.question}</p>
                ${q.options.map((o, idx) => `<label><input type="radio" name="q${i}" value="${idx}"> ${o}</label>`).join('')}
            </div>
        `).join('');
        container.insertAdjacentHTML('beforeend', `<button onclick="Quiz.submit('${quizKey}', '${container.id}')">Submit</button>`);
    },
    submit: (quizKey, containerId) => {
        const container = document.getElementById(containerId);
        const quizData = JSON.parse(localStorage.getItem(quizKey));
        let score = 0;
        quizData.forEach((q, i) => {
            const selected = container.querySelector(`input[name=q${i}]:checked`);
            if (selected && parseInt(selected.value) === q.answer) score += q.weight || 1;
        });
        localStorage.setItem('GLOBAL_SCORE', score);
        alert(`You scored ${score}`);
        UIProgress.updateAllProgress(score, quizData.length);
    }
};
