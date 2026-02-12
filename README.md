# 📚 BookWorld - Your Gateway to Books

A modern, user-friendly book discovery platform that integrates with **Google Books API** to provide access to thousands of free and premium books across all genres.

![BookWorld](static/images/logo.svg)

---

## ✨ Features Implemented

### 🏠 **Home Page**
- ✅ "Welcome to BookWorld" hero section
- ✅ Free Reading button (displays free books from Google Books API)
- ✅ Premium Reading button (displays paid/premium books)
- ✅ Explore Books button (scrolls to categories section)
- ✅ Clean, intuitive interface with calm color scheme

### 🧭 **Navigation Bar**
- ✅ Website logo and name
- ✅ Smart search bar with auto-suggestions
- ✅ Home button (scrolls to top)
- ✅ Categories button (scrolls to categories)
- ✅ Wishlist icon with item counter
- ✅ Notifications icon
- ✅ Profile dropdown (Register/Login or View Profile)

### 👤 **User Authentication**
- ✅ **Register**: Collects Name, Email, Age, Gender
- ✅ **Login**: Simple email-based login
- ✅ **Profile View**: Displays user information
- ✅ **Guest Mode**: Works without login
- ✅ LocalStorage-based authentication (no database required)

### 🔍 **Search Functionality**
- ✅ Real-time auto-suggestions while typing
- ✅ Book covers displayed in suggestions
- ✅ Full search on Enter key
- ✅ Opens detailed book view on selection
- ✅ Powered by Google Books API

### 📂 **Browse by Categories**
- ✅ 12 Book categories:
  - Fiction, Mystery, Romance, Science Fiction, Fantasy
  - Biography, History, Self-Help, Business, Science
  - Children's Books, Young Adult
- ✅ Click any category to load books in that genre
- ✅ Dynamic category cards with icons

### 🌟 **Top 10 Trending Books**
- ✅ Displays highly-rated books from Google Books API
- ✅ Sorted by ratings and review counts
- ✅ Book cards show: cover, title, author, rating, FREE/PREMIUM label

### 📖 **Book Details (Popup Modal)**
- ✅ Book cover image
- ✅ Title, Author(s), Genre
- ✅ Language, Page count, Publish date
- ✅ Star rating with review count
- ✅ Full description/abstract
- ✅ FREE/PREMIUM label
- ✅ **Preview Button**: Opens book preview
- ✅ **More Info Button**: Links to original source
- ✅ **Wishlist Button**: Add/remove from wishlist

### ❤️ **Wishlist System**
- ✅ Add books to wishlist with heart icon
- ✅ Remove books from wishlist
- ✅ View all saved books in wishlist modal
- ✅ Persists across sessions (LocalStorage)
- ✅ Counter badge on wishlist icon

### 🔔 **Notifications**
- ✅ In-app notification system
- ✅ Welcome messages, wishlist updates
- ✅ Notification counter badge
- ✅ Notification history

### 🤖 **AI Chatbot Assistant**
- ✅ Bottom-right corner placement
- ✅ Greets users on open
- ✅ Accepts user interests/preferences
- ✅ Recommends books from Google Books API
- ✅ Keyword-based book matching
- ✅ Minimizable interface

