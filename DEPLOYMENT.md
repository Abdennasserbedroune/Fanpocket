# Deployment Guide - AFCON 2025 Marrakech MVP

## Quick Start

This project is ready for immediate deployment to Vercel or Netlify.

## Vercel Deployment (Recommended)

### Automatic Deployment

1. **Connect Repository**

   ```bash
   # Install Vercel CLI (optional)
   npm i -g vercel

   # Deploy
   vercel
   ```

2. **Configuration**
   The project includes `vercel.json` with optimal settings:
   - Build command: `npm run build`
   - Output directory: `public`
   - Framework: None (vanilla JS)

3. **Preview Deployments**
   - Every PR automatically gets a preview deployment
   - GitHub Actions CI/CD validates build and performance

### Manual Setup

1. Go to [vercel.com](https://vercel.com)
2. Import your repository
3. Vercel auto-detects settings from `vercel.json`
4. Click "Deploy"

## Netlify Deployment

### Option 1: Drop File Upload

```bash
# Build the project
npm run build

# Drag and drop the 'public' folder to Netlify
```

### Option 2: Git Integration

1. Create `netlify.toml`:

   ```toml
   [build]
     command = "npm run build"
     publish = "public"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. Connect repository to Netlify
3. Deploy automatically on push

## Environment Setup

### Build Requirements

- Node.js 16+ or 18+
- npm 8+

### Build Process

```bash
# Install dependencies
npm install

# Run build
npm run build
```

**Build outputs:**

- `dist/main.min.css` (7.4 KB)
- `dist/app.min.js` (4.8 KB)
- Copies to `public/dist/` for serving
- Copies data to `public/data/`

## CI/CD Pipeline

The project includes GitHub Actions workflow (`.github/workflows/ci.yml`):

### On Push/PR:

1. **Lint Check** - Prettier formatting validation
2. **Build** - Verifies successful build
3. **Lighthouse** - Performance audit
4. **Artifacts** - Uploads build artifacts

### Status Checks

All PRs must pass:

- ✅ Linting (Prettier)
- ✅ Build success
- ✅ Lighthouse performance >= 80

## Performance Optimization

### Current Stats

- **CSS**: 7.4 KB minified
- **JS**: 4.8 KB minified
- **Total**: ~12 KB (excluding images)
- **No external dependencies**

### Expected Lighthouse Scores

- Performance: 85-95
- Accessibility: 90-100
- Best Practices: 90-100
- SEO: 90-100

### Further Optimizations

If scores are below target:

1. **Enable Compression**
   - Gzip/Brotli compression (Vercel/Netlify auto-enable)
   - Expected: CSS ~2.5 KB, JS ~1.8 KB

2. **Add Images**
   - Use WebP format
   - Add width/height attributes
   - Implement lazy loading

3. **Add Service Worker** (future)
   - Cache static assets
   - Offline support

## Custom Domain Setup

### Vercel

```bash
vercel domains add your-domain.com
```

### Netlify

1. Go to Domain settings
2. Add custom domain
3. Configure DNS

## SSL/TLS

Both Vercel and Netlify provide:

- ✅ Automatic HTTPS
- ✅ Free SSL certificates
- ✅ HTTP/2 support

## Environment Variables

The application requires Firebase configuration through environment variables.

### Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add the following variables with values from your Firebase project:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. For each variable, select which environments to apply (Production/Preview/Development)
5. Redeploy for changes to take effect

```bash
# Alternative: Using Vercel CLI
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
# ... repeat for all variables
```

### Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings > Environment variables**
3. Click "Add a variable"
4. Add each Firebase configuration variable:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Trigger a new deploy for changes to take effect

### Environment Variable Injection

The build process automatically injects environment variables into `src/js/config.js` during the build step. The `scripts/inject-config.js` script replaces placeholders like `%%VITE_FIREBASE_API_KEY%%` with actual values.

See `FIREBASE_SETUP.md` for detailed instructions on obtaining these values from Firebase Console.

## Monitoring

### Vercel Analytics

```bash
# Enable Vercel Analytics
vercel analytics enable
```

### Lighthouse CI

Automated Lighthouse checks run on every PR via GitHub Actions.

### Manual Testing

```bash
# Install Lighthouse CLI
npm install -g @lhci/cli

# Run audit
lhci autorun --collect.url=http://localhost:8080
```

## Rollback

### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Netlify

- Use Netlify dashboard
- Select previous deployment
- Click "Publish deploy"

## Troubleshooting

### Build Fails

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Test build locally
npm run build
```

### CSS/JS Not Loading

- Verify `public/dist/` contains minified files
- Check browser console for 404 errors
- Ensure `npm run build` completed successfully

### Data Not Loading

- Verify `public/data/` contains JSON files
- Check CORS settings (not needed for same-origin)
- Test locally with `npm run dev`

## Preview URLs

After deployment, you'll get:

- **Production**: `https://your-project.vercel.app`
- **Preview (PR)**: `https://your-project-git-[branch].vercel.app`
- **Custom Domain**: `https://your-domain.com`

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Check responsive design on mobile
- [ ] Test all links and navigation
- [ ] Verify data files load
- [ ] Check browser console for errors
- [ ] Run Lighthouse audit
- [ ] Test form submissions (login, register)
- [ ] Verify SEO meta tags (View source)
- [ ] Test Open Graph (Share on social media)
- [ ] Check accessibility with screen reader

## Support

For deployment issues:

- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- GitHub Actions: [docs.github.com/actions](https://docs.github.com/en/actions)

---

**Ready to Deploy!** 🚀

The project is production-ready. Simply connect your repository to Vercel or Netlify and deploy!
