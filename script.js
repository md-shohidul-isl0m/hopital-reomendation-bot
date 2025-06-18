class HospitalChatbot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        
        this.mockHospitals = [
            {
                id: 1,
                name: "City General Hospital",
                specialty: "Emergency Care",
                distance: "2.3 km",
                rating: 4.8,
                waitTime: "15 min",
                phone: "+1-555-0123",
                address: "123 Medical Center Dr",
                availability: "available"
            },
            {
                id: 2,
                name: "Advanced Heart Institute",
                specialty: "Cardiology",
                distance: "3.7 km",
                rating: 4.9,
                waitTime: "25 min",
                phone: "+1-555-0124",
                address: "456 Heart Care Ave",
                availability: "busy"
            },
            {
                id: 3,
                name: "Metro Diagnostic Center",
                specialty: "Diagnostics",
                distance: "1.8 km",
                rating: 4.6,
                waitTime: "10 min",
                phone: "+1-555-0125",
                address: "789 Health Plaza",
                availability: "available"
            },
            {
                id: 4,
                name: "Children's Medical Center",
                specialty: "Pediatrics",
                distance: "4.2 km",
                rating: 4.7,
                waitTime: "20 min",
                phone: "+1-555-0126",
                address: "321 Kids Health Blvd",
                availability: "full"
            }
        ];
        
        this.init();
    }
    
    init() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        this.messageInput.addEventListener('input', () => {
            this.sendButton.disabled = !this.messageInput.value.trim();
        });
    }
    
    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        this.addUserMessage(message);
        this.messageInput.value = '';
        this.sendButton.disabled = true;
        
        this.showTypingIndicator();
        
        // Simulate bot response delay
        setTimeout(() => {
            this.hideTypingIndicator();
            this.addBotResponse(message);
        }, 2000);
    }
    
    addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.innerHTML = `
            <div class="message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                </svg>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    addBotResponse(userMessage) {
        const responseText = this.generateResponse(userMessage);
        const showHospitals = this.shouldShowHospitals(userMessage);
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot-message';
        
        let hospitalCards = '';
        if (showHospitals) {
            const relevantHospitals = this.getRelevantHospitals(userMessage);
            hospitalCards = relevantHospitals.map(hospital => this.createHospitalCard(hospital)).join('');
        }
        
        messageElement.innerHTML = `
            <div class="message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="currentColor"/>
                </svg>
            </div>
            <div class="message-content">
                <p>${responseText}</p>
                ${hospitalCards}
            </div>
        `;
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
        
        // Add event listeners to book buttons
        if (showHospitals) {
            this.addBookingEventListeners();
        }
    }
    
    generateResponse(userMessage) {
        const responses = [
            "Based on your symptoms, I've found several hospitals that can help you. Here are my top recommendations:",
            "I understand your concern. Let me suggest some suitable hospitals in your area:",
            "Thank you for sharing your symptoms. Here are some hospitals that specialize in your condition:",
            "I've analyzed your requirements and found these hospitals that would be perfect for your needs:"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    shouldShowHospitals(message) {
        const keywords = ['pain', 'hurt', 'sick', 'fever', 'headache', 'chest', 'heart', 'emergency', 'doctor', 'hospital', 'help', 'treatment'];
        return keywords.some(keyword => message.toLowerCase().includes(keyword));
    }
    
    getRelevantHospitals(userMessage) {
        // Simple keyword matching for demo purposes
        const message = userMessage.toLowerCase();
        
        if (message.includes('heart') || message.includes('chest')) {
            return this.mockHospitals.filter(h => h.specialty.includes('Cardiology') || h.specialty.includes('Emergency'));
        } else if (message.includes('child') || message.includes('kid')) {
            return this.mockHospitals.filter(h => h.specialty.includes('Pediatrics') || h.specialty.includes('Emergency'));
        } else if (message.includes('test') || message.includes('scan')) {
            return this.mockHospitals.filter(h => h.specialty.includes('Diagnostics') || h.specialty.includes('Emergency'));
        }
        
        return this.mockHospitals.slice(0, 3); // Return first 3 hospitals as default
    }
    
    createHospitalCard(hospital) {
        const availabilityClass = hospital.availability;
        const badgeClass = `${hospital.availability}-badge`;
        
        return `
            <div class="hospital-card">
                <div class="hospital-header">
                    <div>
                        <div class="hospital-name">${hospital.name}</div>
                        <div class="hospital-specialty">${hospital.specialty}</div>
                    </div>
                    <div class="availability-dot ${availabilityClass}"></div>
                </div>
                
                <div class="hospital-details">
                    <div class="detail-item">
                        <span class="detail-icon">📍</span>
                        <span>${hospital.distance}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">⏰</span>
                        <span>${hospital.waitTime}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">⭐</span>
                        <span>${hospital.rating}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">📞</span>
                        <span>${hospital.phone}</span>
                    </div>
                </div>
                
                <div class="hospital-address">${hospital.address}</div>
                
                <div class="hospital-actions">
                    <span class="availability-badge ${badgeClass}">${hospital.availability}</span>
                    <button class="book-btn" data-hospital-id="${hospital.id}">Book Appointment</button>
                </div>
            </div>
        `;
    }
    
    addBookingEventListeners() {
        const bookButtons = document.querySelectorAll('.book-btn');
        bookButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const hospitalId = e.target.getAttribute('data-hospital-id');
                this.bookAppointment(hospitalId);
            });
        });
    }
    
    bookAppointment(hospitalId) {
        const hospital = this.mockHospitals.find(h => h.id == hospitalId);
        if (hospital) {
            setTimeout(() => {
                this.addBotMessage(`Great! I've initiated the booking process for ${hospital.name}. You'll receive a confirmation call within 15 minutes. Is there anything else I can help you with?`);
            }, 500);
        }
    }
    
    addBotMessage(text) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot-message';
        messageElement.innerHTML = `
            <div class="message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="currentColor"/>
                </svg>
            </div>
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HospitalChatbot();
});
