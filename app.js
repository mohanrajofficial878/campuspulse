// CampusPulse Application Logic

// Initial Preset Sample Data
const DEFAULT_TIMETABLE = [
    { id: 'tt-1', day: 'Monday', startTime: '09:00', endTime: '10:30', subject: 'Data Structures & Algorithms', room: 'LH-301', teacher: 'Dr. Anita Sharma', color: 'indigo' },
    { id: 'tt-2', day: 'Monday', startTime: '10:45', endTime: '12:15', subject: 'Database Management Systems', room: 'Lab 2', teacher: 'Prof. R. K. Gupta', color: 'purple' },
    { id: 'tt-3', day: 'Monday', startTime: '14:00', endTime: '16:00', subject: 'Capstone Web Project Lab', room: 'Software Lab 1', teacher: 'Dr. M. Patel', color: 'pink' },
    { id: 'tt-4', day: 'Tuesday', startTime: '09:00', endTime: '10:30', subject: 'Computer Networks', room: 'LH-302', teacher: 'Prof. S. N. Roy', color: 'emerald' },
    { id: 'tt-5', day: 'Tuesday', startTime: '11:00', endTime: '12:30', subject: 'Operating Systems', room: 'LH-302', teacher: 'Dr. V. K. Singh', color: 'amber' },
    { id: 'tt-6', day: 'Wednesday', startTime: '09:00', endTime: '10:30', subject: 'Data Structures & Algorithms', room: 'LH-301', teacher: 'Dr. Anita Sharma', color: 'indigo' },
    { id: 'tt-7', day: 'Wednesday', startTime: '11:00', endTime: '13:00', subject: 'Full Stack Development', room: 'Lab 4', teacher: 'Prof. Neha Kapoor', color: 'pink' },
    { id: 'tt-8', day: 'Thursday', startTime: '10:00', endTime: '11:30', subject: 'Operating Systems Lab', room: 'OS Lab', teacher: 'Dr. V. K. Singh', color: 'amber' },
    { id: 'tt-9', day: 'Friday', startTime: '09:00', endTime: '11:00', subject: 'Software Engineering Project', room: 'LH-304', teacher: 'Dr. M. Patel', color: 'purple' },
    { id: 'tt-10', day: 'Saturday', startTime: '10:00', endTime: '12:00', subject: 'Industry Seminar & Workshop', room: 'Auditorium', teacher: 'Guest Speakers', color: 'emerald' }
];

const DEFAULT_EXAMS = [
    { id: 'ex-1', subject: 'Database Management Systems', date: '2026-10-25', time: '10:00', venue: 'Exam Hall A', type: 'Midterm', notes: 'Modules 1-3: Relational Algebra, SQL, Normalization' },
    { id: 'ex-2', subject: 'Data Structures & Algorithms', date: '2026-10-28', time: '14:00', venue: 'Exam Hall B', type: 'Midterm', notes: 'Trees, Graphs, Sorting & Dynamic Programming' },
    { id: 'ex-3', subject: 'Computer Networks Practical', date: '2026-11-05', time: '09:30', venue: 'Network Lab 3', type: 'Practical/Lab', notes: 'Wireshark packet analysis, Socket programming' },
    { id: 'ex-4', subject: 'Full Stack Web Capstone', date: '2026-11-15', time: '11:00', venue: 'Seminar Hall', type: 'Final EndSem', notes: 'Final project demonstration & Viva presentation' }
];

const DEFAULT_ATTENDANCE = [
    { id: 'att-1', name: 'Capstone Web Project', category: 'Project', attended: 22, total: 24 },
    { id: 'att-2', name: 'Data Structures & Algorithms', category: 'Theory Class', attended: 28, total: 32 },
    { id: 'att-3', name: 'Database Management Systems', category: 'Theory Class', attended: 20, total: 25 },
    { id: 'att-4', name: 'Computer Networks', category: 'Theory Class', attended: 18, total: 22 },
    { id: 'att-5', name: 'Operating Systems Lab', category: 'Lab Practical', attended: 14, total: 15 }
];

const DEFAULT_BATCHMATES = [
    { id: 'bm-1', name: 'Rohan Sharma', roll: '21CS042', role: 'Frontend Lead (Capstone)', phone: '+91 98765 43210', email: 'rohan.s@college.edu', notes: 'Great at Tailwind CSS & React UI components' },
    { id: 'bm-2', name: 'Priya Nair', roll: '21CS038', role: 'Backend Developer', phone: '+91 98123 45678', email: 'priya.n@college.edu', notes: 'Handles Node.js API endpoints & Database schema' },
    { id: 'bm-3', name: 'Amitav Verma', roll: '21CS015', role: 'Database & QA', phone: '+91 97654 32109', email: 'amitav.v@college.edu', notes: 'SQL expert, tests API integration' },
    { id: 'bm-4', name: 'Sneha Kulkarni', roll: '21CS054', role: 'UI/UX Designer', phone: '+91 99887 76655', email: 'sneha.k@college.edu', notes: 'Figma designer, project presentation slides' }
];

