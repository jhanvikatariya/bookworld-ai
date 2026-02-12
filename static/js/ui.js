// UI Manager Module - Handles all UI interactions and displays
class UIManager {
    constructor() {
        this.initElements();
        this.initEventListeners();
        this.updateUIState();
    }

    // Initialize DOM elements
    initElements() {
        // Navigation
        this.homeBtn = document.getElementById('homeBtn');
        this.categoriesBtn = document.getElementById('categoriesBtn');
        this.wishlistBtn = document.getElementById('wishlistBtn');
        this.notificationBtn = document.getElementById('notificationBtn');
        this.profileBtn = document.getElementById('profileBtn');
        
        // Hero buttons
        this.freeReadingBtn = document.getElementById('freeReadingBtn');
        this.paidReadingBtn = document.getElementById('paidReadingBtn');
        this.exploreBooksBtn = document.getElementById('exploreBooksBtn');
        
        // Sections
        this.categoriesGrid = document.getElementById('categoriesGrid');
        this.booksGrid = document.getElementById('booksGrid');
        this.booksSection = document.getElementById('booksSection');
        this.booksSectionTitle = document.getElementById('booksSectionTitle');
        this.booksLoading = document.getElementById('booksLoading');
        this.booksError = document.getElementById('booksError');
        
        // Modals
        this.bookModal = document.getElementById('bookModal');
        this.authModal = document.getElementById('authModal');
        this.wishlistModal = document.getElementById('wishlistModal');
        this.notificationsModal = document.getElementById('notificationsModal');
    }

    // Initialize event listeners
    initEventListeners() {
        // Navigation
        this.homeBtn.addEventListener('click', () => this.scrollToTop());
        this.categoriesBtn.addEventListener('click', () => this.scrollToCategories());
        this.wishlistBtn.addEventListener('click', () => this.showWishlist());
        this.notificationBtn.addEventListener('click', () => this.showNotifications());
        this.profileBtn.addEventListener('click', () => this.toggleProfileDropdown());
        
        // Hero buttons
        this.freeReadingBtn.addEventListener('click', () => this.showFreeBooks());
        this.paidReadingBtn.addEventListener('click', () => this.showPaidBooks());
        this.exploreBooksBtn.addEventListener('click', () => this.scrollToCategories());
        
        // Footer links
        document.getElementById('footerFreeBooks').addEventListener('click', (e) => {
            e.preventDefault();
            this.showFreeBooks();
        });
        document.getElementById('footerPremiumBooks').addEventListener('click', (e) => {
            e.preventDefault();
            this.showPaidBooks();
        });
        
        // Modal close buttons
        this.initModalCloseListeners();
    }

    // Initialize modal close listeners
    initModalCloseListeners() {
        const modals = [
            { modal: this.bookModal, close: 'modalClose', overlay: 'modalOverlay' },
            { modal: this.authModal, close: 'authModalClose', overlay: 'authModalOverlay' },
            { modal: this.wishlistModal, close: 'wishlistModalClose', overlay: 'wishlistModalOverlay' },
            { modal: this.notificationsModal, close: 'notificationsModalClose', overlay: 'notificationsModalOverlay' }
        ];

        modals.forEach(({ modal, close, overlay }) => {
            document.getElementById(close).addEventListener('click', () => {
                modal.classList.remove('active');
            });
            document.getElementById(overlay).addEventListener('click', () => {
                modal.classList.remove('active');
            });
        });
    }

