// Default settings
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
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    isActive: true,
    motivationalMessages: [
        "Stay focused on your work!",
        "This site is blocked during working hours",
        "Don't get distracted, your future depends on today",
        "Every minute counts, get back to work!"
    ]
};

// Initialize settings
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['focusBlocker'], (result) => {
        if (!result.focusBlocker) {
            chrome.storage.sync.set({ focusBlocker: defaultSettings });
        }
    });
});

// Check if current time is within working hours
function isDuringWorkingHours(settings) {
    const now = new Date();
    const day = now.getDay(); // 0-6, where 0 is Sunday

    // Check if today is a working day
    if (!settings.workingDays.includes(day)) return false;

    const currentTime = now.getHours() * 60 + now.getMinutes();

    const startParts = settings.workingHours.start.split(':');
    const startTime = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);

    const endParts = settings.workingHours.end.split(':');
    const endTime = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);

    return currentTime >= startTime && currentTime <= endTime;
}

// Check if URL is in the list of blocked sites
function isBlockedSite(url, blockedSites) {
    return blockedSites.some(site => url.includes(site));
}

// Handle web navigation
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    // Ignore frames, only consider main navigation
    if (details.frameId !== 0) return;

    chrome.storage.sync.get(['focusBlocker'], (result) => {
        const settings = result.focusBlocker;

        // If extension is active and we're in working hours
        if (settings.isActive && isDuringWorkingHours(settings)) {
            if (isBlockedSite(details.url, settings.blockedSites)) {
                // Select a random motivational message
                const message = settings.motivationalMessages[
                    Math.floor(Math.random() * settings.motivationalMessages.length)
                ];

                // Redirect to a block page
                chrome.tabs.update(details.tabId, {
                    url: `blockpage/block.html?message=${encodeURIComponent(message)}`
                });
            }
        }
    });
});