// Quotes for daily inspiration
const QUOTES = [
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Your talent determines what you can do. Your motivation determines how much you are willing to do.", author: "Lou Holtz" }
];

// App State
let state = {
    timetable: [],
    exams: [],
    attendance: [],
    batchmates: [],
    selectedDay: 'Monday',
    theme: 'neon',
    timetablePic: null
};

let attendanceChartInstance = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    setupClock();
    renderAll();
    setupImageUpload();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW registration skipped', err));
    }
});

// Load state from LocalStorage or default
function loadState() {
    const saved = localStorage.getItem('campuspulse_data');
    if (saved) {
        try {
            state = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading data', e);
            resetToDefaultState();
        }
    } else {
        resetToDefaultState();
    }
}

function resetToDefaultState() {
    state = {
        timetable: [...DEFAULT_TIMETABLE],
        exams: [...DEFAULT_EXAMS],
        attendance: [...DEFAULT_ATTENDANCE],
        batchmates: [...DEFAULT_BATCHMATES],
        selectedDay: getTodayDayName(),
        theme: 'neon',
        timetablePic: null
    };
    saveState();
}

function saveState() {
    localStorage.setItem('campuspulse_data', JSON.stringify(state));
}

function getTodayDayName() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    return days[today] === 'Sunday' ? 'Monday' : days[today];
}

// Clock & Date Header
function setupClock() {
    const updateTime = () => {
        const now = new Date();
        const clockEl = document.getElementById('dash-clock');
        const dateEl = document.getElementById('dash-current-date');
        const dayEl = document.getElementById('dash-current-day');

        if (clockEl) {
            clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }
        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        }
        if (dayEl) {
            dayEl.textContent = now.toLocaleDateString([], { weekday: 'long' }).toUpperCase();
        }
    };
    updateTime();
    setInterval(updateTime, 1000);

    // Set Random Quote
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const quoteEl = document.getElementById('daily-quote');
    if (quoteEl) {
        quoteEl.innerHTML = `"${quote.text}" <span class="block text-[10px] text-slate-400 font-bold uppercase mt-1">— ${quote.author}</span>`;
    }
}

// Navigation Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(`tab-${tabId}`);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${tabId}`);
    if (activeNav) activeNav.classList.add('active');

    // Trigger chart re-render on attendance tab
    if (tabId === 'attendance') {
        renderAttendanceChart();
    }
}

// Theme Switcher
function setTheme(themeName) {
    state.theme = themeName;
    saveState();
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    if (themeName !== 'neon') {
        document.body.classList.add(`theme-${themeName}`);
    }
}

// Global Render Coordinator
function renderAll() {
    renderDashboardStats();
    renderTodaySchedule();
    renderTimetableDayTabs();
    renderTimetableSlots();
    renderMasterGrid();
    renderExams();
    renderAttendance();
    renderBatchmates();
    if (state.theme) setTheme(state.theme);
    renderTimetablePicPreview();
}

