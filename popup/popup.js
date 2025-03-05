document.addEventListener('DOMContentLoaded', () => {
    const statusText = document.getElementById('status-text');
    const activeToggle = document.getElementById('active-toggle');
    const workTime = document.getElementById('work-time');
    const sitesCount = document.getElementById('sites-count');
    const optionsBtn = document.getElementById('options-btn');

    // Load settings
    chrome.storage.sync.get(['focusBlocker'], (result) => {
        const settings = result.focusBlocker;

        // Update interface
        activeToggle.checked = settings.isActive;
        statusText.textContent = settings.isActive ? 'Active' : 'Inactive';
        statusText.className = settings.isActive ? 'active' : 'inactive';
        workTime.textContent = `${settings.workingHours.start} - ${settings.workingHours.end}`;
        sitesCount.textContent = settings.blockedSites.length;
    });

    // Handle active state change
    activeToggle.addEventListener('change', () => {
        chrome.storage.sync.get(['focusBlocker'], (result) => {
            const settings = result.focusBlocker;
            settings.isActive = activeToggle.checked;

            chrome.storage.sync.set({ focusBlocker: settings }, () => {
                statusText.textContent = settings.isActive ? 'Active' : 'Inactive';
                statusText.className = settings.isActive ? 'active' : 'inactive';
            });
        });
    });

    // Open options page
    optionsBtn.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
});