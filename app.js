const btn = document.querySelector('.talk');
const stopBtn = document.querySelector('.stop');
const content = document.querySelector('.content');
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1; 
    text_speak.volume = 1; 
    text_speak.pitch = 0.9;  
    let voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(voice => voice.name.toLowerCase().includes('male')); 
    if (selectedVoice) {
        text_speak.voice = selectedVoice;  
    }

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    const day = new Date();
    const hour = day.getHours();
    if (hour >= 0 && hour < 12) speak("Good Morning Itachi...");
    else if (hour >= 12 && hour < 17) speak("Good Afternoon Itachi...");
    else speak("Good Evening Itachi...");
}

window.addEventListener('load', () => {
    speak("Initializing Sushi...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

stopBtn.addEventListener('click', () => {
    stopRecognition();
    stopSpeech();
});

function stopRecognition() {
    recognition.stop();
    content.textContent = "Stopped listening.";
}

function stopSpeech() {
    window.speechSynthesis.cancel();
    content.textContent = "Speech stopped.";
}

function takeCommand(message) {
    if (message.includes('hello') || message.includes('hi')) {
        speak("Hello Itachi, How may I help you?");
    } 
    else if (message.includes('bye') || message.includes('ok bye')){
        speak("See you, friend...I leave the rest...To you..");
    } 
    else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        const response = `The current time is ${time}.`;
        speak(response);
        appendMessage("Sushi", response);
    } 
    else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        const response = `Today's date is ${date}.`;
        speak(response);
        appendMessage("Sushi", response);
    } 
    else if (message.includes('calculator')) {
        const expression = message.replace('calculator', '').trim();
        if (expression) {
            try {
                const result = evaluateExpression(expression);
                speak(`The result is ${result}`);
                appendMessage("Sushi", `The result is ${result}`);
            } catch (error) {
                speak("Sorry, I couldn't evaluate that expression.");
                appendMessage("Sushi", "Sorry, I couldn't evaluate that expression.");
            }
        } else {
            speak("Please provide an expression to calculate.");
            appendMessage("Sushi", "Please provide an expression to calculate.");
        }
    } 
    else if (message.includes('open youtube')) {
        window.open("https://youtube.com", "_blank");
        const response = "Opening YouTube...";
        speak(response);
        appendMessage("Sushi", response);
    } 
    else if (message.includes('open whatsapp')) {
        window.location.href = "whatsapp://";
        const response = "Opening WhatsApp app...";
        speak(response);
        appendMessage("Sushi", response);
    }
    else if (message.includes('whatsapp chat')) {
        const phoneNumber = message.match(/\d+/g).join('');
        const whatsappURL = `whatsapp://send?phone=${phoneNumber}`;
        window.location.href = whatsappURL;
        const response = `Opening WhatsApp chat with ${phoneNumber}...`;
        speak(response);
        appendMessage("Sushi", response);
    }
    else if (message.includes('open visual studio code')) {
        window.location.href = "vscode://";
        const response = "Opening Visual Studio Code...";
        speak(response);
        appendMessage("Sushi", response);
    } 
    else if (message.includes('open spotify')) {
        window.location.href = "spotify://";
        const response = "Opening Spotify...";
        speak(response);
        appendMessage("Sushi", response);
    } 
    else if (message.includes('open telegram')) {
        window.location.href = "tg://";
        const response = "Opening Telegram...";
        speak(response);
        appendMessage("Sushi", response);
    } 
    else if (message.includes('open linkedin')) {
        window.open("https://www.linkedin.com", "_blank");
        const response = "Opening LinkedIn...";
        speak(response);
        appendMessage("Sushi", response);
    }
    else if (message.includes('open instagram')) {
        window.open("https://www.instagram.com", "_blank");
        const response = "Opening Instagram...";
        speak(response);
        appendMessage("Sushi", response);
    }
    else if (message.includes('wikipedia') || message.includes('what is') || message.includes('who is') || message.includes('define')) {
        const topic = message.replace(/wikipedia|what is|who is|define/g, "").trim();
        if (topic) {
            searchWikipedia(topic);
        } else {
            speak("Please specify a topic you want to search for on Wikipedia.");
            appendMessage("Sushi", "Please specify a topic you want to search for on Wikipedia.");
        }
    } 
    else {
        const response = "I'm not sure about that. Can you ask something else?";
        speak(response);
        appendMessage("Sushi", response);
    }
}

sendButton.addEventListener("click", handleChatInput);
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleChatInput();
});

function handleChatInput() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    appendMessage("You", userMessage);
    processChat(userMessage);
    chatInput.value = "";
}

function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = `${sender}: ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function processChat(message) {
    takeCommand(message.toLowerCase());
}

function searchWikipedia(query) {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.extract) {
                const result = data.extract;
                speak(result);
                appendMessage("Sushi", result);
            } else {
                speak("I couldn't find anything on Wikipedia about that.");
                appendMessage("Sushi", "I couldn't find anything on Wikipedia about that.");
            }
        })
        .catch(error => {
            speak("Sorry, there was an error while fetching the data.");
            appendMessage("Sushi", "Sorry, there was an error while fetching the data.");
        });
}

function evaluateExpression(expression) {
    try {
        return eval(expression); // Evaluates mathematical expressions
    } catch (error) {
        return "Invalid expression";
    }
}