// ==================== DASHBOARD RENDERERS ====================
function renderDashboardStats() {
    // 1. Overall Attendance Math
    const totalAttended = state.attendance.reduce((sum, item) => sum + Number(item.attended), 0);
    const totalConducted = state.attendance.reduce((sum, item) => sum + Number(item.total), 0);
    const avgPct = totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 100) : 0;

    const pctEl = document.getElementById('stat-attendance-pct');
    const barEl = document.getElementById('stat-attendance-bar');
    const statusEl = document.getElementById('stat-attendance-status');

    if (pctEl) pctEl.textContent = `${avgPct}%`;
    if (barEl) barEl.style.width = `${Math.min(avgPct, 100)}%`;
    if (statusEl) {
        if (avgPct >= 80) {
            statusEl.className = "px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300";
            statusEl.textContent = "Great Standing";
        } else if (avgPct >= 75) {
            statusEl.className = "px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300";
            statusEl.textContent = "Borderline (75%)";
        } else {
            statusEl.className = "px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 animate-pulse";
            statusEl.textContent = "Shortage Alert!";
        }
    }

    // 2. Today's Classes Count
    const todayName = getTodayDayName();
    const todayClasses = state.timetable.filter(item => item.day === todayName);
    const todayCountEl = document.getElementById('stat-today-classes');
    const todayNameEl = document.getElementById('stat-today-name');
    if (todayCountEl) todayCountEl.textContent = todayClasses.length;
    if (todayNameEl) todayNameEl.textContent = todayName;

    // 3. Next Exam Countdown
    const now = new Date();
    const upcomingExams = state.exams
        .map(e => ({ ...e, dateTime: new Date(`${e.date}T${e.time}`) }))
        .filter(e => e.dateTime >= now)
        .sort((a, b) => a.dateTime - b.dateTime);

    const nextExamDaysEl = document.getElementById('stat-next-exam-days');
    const nextExamNameEl = document.getElementById('stat-next-exam-name');
    const nextExamDateEl = document.getElementById('stat-next-exam-date');

    if (upcomingExams.length > 0) {
        const next = upcomingExams[0];
        const diffMs = next.dateTime - now;
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (nextExamDaysEl) nextExamDaysEl.textContent = `${daysLeft}d`;
        if (nextExamNameEl) nextExamNameEl.textContent = next.subject;
        if (nextExamDateEl) nextExamDateEl.textContent = `${next.date} at ${next.time}`;
    } else {
        if (nextExamDaysEl) nextExamDaysEl.textContent = "--";
        if (nextExamNameEl) nextExamNameEl.textContent = "None";
        if (nextExamDateEl) nextExamDateEl.textContent = "No upcoming exams";
    }

    // 4. Batchmates Count
    const bmCountEl = document.getElementById('stat-batchmates-count');
    if (bmCountEl) bmCountEl.textContent = state.batchmates.length;
}

