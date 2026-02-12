// Google Books API Integration Module - FIXED VERSION
class BooksAPI {
    constructor() {
        this.cache = this.loadCache();
        this.cleanOldCache();
        // Rate-limit protection
        this._lastRequestAt = 0;
    }

    // Fetch with throttling + exponential backoff for 429/5xx
    async fetchWithRetry(url, { retries = 4, baseDelayMs = 800, allowNonOk = false } = {}) {
        // simple client-side throttle (avoid burst calls)
        const minGapMs = 350;
        const now = Date.now();
        const waitMs = Math.max(0, (this._lastRequestAt + minGapMs) - now);
        if (waitMs > 0) await new Promise(r => setTimeout(r, waitMs));
        this._lastRequestAt = Date.now();

        let attempt = 0;
        while (true) {
            const res = await fetch(url);
            if (allowNonOk) return res;
            if (res.ok) return res;

            // Retry on rate limit / transient server errors
            if ((res.status === 429 || (res.status >= 500 && res.status < 600)) && attempt < retries) {
                const retryAfter = res.headers.get('Retry-After');
                const retryAfterMs = retryAfter ? (parseFloat(retryAfter) * 1000) : 0;
                const backoffMs = Math.round(baseDelayMs * Math.pow(2, attempt) + Math.random() * 250);
                const delay = Math.max(retryAfterMs, backoffMs);
                console.warn(`Google Books API rate-limited (${res.status}). Retrying in ${delay}ms...`);
                await new Promise(r => setTimeout(r, delay));
                attempt++;
                continue;
            }

            let errText = '';
try { errText = await res.text(); } catch (e) {}
console.error('Google Books API error body:', errText);


            throw new Error(`API request failed (HTTP ${res.status})`);
        }
    }

    // Load cache from localStorage
    loadCache() {
        try {
            const cached = localStorage.getItem(CONFIG.STORAGE_KEYS.CACHE);
            return cached ? JSON.parse(cached) : {};
        } catch (e) {
            return {};
        }
    }

