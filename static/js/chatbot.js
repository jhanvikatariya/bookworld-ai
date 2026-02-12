// AI Chatbot Module
class ChatbotManager {
    constructor() {
        this.chatbot = document.getElementById('chatbot');
        this.chatbotToggle = document.getElementById('chatbotToggle');
        this.chatbotWindow = document.getElementById('chatbotWindow');
        this.chatbotMinimize = document.getElementById('chatbotMinimize');
        this.chatbotMessages = document.getElementById('chatbotMessages');
        this.chatbotInput = document.getElementById('chatbotInput');
        this.chatbotSend = document.getElementById('chatbotSend');
        this.isOpen = false;
        this.init();
    }

    init() {
        // Toggle chatbot
        this.chatbotToggle.addEventListener('click', () => {
            this.toggleChatbot();
        });

        // Minimize chatbot
        this.chatbotMinimize.addEventListener('click', () => {
            this.toggleChatbot();
        });

        // Send message on button click
        this.chatbotSend.addEventListener('click', () => {
            this.sendMessage();
        });

        // Send message on Enter key
        this.chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    // Toggle chatbot visibility
    toggleChatbot() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.chatbotWindow.classList.add('active');
        } else {
            this.chatbotWindow.classList.remove('active');
        }
    }

    // Send message
    async sendMessage() {
        const message = this.chatbotInput.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.chatbotInput.value = '';

        // Scroll to bottom
        this.scrollToBottom();

        // Process message and get recommendations
        await this.processMessage(message);
    }

    // Process user message
    async processMessage(message) {
        try {
            // Show typing indicator
            const typingId = this.addTypingIndicator();

            // Extract keywords from message
            const keywords = this.extractKeywords(message);
            
            // Get book recommendations
            const books = await this.getRecommendations(keywords);

            // Remove typing indicator
            this.removeTypingIndicator(typingId);

            if (books.length === 0) {
                this.addMessage(
                    "I couldn't find books matching your interests. Could you try different keywords? For example: mystery, romance, science fiction, fantasy, etc.",
                    'bot'
                );
            } else {
                this.addMessage(
                    `I found ${books.length} great books for you! Check these out:`,
                    'bot'
                );
                
                // Add book recommendations
                this.addBookRecommendations(books);
            }

            this.scrollToBottom();
        } catch (error) {
            console.error('Process message error:', error);
            this.removeAllTypingIndicators();
            this.addMessage(
                "Sorry, I encountered an error. Please try again.",
                'bot'
            );
        }
    }

    // Extract keywords from message
    extractKeywords(message) {
        const lowerMessage = message.toLowerCase();
        
        // Common keywords mapping
        const keywordMap = {
            'mystery': ['mystery', 'detective', 'crime', 'thriller', 'suspense'],
            'romance': ['romance', 'love', 'romantic', 'relationship'],
            'scifi': ['science fiction', 'scifi', 'sci-fi', 'space', 'future', 'technology'],
            'fantasy': ['fantasy', 'magic', 'wizard', 'dragon', 'adventure'],
            'horror': ['horror', 'scary', 'ghost', 'vampire', 'zombie'],
            'biography': ['biography', 'autobiography', 'memoir', 'life story'],
            'history': ['history', 'historical', 'war', 'ancient'],
            'selfhelp': ['self-help', 'self help', 'motivation', 'productivity', 'improvement'],
            'business': ['business', 'entrepreneur', 'startup', 'management', 'finance'],
            'science': ['science', 'physics', 'biology', 'chemistry', 'nature'],
            'children': ['children', 'kids', 'child', 'young'],
            'youngadult': ['young adult', 'teen', 'teenager', 'ya'],
            'fiction': ['fiction', 'novel', 'story'],
            'free': ['free', 'no cost', 'gratis']
        };

        // Find matching keywords
        const matchedKeywords = [];
        
        for (const [category, keywords] of Object.entries(keywordMap)) {
            for (const keyword of keywords) {
                if (lowerMessage.includes(keyword)) {
                    matchedKeywords.push(category);
                    break;
                }
            }
        }

        // If no keywords found, use general search
        if (matchedKeywords.length === 0) {
            return ['fiction'];
        }

        return matchedKeywords;
    }

    // Get book recommendations based on keywords
    async getRecommendations(keywords) {
        try {
            // Build search query
            const queries = keywords.map(keyword => {
                if (keyword === 'free') {
                    return 'fiction';
                }
                return keyword;
            });

            const searchQuery = queries.map(q => `subject:${q}`).join('+OR+');
            
            // Check if user wants free books
            const isFree = keywords.includes('free');
            
            let books;
            if (isFree) {
                books = await window.booksAPI.getFreeBooks(6);
            } else {
                books = await window.booksAPI.searchBooks(searchQuery, 6);
            }

            return books;
        } catch (error) {
            console.error('Get recommendations error:', error);
            return [];
        }
    }

    // Add message to chat
    addMessage(text, type = 'bot') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${type}-message`;
        
        const icon = type === 'bot' ? 
            '<i class="fas fa-robot"></i>' : 
            '<i class="fas fa-user"></i>';
        
        messageDiv.innerHTML = `
            ${icon}
            <p>${text}</p>
        `;
        
        this.chatbotMessages.appendChild(messageDiv);
    }

    // Add typing indicator
    addTypingIndicator() {
        const id = `typing-${Date.now()}`;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-message bot-message';
        typingDiv.id = id;
        typingDiv.innerHTML = `
            <i class="fas fa-robot"></i>
            <p>Thinking...</p>
        `;
        this.chatbotMessages.appendChild(typingDiv);
        this.scrollToBottom();
        return id;
    }

    // Remove typing indicator
    removeTypingIndicator(id) {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    }

    // Remove all typing indicators
    removeAllTypingIndicators() {
        const indicators = this.chatbotMessages.querySelectorAll('[id^="typing-"]');
        indicators.forEach(indicator => indicator.remove());
    }

    // Add book recommendations
    addBookRecommendations(books) {
        const recommendationsDiv = document.createElement('div');
        recommendationsDiv.className = 'chatbot-message bot-message';
        
        const booksHtml = books.map(book => `
            <div class="book-recommendation" data-book-id="${book.id}">
                <div class="book-recommendation-title">${this.truncateText(book.title, 40)}</div>
                <div class="book-recommendation-author">by ${book.author}</div>
            </div>
        `).join('');
        
        recommendationsDiv.innerHTML = `
            <i class="fas fa-robot"></i>
            <div style="flex: 1;">
                ${booksHtml}
            </div>
        `;
        
        this.chatbotMessages.appendChild(recommendationsDiv);
        
        // Add click events to recommendations
        recommendationsDiv.querySelectorAll('.book-recommendation').forEach(item => {
            item.addEventListener('click', async () => {
                const bookId = item.dataset.bookId;
                const book = await window.booksAPI.getBookById(bookId);
                window.uiManager.showBookDetail(book);
            });
        });
    }

    // Scroll to bottom
    scrollToBottom() {
        setTimeout(() => {
            this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
        }, 100);
    }

    // Truncate text
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
}

// Initialize after DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    window.chatbotManager = new ChatbotManager();
});
