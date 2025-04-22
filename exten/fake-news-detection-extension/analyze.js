window.onload = function () {
    // If text is passed via query param, fill it in
    const params = new URLSearchParams(window.location.search);
    const selectedText = params.get('text');
    if (selectedText) {
        document.getElementById('input-text').value = selectedText;
    }
};

const checkButton = document.getElementById('check-button');
const inputText = document.getElementById('input-text');
const responseOutput = document.getElementById('response-output');
const imageResultDiv = document.getElementById('image-result');

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
            responseOutput.innerHTML = `<strong>${data.verdict === 'Fake' ? '❌ Fake' : '✅ Real'}</strong><br><span>${data.reason}</span>`;
            responseOutput.className = `result ${data.verdict === 'Fake' ? 'fake' : 'real'}`;

            if (data.verdict) {
                imageResultDiv.innerHTML = `<strong>Verdict:</strong> ${data.verdict}<br><strong>Reason:</strong> ${data.reason || ''}`;
                imageResultDiv.style.display = "block";
            } else if (data.reason) {
                imageResultDiv.textContent = data.reason;
                imageResultDiv.style.display = "block";
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