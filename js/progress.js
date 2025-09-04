const UIProgress = {
    updateAllProgress: (currentPoints, totalPoints) => {
        const percent = (currentPoints / totalPoints) * 100;
        const fills = document.querySelectorAll('.progress-fill');
        fills.forEach(fill => fill.style.width = percent + '%');
        
        const steps = document.querySelectorAll('.step');
        const completedSteps = Math.round((percent / 100) * steps.length);
        steps.forEach((step, idx) => {
            if (idx < completedSteps) step.classList.add('completed');
            else step.classList.remove('completed');
        });
    }
};
