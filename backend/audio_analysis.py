import os
import tempfile
import threading
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

import google.generativeai as genai
from ibm_watson import SpeechToTextV1
from ibm_watson.websocket import RecognizeCallback, AudioSource
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

# --- CONFIG ---
IBM_API_KEY = os.getenv("IBM_API_KEY", "il6MWSXvjcAw_2NdDGeIb0pzhltkkxK5rMIfSUogOJ5k")
IBM_SERVICE_URL = os.getenv("IBM_SERVICE_URL", "https://api.au-syd.speech-to-text.watson.cloud.ibm.com/instances/5cf36802-2eae-4359-aa8e-bc9551322ee3")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyB2ntSs25uqw_3KYhi-5Mpm-2HCu4HaP0s")

# --- IBM Watson Setup ---
authenticator_stt = IAMAuthenticator(IBM_API_KEY)
speech_to_text = SpeechToTextV1(authenticator=authenticator_stt)
speech_to_text.set_service_url(IBM_SERVICE_URL)

# --- Gemini Setup ---
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(model_name="models/gemini-1.5-pro")

# --- FastAPI Router ---
router = APIRouter()

# --- RecognizeCallback for threading ---
class MyRecognizeCallback(RecognizeCallback):
    def __init__(self):
        super().__init__()
        self.transcript = []
        self.done = threading.Event()

    def on_transcription(self, transcript):
        for result in transcript:
            self.transcript.append(result['transcript'])

    def on_error(self, error):
        self.done.set()
        print(f"Error: {error}")

    def on_close(self):
        self.done.set()

# --- Gemini Fake News Detection ---
def detect_fake_news(article_text):
    prompt = f"""
    You are a fact-checking assistant. Read the article below and respond ONLY with:
    - 'True' if the article seems accurate.
    - 'False' if the article seems fake.
    Then provide a short explanation why.

    Article:
    \"\"\"{article_text}\"\"\"
    """
    response = model.generate_content(prompt)
    return response.text.strip()

# --- Main API Endpoint ---
@router.post("/analyze-audio")
async def analyze_audio(file: UploadFile = File(...)):
    if not file.filename.endswith(".wav"):
        raise HTTPException(status_code=400, detail="Only .wav files are supported.")

    # Save uploaded file to temp location
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Transcribe using IBM Watson
    callback = MyRecognizeCallback()
    with open(tmp_path, "rb") as audio_file:
        audio_source = AudioSource(audio_file)
        thread = threading.Thread(
            target=speech_to_text.recognize_using_websocket,
            args=(audio_source, "audio/wav", callback)
        )
        thread.start()
        callback.done.wait(timeout=60)  # Wait for transcription or timeout

    os.remove(tmp_path)
    transcript = " ".join(callback.transcript).strip()
    if not transcript:
        raise HTTPException(status_code=500, detail="Transcription failed.")

    # Analyze with Gemini
    gemini_result = detect_fake_news(transcript)

    return JSONResponse({
        "transcript": transcript,
        "gemini_result": gemini_result
    })