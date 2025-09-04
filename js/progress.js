

const UIProgress = {
    updateAllProgress: (currentPoints, totalPoints) => {
        const percent = (currentPoints / totalPoints) * 100;

        // Linear progress
        document.querySelectorAll('.progress-fill').forEach(fill => fill.style.width = percent + '%');

        // Stepped progress
        const steps = document.querySelectorAll('.step');
        const completedSteps = Math.round((percent / 100) * steps.length);
        steps.forEach((step, idx) => {
            step.classList.toggle('completed', idx < completedSteps);
        });

        // Circular progress
        document.querySelectorAll('.circular-progress').forEach(cp => {
            const circle = cp.querySelector('.progress');
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percent / 100) * circumference;
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = offset;
        });
    }
};


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
