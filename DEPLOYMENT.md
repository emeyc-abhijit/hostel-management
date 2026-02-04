# Production Deployment Guide

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
2. **Login to Heroku**

   ```bash
   heroku login
   ```

3. **Create Heroku App**

   ```bash
   cd backend
   heroku create hostel-harmony-backend
   ```

4. **Set Environment Variables**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=<your-mongodb-atlas-uri>
   heroku config:set JWT_SECRET=<strong-random-key>
   heroku config:set FRONTEND_URL=<your-frontend-url>
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: AWS EC2

1. **Launch EC2 Instance** (Node.js compatible)
2. **SSH into instance**
3. **Clone repository**
4. **Install dependencies**: `npm install`
5. **Build**: `npm run build`
6. **Set environment variables**
7. **Use PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name "hostel-backend"
   pm2 startup
   pm2 save
   ```
8. **Set up Nginx reverse proxy**

### Option 3: DigitalOcean App Platform

1. Create app from GitHub repo
2. Set runtime to Node.js
3. Add environment variables
4. Deploy

## Frontend Deployment

### Option 1: Vercel

1. **Push to GitHub**
2. **Connect GitHub repo to Vercel**
3. **Configure build settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add environment variables**
   ```
   VITE_API_URL=<your-backend-url>
   ```
5. **Deploy**

### Option 2: Netlify

1. **Connect GitHub repository**
2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Add environment variables**
4. **Deploy**

### Option 3: AWS S3 + CloudFront

1. **Build frontend**: `npm run build`
2. **Create S3 bucket**
3. **Upload dist folder to S3**
4. **Create CloudFront distribution**
5. **Configure domain**

## Database Setup

### MongoDB Atlas (Recommended)

1. **Sign up at mongodb.com**
2. **Create cluster**
3. **Create database user**
4. **Whitelist IP addresses**
5. **Get connection string**
6. **Update MONGODB_URI in production environment**

Connection String Format:

```
mongodb+srv://username:password@cluster.mongodb.net/hostel-harmony?retryWrites=true&w=majority
```

## SSL/TLS Certificate

### For Backend on EC2

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure in Nginx
sudo nano /etc/nginx/sites-available/default
```

### For Frontend on Vercel/Netlify

- Automatic SSL included

## Environment Configuration

### Backend (.env)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hostel-harmony
JWT_SECRET=<long-random-secure-key>
JWT_EXPIRY=7d
FRONTEND_URL=https://yourdomain.com

# Optional
LOG_LEVEL=info
RATE_LIMIT=100
RATE_LIMIT_WINDOW=15
```

### Frontend (.env)

```env
VITE_API_URL=https://api.yourdomain.com/api
```

## Performance Optimization

### Backend

1. **Enable Compression**

   ```typescript
   app.use(compression());
   ```

2. **Database Indexing**

   ```typescript
   // Add indexes to frequently queried fields
   userSchema.index({ email: 1 });
   studentSchema.index({ userId: 1 });
   ```

3. **Caching**

   ```typescript
   app.use(mcache("5 minutes"));
   ```

4. **Connection Pooling**
   ```typescript
   mongoose.set("maxPoolSize", 10);
   ```

### Frontend

1. **Lazy Loading**

   ```typescript
   const Dashboard = lazy(() => import("./pages/Dashboard"));
   ```

2. **Code Splitting**
   - Vite handles this automatically

3. **Image Optimization**
   - Use webp format
   - Responsive images

## Monitoring & Logging

### Backend Logging

```bash
npm install winston
```

### Error Tracking

- Sentry for error monitoring
- LogRocket for frontend errors

### Performance Monitoring

- New Relic
- Datadog
- CloudWatch (AWS)

## Backup & Recovery

### Database

```bash
# Backup MongoDB Atlas
mongodump --uri="mongodb+srv://user:pass@cluster..."

# Restore
mongorestore dump/
```

### Code

- Use GitHub for version control
- Tag releases
- Document breaking changes

## Security Hardening

1. **Dependencies Update**

   ```bash
   npm audit
   npm audit fix
   ```

2. **Environment Secrets**
   - Never commit .env files
   - Use secrets management (GitHub Secrets, AWS Secrets Manager)

3. **API Security**
   - Rate limiting
   - Input validation
   - CORS restrictions
   - HTTPS enforcement

4. **Database Security**
   - IP whitelist
   - Strong passwords
   - Regular backups
   - Encrypted connections

## Domain & DNS

1. **Register domain** (GoDaddy, Namecheap, etc.)
2. **Configure DNS**
   - A record for backend
   - CNAME for frontend CDN
3. **SSL certificate** (Let's Encrypt)

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: npm run build && npm run deploy
```

## Health Checks

### Backend

```bash
curl https://api.yourdomain.com/api/health
```

### Frontend

- Monitor uptime with services like UptimeRobot

## Scaling Considerations

- **Horizontal Scaling**: Multiple backend instances behind load balancer
- **Database Sharding**: For large datasets
- **CDN**: For static assets
- **Caching**: Redis for session/data caching
- **Microservices**: Future architecture

## Support & Maintenance

- Regular dependency updates
- Security patches
- Performance optimization
- User feedback loop
- Documentation updates
- Team training

---

## Quick Checklist

- [ ] Build test passes
- [ ] Environment variables configured
- [ ] Database backup created
- [ ] SSL certificate installed
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Error tracking enabled
- [ ] DNS records updated
- [ ] Domain SSL certificate valid
- [ ] Load testing completed
- [ ] Monitoring alerts set up
- [ ] Backup plan documented
- [ ] Incident response plan ready
