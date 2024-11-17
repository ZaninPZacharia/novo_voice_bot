from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from gtts import gTTS
import os
from io import BytesIO

app = Flask(__name__)

# Enable CORS for the entire Flask app
CORS(app, resources={r"/ask": {"origins": "http://127.0.0.1:5500"}})

# API Key and URL for Gemini AI
API_KEY = "AIzaSyD6M7Y7jROPSx5-MOx3keGugRI-ehIpQME"
API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

def generate_response(prompt):
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": f"Please provide a short and concise response: {prompt}"}]}]
    }

    try:
        response = requests.post(f"{API_URL}?key={API_KEY}", headers=headers, json=data)
        if response.status_code == 200:
            candidates = response.json().get('candidates', [])
            if candidates:
                return candidates[0]['content']['parts'][0]['text']
            else:
                return "No valid response received."
        else:
            return "I'm having trouble answering that."
    except Exception as e:
        print(f"Error: {e}")
        return "I'm having trouble answering that."

# Helper function to detect educational questions
def is_educational_question(question):
    educational_keywords = ["how", "what", "why", "explain", "define", "when", "where", "tell me about", "describe"]
    return any(keyword in question.lower() for keyword in educational_keywords)

@app.route("/ask", methods=["POST"])
def ask():
    question = request.json.get("question")
    if question:
        question_lower = question.lower()

        # Specific response for "who are you"
        if "who are you" in question_lower:
            response_text = "I am Nova, created by Zanin P Zacharia."
        elif "who developed you" in question_lower:
            response_text = "I was developed by Zanin P Zacharia using Google’s Gemini AI."
        # Check if the question is educational
        elif is_educational_question(question):
            response_text = generate_response(question)
        else:
            response_text = "I am designed for educational purposes only."

        # Convert response to speech and send back as an audio file
        audio = gTTS(response_text, lang='en')
        audio_fp = BytesIO()
        audio.save(audio_fp)
        audio_fp.seek(0)  # Move pointer to the start of the file-like object
        return jsonify({"response": response_text, "audio": audio_fp.getvalue().decode('latin1')})

    return jsonify({"response": "No question provided."})

if __name__ == "__main__":
    app.run(debug=True)
