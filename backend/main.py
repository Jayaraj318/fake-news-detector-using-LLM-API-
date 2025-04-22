from fastapi import FastAPI, UploadFile, File, Form, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ocr_utils import extract_text_from_image_bytes
import os
import google.generativeai as genai
import json
import re
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(model_name="models/gemini-1.5-pro")

app = FastAPI(title="Fake News Detection API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def detect_fake_news(article_text: str) -> dict:
    prompt = f"""
You are a fact-checking assistant. Read the article below and reply ONLY in valid JSON with:
{{
  "verdict": "Fake" or "Real",
  "reason": "A short explanation"
}}
Do not include any other text or formatting.

Article:
\"\"\"
{article_text}
\"\"\"
"""

    response = model.generate_content(prompt)
    llm_response = response.text.strip()
    print("LLM raw response:", llm_response)  # 

    try:
        response_json = json.loads(llm_response)
        verdict = response_json.get("verdict", "").strip().lower()
        if verdict in ["real", "true"]:
            verdict = "Real"
        elif verdict in ["fake", "false"]:
            verdict = "Fake"
        else:
            verdict = "Unknown"
        reason = response_json.get("reason", "")
    except Exception as e:
        match = re.search(r'\{.*\}', llm_response, re.DOTALL)
        if match:
            try:
                response_json = json.loads(match.group())
                verdict = response_json.get("verdict", "").strip().lower()
                if verdict in ["real", "true"]:
                    verdict = "Real"
                elif verdict in ["fake", "false"]:
                    verdict = "Fake"
                else:
                    verdict = "Unknown"
                reason = response_json.get("reason", "")
            except Exception as e2:
                verdict = "Unknown"
                reason = f"Error parsing LLM response (regex fallback): {e2}"
        else:
            if "fake" in llm_response.lower():
                verdict = "Fake"
            elif "real" in llm_response.lower() or "true" in llm_response.lower():
                verdict = "Real"
            else:
                verdict = "Unknown"
            reason = llm_response

    return {"verdict": verdict, "reason": reason}

def analyze_text(text):
    prompt = f"""
    You are a fact-checking assistant. Read the article below and respond ONLY with:
    - 'True' if the article seems accurate.
    - 'False' if the article seems fake.
    Then provide a short explanation why.

    Article:
    \"\"\"{text}\"\"\"
    """
    response = model.generate_content(prompt)
    return response.text.strip()

def parse_gemini_response(response_text):
    """
    Extracts verdict and reason from Gemini's response.
    Assumes response starts with 'True' or 'False' (or 'Fake'/'Real'), then explanation.
    """
    lines = response_text.strip().split('\n', 1)
    first_line = lines[0].strip()
    if first_line.lower().startswith('true'):
        verdict = "Real"
        reason = response_text[len('True'):].strip()
    elif first_line.lower().startswith('false'):
        verdict = "Fake"
        reason = response_text[len('False'):].strip()
    elif first_line.lower().startswith('real'):
        verdict = "Real"
        reason = response_text[len('Real'):].strip()
    elif first_line.lower().startswith('fake'):
        verdict = "Fake"
        reason = response_text[len('Fake'):].strip()
    else:
        # fallback: treat first word as verdict, rest as reason
        parts = response_text.strip().split(' ', 1)
        verdict = parts[0]
        reason = parts[1] if len(parts) > 1 else ""
    return verdict, reason

@app.post("/check-news")
async def check_news(text: str = Form(None), image: UploadFile = File(None)):
    if image:
        image_bytes = await image.read()
        extracted_text = extract_text_from_image_bytes(image_bytes)
    elif text:
        extracted_text = text
    else:
        return {"error": "No input provided."}
    analysis = analyze_text(extracted_text)
    return {"extracted_text": extracted_text, "analysis": analysis}

@app.get("/check-news")
async def check_news_get(text: str = Query(..., min_length=10, max_length=5000)):
    if not text:
        raise HTTPException(status_code=400, detail="Text query parameter is required")
    result = detect_fake_news(text)
    return result

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    extracted_text = extract_text_from_image_bytes(image_bytes)
    prompt = f"""
    You are a fact-checking assistant. Read the article below and respond ONLY with:
    - 'True' if the article seems accurate.
    - 'False' if the article seems fake.
    Then provide a short explanation why.

    Article:
    \"\"\"{extracted_text}\"\"\"
    """
    gemini_response = model.generate_content(prompt).text.strip()
    verdict, reason = parse_gemini_response(gemini_response)
    return {"verdict": verdict, "reason": reason}
