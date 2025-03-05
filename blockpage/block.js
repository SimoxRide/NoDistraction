// Calculate end time directly
function calculateTimeRemaining() {
    // Default end time (5:00 PM)
    const defaultEndHour = 17;
    const defaultEndMinute = 0;

    const now = new Date();
    const end = new Date();
    end.setHours(defaultEndHour, defaultEndMinute, 0);

    // If it's already past end time, show 0
    if (now >= end) {
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        return;
    }

    // Calculate difference
    const diffMs = end - now;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    // Update display
    document.getElementById('hours').textContent = diffHrs;
    document.getElementById('minutes').textContent = diffMins;
}

document.addEventListener('DOMContentLoaded', () => {
    // Get message from URL
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message) {
        document.getElementById('motivation-message').textContent = message;
    }

    // Calculate time remaining immediately
    calculateTimeRemaining();

    // Update time every minute
    setInterval(calculateTimeRemaining, 60000);

    // Handle back button
    document.getElementById('back-btn').addEventListener('click', () => {
        history.back();
    });
});