function renderTodaySchedule() {
    const listContainer = document.getElementById('dash-schedule-list');
    if (!listContainer) return;

    const todayName = getTodayDayName();
    const todayClasses = state.timetable.filter(item => item.day === todayName);

    if (todayClasses.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-8 text-slate-500">
                <i class="fa-solid fa-mug-hot text-3xl mb-2 text-indigo-400/40"></i>
                <p class="text-sm font-semibold text-slate-400">No classes scheduled for today (${todayName})!</p>
                <p class="text-xs">Take time to study, work on projects, or relax.</p>
            </div>
        `;
        return;
    }

    // Sort by startTime
    todayClasses.sort((a, b) => a.startTime.localeCompare(b.startTime));

    listContainer.innerHTML = todayClasses.map(slot => {
        const colorClasses = getColorBadgeStyle(slot.color);
        return `
            <div class="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-4 hover:bg-slate-800 transition-all">
                <div class="flex items-center gap-3">
                    <div class="px-3 py-2 rounded-xl text-xs font-extrabold ${colorClasses.bg} ${colorClasses.text} border ${colorClasses.border}">
                        ${slot.startTime} - ${slot.endTime}
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-white">${slot.subject}</h4>
                        <p class="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                            <span><i class="fa-solid fa-location-dot text-indigo-400"></i> ${slot.room || 'N/A'}</span>
                            <span><i class="fa-solid fa-user-tie text-purple-400"></i> ${slot.teacher || 'N/A'}</span>
                        </p>
                    </div>
                </div>
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${colorClasses.bg} ${colorClasses.text} uppercase">
                    Scheduled
                </span>
            </div>
        `;
    }).join('');
}


// ==================== TIMETABLE RENDERERS ====================
function renderTimetableDayTabs() {
    const container = document.getElementById('day-tabs-container');
    if (!container) return;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    container.innerHTML = days.map(day => `
        <button onclick="selectTimetableDay('${day}')" class="day-tab ${state.selectedDay === day ? 'active' : ''} px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 whitespace-nowrap">
            <i class="fa-solid fa-calendar-day"></i> ${day}
        </button>
    `).join('');
}

function selectTimetableDay(day) {
    state.selectedDay = day;
    renderTimetableDayTabs();
    renderTimetableSlots();
}

function renderTimetableSlots() {
    const grid = document.getElementById('timetable-slots-grid');
    if (!grid) return;

    const slots = state.timetable.filter(item => item.day === state.selectedDay);
    slots.sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (slots.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12 bg-slate-800/20 border border-slate-800 rounded-3xl">
                <i class="fa-solid fa-calendar-xmark text-4xl text-slate-600 mb-3"></i>
                <p class="text-base font-bold text-slate-300">No classes added for ${state.selectedDay}</p>
                <p class="text-xs text-slate-500 mt-1">Click "Add Class Slot" to customize your schedule for this day.</p>
                <button onclick="openTimetableModal('${state.selectedDay}')" class="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-all">
                    + Add Class for ${state.selectedDay}
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = slots.map(slot => {
        const colorStyle = getColorBadgeStyle(slot.color);
        return `
            <div class="p-5 rounded-3xl bg-slate-800/50 border border-slate-700/60 hover:bg-slate-800 transition-all duration-300 relative group flex flex-col justify-between shadow-lg">
                <div class="flex items-start justify-between gap-3 mb-3">
                    <span class="px-3 py-1 rounded-xl text-xs font-extrabold ${colorStyle.bg} ${colorStyle.text} border ${colorStyle.border}">
                        <i class="fa-regular fa-clock"></i> ${slot.startTime} - ${slot.endTime}
                    </span>

                    <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button onclick="editTimetableSlot('${slot.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-700/60 transition-all" title="Edit">
                            <i class="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button onclick="deleteTimetableSlot('${slot.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition-all" title="Delete">
                            <i class="fa-solid fa-trash text-xs"></i>
                        </button>
                    </div>
                </div>

                <div class="my-2">
                    <h4 class="text-base font-extrabold text-white leading-snug">${slot.subject}</h4>
                </div>

                <div class="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400 mt-2">
                    <span class="flex items-center gap-1 font-semibold text-slate-300">
                        <i class="fa-solid fa-door-open text-indigo-400"></i> ${slot.room || 'Room Unassigned'}
                    </span>
                    <span class="flex items-center gap-1 text-slate-400">
                        <i class="fa-solid fa-chalkboard-user text-purple-400"></i> ${slot.teacher || 'N/A'}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

function renderMasterGrid() {
    const tbody = document.getElementById('master-grid-tbody');
    if (!tbody) return;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    tbody.innerHTML = days.map(day => {
        const slots = state.timetable.filter(item => item.day === day);
        slots.sort((a, b) => a.startTime.localeCompare(b.startTime));

        return `
            <tr>
                <td class="p-3 font-bold text-indigo-300">${day}</td>
                <td class="p-3">
                    ${slots.length === 0 ? '<span class="text-slate-500 italic">No classes</span>' : `
                        <div class="flex flex-wrap gap-2">
                            ${slots.map(s => {
                                const st = getColorBadgeStyle(s.color);
                                return `<span class="px-2.5 py-1 rounded-lg ${st.bg} ${st.text} border ${st.border} font-semibold">${s.startTime}: ${s.subject} (${s.room})</span>`;
                            }).join('')}
                        </div>
                    `}
                </td>
            </tr>
        `;
    }).join('');
}

// Timetable Modals & CRUD
function openTimetableModal(defaultDay = null) {
    document.getElementById('modal-timetable-title').innerHTML = `<i class="fa-solid fa-calendar-plus text-indigo-400"></i> Add Class Slot`;
    document.getElementById('form-timetable').reset();
    document.getElementById('tt-id').value = '';
    if (defaultDay) {
        document.getElementById('tt-day').value = defaultDay;
    } else {
        document.getElementById('tt-day').value = state.selectedDay;
    }
    openModal('modal-timetable');
}

function editTimetableSlot(id) {
    const slot = state.timetable.find(item => item.id === id);
    if (!slot) return;

    document.getElementById('modal-timetable-title').innerHTML = `<i class="fa-solid fa-pen text-indigo-400"></i> Edit Class Slot`;
    document.getElementById('tt-id').value = slot.id;
    document.getElementById('tt-day').value = slot.day;
    document.getElementById('tt-start-time').value = slot.startTime;
    document.getElementById('tt-end-time').value = slot.endTime;
    document.getElementById('tt-subject').value = slot.subject;
    document.getElementById('tt-room').value = slot.room || '';
    document.getElementById('tt-teacher').value = slot.teacher || '';

    // Color radio
    const radio = document.querySelector(`input[name="tt-color"][value="${slot.color || 'indigo'}"]`);
    if (radio) radio.checked = true;

    openModal('modal-timetable');
}

function saveTimetableSlot(e) {
    e.preventDefault();
    const id = document.getElementById('tt-id').value;
    const day = document.getElementById('tt-day').value;
    const startTime = document.getElementById('tt-start-time').value;
    const endTime = document.getElementById('tt-end-time').value;
    const subject = document.getElementById('tt-subject').value.trim();
    const room = document.getElementById('tt-room').value.trim();
    const teacher = document.getElementById('tt-teacher').value.trim();
    const color = document.querySelector('input[name="tt-color"]:checked')?.value || 'indigo';

    if (id) {
        // Edit existing
        const index = state.timetable.findIndex(item => item.id === id);
        if (index !== -1) {
            state.timetable[index] = { id, day, startTime, endTime, subject, room, teacher, color };
        }
    } else {
        // Create new
        const newId = 'tt-' + Date.now();
        state.timetable.push({ id: newId, day, startTime, endTime, subject, room, teacher, color });
    }

    state.selectedDay = day;
    saveState();
    closeModal('modal-timetable');
    renderAll();
}

function deleteTimetableSlot(id) {
    if (confirm('Are you sure you want to delete this class slot?')) {
        state.timetable = state.timetable.filter(item => item.id !== id);
        saveState();
        renderAll();
    }
}


// Timetable Image Handler
function openTimetablePicModal() {
    openModal('modal-timetable-pic');
    renderTimetablePicPreview();
}

function setupImageUpload() {
    const input = document.getElementById('tt-image-input');
    if (!input) return;

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            state.timetablePic = event.target.result;
            saveState();
            renderTimetablePicPreview();
        };
        reader.readAsDataURL(file);
    });
}

