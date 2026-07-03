// ========================================
// UKF SERVICES - CHATBOT SYSTEM v1.0
// Production-Ready B2B Chat Logic
// FIXED: Improved logging and error handling
// ========================================

// ------------------------------
// CHAT STATE MANAGEMENT
// ------------------------------

const chatState = {
  stage: "chat",              // chat | escalation_offer | collecting_contact | ended
  escalationOffered: false,
  contactRequested: false,
  contactCaptured: false,
  messageCount: 0
};

// ------------------------------
// KEYWORD SETS (INTENT DETECTION)
// ------------------------------

const pricingKeywords = ["price", "cost", "quote", "rate", "charges", "fee", "pricing", "expensive", "cheap"];
const complianceKeywords = ["customs", "regulation", "hs code", "dangerous", "chemical", "battery", "compliance", "clearance", "documentation"];
const urgencyKeywords = ["urgent", "asap", "stuck", "delay", "problem", "issue", "emergency", "help", "quickly"];
const serviceKeywords = ["ocean", "sea", "air", "freight", "shipping", "cargo", "warehouse", "transport", "delivery"];

const affirmativeKeywords = ["yes", "yeah", "yep", "sure", "okay", "ok", "please do", "absolutely", "correct", "right"];
const negativeKeywords = ["no", "nope", "not now", "later", "don't", "do not", "maybe later", "not interested"];
const endKeywords = ["bye", "thanks", "thank you", "goodbye", "end", "done", "that's all", "thats all"];

// ------------------------------
// DOM REFERENCES
// ------------------------------

let chatBubble, chatWindow, chatMessages, chatInput, chatSendBtn, typingIndicator;

// ------------------------------
// INITIALIZATION
// ------------------------------

document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
});

function initializeChatbot() {
    // Get DOM elements
    chatBubble = document.getElementById('chatBubble');
    chatWindow = document.getElementById('chatWindow');
    chatMessages = document.getElementById('chatMessages');
    chatInput = document.getElementById('chatInput');
    chatSendBtn = document.getElementById('chatSendBtn');
    typingIndicator = document.getElementById('typingIndicator');

    // Event listeners
    if (chatBubble) {
        chatBubble.addEventListener('click', openChat);
    }

    const closeBtn = document.getElementById('chatClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeChat);
    }

    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    console.log('[CHATBOT] Initialized successfully');
}

// ------------------------------
// CHAT WINDOW CONTROLS
// ------------------------------

function openChat() {
    if (chatWindow && chatBubble) {
        chatWindow.classList.add('active');
        chatBubble.classList.add('active');
        
        // Start conversation if first time
        if (chatState.messageCount === 0) {
            setTimeout(() => {
                startChat();
            }, 800);
        }

        // Focus input
        if (chatInput) {
            setTimeout(() => chatInput.focus(), 400);
        }
    }
}

function closeChat() {
    if (chatWindow && chatBubble) {
        chatWindow.classList.remove('active');
        chatBubble.classList.remove('active');
    }
}

// ------------------------------
// MESSAGE HANDLING
// ------------------------------

function sendMessage() {
    if (!chatInput) return;

    const userText = chatInput.value.trim();
    
    if (!userText) {
        return;
    }

    // Add user message to UI
    addUserMessage(userText);
    
    // Clear input
    chatInput.value = '';
    chatSendBtn.disabled = true;

    // Process message
    setTimeout(() => {
        handleUserMessage(userText);
        chatSendBtn.disabled = false;
    }, 800);
}

function addUserMessage(message) {
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user';
    messageDiv.innerHTML = `
        <div class="message-bubble">
            ${escapeHtml(message)}
            <span class="message-time">${getCurrentTime()}</span>
        </div>
        <div class="message-avatar">YOU</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function addBotMessage(message) {
    if (!chatMessages) return;

    // Show typing indicator
    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();

        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot';
        messageDiv.innerHTML = `
            <div class="message-avatar">UKF</div>
            <div class="message-bubble">
                ${message}
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
        chatState.messageCount++;
    }, 1000 + Math.random() * 1000); // Random delay for natural feel
}

function showTypingIndicator() {
    if (typingIndicator) {
        typingIndicator.style.display = 'flex';
        scrollToBottom();
    }
}

function hideTypingIndicator() {
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}

// ------------------------------
// CONVERSATION LOGIC
// ------------------------------

function startChat() {
    addBotMessage(
        "Hello, welcome to UKF Services. I can help with general questions and guide you to the right next step. How may I assist today?"
    );
}

function handleUserMessage(userText) {
    if (!userText || !userText.trim()) {
        addBotMessage("Could you please let me know how I can help?");
        return;
    }

    const text = userText.toLowerCase();

    // Check if chat has ended
    if (chatState.stage === "ended") {
        addBotMessage("Thank you for your message. Our team will be in touch shortly. Have a great day!");
        return;
    }

    // Check for ending keywords
    if (containsAny(text, endKeywords)) {
        return endChat();
    }

    // Handle escalation decision stage
    if (chatState.stage === "escalation_offer") {
        return handleEscalationDecision(text);
    }

    // Handle contact capture stage
    if (chatState.stage === "collecting_contact") {
        return captureContactDetails(userText);
    }

    // Intent detection (main conversation)
    if (containsAny(text, pricingKeywords)) {
        return handlePricingRequest();
    }
    
    if (containsAny(text, complianceKeywords)) {
        return handleComplianceRequest();
    }
    
    if (containsAny(text, urgencyKeywords)) {
        return handleUrgency();
    }

    if (containsAny(text, serviceKeywords)) {
        return handleServiceInquiry();
    }

    // Default general query handler
    handleGeneralQuery();
}

