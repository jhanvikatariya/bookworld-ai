// Configuration for BookWorld Application
const CONFIG = {
    // Google Books API Configuration
    API: {
        BASE_URL: 'https://www.googleapis.com/books/v1',
        MAX_RESULTS: 40,
        CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    },

    // Optional: Google Books API key (recommended to avoid 429/quotas)
    // How to set: create a key in Google Cloud Console and paste it here.
    // Leave as empty string to run without a key.
    API_KEY: 'AIzaSyD2KXZoXtUL9sciSH5mdSe17ohNEKVxA7g' ,

    // Book Categories
    CATEGORIES: [
        { id: 'fiction', name: 'Fiction', icon: 'fa-book', query: 'subject:fiction' },
        { id: 'mystery', name: 'Mystery', icon: 'fa-mask', query: 'subject:mystery' },
        { id: 'romance', name: 'Romance', icon: 'fa-heart', query: 'subject:romance' },
        { id: 'scifi', name: 'Science Fiction', icon: 'fa-rocket', query: 'subject:science+fiction' },
        { id: 'fantasy', name: 'Fantasy', icon: 'fa-dragon', query: 'subject:fantasy' },
        { id: 'biography', name: 'Biography', icon: 'fa-user-circle', query: 'subject:biography' },
        { id: 'history', name: 'History', icon: 'fa-landmark', query: 'subject:history' },
        { id: 'selfhelp', name: 'Self-Help', icon: 'fa-lightbulb', query: 'subject:self-help' },
        { id: 'business', name: 'Business', icon: 'fa-briefcase', query: 'subject:business' },
        { id: 'science', name: 'Science', icon: 'fa-flask', query: 'subject:science' },
        { id: 'children', name: "Children's Books", icon: 'fa-child', query: 'subject:children' },
        { id: 'youngadult', name: 'Young Adult', icon: 'fa-users', query: 'subject:young+adult' }
    ],

    // Default placeholder image
    DEFAULT_COVER: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"%3E%3Crect fill="%23f5f1ec" width="200" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" fill="%237c9885" text-anchor="middle" dominant-baseline="middle"%3ENo Cover%3C/text%3E%3C/svg%3E',

    // LocalStorage keys
    STORAGE_KEYS: {
        USER: 'bookworld_user',
        WISHLIST: 'bookworld_wishlist',
        CACHE: 'bookworld_cache',
        NOTIFICATIONS: 'bookworld_notifications'
    }
};

// Export for use in other modules
window.CONFIG = CONFIG;
