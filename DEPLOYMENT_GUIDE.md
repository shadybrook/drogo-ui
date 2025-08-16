# 🚀 DroGo Deployment Guide

## Complete Setup: Netlify + Supabase + Real-time Features

### **📋 Prerequisites**
- Node.js 18+ installed
- GitHub account
- Netlify account (free)
- Supabase account (free)

---

## **🔧 Step 1: Supabase Setup**

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose organization and enter:
   - **Project name**: `drogo-backend`
   - **Database password**: (save this securely)
   - **Region**: Choose closest to your users
4. Click "Create new project" (takes 2-3 minutes)

### 1.2 Get API Credentials
1. In your Supabase dashboard, go to **Settings → API**
2. Copy these values:
   ```
   Project URL: https://your-project-id.supabase.co
   Anon/Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 1.3 Setup Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `database-schema.sql` file
3. Click "Run" to execute the schema
4. Verify tables are created in **Table Editor**

---

## **🌐 Step 2: Environment Variables**

### 2.1 Create Local .env File
```bash
# Create .env in project root
REACT_APP_SUPABASE_URL=https://exdnazmunvvbqzihoavp.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZG5hem11bnZ2YnF6aWhvYXZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMjIxNzMsImV4cCI6MjA3MDg5ODE3M30.7zf4Pi-KEfm0yATbaYAz0tzTohqdi-QlH9qOHkU81PU
```

### 2.2 Test Local Setup
```bash
npm install
npm start
```
- App should load at `http://localhost:3000`
- Check browser console for "Supabase connected" (no errors)

---

## **🚀 Step 3: Netlify Deployment**

### 3.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial DroGo deployment"
git branch -M main
git remote add origin https://github.com/yourusername/drogo-ui.git
git push -u origin main
```

### 3.2 Connect to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up
2. Click "New site from Git"
3. Connect your GitHub account
4. Choose your `drogo-ui` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
6. Click "Deploy site"

### 3.3 Add Environment Variables in Netlify
1. In Netlify dashboard, go to **Site settings → Environment variables**
2. Add these variables:
   ```
   REACT_APP_SUPABASE_URL = https://your-project-id.supabase.co
   REACT_APP_SUPABASE_ANON_KEY = your-anon-key-here
   ```
3. Click "Save"
4. Go to **Deploys** and click "Trigger deploy"

---

## **✅ Step 4: Verify Deployment**

### 4.1 Test Core Features
- ✅ **Landing page** loads
- ✅ **Sign up/Login** works
- ✅ **Address selection** and map work
- ✅ **Add items to cart**
- ✅ **Place order** (check Supabase tables)
- ✅ **Real-time order tracking**

### 4.2 Test Admin Dashboard
- Visit: `https://your-site.netlify.app/admin`
- Should show orders and analytics
- Test order status updates

### 4.3 Test Push Notifications
- Allow notifications when prompted
- Place an order and watch for notifications
- Check browser notification permissions

---

## **🔄 Step 5: Real-time Features**

### 5.1 Order Tracking
- Orders update in real-time via Supabase subscriptions
- Status changes trigger notifications
- ETA updates automatically

### 5.2 Inventory Management
- Product stock updates in real-time
- Admin can see live inventory changes
- Low stock alerts (in console for demo)

### 5.3 Admin Dashboard
- Live order updates
- Real-time analytics
- Order status management

---

## **📱 Step 6: Push Notifications**

### 6.1 Browser Notifications
- Automatically requested on first login
- Works for order status updates
- Background service worker handles notifications

### 6.2 Add Notification Icons
Add these files to your `public` folder:
- `icon-192x192.png` (192x192 px app icon)
- `icon-72x72.png` (72x72 px badge icon)

---

## **🛠️ Step 7: Advanced Configuration**

### 7.1 Custom Domain (Optional)
1. In Netlify, go to **Domain settings**
2. Add custom domain
3. Configure DNS records as shown

### 7.2 Enable HTTPS
- Netlify automatically provides HTTPS
- Verify SSL certificate is active

### 7.3 Performance Optimization
- Enable Netlify's asset optimization
- Configure cache headers
- Use Netlify Edge Functions if needed

---

## **🔒 Step 8: Security & Production**

### 8.1 Supabase Security
- Review RLS policies in Supabase
- Set up proper user roles
- Configure JWT settings

### 8.2 Environment Security
- Never commit `.env` files
- Use Netlify environment variables
- Rotate API keys regularly

### 8.3 Monitoring
- Set up Supabase alerts
- Monitor Netlify deploy logs
- Track user analytics

---

## **📊 Step 9: Analytics & Monitoring**

### 9.1 Supabase Analytics
- Monitor database usage
- Track API calls
- Set up alerts for quotas

### 9.2 User Analytics
- Track order completion rates
- Monitor popular products
- Analyze delivery patterns

---

## **🚨 Troubleshooting**

### Common Issues

**1. Supabase Connection Error**
```
Error: Invalid API key
```
**Solution**: Check environment variables are correct and deployed

**2. Build Fails on Netlify**
```
Module not found: Can't resolve '@supabase/supabase-js'
```
**Solution**: Ensure all dependencies are in `package.json`

**3. Notifications Not Working**
```
Notification permission denied
```
**Solution**: Enable notifications in browser settings

**4. Orders Not Updating**
```
RLS policy violation
```
**Solution**: Check database policies in Supabase

### Support Resources
- **Supabase Docs**: [docs.supabase.com](https://docs.supabase.com)
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **React Docs**: [react.dev](https://react.dev)

---

## **🎯 Production Checklist**

- [ ] Supabase project created and configured
- [ ] Database schema deployed
- [ ] Environment variables set in Netlify
- [ ] GitHub repository connected
- [ ] Netlify deployment successful
- [ ] All features tested and working
- [ ] Push notifications enabled
- [ ] Admin dashboard accessible
- [ ] Real-time updates working
- [ ] SSL certificate active
- [ ] Custom domain configured (optional)

---

## **💰 Cost Breakdown**

**Free Tier Limits:**
- **Netlify**: 100GB bandwidth/month, 300 build minutes
- **Supabase**: 500MB database, 2GB bandwidth, 50MB file storage
- **Total Monthly Cost**: $0

**Paid Upgrades** (when needed):
- **Netlify Pro**: $19/month (1TB bandwidth)
- **Supabase Pro**: $25/month (8GB database)

---

## **📞 Support**

If you encounter issues:
1. Check browser console for errors
2. Verify environment variables
3. Check Supabase table structure
4. Review Netlify deploy logs

**Contact**: Create an issue in the GitHub repository with:
- Error messages
- Screenshots
- Steps to reproduce

---

**🎉 Congratulations! Your DroGo app is now live with full real-time features!**

**Live URLs:**
- **App**: `https://your-site.netlify.app`
- **Admin**: `https://your-site.netlify.app/admin`
- **Supabase Dashboard**: `https://your-project-id.supabase.co`
