// JS for the image fake news form
const imageInput = document.getElementById('image-input');
const previewContainer = document.getElementById('image-preview-container');
const analyzeBtn = document.getElementById('analyze-image-btn');
const extractedTextDiv = document.getElementById('extracted-text');
const analysisResultDiv = document.getElementById('image-analysis-result');

let selectedImage = null;

// Show image preview
imageInput.addEventListener('change', function () {
    previewContainer.innerHTML = '';
    extractedTextDiv.style.display = 'none';
    analysisResultDiv.textContent = '';
    extractedTextDiv.textContent = '';
    selectedImage = null;
    analyzeBtn.disabled = true;

    if (this.files && this.files[0]) {
        const file = this.files[0];
        selectedImage = file;
        const img = document.createElement('img');
        img.className = 'image-preview';
        img.src = URL.createObjectURL(file);
        previewContainer.appendChild(img);
        analyzeBtn.disabled = false;
    }
});

// Handle analyze button click
analyzeBtn.addEventListener('click', async function () {
    const file = imageInput.files[0];
    if (!file) return;
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Analyzing...";
    extractedTextDiv.style.display = 'none';
    analysisResultDiv.textContent = '';

    const formData = new FormData();
    formData.append('file', file);

    try {
        // Use the correct backend URL and handle errors
        const response = await fetch('http://localhost:8000/analyze-image', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            if (response.status === 429) {
                analysisResultDiv.textContent = "API quota exceeded. Please try again later.";
            } else {
                analysisResultDiv.textContent = "Error analyzing image. (" + response.status + ")";
            }
            analysisResultDiv.className = "analysis-result error";
            analysisResultDiv.style.display = "block";
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = "Analyze Image";
            return;
        }

        const data = await response.json();

        // Always show verdict if present, fallback to reason or analysis
        if (data.verdict) {
            let verdictLabel = '';
            let verdictIcon = '';
            if (String(data.verdict).toLowerCase() === 'fake') {
                verdictLabel = 'Fake News';
                verdictIcon = '❌';
                analysisResultDiv.className = "analysis-result error";
            } else if (String(data.verdict).toLowerCase() === 'real') {
                verdictLabel = 'Real News';
                verdictIcon = '✅';
                analysisResultDiv.className = "analysis-result success";
            } else {
                verdictLabel = data.verdict;
                verdictIcon = '🤔';
                analysisResultDiv.className = "analysis-result";
            }
            analysisResultDiv.innerHTML = `<strong>${verdictIcon} ${verdictLabel}</strong><br><span>${data.reason || ''}</span>`;
            analysisResultDiv.style.display = "block";
        } else if (data.reason) {
            analysisResultDiv.textContent = data.reason;
            analysisResultDiv.className = "analysis-result";
            analysisResultDiv.style.display = "block";
        } else if (data.analysis) {
            analysisResultDiv.textContent = data.analysis;
            analysisResultDiv.className = "analysis-result";
            analysisResultDiv.style.display = "block";
        } else {
            analysisResultDiv.textContent = "No analysis result.";
            analysisResultDiv.className = "analysis-result";
            analysisResultDiv.style.display = "block";
        }
    } catch (err) {
        analysisResultDiv.textContent = "Error analyzing image.";
        analysisResultDiv.className = "analysis-result error";
        analysisResultDiv.style.display = "block";
    }
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Analyze Image";
});