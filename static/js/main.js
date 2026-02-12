// Main JavaScript - Application Entry Point
class BookWorldApp {
    constructor() {
        this.init();
    }

    async init() {
        try {
            console.log('BookWorld App initializing...');
            
            // Display categories
            window.uiManager.displayCategories();
            
            // Load trending books by default
            await this.loadTrendingBooks();
            
            console.log('BookWorld App initialized successfully!');
        } catch (error) {
            console.error('App initialization error:', error);
            window.uiManager.showError('Failed to initialize the app. Please refresh the page.');
        }
    }

    async loadTrendingBooks() {
        try {
            window.uiManager.showLoading();
            const books = await window.booksAPI.getTrendingBooks(10);
            
            document.getElementById('booksSectionTitle').textContent = 'Top 10 Trending Books';
            window.uiManager.displayBooks(books);
        } catch (error) {
            console.error('Load trending books error:', error);
            window.uiManager.showError('Failed to load trending books. Please try again.');
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.bookWorldApp = new BookWorldApp();
    });
} else {
    window.bookWorldApp = new BookWorldApp();
}