    // Update UI state based on auth
    updateUIState() {
        const user = window.authManager.getUser();
        const profileDropdown = document.getElementById('profileDropdown');
        
        if (user) {
            // User is logged in
            document.getElementById('profileName').textContent = user.name;
            profileDropdown.innerHTML = `
                <div class="dropdown-item" id="viewProfileBtn">
                    <i class="fas fa-user"></i>
                    <span>View Profile</span>
                </div>
                <div class="dropdown-item" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </div>
            `;
            
            document.getElementById('viewProfileBtn').addEventListener('click', () => {
                this.showProfile();
                this.hideProfileDropdown();
            });
            
            document.getElementById('logoutBtn').addEventListener('click', () => {
                this.logout();
                this.hideProfileDropdown();
            });
        } else {
            // User is not logged in
            document.getElementById('profileName').textContent = 'Profile';
            profileDropdown.innerHTML = `
                <div class="dropdown-item" id="registerBtn">
                    <i class="fas fa-user-plus"></i>
                    <span>Register</span>
                </div>
                <div class="dropdown-item" id="loginBtn">
                    <i class="fas fa-sign-in-alt"></i>
                    <span>Login</span>
                </div>
            `;
            
            document.getElementById('registerBtn').addEventListener('click', () => {
                this.showRegisterForm();
                this.hideProfileDropdown();
            });
            
            document.getElementById('loginBtn').addEventListener('click', () => {
                this.showLoginForm();
                this.hideProfileDropdown();
            });
        }
        
        this.updateWishlistCount();
        this.updateNotificationCount();
    }

