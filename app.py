from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from gtts import gTTS
from io import BytesIO
import base64
import os  # Import os for environment variables

app = Flask(__name__)

# Enable CORS for the entire Flask app to allow requests from GitHub Pages
CORS(app, resources={r"/ask": {"origins": "https://zaninpzacharia.github.io"}})  # Allow CORS from GitHub Pages

# Load API Key securely from environment variables
API_KEY = os.getenv("GEMINI_API_KEY")  # Ensure you have this in your environment variables or .env file
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

@app.route("/")
def home():
    return "Nova is live! Welcome to the educational assistant."

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
        
        # Convert response text to speech using gTTS
        audio = gTTS(response_text, lang='en')
        audio_fp = BytesIO()
        audio.write_to_fp(audio_fp)  # Write directly to the BytesIO object
        audio_fp.seek(0)  # Reset pointer to the start of the file-like object

        # Encode the audio in base64 for sending over HTTP
        audio_base64 = base64.b64encode(audio_fp.read()).decode('utf-8')

        return jsonify({"response": response_text, "audio": audio_base64})
    
    return jsonify({"response": "No question provided."})

if __name__ == "__main__":
    # Use the environment variable for the port (Render provides it)
    port = int(os.environ.get("PORT", 5000))  # Use 5000 as fallback
    app.run(debug=True, host='0.0.0.0', port=port)
