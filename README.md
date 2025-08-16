# DroGo - Drone Delivery App

A modern, responsive React web application for drone delivery services. Built with React 18, featuring real-time order tracking, interactive maps, and seamless user experience across all devices.

## 🚁 Features

### Core Functionality
- **User Authentication**: Google OAuth and email/password login
- **Interactive Maps**: Location selection with Leaflet.js
- **Delivery Spot Selection**: Uber-like pickup spot interface
- **Real-time Cart**: Live updates with item management
- **Order Tracking**: Live delivery tracking with animated drone
- **Responsive Design**: Optimized for mobile, tablet, and desktop

### Advanced Features
- **Voice Search**: Voice-enabled product search
- **Edge Case Handling**: Robust location and terrace accessibility logic
- **PWA Ready**: Progressive Web App capabilities
- **Real-time Updates**: Live cart changes and order status
- **Backend Integration**: Ready for API integration

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router DOM
- **Maps**: Leaflet.js, React-Leaflet
- **Authentication**: Firebase Auth (configurable)
- **Styling**: Custom CSS with CSS Variables
- **State Management**: React Context API
- **Notifications**: React Toastify
- **Build Tool**: Create React App
- **Deployment**: Netlify optimized

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile**: 320px - 768px (Primary focus)
- **Tablet**: 769px - 1024px
- **Desktop**: 1025px and above

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd drogo-drone-delivery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🌐 Deployment

### Netlify Deployment

1. **Connect to Netlify**
   - Push code to GitHub/GitLab
   - Connect repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`

2. **Environment Variables** (if needed)
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   REACT_APP_API_BASE_URL=your_api_url
   ```

3. **Deploy**
   - Automatic deployment on git push
   - Manual deployment via Netlify dashboard

### Custom Domain Setup
```
# Custom domain configuration
www.drogo-delivery.com → Primary domain
drogo-delivery.com → Redirect to www
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── LandingPage.js   # Landing and address input
│   ├── HomePage.js      # Main shopping interface
│   ├── OrdersPage.js    # Order tracking
│   ├── AccountPage.js   # User account management
│   ├── AuthModal.js     # Authentication modal
│   ├── InteractiveMap.js # Map with delivery spots
│   └── ...
├── contexts/            # React Context providers
│   ├── AuthContext.js   # User authentication
│   ├── CartContext.js   # Shopping cart management
│   └── LocationContext.js # Location and delivery spots
├── data/
│   └── products.js      # Product catalog
├── App.js              # Main app component
├── index.js           # App entry point
└── index.css          # Global styles
```

## 🔧 Configuration

### Authentication Setup
Update `src/contexts/AuthContext.js` for production:

```javascript
// Replace mock authentication with real Firebase config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // ... other config
};
```

### Maps Configuration
Update `src/components/InteractiveMap.js` for production:

```javascript
// Replace with your preferred map provider
const tileLayer = "https://your-map-provider/{z}/{x}/{y}.png";
```

### Backend Integration
Update contexts for API integration:

```javascript
// Example API integration in CartContext.js
const placeOrder = async (orderData) => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  return response.json();
};
```

## 🎨 Design System

### Color Palette
```css
--brand: #00D67F        /* Primary green */
--brand-2: #00b86f      /* Darker green */
--brand-light: #e6fff2  /* Light green */
--accent: #FFB703       /* Orange accent */
--bg: #f8fafc          /* Background */
--card: #ffffff        /* Card background */
--ink: #0f172a         /* Text color */
--muted: #64748b       /* Muted text */
```

### Typography
- **Primary Font**: Inter
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto

### Breakpoints
- **Mobile**: max-width: 480px
- **Tablet**: 481px - 768px  
- **Desktop**: 769px+

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration/login flow
- [ ] Address input and validation
- [ ] Map interaction and delivery spot selection
- [ ] Product browsing and search
- [ ] Cart operations (add, remove, update)
- [ ] Order placement and tracking
- [ ] Responsive design across devices
- [ ] Voice search functionality
- [ ] Edge cases (no location, invalid input)

### Production Testing
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] PWA functionality
- [ ] Cross-browser compatibility
- [ ] Accessibility compliance

## 🔒 Security

### Client-Side Security
- Input validation and sanitization
- XSS protection through React's built-in escaping
- Secure authentication token handling
- Environment variable protection

### Production Recommendations
- HTTPS enforcement
- CSP headers implementation
- Rate limiting on API endpoints
- Input validation on backend

## 📊 Performance

### Optimization Features
- Code splitting with React lazy loading
- Image optimization and lazy loading
- Service worker for caching
- Bundle size optimization
- Gzip compression via Netlify

### Performance Metrics
- Lighthouse Score: 90+ (target)
- First Contentful Paint: <2s
- Time to Interactive: <3s
- Bundle size: <500KB gzipped

## 🐛 Troubleshooting

### Common Issues

1. **Maps not loading**
   ```bash
   # Check Leaflet.js import
   npm install leaflet react-leaflet
   ```

2. **Authentication issues**
   ```bash
   # Verify environment variables
   echo $REACT_APP_GOOGLE_CLIENT_ID
   ```

3. **Build failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and React DevTools support.

## 🚀 Future Enhancements

### Planned Features
- [ ] Push notifications for order updates
- [ ] Offline functionality with service workers
- [ ] Advanced analytics and tracking
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced filters and sorting
- [ ] Social sharing capabilities
- [ ] Loyalty program integration

### Backend Integration
- [ ] Real-time order tracking API
- [ ] Payment gateway integration
- [ ] Inventory management system
- [ ] User preference storage
- [ ] Analytics and reporting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Email: support@drogo-delivery.com
- Phone: 1800-DROGO-1
- Documentation: [docs.drogo-delivery.com]

---

**Made with ❤️ for fast, efficient drone delivery**
