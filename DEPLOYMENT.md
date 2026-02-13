# Deployment Guide for SmartWash

This guide explains how to deploy your SmartWash application to various hosting platforms.

## Before Deploying

1. Test the production build locally:
   ```bash
   npm run build
   npm run preview
   ```

2. Verify everything works at `http://localhost:4173`

## Deployment Options

### Option 1: Netlify (Recommended - Free)

**Easiest deployment with drag-and-drop:**

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to [Netlify Drop](https://app.netlify.com/drop)

3. Drag and drop the `dist` folder

4. Your site is live! You'll get a URL like: `https://your-site-name.netlify.app`

**Or use Netlify CLI:**

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build and deploy:
   ```bash
   npm run build
   netlify deploy --prod
   ```

**Or connect to Git:**

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com/)
3. Click "New site from Git"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

### Option 2: Vercel (Free)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts

**Or use Vercel dashboard:**

1. Go to [Vercel](https://vercel.com/)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel auto-detects Vite settings
5. Click "Deploy"

### Option 3: GitHub Pages (Free)

1. Install the gh-pages package:
   ```bash
   npm install -D gh-pages
   ```

2. Update `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/smartwash",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/smartwash/', // Your repo name
     plugins: [react()],
     // ... rest of config
   })
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. Enable GitHub Pages in your repository settings

### Option 4: Firebase Hosting (Free tier available)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase:
   ```bash
   firebase init
   ```
   - Select "Hosting"
   - Public directory: `dist`
   - Single-page app: `Yes`
   - Set up automatic builds: `No`

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

### Option 5: Render (Free)

1. Push code to GitHub
2. Go to [Render](https://render.com/)
3. Click "New Static Site"
4. Connect your repository
5. Settings:
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
6. Click "Create Static Site"

### Option 6: Traditional Web Server

If you have your own web server (Apache, Nginx, etc.):

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the contents of the `dist` folder to your web server

3. Configure your server:

**For Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**For Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Important Notes

### Single Page Application (SPA) Configuration

Since SmartWash is a single-page application, you need to configure your hosting to:
- Serve `index.html` for all routes
- Handle client-side routing properly

Most platforms (Netlify, Vercel) do this automatically. For others, add a redirect rule.

### Environment Variables

If you add environment variables later:

1. Create `.env` file locally (already in .gitignore)
2. Add variables like:
   ```
   VITE_API_URL=https://api.example.com
   ```
3. Access in code:
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL
   ```
4. Add variables to your hosting platform's dashboard

### Custom Domain

Most hosting platforms allow custom domains:

1. Buy a domain from a registrar (GoDaddy, Namecheap, etc.)
2. Add the domain in your hosting platform's settings
3. Update DNS records as instructed by the platform
4. Wait for DNS propagation (up to 48 hours)

## Post-Deployment Checklist

After deploying, verify:

- ✅ Customer login/registration works
- ✅ Admin access works (Ctrl+Alt+P)
- ✅ Booking system functions properly
- ✅ Receipt generation works
- ✅ All images and assets load
- ✅ Responsive design works on mobile
- ✅ All status updates work in admin panel
- ✅ LocalStorage persists data correctly

## Performance Optimization

For better performance:

1. **Enable compression** on your hosting platform
2. **Use a CDN** if available (Cloudflare, etc.)
3. **Enable caching** headers for static assets
4. **Monitor bundle size**:
   ```bash
   npm run build
   # Check dist folder size
   ```

## Analytics (Optional)

To track usage, add Google Analytics:

1. Get tracking ID from Google Analytics
2. Add to `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

## Updating Your Live Site

After making changes:

1. Pull latest changes:
   ```bash
   git pull
   ```

2. Install any new dependencies:
   ```bash
   npm install
   ```

3. Build:
   ```bash
   npm run build
   ```

4. Deploy:
   - **Netlify/Vercel with Git:** Automatic on push
   - **Netlify Drop:** Drag new dist folder
   - **Manual:** Upload new dist contents

## Backup Strategy

**Important:** Since data is stored in localStorage:

1. **For testing only:** Use as-is
2. **For production:** Integrate a backend database
   - Consider: Supabase, Firebase, MongoDB Atlas
   - Prevents data loss when users clear cache
   - Enables multi-device access

## Troubleshooting Deployment

### Build fails on hosting platform

1. Check Node.js version in platform settings (use v18+)
2. Verify `package.json` scripts are correct
3. Check build logs for specific errors

### 404 errors on refresh

Your platform needs SPA redirect rules:

**Netlify:** Create `public/_redirects`:
```
/*    /index.html   200
```

**Vercel:** Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Assets not loading

1. Check `base` path in `vite.config.ts`
2. Verify asset paths are relative
3. Check browser console for 404 errors

### Slow loading

1. Check bundle size (`dist` folder)
2. Enable gzip compression
3. Use a CDN
4. Optimize images

## Cost Estimates

- **Netlify:** Free (100GB bandwidth, 300 build minutes/month)
- **Vercel:** Free (100GB bandwidth, unlimited sites)
- **GitHub Pages:** Free (1GB storage, 100GB bandwidth/month)
- **Firebase:** Free tier (10GB storage, 360MB/day transfer)
- **Render:** Free (100GB bandwidth)

All free tiers are sufficient for small to medium traffic.

## Security Considerations

1. **HTTPS:** All recommended platforms provide free SSL
2. **API Keys:** Never commit to Git (use .env)
3. **Admin Credentials:** Change default password in production
4. **Data Privacy:** Consider GDPR if serving European users
5. **Backups:** Implement database if storing real customer data

## Need a Backend?

For production use with real customers, consider:

1. **Supabase** (easiest)
   - PostgreSQL database
   - Authentication
   - Real-time updates
   - Free tier: 500MB database, 2GB bandwidth

2. **Firebase**
   - NoSQL database
   - Authentication
   - Free tier available

3. **Custom Backend**
   - Node.js + Express
   - MongoDB/PostgreSQL
   - Host on Railway, Render, or Heroku

---

**Ready to deploy!** Choose a platform and follow the steps above.

For most users, we recommend starting with **Netlify Drop** (easiest) or **Vercel** (best performance).
