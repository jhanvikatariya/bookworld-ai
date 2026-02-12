// Search Functionality Module
class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchSuggestions = document.getElementById('searchSuggestions');
        this.debounceTimer = null;
        this.init();
    }

    init() {
        // Search input event
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Search on Enter key
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(e.target.value);
            }
        });

        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.searchSuggestions.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }

    // Handle search input with debounce
    handleSearch(query) {
        clearTimeout(this.debounceTimer);
        
        if (!query || query.length < 2) {
            this.hideSuggestions();
            return;
        }

        this.debounceTimer = setTimeout(async () => {
            await this.showSuggestions(query);
        }, 300);
    }

    // Show search suggestions
    async showSuggestions(query) {
        try {
            const books = await window.booksAPI.getSearchSuggestions(query, 5);
            
            if (books.length === 0) {
                this.hideSuggestions();
                return;
            }

            this.searchSuggestions.innerHTML = books.map(book => `
                <div class="suggestion-item" data-book-id="${book.id}">
                    <img src="${book.cover}" alt="${book.title}" class="suggestion-image" onerror="this.src='${CONFIG.DEFAULT_COVER}'">
                    <div class="suggestion-info">
                        <div class="suggestion-title">${this.truncateText(book.title, 50)}</div>
                        <div class="suggestion-author">${book.author}</div>
                    </div>
                </div>
            `).join('');

            // Add click events to suggestions
            this.searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', async () => {
                    const bookId = item.dataset.bookId;
                    const book = await window.booksAPI.getBookById(bookId);
                    window.uiManager.showBookDetail(book);
                    this.hideSuggestions();
                    this.searchInput.value = '';
                });
            });

            this.searchSuggestions.classList.add('active');
        } catch (error) {
            console.error('Show suggestions error:', error);
            this.hideSuggestions();
        }
    }

    // Hide suggestions
    hideSuggestions() {
        this.searchSuggestions.classList.remove('active');
        this.searchSuggestions.innerHTML = '';
    }

    // Perform full search (on Enter)
    async performSearch(query) {
        if (!query || query.length < 2) {
            return;
        }

        this.hideSuggestions();
        
        try {
            window.uiManager.showLoading();
            const books = await window.booksAPI.searchBooks(query, 20);
            
            // Scroll to books section
            document.getElementById('booksSection').scrollIntoView({ behavior: 'smooth' });
            
            // Update section title
            document.getElementById('booksSectionTitle').textContent = `Search Results for "${query}"`;
            
            // Display books
            window.uiManager.displayBooks(books);
            
            this.searchInput.value = '';
        } catch (error) {
            console.error('Perform search error:', error);
            window.uiManager.showError('Failed to search books. Please try again.');
        }
    }

    // Truncate text
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
}

// Initialize after DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    window.searchManager = new SearchManager();
});
