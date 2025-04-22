const webInput = document.getElementById('web-input');
const webCheckBtn = document.getElementById('web-check-btn');
const webResult = document.getElementById('web-result');

function showLoading() {
    webCheckBtn.disabled = true;
    webCheckBtn.innerHTML = `
        <span class="btn-text">Analyzing</span>
        <div class="loader"></div>
    `;
    webCheckBtn.classList.add('loading');
}

function resetButton() {
    webCheckBtn.disabled = false;
    webCheckBtn.innerHTML = `
        <span class="btn-text">Analyze Article</span>
        <span class="btn-icon">→</span>
    `;
    webCheckBtn.classList.remove('loading');
}

webCheckBtn.addEventListener('click', async () => {
    const text = webInput.value.trim();
    webResult.innerHTML = '';
    webResult.className = 'result';

    if (!text) {
        webResult.innerHTML = `
            <div class="alert-error">
                <span class="icon">⚠️</span>
                <span>Please enter a news article to analyze.</span>
            </div>
        `;
        webResult.classList.add('error');
        return;
    }

    showLoading();

    try {
        const response = await fetch(`http://localhost:8000/check-news?text=${encodeURIComponent(text)}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        if (data && data.verdict) {
            const verdict = (data.verdict || '').toLowerCase();
            let icon, label;

            if (verdict === 'fake') {
                icon = '🚫';
                label = 'Potentially Misleading';
                webResult.className = 'result fake';
            } else if (verdict === 'real') {
                icon = '✓';
                label = 'Verified Authentic';
                webResult.className = 'result real';
            }

            webResult.innerHTML = `
                <div class="verdict-header">
                    <span class="verdict-icon">${icon}</span>
                    <span class="verdict-label">${label}</span>
                </div>
                <div class="verdict-reason">${data.reason}</div>
            `;
        }
    } catch (error) {
        webResult.innerHTML = `
            <div class="alert-error">
                <span class="icon">❌</span>
                <span>Error: ${error.message}</span>
            </div>
        `;
        webResult.classList.add('error');
    } finally {
        resetButton();
    }
});

// Add input animations
webInput.addEventListener('focus', () => {
    webInput.parentElement.classList.add('focused');
});

webInput.addEventListener('blur', () => {
    webInput.parentElement.classList.remove('focused');
});

document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabText = document.getElementById('tab-text-pro');
    const tabImage = document.getElementById('tab-image-pro');
    const textSection = document.getElementById('text-section-pro');
    const imageSection = document.getElementById('image-section-pro');

    tabText.onclick = () => {
        tabText.classList.add('active');
        tabImage.classList.remove('active');
        textSection.classList.add('active');
        imageSection.classList.remove('active');
    };
    tabImage.onclick = () => {
        tabImage.classList.add('active');
        tabText.classList.remove('active');
        imageSection.classList.add('active');
        textSection.classList.remove('active');
    };

    // Text Analysis
    const analyzeBtn = document.getElementById('web-check-btn-pro');
    const textarea = document.getElementById('web-input-pro');
    const loading = document.getElementById('web-loading-pro');
    const result = document.getElementById('web-result-pro');

    analyzeBtn.onclick = async () => {
        const text = textarea.value.trim();
        result.textContent = '';
        result.className = 'result-pro';

        if (!text) {
            result.textContent = "Please enter some text to analyze.";
            result.className = "result-pro";
            return;
        }
        analyzeBtn.disabled = true;
        loading.style.display = "flex";
        result.textContent = "";
        result.className = "result-pro";
        // Simulate API call
        setTimeout(() => {
            loading.style.display = "none";
            analyzeBtn.disabled = false;
            // Demo verdict
            const isFake = text.length % 2 === 0;
            result.textContent = isFake ? "This news appears to be FAKE." : "This news appears to be REAL.";
            result.className = "result-pro " + (isFake ? "fake" : "real");
        }, 1800);
    };

    // Image Analysis
    const imageInput = document.getElementById('image-input-pro');
    const imageBtn = document.getElementById('analyze-image-btn-pro');
    const imagePreview = document.getElementById('image-preview-container-pro');
    const imageLoading = document.getElementById('image-loading-pro');
    const imageResult = document.getElementById('image-analysis-result-pro');
    const extractedText = document.getElementById('extracted-text-pro');

    imageInput.onchange = () => {
        imageResult.textContent = "";
        extractedText.style.display = "none";
        imageBtn.disabled = !imageInput.files.length;
        imagePreview.innerHTML = "";
        if (imageInput.files.length) {
            const file = imageInput.files[0];
            const reader = new FileReader();
            reader.onload = e => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = "image-preview";
                imagePreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    };

    imageBtn.onclick = () => {
        imageBtn.disabled = true;
        imageLoading.style.display = "flex";
        imageResult.textContent = "";
        extractedText.style.display = "none";
        // Simulate OCR + analysis
        setTimeout(() => {
            imageLoading.style.display = "none";
            imageBtn.disabled = false;
            extractedText.textContent = "Extracted text: Example headline from image.";
            extractedText.style.display = "block";
            const isFake = Math.random() > 0.5;
            imageResult.textContent = isFake ? "This image likely contains FAKE news." : "This image likely contains REAL news.";
            imageResult.className = "analysis-result " + (isFake ? "error" : "success");
        }, 2000);
    };

    // --- Image Analysis (real backend) ---
    const imageInputReal = document.getElementById('image-input');
    const imageBtnReal = document.getElementById('analyze-image-btn');
    const imagePreviewReal = document.getElementById('image-preview-container');
    const imageResultReal = document.getElementById('image-analysis-result');
    const extractedTextReal = document.getElementById('extracted-text');

    if (imageInputReal && imageBtnReal && imagePreviewReal && imageResultReal) {
        imageInputReal.addEventListener('change', function () {
            imagePreviewReal.innerHTML = '';
            extractedTextReal.style.display = 'none';
            imageResultReal.textContent = '';
            extractedTextReal.textContent = '';
            imageBtnReal.disabled = true;

            if (this.files && this.files[0]) {
                const file = this.files[0];
                const img = document.createElement('img');
                img.className = 'image-preview';
                img.src = URL.createObjectURL(file);
                img.onload = () => URL.revokeObjectURL(img.src);
                imagePreviewReal.appendChild(img);
                imageBtnReal.disabled = false;
            }
        });

        imageBtnReal.addEventListener('click', async function () {
            const file = imageInputReal.files[0];
            if (!file) return;
            imageBtnReal.disabled = true;
            imageBtnReal.textContent = "Analyzing...";
            extractedTextReal.style.display = 'none';
            imageResultReal.textContent = '';

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('http://localhost:8000/analyze-image', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                // Show verdict and reason
                if (data.verdict && data.reason) {
                    imageResultReal.innerHTML = `<strong>Verdict:</strong> ${data.verdict}<br><strong>Reason:</strong> ${data.reason}`;
                    imageResultReal.style.display = "block";
                } else if (data.reason) {
                    imageResultReal.textContent = data.reason;
                    imageResultReal.style.display = "block";
                } else if (data.analysis) {
                    imageResultReal.textContent = data.analysis;
                    imageResultReal.style.display = "block";
                } else {
                    imageResultReal.textContent = "No analysis result.";
                    imageResultReal.style.display = "block";
                }
            } catch (err) {
                imageResultReal.textContent = "Error analyzing image.";
                imageResultReal.style.display = "block";
            }
            imageBtnReal.disabled = false;
            imageBtnReal.textContent = "Analyze Image";
        });
    }
});