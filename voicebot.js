document.addEventListener("DOMContentLoaded", function() {
    const askButton = document.getElementById("ask-button"); // Correct ID from HTML
    const responseElement = document.getElementById("response"); // Correct ID from HTML
    const askText = document.getElementById("ask-text"); // Text that needs to change dynamically
    let isListening = false; // Track if the mic is currently listening
    let isResponding = false; // Track if the assistant is responding
    let isSpeaking = false; // Track if the assistant is currently speaking

    // Function to determine the greeting based on the current time
    function getGreeting() {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            return "Good morning!";
        } else if (currentHour < 18) {
            return "Good afternoon!";
        } else {
            return "Good evening!";
        }
    }

    // Set the greeting when the page loads
    askText.innerText = getGreeting(); // Display the greeting

    // Start or stop listening based on the mic button
    askButton.addEventListener("click", async function() {
        if (isSpeaking) {
            stopResponse(); // If speaking, stop the response
        } else if (isListening) {
            stopListening();  // Stop listening if already listening
        } else {
            startListening();  // Start listening if not already listening or responding
        }
    });

    async function startListening() {
        isListening = true;
        isResponding = false;
        askButton.innerHTML = '<i class="fas fa-stop"></i>';  // Change mic icon to stop
        askText.innerText = "Listening...";  // Change the text dynamically when listening starts

        try {
            const question = await getVoiceInput();
            askText.innerText = question;  // Change the text to the question the user asked
            responseElement.innerText = "Processing...";  // Show processing text

            if (question) {
                const response = await fetch("https://nova-backend-8lwz.onrender.com/ask", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ question })
                });

                const result = await response.json();
                const aiResponse = result.response;
                askText.innerText = aiResponse;  // Change the text to the assistant's response
                responseElement.innerText = "";  // Clear the extra text area
                speakText(aiResponse);  // Speak the AI response out loud
                isResponding = true;
            } else {
                responseElement.innerText = "I couldn't hear your question.";
                stopListening();
            }
        } catch (error) {
            console.error("Error:", error);
            responseElement.innerText = "There was an error processing your request.";
            stopListening();
        }
    }

    function stopListening() {
        isListening = false;
        askButton.innerHTML = '<i class="fas fa-microphone"></i>';  // Change mic icon back to mic
        askText.innerText = "Tap to ask your AI assistant a question.";  // Reset text back to default
    }

    function stopResponse() {
        if (isSpeaking) {
            // Stop the speech synthesis if speaking
            window.speechSynthesis.cancel(); // Stops the speech synthesis
            askText.innerText = "Speech stopped. Ready for the next question."; // Update the text when speech is stopped
            isSpeaking = false;
            askButton.innerHTML = '<i class="fas fa-microphone"></i>';  // Reset mic icon
        }
    }

    // This function captures voice input using the Web Speech API
    async function getVoiceInput() {
        return new Promise((resolve, reject) => {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = "en-US";
            recognition.start();

            recognition.onresult = (event) => {
                const transcription = event.results[0][0].transcript;
                resolve(transcription);
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                reject("Error occurred while recognizing speech.");
            };
        });
    }

    function speakText(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => {
            isSpeaking = true;
        };

        utterance.onend = () => {
            isSpeaking = false;
            isResponding = false;  // Reset after speaking ends
            askText.innerText = "Tap to ask your AI assistant a question.";  // Reset text when done
        };

        window.speechSynthesis.speak(utterance);
    }
});