// ------------------------------
// INTENT HANDLERS
// ------------------------------

function handlePricingRequest() {
    addBotMessage(
        "Pricing depends on several operational factors, so this is best handled by our team to ensure accuracy."
    );
    offerEscalation();
}

function handleComplianceRequest() {
    addBotMessage(
        "I can explain general processes, but compliance-related matters should be reviewed by our specialists to ensure everything is handled correctly."
    );
    offerEscalation();
}

function handleUrgency() {
    addBotMessage(
        "I understand this may be time-sensitive. To avoid delays or incorrect guidance, our office will be best placed to assist."
    );
    offerEscalation();
}

function handleServiceInquiry() {
    addBotMessage(
        "We offer Ocean Freight, Air Freight, Customs Clearance, Warehousing, Road Transport, and Project Cargo services. Would you like specific information about any of these, or would you prefer to speak with our team?"
    );
}

function handleGeneralQuery() {
    addBotMessage(
        "I can help with general information about our services or explain how things typically work. If needed, I can also connect you with our team."
    );
}

// ------------------------------
// ESCALATION FLOW
// ------------------------------

function offerEscalation() {
    if (chatState.escalationOffered) return;

    chatState.escalationOffered = true;
    chatState.stage = "escalation_offer";

    addBotMessage(
        "Would you like me to connect you with our team so they can assist further?"
    );
}

function handleEscalationDecision(text) {
    if (containsAny(text, affirmativeKeywords)) {
        chatState.stage = "collecting_contact";
        requestContactDetails();
        return;
    }

    if (containsAny(text, negativeKeywords)) {
        chatState.stage = "chat";
        chatState.escalationOffered = false;
        addBotMessage(
            "No problem at all. I'm here if you'd like general information or have another question."
        );
        return;
    }

    // Ambiguous response
    addBotMessage(
        "Just let me know if you'd like me to connect you with the team, or we can continue here."
    );
}

function requestContactDetails() {
    if (chatState.contactRequested) return;

    chatState.contactRequested = true;

    addBotMessage(
        "May I take your name and email address so the team can follow up with you? Please provide them in your next message."
    );
}

function captureContactDetails(userText) {
    // Simple email detection
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const email = userText.match(emailRegex);

    if (!email) {
        addBotMessage(
            "I don't see an email address in your message. Could you please provide your email so the team can reach you?"
        );
        return;
    }

    chatState.contactCaptured = true;
    chatState.stage = "ended";

    // Send to backend (integrate with your lead-engine.js)
    submitChatLead({
        name: userText.replace(emailRegex, '').trim() || 'Chat User',
        email: email[0],
        message: getChatTranscript(),
        source: 'Chatbot'
    });

    addBotMessage(
        "Thank you. I've passed this to our team, and they'll be in touch shortly."
    );
    
    setTimeout(() => {
        politeClose();
    }, 2000);
}

// ------------------------------
// CHAT ENDING
// ------------------------------

function endChat() {
    chatState.stage = "ended";
    politeClose();
}

function politeClose() {
    addBotMessage(
        "Thank you for contacting UKF Services. If you need anything further, our team will be happy to assist. Have a great day."
    );
}

// ------------------------------
// LEAD SUBMISSION
// ------------------------------

function submitChatLead(data) {
    console.log('[CHATBOT] Chat Lead Captured:', data);

    // Send to Formspree
    if (typeof fetch !== 'undefined') {
        fetch('https://formspree.io/f/xzdpekbl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                message: data.message,
                source: 'UKF Chatbot',
                _subject: `New Chat Lead: ${data.name}`
            })
        })
        .then(response => {
            if (response.ok) {
                console.log('[CHATBOT] Lead sent successfully');
                return response.json();
            } else {
                console.error('[CHATBOT] Lead submission failed: HTTP', response.status);
                throw new Error(`HTTP ${response.status}`);
            }
        })
        .then(data => {
            console.log('[CHATBOT] Formspree response:', data);
        })
        .catch(err => {
            console.error('[CHATBOT] Lead submission error:', err);
        });
    }
}

function getChatTranscript() {
    if (!chatMessages) return 'No transcript available';
    
    const messages = chatMessages.querySelectorAll('.chat-message');
    let transcript = 'Chat Transcript:\n\n';
    
    messages.forEach(msg => {
        const isBot = msg.classList.contains('bot');
        const bubble = msg.querySelector('.message-bubble');
        if (!bubble) return;
        
        const text = bubble.textContent.trim();
        const time = msg.querySelector('.message-time')?.textContent || '';
        transcript += `${isBot ? 'BOT' : 'USER'} [${time}]: ${text}\n`;
    });
    
    return transcript;
}

// ------------------------------
// UTILITIES
// ------------------------------

function containsAny(text, keywords) {
    return keywords.some(word => text.includes(word));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
}

function scrollToBottom() {
    if (chatMessages) {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }
}

// ------------------------------
// EXPORT FOR TESTING (Optional)
// ------------------------------

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleUserMessage,
        chatState,
        containsAny
    };
}
