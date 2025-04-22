const checkButton = document.getElementById('check-button');
const inputText = document.getElementById('input-text');
const responseOutput = document.getElementById('response-output');

checkButton.addEventListener('click', async () => {
    const text = inputText.value.trim();
    responseOutput.textContent = '';
    if (!text) {
        responseOutput.textContent = 'Please enter a news article.';
        responseOutput.className = 'result error';
        return;
    }

    responseOutput.textContent = 'Checking...';
    responseOutput.className = 'result loading';

    try {
        const response = await fetch(`http://localhost:8000/check-news?text=${encodeURIComponent(text)}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        if (data) {
            const verdict = (data.verdict || '').toLowerCase();
            if (verdict === 'fake') {
                responseOutput.innerHTML = `<strong>❌ Fake</strong><br><span>${data.reason}</span>`;
                responseOutput.className = 'result fake';
            } else if (verdict === 'real') {
                responseOutput.innerHTML = `<strong>✅ Real</strong><br><span>${data.reason}</span>`;
                responseOutput.className = 'result real';
            } else {
                responseOutput.innerHTML = `<strong>🤔 Unable to determine</strong><br><span>${data.reason || 'The system could not determine if this news is real or fake.'}</span>`;
                responseOutput.className = 'result error';
            }
        } else {
            responseOutput.textContent = 'No response from the server.';
            responseOutput.className = 'result error';
        }
    } catch (error) {
        responseOutput.textContent = 'Error: ' + error.message;
        responseOutput.className = 'result error';
    }
});

document.getElementById('webview-button').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('web/index.html') });
});

document.getElementById('image-analysis-btn').onclick = function () {
    chrome.tabs.create({ url: chrome.runtime.getURL('web/image-analysis.html') });
};

document.getElementById('audio-analysis-btn').onclick = function () {
    chrome.tabs.create({ url: 'https://your-website.com/audio-analysis' });
};

document.getElementById('analyze-btn').onclick = function () {
    window.open('analyze.html', '_blank');
};

document.getElementById('image-analyze-btn').onclick = function () {
    window.open('analyze.html#image', '_blank');
};