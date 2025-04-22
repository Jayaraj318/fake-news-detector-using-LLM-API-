chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: "check-fake-news",
            title: "Check Fake News with Gemini",
            contexts: ["selection"]
        }, () => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            }
        });
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "check-fake-news" && info.selectionText) {
        const selectedText = encodeURIComponent(info.selectionText.trim());
        chrome.windows.create({
            url: `analyze.html?text=${selectedText}`,
            type: "popup",
            width: 400,
            height: 500
        });
    }
});