    // Save cache to localStorage
    saveCache() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.CACHE, JSON.stringify(this.cache));
        } catch (e) {
            console.error('Failed to save cache:', e);
        }
    }

    // Clean old cache entries
    cleanOldCache() {
        const now = Date.now();
        let changed = false;
        
        for (const key in this.cache) {
            if (now - this.cache[key].timestamp > CONFIG.API.CACHE_DURATION) {
                delete this.cache[key];
                changed = true;
            }
        }
        
        if (changed) {
            this.saveCache();
        }
    }

    // Get cached data or null
    getCached(key) {
        const cached = this.cache[key];
        if (cached && (Date.now() - cached.timestamp < CONFIG.API.CACHE_DURATION)) {
            return cached.data;
        }
        return null;
    }

    // Set cached data
    setCached(key, data) {
        this.cache[key] = {
            data: data,
            timestamp: Date.now()
        };
        this.saveCache();
    }

    // Search books
    async searchBooks(query, maxResults = CONFIG.API.MAX_RESULTS) {
        const cacheKey = `search_${query}_${maxResults}`;
        const cached = this.getCached(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const url = `${CONFIG.API.BASE_URL}/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&printType=books${CONFIG.API_KEY ? `&key=${CONFIG.API_KEY}` : ''}`;
            const response = await this.fetchWithRetry(url);
            const data = await response.json();
            const books = this.parseBooks(data.items || []);
            
            this.setCached(cacheKey, books);
            return books;
        } catch (error) {
            console.error('Search books error:', error);
            throw error;
        }
    }

    // Get books by category
    async getBooksByCategory(categoryQuery, maxResults = CONFIG.API.MAX_RESULTS) {
        return await this.searchBooks(categoryQuery, maxResults);
    }

    // Get trending books (highly rated)
    async getTrendingBooks(maxResults = 10) {
        const cacheKey = `trending_${maxResults}`;
        const cached = this.getCached(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            // Search for popular, highly-rated books
            const queries = [
                'subject:fiction',
                'subject:bestseller',
                'subject:popular'
            ];
            
            const randomQuery = queries[Math.floor(Math.random() * queries.length)];
            const url = `${CONFIG.API.BASE_URL}/volumes?q=${randomQuery}&orderBy=relevance&maxResults=${maxResults * 3}&printType=books${CONFIG.API_KEY ? `&key=${CONFIG.API_KEY}` : ''}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            let books = this.parseBooks(data.items || []);
            
            // Filter books with ratings and sort by rating
            books = books.filter(book => book.rating > 0);
            books.sort((a, b) => {
                // Sort by rating first, then by review count
                if (b.rating !== a.rating) {
                    return b.rating - a.rating;
                }
                return b.reviewCount - a.reviewCount;
            });
            
            // Get top books
            books = books.slice(0, maxResults);
            
            this.setCached(cacheKey, books);
            return books;
        } catch (error) {
            console.error('Get trending books error:', error);
            throw error;
        }
    }

    // Get free books - FIXED VERSION
    async getFreeBooks(maxResults = CONFIG.API.MAX_RESULTS) {
        const cacheKey = `free_${maxResults}`;
        const cached = this.getCached(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            // Strategy 1: Try free-ebooks filter
            let url = `${CONFIG.API.BASE_URL}/volumes?q=subject:fiction&filter=free-ebooks&maxResults=40&orderBy=relevance&printType=books${CONFIG.API_KEY ? `&key=${CONFIG.API_KEY}` : ''}`;
            let response = await this.fetchWithRetry(url);
            let data = await response.json();
            
            // Strategy 2: If no results, try classic literature (often free)
            if (!data.items || data.items.length === 0) {
                console.log('Trying classic literature as free books...');
                url = `${CONFIG.API.BASE_URL}/volumes?q=subject:classic+OR+subject:"public+domain"&filter=free-ebooks&maxResults=40&orderBy=relevance&printType=books${CONFIG.API_KEY ? `&key=${CONFIG.API_KEY}` : ''}`;
                response = await this.fetchWithRetry(url);
                data = await response.json();
            }
            
            // Strategy 3: Try public domain books
            if (!data.items || data.items.length === 0) {
                console.log('Trying public domain books...');
                url = `${CONFIG.API.BASE_URL}/volumes?q=subject:"public+domain"&maxResults=40&orderBy=relevance&printType=books${CONFIG.API_KEY ? `&key=${CONFIG.API_KEY}` : ''}`;
                response = await this.fetchWithRetry(url);
                data = await response.json();
            }
            
            // Check if we have items
            if (!data.items || data.items.length === 0) {
                console.warn('No free books found in API response');
                return [];
            }
            
            let books = this.parseBooks(data.items || []);
            
            // FIXED: Strictly filter for free books only
            // If no free books found, return empty array instead of all books
            books = books.filter(book => book.isFree === true);
            
            // If still no free books, try one more search with different parameters
            if (books.length === 0) {
                console.log('Retrying with broader free books search...');
                url = `${CONFIG.API.BASE_URL}/volumes?q=free+OR+public+domain&filter=free-ebooks&maxResults=40&printType=books${CONFIG.API_KEY ? `&key=${CONFIG.API_KEY}` : ''}`;
                response = await this.fetchWithRetry(url);
                data = await response.json();
                books = this.parseBooks(data.items || []);
                books = books.filter(book => book.isFree === true);
            }
            
            // Return only the requested number
            books = books.slice(0, maxResults);
            
            console.log(`Loaded ${books.length} free books (strictly filtered)`);
            
            this.setCached(cacheKey, books);
            return books;
        } catch (error) {
            console.error('Get free books error:', error);
            throw error;
        }
    }

    // Get paid/premium books - FIXED VERSION
    async getPaidBooks(maxResults = CONFIG.API.MAX_RESULTS) {
        const cacheKey = `paid_${maxResults}`;
        const cached = this.getCached(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            // Strategy 1: Try paid-ebooks filter
            let url = `${CONFIG.API.BASE_URL}/volumes?q=subject:fiction&filter=paid-ebooks&maxResults=40&orderBy=relevance&printType=books${CONFIG.API_KEY ? `&key=${CONFIG.API_KEY}` : ''}`;
            let response = await this.fetchWithRetry(url);
            let data = await response.json();
            
            // Strategy 2: If no results, try bestseller books (popular premium titles)
            if (!data.items || data.items.length === 0) {
                console.log('Trying bestseller books as premium...');
                url = `${CONFIG.API.BASE_URL}/volumes?q=subject:bestseller+OR+subject:popular&filter=paid-ebooks&maxResults=40&orderBy=relevance&printType=books${CONFIG.API_KEY ? `&key=${CONFIG.API_KEY}` : ''}`;
                response = await this.fetchWithRetry(url);
                data = await response.json();
            }
            
            // Strategy 3: If still no results, get highly rated fiction books
            if (!data.items || data.items.length === 0) {
                console.log('Trying popular fiction books as premium...');
                url = `${CONFIG.API.BASE_URL}/volumes?q=subject:fiction&orderBy=newest&maxResults=40&printType=books${CONFIG.API_KEY ? `&key=${CONFIG.API_KEY}` : ''}`;
                response = await this.fetchWithRetry(url);
                data = await response.json();
            }
            
            // Check if we have items
            if (!data.items || data.items.length === 0) {
                console.warn('No premium books found in API response');
                return [];
            }
            
            let books = this.parseBooks(data.items || []);
            
            // FIXED: Strictly filter for premium books only (NOT free)
            books = books.filter(book => book.isPremium === true && book.isFree === false);
            
            // If no premium books found with strict filter, relax to non-free books
            if (books.length === 0) {
                console.log('Relaxing filter to non-free books...');
                books = this.parseBooks(data.items || []);
                books = books.filter(book => book.isFree === false);
            }
            
            // Return only the requested number
            books = books.slice(0, maxResults);
            
            console.log(`Loaded ${books.length} premium books (strictly filtered)`);
            
            this.setCached(cacheKey, books);
            return books;
        } catch (error) {
            console.error('Get paid books error:', error);
            throw error;
        }
    }

    // Get book by ID
    async getBookById(bookId) {
        const cacheKey = `book_${bookId}`;
        const cached = this.getCached(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const url = `${CONFIG.API.BASE_URL}/volumes/${bookId}${CONFIG.API_KEY ? `?key=${CONFIG.API_KEY}` : ''}`;
            const response = await this.fetchWithRetry(url);
            const data = await response.json();
            const book = this.parseBook(data);
            
            this.setCached(cacheKey, book);
            return book;
        } catch (error) {
            console.error('Get book by ID error:', error);
            throw error;
        }
    }

    // Parse multiple books from API response
    parseBooks(items) {
        return items.map(item => this.parseBook(item)).filter(book => book !== null);
    }

    // Parse single book from API response - IMPROVED VERSION
    parseBook(item) {
        try {
            const volumeInfo = item.volumeInfo || {};
            const saleInfo = item.saleInfo || {};
            const accessInfo = item.accessInfo || {};

            // IMPROVED: More accurate determination of free vs paid books
            // A book is considered FREE if:
            // 1. Explicitly marked as FREE in saleInfo
            // 2. Is in public domain (full public access)
            // 3. Has epub or pdf access with "FULL_PUBLIC_DOMAIN" status
            const isFree = 
                saleInfo.saleability === 'FREE' || 
                saleInfo.saleability === 'NOT_FOR_SALE' ||
                accessInfo.accessViewStatus === 'FULL_PUBLIC_DOMAIN' ||
                accessInfo.publicDomain === true ||
                (accessInfo.epub?.isAvailable && accessInfo.epub?.acsTokenLink === undefined && 
                 accessInfo.pdf?.isAvailable && accessInfo.pdf?.acsTokenLink === undefined) ||
                (saleInfo.isEbook === false && accessInfo.viewability === 'ALL_PAGES');

            // A book is premium if it's explicitly for sale with a price
            const isPremium = 
                saleInfo.saleability === 'FOR_SALE' || 
                saleInfo.listPrice !== undefined ||
                saleInfo.retailPrice !== undefined;

            return {
                id: item.id,
                title: volumeInfo.title || 'Unknown Title',
                authors: volumeInfo.authors || ['Unknown Author'],
                author: (volumeInfo.authors || ['Unknown Author'])[0],
                description: volumeInfo.description || 'No description available.',
                cover: volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || 
                       volumeInfo.imageLinks?.smallThumbnail?.replace('http:', 'https:') ||
                       CONFIG.DEFAULT_COVER,
                rating: volumeInfo.averageRating || 0,
                reviewCount: volumeInfo.ratingsCount || 0,
                categories: volumeInfo.categories || ['General'],
                category: (volumeInfo.categories || ['General'])[0],
                language: volumeInfo.language || 'en',
                pageCount: volumeInfo.pageCount || 0,
                publishedDate: volumeInfo.publishedDate || 'Unknown',
                publisher: volumeInfo.publisher || 'Unknown',
                previewLink: volumeInfo.previewLink || item.selfLink,
                infoLink: volumeInfo.infoLink || item.selfLink,
                isFree: isFree,
                isPremium: isPremium,
                // Debug info (can be removed in production)
                _debug: {
                    saleability: saleInfo.saleability,
                    accessViewStatus: accessInfo.accessViewStatus,
                    publicDomain: accessInfo.publicDomain,
                    isEbook: saleInfo.isEbook
                }
            };
        } catch (error) {
            console.error('Parse book error:', error);
            return null;
        }
    }

    // Get auto-suggestions for search
    async getSearchSuggestions(query, maxResults = 5) {
        if (!query || query.length < 2) {
            return [];
        }

        try {
            const url = `${CONFIG.API.BASE_URL}/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&printType=books${CONFIG.API_KEY ? `&key=${CONFIG.API_KEY}` : ''}`;
            const response = await this.fetchWithRetry(url, { allowNonOk: true });
            if (!response.ok) {
                return [];
            }
            const data = await response.json();
            return this.parseBooks(data.items || []);
        } catch (error) {
            console.error('Get suggestions error:', error);
            return [];
        }
    }
}

// Create global instance
window.booksAPI = new BooksAPI();