    // Toggle profile dropdown
    toggleProfileDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        dropdown.classList.toggle('active');
    }

    // Hide profile dropdown
    hideProfileDropdown() {
        document.getElementById('profileDropdown').classList.remove('active');
    }

    // Update wishlist count
    updateWishlistCount() {
        const count = window.wishlistManager.getCount();
        document.getElementById('wishlistCount').textContent = count;
        document.getElementById('wishlistCount').style.display = count > 0 ? 'block' : 'none';
    }

    // Update notification count
    updateNotificationCount() {
        const notifications = window.authManager.getNotifications();
        const unreadCount = notifications.filter(n => !n.read).length;
        document.getElementById('notificationCount').textContent = unreadCount;
        document.getElementById('notificationCount').style.display = unreadCount > 0 ? 'block' : 'none';
    }

    // Scroll to top
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Scroll to categories
    scrollToCategories() {
        document.getElementById('categoriesSection').scrollIntoView({ behavior: 'smooth' });
    }

    // Display categories
    displayCategories() {
        this.categoriesGrid.innerHTML = CONFIG.CATEGORIES.map(category => `
            <div class="category-card" data-category-id="${category.id}">
                <div class="category-icon">
                    <i class="fas ${category.icon}"></i>
                </div>
                <div class="category-name">${category.name}</div>
            </div>
        `).join('');

        // Add click events (use event delegation to avoid missing clicks)
        this.categoriesGrid.addEventListener('click', async (e) => {
            const card = e.target.closest('.category-card');
            if (!card) return;

            const categoryId = card.dataset.categoryId;
            const category = CONFIG.CATEGORIES.find(c => c.id === categoryId);

            if (!category) {
                console.warn('Category not found for id:', categoryId);
                this.showError('Invalid category selected.');
                return;
            }

            await this.showCategoryBooks(category);
        });
    }

    // Show category books
    async showCategoryBooks(category) {
        try {
            this.showLoading();
            const books = await window.booksAPI.getBooksByCategory(category.query);
            
            this.booksSection.scrollIntoView({ behavior: 'smooth' });
            this.booksSectionTitle.textContent = category.name;
            this.displayBooks(books);
        } catch (error) {
            console.error('Show category books error:', error);
            this.showError('Failed to load books. Please try again.');
        }
    }

    // Show free books
    async showFreeBooks() {
        try {
            this.showLoading();
            this.booksSection.scrollIntoView({ behavior: 'smooth' });
            const books = await window.booksAPI.getFreeBooks(10);
            
            this.booksSectionTitle.textContent = 'Top 10 Free Books';
            
            if (!books || books.length === 0) {
                this.showError('No free books available at the moment. Please try again later or explore other categories.');
                return;
            }
            
            this.displayBooks(books);
        } catch (error) {
            console.error('Show free books error:', error);
            this.showError('Failed to load free books. Please try again.');
        }
    }

    // Show paid books
    async showPaidBooks() {
        try {
            this.showLoading();
            this.booksSection.scrollIntoView({ behavior: 'smooth' });
            const books = await window.booksAPI.getPaidBooks(10);
            
            this.booksSectionTitle.textContent = 'Top 10 Premium Books';
            
            if (!books || books.length === 0) {
                this.showError('No premium books available at the moment. Please try again later or explore other categories.');
                return;
            }
            
            this.displayBooks(books);
        } catch (error) {
            console.error('Show paid books error:', error);
            this.showError('Failed to load premium books. Please try again.');
        }
    }

    // Display books
    displayBooks(books) {
        this.hideLoading();
        this.hideError();
        
        if (books.length === 0) {
            this.booksGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-book"></i>
                    <p>No books found.</p>
                </div>
            `;
            return;
        }

        this.booksGrid.innerHTML = books.map(book => this.createBookCard(book)).join('');
        
        // Add event listeners
        this.booksGrid.querySelectorAll('.book-card').forEach(card => {
            const bookId = card.dataset.bookId;
            const book = books.find(b => b.id === bookId);
            
            card.querySelector('.book-btn-primary').addEventListener('click', (e) => {
                e.stopPropagation();
                this.showBookDetail(book);
            });
            
            card.querySelector('.wishlist-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleWishlist(book, e.currentTarget);
            });
            
            card.addEventListener('click', () => {
                this.showBookDetail(book);
            });
        });
    }

    // Create book card HTML
    createBookCard(book) {
        const isInWishlist = window.wishlistManager.hasBook(book.id);
        const stars = this.generateStars(book.rating);
        
        return `
            <div class="book-card" data-book-id="${book.id}">
                <img src="${book.cover}" alt="${book.title}" class="book-cover" onerror="this.src='${CONFIG.DEFAULT_COVER}'">
                <div class="book-info">
                    <h3 class="book-title">${this.truncateText(book.title, 40)}</h3>
                    <p class="book-author">${book.author}</p>
                    <div class="book-rating">
                        <span class="stars">${stars}</span>
                        <span class="count">(${book.reviewCount || 0})</span>
                    </div>
                    <div class="book-labels">
                        ${book.isFree ? '<span class="book-label free">Free</span>' : '<span class="book-label premium">Premium</span>'}
                    </div>
                    <div class="book-actions">
                        <button class="book-btn book-btn-primary">
                            View Details
                        </button>
                        <button class="wishlist-btn ${isInWishlist ? 'active' : ''}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Show book detail modal
    showBookDetail(book) {
        const stars = this.generateStars(book.rating);
        const isInWishlist = window.wishlistManager.hasBook(book.id);
        
        document.getElementById('modalBody').innerHTML = `
            <div class="book-detail">
                <div class="book-detail-image">
                    <img src="${book.cover}" alt="${book.title}" class="book-detail-cover" onerror="this.src='${CONFIG.DEFAULT_COVER}'">
                </div>
                <div class="book-detail-content">
                    <h2 class="book-detail-title">${book.title}</h2>
                    <p class="book-detail-author">by ${book.authors.join(', ')}</p>
                    
                    <div class="book-detail-meta">
                        <div class="meta-item">
                            <i class="fas fa-star"></i>
                            <span>${stars} ${book.rating.toFixed(1)} (${book.reviewCount} reviews)</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-tag"></i>
                            <span>${book.category}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-language"></i>
                            <span>${book.language.toUpperCase()}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-file-alt"></i>
                            <span>${book.pageCount || 'N/A'} pages</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${book.publishedDate}</span>
                        </div>
                    </div>
                    
                    <div class="book-labels" style="margin-bottom: 1rem;">
                        ${book.isFree ? '<span class="book-label free">Free</span>' : '<span class="book-label premium">Premium</span>'}
                    </div>
                    
                    <div class="book-detail-description">
                        <p>${book.description}</p>
                    </div>
                    
                    <div class="book-detail-actions">
                        <button class="btn btn-primary" id="previewBookBtn">
                            <i class="fas fa-book-open"></i>
                            Preview Book
                        </button>
                        <button class="btn btn-secondary" id="moreInfoBtn">
                            <i class="fas fa-info-circle"></i>
                            More Info
                        </button>
                        <button class="btn ${isInWishlist ? 'btn-primary' : 'btn-outline'}" id="wishlistToggleBtn">
                            <i class="fas fa-heart"></i>
                            ${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('previewBookBtn').addEventListener('click', () => {
            window.open(book.previewLink, '_blank');
        });
        
        document.getElementById('moreInfoBtn').addEventListener('click', () => {
            window.open(book.infoLink, '_blank');
        });
        
        document.getElementById('wishlistToggleBtn').addEventListener('click', (e) => {
            window.wishlistManager.toggleBook(book);
            this.bookModal.classList.remove('active');
            this.updateWishlistCount();
        });
        
        this.bookModal.classList.add('active');
    }

    // Toggle wishlist
    toggleWishlist(book, button) {
        window.wishlistManager.toggleBook(book);
        button.classList.toggle('active');
        this.updateWishlistCount();
    }

    // Show wishlist
    showWishlist() {
        const books = window.wishlistManager.getBooks();
        
        let content = '<h2>My Wishlist</h2>';
        
        if (books.length === 0) {
            content += `
                <div class="empty-state">
                    <i class="fas fa-heart-broken"></i>
                    <p>Your wishlist is empty.</p>
                </div>
            `;
        } else {
            content += `<div class="wishlist-grid">`;
            books.forEach(book => {
                content += this.createBookCard(book);
            });
            content += `</div>`;
        }
        
        document.getElementById('wishlistModalBody').innerHTML = content;
        
        // Add event listeners
        if (books.length > 0) {
            document.querySelectorAll('#wishlistModalBody .book-card').forEach(card => {
                const bookId = card.dataset.bookId;
                const book = books.find(b => b.id === bookId);
                
                card.querySelector('.book-btn-primary').addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const fullBook = await window.booksAPI.getBookById(book.id);
                    this.showBookDetail(fullBook);
                });
                
                card.querySelector('.wishlist-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.wishlistManager.removeBook(book.id);
                    this.showWishlist(); // Refresh
                    this.updateWishlistCount();
                });
                
                card.addEventListener('click', async () => {
                    const fullBook = await window.booksAPI.getBookById(book.id);
                    this.showBookDetail(fullBook);
                });
            });
        }
        
        this.wishlistModal.classList.add('active');
    }

    // Show notifications
    showNotifications() {
        const notifications = window.authManager.getNotifications();
        
        let content = '<h2>Notifications</h2><div id="notificationsList">';
        
        if (notifications.length === 0) {
            content += `
                <div class="empty-state">
                    <i class="fas fa-bell-slash"></i>
                    <p>No notifications.</p>
                </div>
            `;
        } else {
            notifications.forEach(notification => {
                content += `
                    <div class="notification-item">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <h4>${notification.title}</h4>
                            <p>${notification.message}</p>
                            <span class="notification-time">${notification.time}</span>
                        </div>
                    </div>
                `;
            });
        }
        
        content += '</div>';
        
        document.querySelector('#notificationsModal .modal-body').innerHTML = content;
        this.notificationsModal.classList.add('active');
        
        // Mark all as read
        this.updateNotificationCount();
    }

    // Show register form
    showRegisterForm() {
        document.getElementById('authModalBody').innerHTML = `
            <div class="auth-container">
                <h2 class="auth-title">Create Account</h2>
                <form id="registerForm">
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <input type="text" class="form-input" id="registerName" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" id="registerEmail" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Age</label>
                        <input type="number" class="form-input" id="registerAge" min="13" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Gender</label>
                        <select class="form-select" id="registerGender" required>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                    </div>
                    <button type="submit" class="form-submit">Register</button>
                </form>
                <p class="form-back" id="backToAuth">← Back</p>
            </div>
        `;
        
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
        
        document.getElementById('backToAuth').addEventListener('click', () => {
            this.authModal.classList.remove('active');
        });
        
        this.authModal.classList.add('active');
    }

    // Show login form
    showLoginForm() {
        document.getElementById('authModalBody').innerHTML = `
            <div class="auth-container">
                <h2 class="auth-title">Login</h2>
                <form id="loginForm">
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input" id="loginEmail" required>
                    </div>
                    <button type="submit" class="form-submit">Login</button>
                </form>
                <p class="form-back" id="backToAuth">← Back</p>
            </div>
        `;
        
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        document.getElementById('backToAuth').addEventListener('click', () => {
            this.authModal.classList.remove('active');
        });
        
        this.authModal.classList.add('active');
    }

    // Handle registration
    handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const age = document.getElementById('registerAge').value;
        const gender = document.getElementById('registerGender').value;
        
        try {
            window.authManager.register(name, email, age, gender);
            this.authModal.classList.remove('active');
            this.updateUIState();
            alert('Registration successful! Welcome to BookWorld!');
        } catch (error) {
            alert(error.message);
        }
    }

    // Handle login
    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        
        try {
            window.authManager.login(email);
            this.authModal.classList.remove('active');
            this.updateUIState();
            alert('Login successful! Welcome back!');
        } catch (error) {
            alert(error.message);
        }
    }

    // Show profile
    showProfile() {
        const user = window.authManager.getUser();
        
        document.getElementById('authModalBody').innerHTML = `
            <div class="auth-container">
                <h2 class="auth-title">My Profile</h2>
                <div class="profile-info">
                    <div class="profile-item">
                        <div class="profile-label">Name</div>
                        <div class="profile-value">${user.name}</div>
                    </div>
                    <div class="profile-item">
                        <div class="profile-label">Email</div>
                        <div class="profile-value">${user.email}</div>
                    </div>
                    <div class="profile-item">
                        <div class="profile-label">Age</div>
                        <div class="profile-value">${user.age}</div>
                    </div>
                    <div class="profile-item">
                        <div class="profile-label">Gender</div>
                        <div class="profile-value">${user.gender}</div>
                    </div>
                </div>
                <div class="profile-actions">
                    <button class="form-submit" id="closeProfileBtn">Close</button>
                </div>
            </div>
        `;
        
        document.getElementById('closeProfileBtn').addEventListener('click', () => {
            this.authModal.classList.remove('active');
        });
        
        this.authModal.classList.add('active');
    }

    // Logout
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            window.authManager.logout();
            this.updateUIState();
            alert('You have been logged out.');
        }
    }

    // Show loading state
    showLoading() {
        this.booksGrid.innerHTML = '';
        this.booksLoading.classList.add('active');
        this.booksError.classList.remove('active');
    }

    // Hide loading state
    hideLoading() {
        this.booksLoading.classList.remove('active');
    }

    // Show error
    showError(message) {
        this.booksGrid.innerHTML = '';
        this.booksError.textContent = message;
        this.booksError.classList.add('active');
        this.booksLoading.classList.remove('active');
    }

    // Hide error
    hideError() {
        this.booksError.classList.remove('active');
    }

    // Generate star rating HTML
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let html = '';
        for (let i = 0; i < fullStars; i++) {
            html += '<i class="fas fa-star"></i>';
        }
        if (halfStar) {
            html += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            html += '<i class="far fa-star"></i>';
        }
        return html;
    }

    // Truncate text
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
}

// Create global instance
window.uiManager = new UIManager();
