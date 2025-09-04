const Quiz = {
    initQuizPage: (container, quizKey) => {
        const quizData = JSON.parse(localStorage.getItem(quizKey)) || [];
        const session = AUTH.getSession();
        const username = session ? session.username : 'guest';

        container.innerHTML = quizData.map((q, i) => `
            <div class="question">
                <p>${i + 1}. ${q.question}</p>
                ${q.options.map((o, idx) => `
                    <label class="option" data-correct="${idx === q.answer}">
                        <input type="radio" name="q${i}" value="${idx}"> ${o}
                    </label>
                `).join('')}
            </div>
        `).join('');

        container.insertAdjacentHTML('beforeend', `<button id="quiz-submit-btn">Submit</button>`);

        document.getElementById('quiz-submit-btn').addEventListener('click', () => {
            Quiz.submit(quizKey, container.id, username);
        });
    },

    submit: (quizKey, containerId, username) => {
        const container = document.getElementById(containerId);
        const quizData = JSON.parse(localStorage.getItem(quizKey)) || [];
        let score = 0;

        quizData.forEach((q, i) => {
            const selected = container.querySelector(`input[name=q${i}]:checked`);
            const optionEls = container.querySelectorAll(`input[name=q${i}]`);
            
            optionEls.forEach(opt => {
                const parent = opt.closest('.option');
                parent.classList.remove('correct', 'incorrect');
                if (parseInt(opt.value) === q.answer) parent.classList.add('correct');
            });

            if (selected && parseInt(selected.value) === q.answer) score += q.weight || 1;
            else if (selected) selected.closest('.option').classList.add('incorrect');
        });

        // Save attempts and best score per user
        const attemptsKey = `attempts_${quizKey}_${username}`;
        const bestScoreKey = `best_${quizKey}_${username}`;
        let attempts = parseInt(localStorage.getItem(attemptsKey)) || 0;
        attempts++;
        localStorage.setItem(attemptsKey, attempts);

        const prevBest = parseInt(localStorage.getItem(bestScoreKey)) || 0;
        if (score > prevBest) localStorage.setItem(bestScoreKey, score);

        alert(`You scored ${score}/${quizData.length}. Attempt #${attempts}. Best: ${Math.max(score, prevBest)}`);

        // Update progress bars
        UIProgress.updateAllProgress(score, quizData.length);
    }
};
