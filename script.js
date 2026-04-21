document.addEventListener('DOMContentLoaded', () => {
    const clockElement = document.getElementById('digital-clock');
    const dateLongElement = document.getElementById('current-date-long');
    const monthYearDisplay = document.getElementById('month-year-display');
    const calendarDaysElement = document.getElementById('calendar-days');
    const eventListElement = document.getElementById('event-list');

    // --- Mock Data ---
    const mockEvents = [
        { time: '09:00 AM', title: 'Morning Stand-up', dayOffset: 0 },
        { time: '11:30 AM', title: 'Client Presentation', dayOffset: 0 },
        { time: '02:00 PM', title: 'Design Review', dayOffset: 1 },
        { time: '10:00 AM', title: 'Marketing Sync', dayOffset: 2 },
        { time: '04:00 PM', title: 'Weekly Wrap-up', dayOffset: 4 }
    ];

    // --- Clock Logic ---
    function updateClock() {
        const now = new Date();

        // Time
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;

        // Long Date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateLongElement.textContent = now.toLocaleDateString('en-US', options);

        // Check for midnight to refresh calendar
        if (hours === '00' && minutes === '00' && seconds === '00') {
            renderCalendar();
        }
    }

    // --- Calendar Logic ---
    function renderCalendar() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const today = now.getDate();

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

        // Get first day of month (0-6)
        const firstDay = new Date(year, month, 1).getDay();
        // Get total days in month
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // Get total days in previous month
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        calendarDaysElement.innerHTML = '';

        // Previous month filler days
        for (let i = firstDay; i > 0; i--) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day not-current';
            dayDiv.innerHTML = `<span class="day-number">${daysInPrevMonth - i + 1}</span>`;
            calendarDaysElement.appendChild(dayDiv);
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            if (i === today) {
                dayDiv.classList.add('today');
            }

            dayDiv.innerHTML = `<span class="day-number">${i}</span>`;

            // Add a dot if there's a mock event today (simplistic mapping)
            const hasEvent = mockEvents.some(e => {
                const eventDate = new Date();
                eventDate.setDate(now.getDate() + e.dayOffset);
                return eventDate.getDate() === i && eventDate.getMonth() === month;
            });

            if (hasEvent) {
                const dot = document.createElement('div');
                dot.className = 'day-event-dot';
                dayDiv.appendChild(dot);
            }

            calendarDaysElement.appendChild(dayDiv);
        }

        // Next month filler days (to complete the grid)
        const totalCells = calendarDaysElement.children.length;
        const remainingCells = 42 - totalCells; // 6 rows of 7
        for (let i = 1; i <= remainingCells; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day not-current';
            dayDiv.innerHTML = `<span class="day-number">${i}</span>`;
            calendarDaysElement.appendChild(dayDiv);
        }

        renderEvents();
    }

    function renderEvents() {
        eventListElement.innerHTML = '';
        const now = new Date();

        mockEvents.forEach(event => {
            const eventDate = new Date();
            eventDate.setDate(now.getDate() + event.dayOffset);

            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';

            let datePrefix = '';
            if (event.dayOffset === 0) datePrefix = 'Today - ';
            else if (event.dayOffset === 1) datePrefix = 'Tomorrow - ';
            else datePrefix = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' - ';

            eventItem.innerHTML = `
                <div class="event-time">${datePrefix}${event.time}</div>
                <div class="event-title">${event.title}</div>
            `;
            eventListElement.appendChild(eventItem);
        });
    }

    // Initial setup
    updateClock();
    renderCalendar();

    // Intervals
    setInterval(updateClock, 1000);
});
