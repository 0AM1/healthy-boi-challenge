// Challenge tasks by week with varied diet and exercise schedule
const challengeTasks = {
    'week1-2': {
        diet: [
            'No alcohol',
            'No coffee',
            { day: [1, 4, 7, 8, 11, 14], task: 'Drink 250ml beet juice' },
            { day: [2, 5, 9, 12], task: 'Eat 1 cup spinach' },
            { day: [3, 6, 10, 13], task: 'Use 1 tsp grated ginger in water' },
            { day: [1, 3, 5, 7, 9, 11, 13], task: 'Eat a banana' },
            { day: [2, 4, 6, 8, 10, 12, 14], task: 'Eat an orange' }
        ],
        exercise: [
            { day: [1, 4, 7, 10, 13], task: 'Jog 20 minutes' },
            { day: [3, 9], task: 'Gym session (30 minutes)' }
        ],
        sleep: ['Sleep 7 hours on firm mattress', 'Track dizziness'],
        mindset: ['Expect headaches or grumpiness']
    },
    'week3-4': {
        diet: [
            'No alcohol',
            'No coffee',
            { day: [1, 4, 7, 8, 11, 14], task: 'Drink 250ml beet juice' },
            { day: [2, 5, 9, 12], task: 'Eat 1 cup spinach' },
            { day: [3, 6, 10, 13], task: 'Use 1 tsp grated ginger in water' },
            { day: [1, 3, 5, 7, 9, 11, 13], task: 'Eat a banana' },
            { day: [2, 4, 6, 8, 10, 12, 14], task: 'Eat 2 celery stalks' },
            { day: [1, 4, 7, 10, 13], task: 'Eat 1 garlic clove' },
            'Drink 2-3L water'
        ],
        exercise: [
            { day: [1, 4, 7, 10, 13], task: 'Jog 25-30 minutes' },
            { day: [3, 9], task: 'Gym session (30 minutes)' },
            'Stretch 5 minutes post-exercise'
        ],
        sleep: ['Sleep 7 hours', 'Track snoring changes'],
        mindset: ['Push through cravings']
    },
    'week5-8': {
        diet: [
            'No alcohol',
            'No coffee',
            { day: [1, 4, 7, 8, 11, 14], task: 'Drink 250ml beet juice' },
            { day: [2, 5, 9, 12], task: 'Eat 1 cup spinach' },
            { day: [3, 6, 10, 13], task: 'Use 1 tsp grated ginger in water' },
            { day: [1, 3, 5, 7, 9, 11, 13], task: 'Eat a banana' },
            { day: [2, 4, 6, 8, 10, 12, 14], task: 'Eat 2 celery stalks' },
            { day: [1, 4, 7, 10, 13], task: 'Eat 1 garlic clove' },
            { day: [2, 5, 9, 12], task: 'Eat 1 cup kale or broccoli' },
            'No cheat meals'
        ],
        exercise: [
            { day: [1, 4, 7, 10, 13], task: 'Jog 30 minutes' },
            { day: [3, 9], task: 'Gym session (30 minutes)' },
            'Walk 10 minutes on recovery days'
        ],
        sleep: ['Sleep 7-8 hours', 'Track BP weekly'],
        mindset: ['Recheck cortisol/BP with doctor at week 8']
    }
};

// Initialize calendar
let currentMonth = 7; // August 2025 (0-based index)
let currentYear = 2025;

function initCalendar() {
    updateCalendar(currentMonth, currentYear);

    // Navigation buttons
    document.getElementById('prevMonth').addEventListener('click', () => {
        if (currentMonth > 7 || currentYear > 2025) { // Limit to August 2025
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updateCalendar(currentMonth, currentYear);
        }
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        if (currentMonth < 8 || currentYear < 2025) { // Limit to September 2025
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updateCalendar(currentMonth, currentYear);
        }
    });

    // Modal close button
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('taskModal').style.display = 'none';
    });
}

// Update calendar for the given month and year
function updateCalendar(month, year) {
    const calendar = document.getElementById('calendar');
    const monthYear = document.getElementById('monthYear');
    calendar.innerHTML = '';

    const startDate = new Date('2025-08-05'); // Day 1 of challenge
    const endDate = new Date('2025-09-29'); // End of 8 weeks
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    monthYear.textContent = `${months[month]} ${year}`;

    // Add weekday headers
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeader.style.color = '#fff';
        dayHeader.style.fontWeight = 'bold';
        calendar.appendChild(dayHeader);
    });

    // Calculate days in month and first day
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Adjust for Sunday as first day
    const offset = (firstDayOfMonth + 7) % 7;

    // Add empty cells
    for (let i = 0; i < offset; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'day empty';
        calendar.appendChild(emptyDay);
    }

    // Generate calendar days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayIndex = Math.floor((date - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const week = getWeek(dayIndex);
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        if (!week || date > endDate) {
            dayDiv.className += ' disabled';
        }
        dayDiv.textContent = day;
        dayDiv.dataset.day = day;
        dayDiv.dataset.week = week || '';
        dayDiv.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayDiv.dataset.dayIndex = dayIndex;
        if (week && date <= endDate) {
            dayDiv.addEventListener('click', () => showModal(dayDiv));
        }
        calendar.appendChild(dayDiv);
    }
}

// Determine week range for tasks
function getWeek(dayIndex) {
    if (dayIndex < 1 || dayIndex > 56) return null; // Before or after 8-week challenge
    if (dayIndex <= 14) return 'week1-2';
    if (dayIndex <= 28) return 'week3-4';
    return 'week5-8';
}

// Show modal with tasks
function showModal(dayDiv) {
    const day = dayDiv.dataset.day;
    const week = dayDiv.dataset.week;
    const date = dayDiv.dataset.date;
    const dayIndex = parseInt(dayDiv.dataset.dayIndex);
    if (!week) return; // No tasks for this day

    const modal = document.getElementById('taskModal');
    const modalTitle = document.getElementById('modalTitle');
    const taskList = document.getElementById('taskList');
    
    modalTitle.textContent = `Day ${day} Tasks (${date})`;
    taskList.innerHTML = '';

    const tasks = challengeTasks[week];
    Object.keys(tasks).forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `<h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>`;
        let hasTasks = false;

        tasks[category].forEach(task => {
            const taskText = typeof task === 'string' ? task : task.task;
            const shouldDisplay = typeof task === 'string' ? true : task.day.includes(dayIndex % 14 === 0 ? 14 : dayIndex % 14);

            if (shouldDisplay) {
                hasTasks = true;
                const taskId = `task-${date}-${category}-${taskText.replace(/\s+/g, '-')}`;
                const checked = localStorage.getItem(taskId) === 'true' ? 'checked' : '';
                const taskItem = document.createElement('div');
                taskItem.className = 'task-item';
                taskItem.innerHTML = `
                    <input type="checkbox" id="${taskId}" ${checked}>
                    <label for="${taskId}">${taskText}</label>
                `;
                categoryDiv.appendChild(taskItem);
                const checkbox = document.getElementById(taskId);
                if (checkbox) {
                    checkbox.addEventListener('change', (e) => {
                        localStorage.setItem(taskId, e.target.checked);
                    });
                }
            }
        });

        if (hasTasks) {
            taskList.appendChild(categoryDiv);
        }
    });

    if (taskList.children.length === 0) {
        taskList.innerHTML = '<p>No tasks for this day.</p>';
    }
    
    modal.style.display = 'flex';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCalendar);
