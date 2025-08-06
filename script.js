// Roi HaGever
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCoFnRRTWN9wiULuTaYf4UcM62dpDgNGyM",
    authDomain: "healthy-boi-11eb8.firebaseapp.com",
    projectId: "healthy-boi-11eb8",
    storageBucket: "healthy-boi-11eb8.firebasestorage.app",
    messagingSenderId: "296111243027",
    appId: "1:296111243027:web:bfd16a419370edb3b5a4e6",
    measurementId: "G-FZTFK24XQ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
        if (currentMonth > 7 || currentYear > 2025) {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updateCalendar(currentMonth, currentYear);
        }
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        if (currentMonth < 8 || currentYear < 2025) {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updateCalendar(currentMonth, currentYear);
        }
    });

    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            document.getElementById('taskModal').style.display = 'none';
            document.getElementById('streakModal').style.display = 'none';
        });
    });

    // Achievement buttons
    document.querySelectorAll('.achievement').forEach(btn => {
        btn.addEventListener('click', () => showStreakModal(btn.dataset.category));
    });
}

// Update calendar for the given month and year
function updateCalendar(month, year) {
    const calendar = document.getElementById('calendar');
    const monthYear = document.getElementById('monthYear');
    calendar.innerHTML = '';

    const startDate = new Date('2025-08-06'); // Day 1 of challenge
    const endDate = new Date('2025-09-30'); // End of 8 weeks
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
        if (!week || date > endDate || date < startDate) {
            dayDiv.className += ' disabled';
        }
        dayDiv.textContent = day; // Show only the day number
        dayDiv.dataset.day = day;
        dayDiv.dataset.week = week || '';
        dayDiv.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayDiv.dataset.dayIndex = dayIndex;
        if (week && date <= endDate && date >= startDate) {
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
            if (shouldDisplay) {
                hasTasks = true;
                const taskId = `task-${date}-${category}-${taskText.replace(/\s+/g, '-')}`; // Consistent ID
                const taskDocRef = doc(db, 'tasks', 'boi123', date, taskId);
                const taskDocSnap = await getDoc(taskDocRef);
                const checked = taskDocSnap.exists() ? (taskDocSnap.data().checked || false) : false; // Ensure default false
                
                const taskItem = document.createElement('div');
                taskItem.className = 'task-item';
                taskItem.innerHTML = `
                    <input type="checkbox" id="${taskId}" ${checked ? 'checked' : ''}>
                    <label for="${taskId}">${taskText}</label>
                `;
                categoryDiv.appendChild(taskItem);
                setTimeout(() => {
                    const checkbox = document.getElementById(taskId);
                    if (checkbox) {
                        checkbox.addEventListener('change', async (e) => {
                            await setDoc(taskDocRef, { checked: e.target.checked }, { merge: true });
                        });
                    }
                }, 0);
            }
        }

        if (hasTasks) {
            taskList.appendChild(categoryDiv);
        }
    }

    if (taskList.children.length === 0) {
        taskList.innerHTML = '<p>No tasks for this day.</p>';
    }
    
    modal.style.display = 'flex';
}

// Show streak modal
async function showStreakModal(category) {
    const streakModal = document.getElementById('streakModal');
    const streakTitle = document.getElementById('streakTitle');
    const streakCount = document.getElementById('streakCount');
    
    streakTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Streak`;
    streakCount.textContent = 'Calculating...';

    const startDate = new Date('2025-08-06');
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= today && currentDate <= new Date('2025-09-30')) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayIndex = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const week = getWeek(dayIndex);
        if (!week) break;

                let tasksToCheck = [];
        if (category === 'coffee') tasksToCheck = ['No coffee'].filter(t => challengeTasks[week].diet.includes(t));
        else if (category === 'booze') tasksToCheck = ['No alcohol'].filter(t => challengeTasks[week].diet.includes(t));
        else if (category === 'sports') tasksToCheck = challengeTasks[week].exercise.map(t => typeof t === 'string' ? t : t.task);
        else if (category === 'food') tasksToCheck = challengeTasks[week].diet.filter(t => typeof t === 'string' ? !['No alcohol', 'No coffee'].includes(t) : true).map(t => typeof t === 'string' ? t : t.task);
        else if (category === 'sleep') tasksToCheck = challengeTasks[week].sleep;

        let allChecked = true;
        for (const task of tasksToCheck) {
            if (category === 'sports' || category === 'food') {
                const shouldDisplay = challengeTasks[week][category].some(t => (typeof t === 'string' ? t === task : t.task === task && t.day.includes(dayIndex % 14 === 0 ? 14 : dayIndex % 14)));
                if (!shouldDisplay) continue;
            }
            const taskId = `task-${dateStr}-${category === 'sports' ? 'exercise' : category}-${task.replace(/\s+/g, '-')}`;
            const docRef = doc(db, 'tasks', 'boi123', dateStr, taskId);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists() || !docSnap.data().checked) {
                allChecked = false;
                break;
            }
        }

        if (!allChecked) break;
        streak++;
        currentDate.setDate(currentDate.getDate() + 1);
    }

    streakCount.textContent = `${streak} day${streak === 1 ? '' : 's'}`;
    streakModal.style.display = 'flex';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCalendar);



