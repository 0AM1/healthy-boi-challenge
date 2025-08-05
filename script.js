// Challenge tasks by week
const challengeTasks = {
    'week1-2': {
        diet: [
            'Drop alcohol and coffee',
            'Eat 1-2 beets or 250ml beet juice',
            'Eat 1 cup spinach',
            'Use 1 tsp grated ginger in water',
            'Eat bananas and oranges'
        ],
        exercise: ['Jog 20 minutes (3x/week)'],
        sleep: ['Sleep 7 hours on firm mattress', 'Track dizziness'],
        mindset: ['Expect headaches/grumpiness']
    },
    'week3-4': {
        diet: [
            'Continue beets, spinach, ginger',
            'Add 2 celery stalks',
            'Add 1 garlic clove',
            'Drink 2-3L water'
        ],
        exercise: ['Jog 25-30 minutes (4x/week)', 'Stretch 5 minutes post-run'],
        sleep: ['Sleep 7 hours', 'Track snoring changes'],
        mindset: ['Push through cravings']
    },
    'week5-8': {
        diet: [
            'Maintain beets, spinach, ginger, celery, garlic',
            'Add 1 cup kale or broccoli',
            'No cheats'
        ],
        exercise: ['Jog 30 minutes (4-5x/week)', 'Walk 10 minutes on off days'],
        sleep: ['Sleep 7-8 hours', 'Track BP weekly'],
        mindset: ['Recheck cortisol/BP with doctor at week 8']
    }
};

// Initialize calendar
function initCalendar() {
    const calendar = document.getElementById('calendar');
    const startDate = new Date('2025-08-05'); // Day 1
    const today = new Date('2025-08-05'); // For current date logic
    const daysInMonth = 31; // August 2025 has 31 days
    const firstDayOfMonth = new Date('2025-08-01').getDay(); // Friday (5)
    
    // Adjust for Sunday as first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const offset = (firstDayOfMonth + 7) % 7;

    // Add weekday headers
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeader.style.color = '#fff';
        dayHeader.style.fontWeight = 'bold';
        calendar.appendChild(dayHeader);
    });

    // Add empty cells for days before the 1st
    for (let i = 0; i < offset; i++) {
        const emptyDay = document.createElement('div');
        calendar.appendChild(emptyDay);
    }

    // Generate calendar days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(2025, 7, day);
        const dayIndex = Math.floor((date - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const week = getWeek(dayIndex);
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.innerHTML = `
            <div class="day-card" data-day="${day}" data-week="${week}">
                <div class="day-front">${day}</div>
                <div class="day-back">
                    <h3>Day ${day} Tasks</h3>
                    <div class="tasks"></div>
                </div>
            </div>
        `;
        calendar.appendChild(dayDiv);
    }

    // Add event listeners for desktop (flip) and mobile (modal)
    const isMobile = window.innerWidth <= 600;
    document.querySelectorAll('.day-card').forEach(card => {
        card.addEventListener('click', () => {
            if (isMobile) {
                showModal(card);
            } else {
                card.classList.toggle('flipped');
                if (card.classList.contains('flipped')) {
                    loadTasks(card);
                }
            }
        });
    });

    // Modal close button
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('taskModal').style.display = 'none';
    });
}

// Determine week range for tasks
function getWeek(dayIndex) {
    if (dayIndex <= 14) return 'week1-2';
    if (dayIndex <= 28) return 'week3-4';
    return 'week5-8';
}

// Load tasks for a day
function loadTasks(card) {
    const day = card.dataset.day;
    const week = card.dataset.week;
    const tasksContainer = card.querySelector('.tasks');
    tasksContainer.innerHTML = '';
    const tasks = challengeTasks[week];
    
    for (const category in tasks) {
        tasks[category].forEach(task => {
            const taskId = `task-${day}-${category}-${task.replace(/\s+/g, '-')}`;
            const checked = localStorage.getItem(taskId) === 'true' ? 'checked' : '';
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <input type="checkbox" id="${taskId}" ${checked}>
                <label for="${taskId}">${task}</label>
            `;
            tasksContainer.appendChild(taskItem);
            document.getElementById(taskId).addEventListener('change', (e) => {
                localStorage.setItem(taskId, e.target.checked);
            });
        });
    }
}

// Show modal for mobile
function showModal(card) {
    const day = card.dataset.day;
    const week = card.dataset.week;
    const modal = document.getElementById('taskModal');
    const modalTitle = document.getElementById('modalTitle');
    const taskList = document.getElementById('taskList');
    
    modalTitle.textContent = `Day ${day} Tasks`;
    taskList.innerHTML = '';
    const tasks = challengeTasks[week];
    
    for (const category in tasks) {
        tasks[category].forEach(task => {
            const taskId = `task-${day}-${category}-${task.replace(/\s+/g, '-')}`;
            const checked = localStorage.getItem(taskId) === 'true' ? 'checked' : '';
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <input type="checkbox" id="${taskId}" ${checked}>
                <label for="${taskId}">${task}</label>
            `;
            taskList.appendChild(taskItem);
            document.getElementById(taskId).addEventListener('change', (e) => {
                localStorage.setItem(taskId, e.target.checked);
            });
        });
    }
    
    modal.style.display = 'flex';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCalendar);
