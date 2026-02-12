// Wishlist Management Module
class WishlistManager {
    constructor() {
        this.wishlist = this.loadWishlist();
    }

    // Load wishlist from localStorage
    loadWishlist() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEYS.WISHLIST);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    // Save wishlist to localStorage
    saveWishlist() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.WISHLIST, JSON.stringify(this.wishlist));
            
            // Update wishlist count in UI
            if (window.uiManager) {
                window.uiManager.updateWishlistCount();
            }
        } catch (e) {
            console.error('Failed to save wishlist:', e);
        }
    }

    // Add book to wishlist
    addBook(book) {
        // Check if already in wishlist
        if (this.hasBook(book.id)) {
            return false;
        }

        this.wishlist.push({
            id: book.id,
            title: book.title,
            author: book.author,
            cover: book.cover,
            rating: book.rating,
            reviewCount: book.reviewCount,
            isFree: book.isFree,
            addedAt: Date.now()
        });

        this.saveWishlist();
        
        // Add notification
        if (window.authManager) {
            window.authManager.addNotification(
                'Added to Wishlist',
                `"${book.title}" has been added to your wishlist.`
            );
        }
        
        return true;
    }

    // Remove book from wishlist
    removeBook(bookId) {
        const index = this.wishlist.findIndex(item => item.id === bookId);
        
        if (index !== -1) {
            const book = this.wishlist[index];
            this.wishlist.splice(index, 1);
            this.saveWishlist();
            
            // Add notification
            if (window.authManager) {
                window.authManager.addNotification(
                    'Removed from Wishlist',
                    `"${book.title}" has been removed from your wishlist.`
                );
            }
            
            return true;
        }
        
        return false;
    }

    // Toggle book in wishlist
    toggleBook(book) {
        if (this.hasBook(book.id)) {
            return this.removeBook(book.id);
        } else {
            return this.addBook(book);
        }
    }

    // Check if book is in wishlist
    hasBook(bookId) {
        return this.wishlist.some(item => item.id === bookId);
    }

    // Get all wishlist books
    getBooks() {
        return this.wishlist;
    }

    // Get wishlist count
    getCount() {
        return this.wishlist.length;
    }

    // Clear wishlist
    clear() {
        this.wishlist = [];
        this.saveWishlist();
    }
}

// Create global instance
window.wishlistManager = new WishlistManager();
