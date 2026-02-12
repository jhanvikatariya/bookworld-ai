// Authentication Module
class AuthManager {
    constructor() {
        this.user = this.loadUser();
    }

    // Load user from localStorage
    loadUser() {
        try {
            const userData = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
            return userData ? JSON.parse(userData) : null;
        } catch (e) {
            return null;
        }
    }

    // Save user to localStorage
    saveUser(user) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
            this.user = user;
        } catch (e) {
            console.error('Failed to save user:', e);
        }
    }

    // Register new user
    register(name, email, age, gender) {
        if (!name || !email || !age || !gender) {
            throw new Error('All fields are required');
        }

        if (!this.validateEmail(email)) {
            throw new Error('Invalid email address');
        }

        if (age < 13) {
            throw new Error('You must be at least 13 years old');
        }

        const user = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            age: parseInt(age),
            gender: gender,
            registeredAt: new Date().toISOString()
        };

        this.saveUser(user);
        this.addNotification('Welcome!', `Welcome to BookWorld, ${user.name}!`);
        return user;
    }

    // Login user (email only)
    login(email) {
        if (!email) {
            throw new Error('Email is required');
        }

        if (!this.validateEmail(email)) {
            throw new Error('Invalid email address');
        }

        // Check if user exists
        if (this.user && this.user.email === email.trim().toLowerCase()) {
            this.addNotification('Welcome Back!', `Good to see you again, ${this.user.name}!`);
            return this.user;
        }

        throw new Error('User not found. Please register first.');
    }

    // Logout user
    logout() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
        this.user = null;
        this.addNotification('Logged Out', 'You have been logged out successfully.');
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.user !== null;
    }

    // Get current user
    getUser() {
        return this.user;
    }

    // Validate email
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Add notification
    addNotification(title, message) {
        try {
            const notifications = this.getNotifications();
            notifications.unshift({
                id: Date.now(),
                title: title,
                message: message,
                time: 'Just now',
                read: false
            });
            
            // Keep only last 20 notifications
            if (notifications.length > 20) {
                notifications.pop();
            }
            
            localStorage.setItem(CONFIG.STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
            
            // Update notification count in UI
            if (window.uiManager) {
                window.uiManager.updateNotificationCount();
            }
        } catch (e) {
            console.error('Failed to add notification:', e);
        }
    }

    // Get notifications
    getNotifications() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEYS.NOTIFICATIONS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    // Clear notifications
    clearNotifications() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.NOTIFICATIONS);
    }
}

// Create global instance
window.authManager = new AuthManager();
