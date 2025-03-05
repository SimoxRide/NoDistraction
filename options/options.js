document.addEventListener('DOMContentLoaded', () => {
    const startTime = document.getElementById('start-time');
    const endTime = document.getElementById('end-time');
    const dayCheckboxes = document.querySelectorAll('.day-checkbox input');
    const sitesList = document.getElementById('sites-list');
    const newSite = document.getElementById('new-site');
    const addSiteBtn = document.getElementById('add-site');
    const messagesList = document.getElementById('messages-list');
    const newMessage = document.getElementById('new-message');
    const addMessageBtn = document.getElementById('add-message');
    const saveBtn = document.getElementById('save-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Load settings
    loadSettings();

    // Add a new site
    addSiteBtn.addEventListener('click', () => {
        const site = newSite.value.trim();
        if (site) {
            addSiteToList(site);
            newSite.value = '';
        }
    });

    // Add a new message
    addMessageBtn.addEventListener('click', () => {
        const message = newMessage.value.trim();
        if (message) {
            addMessageToList(message);
            newMessage.value = '';
        }
    });

    // Save settings
    saveBtn.addEventListener('click', saveSettings);

    // Reset to default settings
    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset to default settings?')) {
            chrome.storage.sync.get(['focusBlocker'], (result) => {
                const defaultSettings = {
                    blockedSites: [
                        "facebook.com",
                        "twitter.com",
                        "instagram.com",
                        "reddit.com",
                        "youtube.com",
                        "tiktok.com"
                    ],
                    workingHours: {
                        start: "09:00",
                        end: "17:00"
                    },
                    workingDays: [1, 2, 3, 4, 5],
                    isActive: true,
                    motivationalMessages: [
                        "Stay focused on your work!",
                        "This site is blocked during working hours",
                        "Don't get distracted, your future depends on today",
                        "Every minute counts, get back to work!"
                    ]
                };

                chrome.storage.sync.set({ focusBlocker: defaultSettings }, loadSettings);
            });
        }
    });

    // Function to load settings
    function loadSettings() {
        chrome.storage.sync.get(['focusBlocker'], (result) => {
            const settings = result.focusBlocker;

            // Set times
            startTime.value = settings.workingHours.start;
            endTime.value = settings.workingHours.end;

            // Set days
            dayCheckboxes.forEach(checkbox => {
                checkbox.checked = settings.workingDays.includes(parseInt(checkbox.value));
            });

            // Set blocked sites
            sitesList.innerHTML = '';
            settings.blockedSites.forEach(site => {
                addSiteToList(site);
            });

            // Set motivational messages
            messagesList.innerHTML = '';
            settings.motivationalMessages.forEach(message => {
                addMessageToList(message);
            });
        });
    }

    // Function to save settings
    function saveSettings() {
        // Collect selected working days
        const workingDays = [];
        dayCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                workingDays.push(parseInt(checkbox.value));
            }
        });

        // Collect blocked sites
        const blockedSites = [];
        document.querySelectorAll('.site-item span').forEach(span => {
            blockedSites.push(span.textContent);
        });

        // Collect motivational messages
        const motivationalMessages = [];
        document.querySelectorAll('.message-item span').forEach(span => {
            motivationalMessages.push(span.textContent);
        });

        // Create new settings
        const newSettings = {
            workingHours: {
                start: startTime.value,
                end: endTime.value
            },
            workingDays: workingDays,
            blockedSites: blockedSites,
            motivationalMessages: motivationalMessages,
            isActive: true // Maintain current state
        };

        // Get current state and merge with new settings
        chrome.storage.sync.get(['focusBlocker'], (result) => {
            const currentSettings = result.focusBlocker;
            newSettings.isActive = currentSettings.isActive;

            // Save new settings
            chrome.storage.sync.set({ focusBlocker: newSettings }, () => {
                showSavedMessage();
            });
        });
    }

    // Function to add a site to the list
    function addSiteToList(site) {
        const item = document.createElement('div');
        item.className = 'site-item';

        const span = document.createElement('span');
        span.textContent = site;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            item.remove();
        });

        item.appendChild(span);
        item.appendChild(deleteBtn);
        sitesList.appendChild(item);
    }

    // Function to add a message to the list
    function addMessageToList(message) {
        const item = document.createElement('div');
        item.className = 'message-item';

        const span = document.createElement('span');
        span.textContent = message;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            item.remove();
        });

        item.appendChild(span);
        item.appendChild(deleteBtn);
        messagesList.appendChild(item);
    }

    // Function to show a saved message
    function showSavedMessage() {
        const message = document.createElement('div');
        message.className = 'saved-message';
        message.textContent = 'Settings saved!';
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.left = '50%';
        message.style.transform = 'translateX(-50%)';
        message.style.backgroundColor = '#4CAF50';
        message.style.color = 'white';
        message.style.padding = '10px 20px';
        message.style.borderRadius = '5px';
        message.style.zIndex = '1000';

        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }
});