### 🎨 **Color Scheme (Calm & Comfortable)**
- ✅ **Sage Green** (#7c9885) - Primary color
- ✅ **Warm Beige** (#b8a08a) - Secondary color
- ✅ **Soft Gold** (#d4a574) - Accent color
- ✅ **Off-White** (#faf8f5) - Background
- ✅ **Dark Green-Gray** (#2c3e3a) - Text
- ✅ Designed for comfortable, long reading sessions

### 🔗 **Footer**
- ✅ BookWorld logo and description
- ✅ Social media icons (Facebook, Twitter, Instagram, LinkedIn)
- ✅ Quick Links: Home, Categories, Free Books, Premium Books
- ✅ Support: Terms of Service, Privacy Policy, Contact
- ✅ **Copyright Disclaimer**: To avoid legal issues with book content

### 📱 **Responsive Design**
- ✅ Mobile-friendly interface
- ✅ Tablet-optimized layout
- ✅ Desktop experience
- ✅ Smooth animations and transitions

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package installer)
- Internet connection (for Google Books API)

### Installation

1. **Extract the project files** (if you received a ZIP)
   ```bash
   unzip bookworld.zip
   cd bookworld_new
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open your browser**
   ```
   http://localhost:5000
   ```

That's it! Your BookWorld is now live! 🎉

---

## 📁 Project Structure

```
bookworld_new/
├── app.py                      # Flask backend server
├── requirements.txt            # Python dependencies
├── README.md                   # This file
├── templates/
│   └── index.html             # Main HTML template
└── static/
    ├── css/
    │   └── style.css          # All styles (calm color scheme)
    ├── js/
    │   ├── config.js          # Configuration & constants
    │   ├── api.js             # Google Books API integration
    │   ├── auth.js            # Authentication system
    │   ├── wishlist.js        # Wishlist management
    │   ├── search.js          # Search functionality
    │   ├── ui.js              # UI manager & interactions
    │   ├── chatbot.js         # AI chatbot
    │   └── main.js            # Application entry point
    └── images/
        └── logo.svg           # BookWorld logo
```

---

## 🎯 How to Use

### 📚 **Browsing Books**
1. **View Trending Books**: Scroll down the homepage to see Top 10 trending books
2. **Free Books**: Click "Free Reading" button to see all free books
3. **Premium Books**: Click "Premium Reading" button to see paid books
4. **By Category**: Click "Explore Books" → Select any category

### 🔍 **Searching for Books**
1. Type in the search bar at the top
2. Auto-suggestions appear as you type (shows book covers)
3. Click a suggestion to view book details
4. Or press Enter for full search results

### 👤 **Creating an Account**
1. Click the Profile icon (top-right)
2. Click "Register"
3. Fill in: Name, Email, Age, Gender
4. Click "Register"

### 🔐 **Logging In**
1. Click the Profile icon
2. Click "Login"
3. Enter your email
4. Click "Login"

### ❤️ **Managing Wishlist**
1. Click the heart icon on any book card
2. View your wishlist by clicking the Wishlist icon (top navigation)
3. Remove books by clicking the heart again

### 📖 **Reading Books**
1. Click on any book to view details
2. Click "Preview Book" to read a sample
3. Click "More Info" to visit the original source
4. Add to wishlist for later

### 🤖 **Using AI Assistant**
1. Click the robot icon (bottom-right corner)
2. Tell the bot your interests (e.g., "I want mystery books")
3. The bot will recommend books from Google Books API
4. Click recommended books to view details

---

## 🔧 Google Books API Integration

### What's Included:
- **Real-time book data** from Google Books API
- **No API key required** for basic usage
- **Automatic caching** (5-minute duration for faster performance)
- **Book metadata**:
  - Title, Author(s), Description
  - Cover images
  - Ratings & review counts
  - Categories/Genres
  - Language, Page count, Publish date
  - FREE/PREMIUM classification
  - Preview & info links

### API Features:
- ✅ Search books by title/author
- ✅ Filter by category
- ✅ Get free books only
- ✅ Get paid books only
- ✅ Get trending books
- ✅ Auto-suggestions
- ✅ Client-side caching for performance

---

## ⚙️ Configuration

### Customize Categories
Edit `static/js/config.js` to add/remove categories:
```javascript
CATEGORIES: [
    { id: 'fiction', name: 'Fiction', icon: 'fa-book', query: 'subject:fiction' },
    // Add more categories here
]
```

### Customize Colors
Edit `static/css/style.css` CSS variables:
```css
:root {
    --sage-green: #7c9885;
    --warm-beige: #b8a08a;
    --soft-gold: #d4a574;
    /* Modify colors here */
}
```

### Replace Logo
Replace `static/images/logo.svg` or `static/images/logo.png` with your custom logo.

---

## 🌐 Deployment

### Local Development
Already running with `python app.py` on `http://localhost:5000`

### Production Deployment Options

#### 1. **Heroku**
```bash
# Create Procfile
echo "web: python app.py" > Procfile

# Deploy
git init
git add .
git commit -m "Initial commit"
heroku create bookworld-app
git push heroku master
```

#### 2. **PythonAnywhere**
1. Upload project files
2. Create virtual environment
3. Install requirements
4. Configure WSGI file
5. Reload web app

#### 3. **Vercel/Netlify** (with serverless functions)
- Configure build settings
- Deploy static files
- Set up serverless API routes

---

## 🛡️ Copyright & Legal

### Disclaimer
**BookWorld is a book discovery platform** that aggregates publicly available book information from Google Books API. 

- ❌ We do **NOT** claim ownership of any book content, covers, or metadata
- ✅ All rights belong to their respective authors, publishers, and copyright holders
- ✅ Links to read or preview books redirect to **authorized sources**
- ✅ We use Google Books API in compliance with their Terms of Service

**For copyright concerns**, please contact us and we will respond promptly.

---

## 📊 Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| Home Page | ✅ Complete | Hero section with action buttons |
| Navigation | ✅ Complete | Full navbar with search, wishlist, profile |
| User Auth | ✅ Complete | Register/Login with age & gender |
| Search | ✅ Complete | Auto-suggestions with book covers |
| Categories | ✅ Complete | 12 genres with dynamic filtering |
| Trending Books | ✅ Complete | Top 10 highly-rated books |
| Book Details | ✅ Complete | Full modal with all metadata |
| Wishlist | ✅ Complete | Add/remove with persistence |
| AI Chatbot | ✅ Complete | Book recommendations |
| Notifications | ✅ Complete | In-app notification system |
| Free Books | ✅ Complete | Filter free books only |
| Premium Books | ✅ Complete | Filter paid books only |
| Responsive | ✅ Complete | Mobile, tablet, desktop |
| Footer | ✅ Complete | Links, social media, disclaimer |

---

## 🎓 Technologies Used

### Frontend
- **HTML5**: Semantic structure
- **CSS3**: Custom styling with CSS variables
- **JavaScript (ES6+)**: Modular architecture
- **Font Awesome**: Icons
- **Google Fonts**: Typography (Inter, Playfair Display)

### Backend
- **Flask**: Python web framework
- **Flask-CORS**: Cross-origin resource sharing

### API
- **Google Books API v1**: Real-time book data

### Storage
- **LocalStorage**: User data, wishlist, cache

---

## 📈 Performance

- ⚡ **Fast page loads** with optimized assets
- 💾 **Client-side caching** (5-minute expiry)
- 🎨 **Smooth animations** with CSS transitions
- 📱 **Responsive images** with proper sizing
- 🔄 **Lazy loading** for book covers

---

## 🐛 Troubleshooting

### Books not loading?
- Check internet connection
- Google Books API might be temporarily down
- Clear browser cache and refresh

### User data lost?
- LocalStorage might be cleared
- Browser in private/incognito mode
- Use regular browser mode

### Search not working?
- Type at least 2 characters
- Wait for auto-suggestions
- Try different keywords

### Images not displaying?
- Ad blockers might interfere
- Disable ad blocker for this site
- Check internet connection

---

## 🚀 Future Enhancements

Potential features for future versions:
- [ ] User book reviews & ratings
- [ ] Reading progress tracking
- [ ] Book recommendations based on reading history
- [ ] Social sharing features
- [ ] Multiple language support
- [ ] Advanced search filters
- [ ] User book collections
- [ ] Reading challenges & achievements

---

## 📞 Support

For questions, issues, or feedback:
- **Email**: support@bookworld.com (placeholder)
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Read this README carefully

---

## 🙏 Acknowledgments

- **Google Books API**: For providing book data
- **Font Awesome**: For beautiful icons
- **Google Fonts**: For typography
- **Flask**: For the web framework

---

## 📝 License

This project is for educational and demonstration purposes. 

**Book content, covers, and metadata** are provided by Google Books API and belong to their respective copyright holders.

---

## 🎉 Enjoy BookWorld!

Thank you for using BookWorld. We hope you discover amazing books!

**Happy Reading!** 📚✨

---

**Version**: 1.0.0  
**Last Updated**: February 3, 2026  
**Status**: Production Ready ✓
