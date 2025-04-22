chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "check-fake-news",
        title: "Check Fake News with Gemini",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "check-fake-news" && info.selectionText) {
        const text = info.selectionText.trim();
        try {
            const response = await fetch(`http://localhost:8000/check-news?text=${encodeURIComponent(text)}`);
            if (!response.ok) throw new Error("Network error");
            const data = await response.json();
            const verdict = data.verdict === "Fake" ? "❌ Fake" : "✅ Real";
            const reason = data.reason || "";
            const message = `${verdict}\n${reason}`;

            // Try notification
            chrome.notifications.create({
                type: "basic",
                iconUrl: "icons/icon128.png",
                title: "Fake News Check Result",
                message: message.length > 200 ? message.slice(0, 197) + "..." : message
            }, () => {
                if (chrome.runtime.lastError) {
                    // Fallback to alert if notification fails
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: (msg) => alert(msg),
                        args: [message]
                    });
                }
            });
        } catch (err) {
            // Fallback to alert on error
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (msg) => alert(msg),
                args: ["Error checking news: " + err.message]
            });
        }
    }
});