function renderTimetablePicPreview() {
    const imgEl = document.getElementById('tt-image-preview');
    const placeholderEl = document.getElementById('tt-image-placeholder');
    if (!imgEl || !placeholderEl) return;

    if (state.timetablePic) {
        imgEl.src = state.timetablePic;
        imgEl.classList.remove('hidden');
        placeholderEl.classList.add('hidden');
    } else {
        imgEl.src = '';
        imgEl.classList.add('hidden');
        placeholderEl.classList.remove('hidden');
    }
}

function removeTimetablePic() {
    if (confirm('Remove saved timetable picture?')) {
        state.timetablePic = null;
        saveState();
        renderTimetablePicPreview();
    }
}


// ==================== EXAM RENDERERS ====================
function renderExams() {
    const grid = document.getElementById('exams-grid');
    if (!grid) return;

    if (state.exams.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12 bg-slate-800/20 border border-slate-800 rounded-3xl">
                <i class="fa-solid fa-pen-ruler text-4xl text-slate-600 mb-3"></i>
                <p class="text-base font-bold text-slate-300">No exams added yet</p>
                <p class="text-xs text-slate-500 mt-1">Keep track of upcoming tests, midterms and final endsems.</p>
                <button onclick="openExamModal()" class="mt-4 px-4 py-2 rounded-xl bg-pink-600 text-white text-xs font-bold hover:bg-pink-500 transition-all">
                    + Add New Exam
                </button>
            </div>
        `;
        return;
    }

    // Sort exams chronologically
    const sorted = [...state.exams].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    const now = new Date();

    grid.innerHTML = sorted.map(exam => {
        const examDate = new Date(`${exam.date}T${exam.time}`);
        const isPast = examDate < now;
        const diffMs = examDate - now;
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        return `
            <div class="p-6 rounded-3xl bg-slate-800/50 border ${isPast ? 'border-slate-800 opacity-60' : 'border-slate-700/60 hover:border-pink-500/40'} transition-all shadow-xl flex flex-col justify-between relative group">
                <div>
                    <div class="flex items-start justify-between gap-3 mb-3">
                        <span class="px-3 py-1 rounded-xl text-xs font-bold ${isPast ? 'bg-slate-700 text-slate-400' : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'}">
                            ${exam.type || 'Exam'}
                        </span>

                        <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button onclick="editExam('${exam.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-pink-300 hover:bg-slate-700/60 transition-all">
                                <i class="fa-solid fa-pen text-xs"></i>
                            </button>
                            <button onclick="deleteExam('${exam.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition-all">
                                <i class="fa-solid fa-trash text-xs"></i>
                            </button>
                        </div>
                    </div>

                    <h3 class="text-lg font-extrabold text-white leading-snug mb-2">${exam.subject}</h3>

                    <div class="space-y-1.5 text-xs text-slate-300 my-3">
                        <p class="flex items-center gap-2">
                            <i class="fa-solid fa-calendar text-pink-400"></i> <span class="font-semibold text-white">${exam.date}</span> at ${exam.time}
                        </p>
                        <p class="flex items-center gap-2">
                            <i class="fa-solid fa-location-dot text-purple-400"></i> ${exam.venue || 'Venue TBD'}
                        </p>
                        ${exam.notes ? `<p class="mt-2 text-slate-400 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">${exam.notes}</p>` : ''}
                    </div>
                </div>

                <div class="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs mt-2">
                    ${isPast ? `
                        <span class="text-slate-500 font-bold uppercase tracking-wider">Completed</span>
                    ` : `
                        <span class="font-bold text-pink-400 flex items-center gap-1">
                            <i class="fa-solid fa-hourglass-half animate-spin"></i> ${daysLeft === 0 ? 'Today!' : `${daysLeft} Days Left`}
                        </span>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

function openExamModal() {
    document.getElementById('modal-exam-title').innerHTML = `<i class="fa-solid fa-pen-ruler text-pink-400"></i> Add Exam Entry`;
    document.getElementById('form-exam').reset();
    document.getElementById('exam-id').value = '';
    openModal('modal-exam');
}

function editExam(id) {
    const exam = state.exams.find(item => item.id === id);
    if (!exam) return;

    document.getElementById('modal-exam-title').innerHTML = `<i class="fa-solid fa-pen text-pink-400"></i> Edit Exam Entry`;
    document.getElementById('exam-id').value = exam.id;
    document.getElementById('exam-subject').value = exam.subject;
    document.getElementById('exam-date').value = exam.date;
    document.getElementById('exam-time').value = exam.time;
    document.getElementById('exam-venue').value = exam.venue || '';
    document.getElementById('exam-type').value = exam.type || 'Midterm';
    document.getElementById('exam-notes').value = exam.notes || '';

    openModal('modal-exam');
}

function saveExam(e) {
    e.preventDefault();
    const id = document.getElementById('exam-id').value;
    const subject = document.getElementById('exam-subject').value.trim();
    const date = document.getElementById('exam-date').value;
    const time = document.getElementById('exam-time').value;
    const venue = document.getElementById('exam-venue').value.trim();
    const type = document.getElementById('exam-type').value;
    const notes = document.getElementById('exam-notes').value.trim();

    if (id) {
        const index = state.exams.findIndex(item => item.id === id);
        if (index !== -1) {
            state.exams[index] = { id, subject, date, time, venue, type, notes };
        }
    } else {
        const newId = 'ex-' + Date.now();
        state.exams.push({ id: newId, subject, date, time, venue, type, notes });
    }

    saveState();
    closeModal('modal-exam');
    renderAll();
}

function deleteExam(id) {
    if (confirm('Delete this exam entry?')) {
        state.exams = state.exams.filter(item => item.id !== id);
        saveState();
        renderAll();
    }
}


// ==================== ATTENDANCE RENDERERS ====================
function renderAttendance() {
    const container = document.getElementById('attendance-list-container');
    if (!container) return;

    if (state.attendance.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 bg-slate-800/20 border border-slate-800 rounded-3xl">
                <i class="fa-solid fa-user-check text-4xl text-slate-600 mb-3"></i>
                <p class="text-base font-bold text-slate-300">No subjects or projects tracked</p>
                <p class="text-xs text-slate-500 mt-1">Add your subjects to keep attendance > 75%.</p>
                <button onclick="openAttendanceModal()" class="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-all">
                    + Add Subject / Project
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = state.attendance.map(item => {
        const attended = Number(item.attended);
        const total = Number(item.total);
        const pct = total > 0 ? Math.round((attended / total) * 100) : 0;

        // 75% Rule Calculation: How many consecutive classes to reach 75% OR how many can be missed
        let statusBadge = '';
        let mathAdvice = '';

        if (pct >= 75) {
            // Can miss classes math: floor((attended - 0.75 * total) / 0.75)
            const canMiss = Math.floor((attended - 0.75 * total) / 0.75);
            statusBadge = `<span class="px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"><i class="fa-solid fa-circle-check"></i> Safe (${pct}%)</span>`;
            if (canMiss > 0) {
                mathAdvice = `<span class="text-emerald-400 font-medium">You can safely miss ${canMiss} class${canMiss > 1 ? 'es' : ''} and stay above 75%.</span>`;
            } else {
                mathAdvice = `<span class="text-amber-400 font-medium">You are at 75% threshold! Don't miss the next class.</span>`;
            }
        } else {
            // Need to attend math: ceil((0.75 * total - attended) / 0.25)
            const needAttend = Math.ceil((0.75 * total - attended) / 0.25);
            statusBadge = `<span class="px-3 py-1 rounded-xl text-xs font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"><i class="fa-solid fa-triangle-exclamation"></i> Low (${pct}%)</span>`;
            mathAdvice = `<span class="text-rose-400 font-bold">Must attend next ${needAttend} consecutive class${needAttend > 1 ? 'es' : ''} to reach 75%!</span>`;
        }

        return `
            <div class="p-5 rounded-3xl bg-slate-800/50 border border-slate-700/60 hover:bg-slate-800 transition-all shadow-lg flex flex-col justify-between gap-4">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-700 text-slate-300 uppercase">${item.category || 'Subject'}</span>
                        </div>
                        <h4 class="text-base font-extrabold text-white">${item.name}</h4>
                    </div>
                    ${statusBadge}
                </div>

                <div>
                    <div class="flex items-center justify-between text-xs text-slate-300 mb-1 font-semibold">
                        <span>Attended ${attended} / ${total} Classes</span>
                        <span>${pct}%</span>
                    </div>
                    <div class="w-full bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-500 ${pct >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-rose-500 to-pink-500'}" style="width: ${Math.min(pct, 100)}%"></div>
                    </div>
                    <p class="text-xs mt-2">${mathAdvice}</p>
                </div>

                <div class="pt-3 border-t border-slate-700/50 flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <button onclick="updateAttendanceCount('${item.id}', 1, 1)" class="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1 transition-all">
                            <i class="fa-solid fa-plus text-[10px]"></i> Attended
                        </button>
                        <button onclick="updateAttendanceCount('${item.id}', 0, 1)" class="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-bold border border-rose-500/30 flex items-center gap-1 transition-all">
                            <i class="fa-solid fa-xmark text-[10px]"></i> Missed
                        </button>
                    </div>

                    <div class="flex items-center gap-1">
                        <button onclick="editAttendance('${item.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-slate-700/60 transition-all">
                            <i class="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button onclick="deleteAttendance('${item.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition-all">
                            <i class="fa-solid fa-trash text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderAttendanceChart() {
    const canvas = document.getElementById('attendanceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (attendanceChartInstance) {
        attendanceChartInstance.destroy();
    }

    const labels = state.attendance.map(a => a.name);
    const dataPct = state.attendance.map(a => a.total > 0 ? Math.round((a.attended / a.total) * 100) : 0);
    const colors = dataPct.map(p => p >= 75 ? '#10b981' : '#f43f5e');

    attendanceChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: dataPct.length > 0 ? dataPct : [100],
                backgroundColor: colors.length > 0 ? colors : ['#6366f1'],
                borderWidth: 0,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            cutout: '75%'
        }
    });
}

function updateAttendanceCount(id, addAttended, addTotal) {
    const item = state.attendance.find(a => a.id === id);
    if (!item) return;

    item.attended = Math.max(0, Number(item.attended) + addAttended);
    item.total = Math.max(1, Number(item.total) + addTotal);

    saveState();
    renderAll();
    renderAttendanceChart();
}

function openAttendanceModal() {
    document.getElementById('modal-attendance-title').innerHTML = `<i class="fa-solid fa-user-check text-emerald-400"></i> Add Subject / Project`;
    document.getElementById('form-attendance').reset();
    document.getElementById('att-id').value = '';
    openModal('modal-attendance');
}

function editAttendance(id) {
    const item = state.attendance.find(a => a.id === id);
    if (!item) return;

    document.getElementById('modal-attendance-title').innerHTML = `<i class="fa-solid fa-pen text-emerald-400"></i> Edit Subject / Project`;
    document.getElementById('att-id').value = item.id;
    document.getElementById('att-name').value = item.name;
    document.getElementById('att-category').value = item.category || 'Theory Class';
    document.getElementById('att-attended').value = item.attended;
    document.getElementById('att-total').value = item.total;

    openModal('modal-attendance');
}

function saveAttendance(e) {
    e.preventDefault();
    const id = document.getElementById('att-id').value;
    const name = document.getElementById('att-name').value.trim();
    const category = document.getElementById('att-category').value;
    const attended = Number(document.getElementById('att-attended').value);
    const total = Number(document.getElementById('att-total').value);

    if (id) {
        const index = state.attendance.findIndex(a => a.id === id);
        if (index !== -1) {
            state.attendance[index] = { id, name, category, attended, total };
        }
    } else {
        const newId = 'att-' + Date.now();
        state.attendance.push({ id: newId, name, category, attended, total });
    }

    saveState();
    closeModal('modal-attendance');
    renderAll();
    renderAttendanceChart();
}

function deleteAttendance(id) {
    if (confirm('Delete this attendance tracker?')) {
        state.attendance = state.attendance.filter(a => a.id !== id);
        saveState();
        renderAll();
        renderAttendanceChart();
    }
}


// ==================== BATCHMATES RENDERERS ====================
function renderBatchmates() {
    const grid = document.getElementById('batchmates-grid');
    if (!grid) return;

    const searchTerm = (document.getElementById('batchmate-search')?.value || '').toLowerCase();
    const filtered = state.batchmates.filter(bm => 
        bm.name.toLowerCase().includes(searchTerm) ||
        (bm.roll && bm.roll.toLowerCase().includes(searchTerm)) ||
        (bm.role && bm.role.toLowerCase().includes(searchTerm)) ||
        (bm.phone && bm.phone.toLowerCase().includes(searchTerm))
    );

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12 bg-slate-800/20 border border-slate-800 rounded-3xl">
                <i class="fa-solid fa-user-group text-4xl text-slate-600 mb-3"></i>
                <p class="text-base font-bold text-slate-300">No batchmates found</p>
                <p class="text-xs text-slate-500 mt-1">Add classmates and project team members.</p>
                <button onclick="openBatchmateModal()" class="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition-all">
                    + Add Batchmate
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(bm => {
        const initials = bm.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        return `
            <div class="p-6 rounded-3xl bg-slate-800/50 border border-slate-700/60 hover:border-amber-500/40 transition-all shadow-xl flex flex-col justify-between relative group">
                <div>
                    <div class="flex items-start justify-between gap-3 mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-extrabold flex items-center justify-center text-base shadow-lg shadow-amber-500/20">
                                ${initials}
                            </div>
                            <div>
                                <h3 class="text-base font-extrabold text-white">${bm.name}</h3>
                                <p class="text-xs font-semibold text-amber-400">${bm.roll || 'ID N/A'}</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button onclick="editBatchmate('${bm.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-700/60 transition-all">
                                <i class="fa-solid fa-pen text-xs"></i>
                            </button>
                            <button onclick="deleteBatchmate('${bm.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition-all">
                                <i class="fa-solid fa-trash text-xs"></i>
                            </button>
                        </div>
                    </div>

                    ${bm.role ? `<div class="mb-3"><span class="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20"><i class="fa-solid fa-briefcase"></i> ${bm.role}</span></div>` : ''}

                    <div class="space-y-1.5 text-xs text-slate-300">
                        ${bm.phone ? `<p class="flex items-center gap-2"><i class="fa-solid fa-phone text-emerald-400"></i> <a href="tel:${bm.phone}" class="hover:underline">${bm.phone}</a></p>` : ''}
                        ${bm.email ? `<p class="flex items-center gap-2"><i class="fa-solid fa-envelope text-indigo-400"></i> <a href="mailto:${bm.email}" class="hover:underline">${bm.email}</a></p>` : ''}
                        ${bm.notes ? `<p class="mt-3 text-slate-400 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">${bm.notes}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterBatchmates() {
    renderBatchmates();
}

function openBatchmateModal() {
    document.getElementById('modal-batchmate-title').innerHTML = `<i class="fa-solid fa-user-plus text-amber-400"></i> Add Batchmate / Project Mate`;
    document.getElementById('form-batchmate').reset();
    document.getElementById('bm-id').value = '';
    openModal('modal-batchmate');
}

function editBatchmate(id) {
    const bm = state.batchmates.find(b => b.id === id);
    if (!bm) return;

    document.getElementById('modal-batchmate-title').innerHTML = `<i class="fa-solid fa-pen text-amber-400"></i> Edit Batchmate Details`;
    document.getElementById('bm-id').value = bm.id;
    document.getElementById('bm-name').value = bm.name;
    document.getElementById('bm-roll').value = bm.roll || '';
    document.getElementById('bm-role').value = bm.role || '';
    document.getElementById('bm-phone').value = bm.phone || '';
    document.getElementById('bm-email').value = bm.email || '';
    document.getElementById('bm-notes').value = bm.notes || '';

    openModal('modal-batchmate');
}

function saveBatchmate(e) {
    e.preventDefault();
    const id = document.getElementById('bm-id').value;
    const name = document.getElementById('bm-name').value.trim();
    const roll = document.getElementById('bm-roll').value.trim();
    const role = document.getElementById('bm-role').value.trim();
    const phone = document.getElementById('bm-phone').value.trim();
    const email = document.getElementById('bm-email').value.trim();
    const notes = document.getElementById('bm-notes').value.trim();

    if (id) {
        const index = state.batchmates.findIndex(b => b.id === id);
        if (index !== -1) {
            state.batchmates[index] = { id, name, roll, role, phone, email, notes };
        }
    } else {
        const newId = 'bm-' + Date.now();
        state.batchmates.push({ id: newId, name, roll, role, phone, email, notes });
    }

    saveState();
    closeModal('modal-batchmate');
    renderAll();
}

function deleteBatchmate(id) {
    if (confirm('Delete this batchmate contact?')) {
        state.batchmates = state.batchmates.filter(b => b.id !== id);
        saveState();
        renderAll();
    }
}


// ==================== UTILS & HELPERS ====================
function openModal(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('hidden');
        el.classList.add('flex');
    }
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('hidden');
        el.classList.remove('flex');
    }
}

function getColorBadgeStyle(colorName) {
    switch (colorName) {
        case 'purple':
            return { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' };
        case 'pink':
            return { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/30' };
        case 'emerald':
            return { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30' };
        case 'amber':
            return { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30' };
        case 'indigo':
        default:
            return { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30' };
    }
}

// Backup Export & Restore Import
function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CampusPulse_Backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedState = JSON.parse(e.target.result);
            if (importedState.timetable && importedState.exams && importedState.attendance) {
                state = importedState;
                saveState();
                renderAll();
                alert('Data successfully restored!');
            } else {
                alert('Invalid JSON backup file structure!');
            }
        } catch (err) {
            alert('Error parsing JSON file!');
        }
    };
    reader.readAsText(file);
}
