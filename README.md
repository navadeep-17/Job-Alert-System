# Job Alert System

A full-stack job alert website built with Next.js 14, TypeScript, Prisma, PostgreSQL, and Resend for email notifications. Users can subscribe to job alerts based on their preferences and receive daily email notifications about new opportunities.

## Features

- 🔍 **Browse Jobs** - View and search job listings with filters for category, location, and keywords
- 📧 **Email Subscriptions** - Subscribe with email verification to get personalized job alerts
- 🎯 **Preference Management** - Select job categories, locations, and keywords for tailored alerts
- ✉️ **Email Notifications** - Receive daily digests of matching jobs via email
- 🔐 **Verification System** - Email verification for subscribers
- 🚫 **Easy Unsubscribe** - One-click unsubscribe from email alerts
- ⚡ **Cron Jobs** - Automated daily job alert sending
- 💾 **PostgreSQL Database** - Robust data storage with Prisma ORM

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Email**: Resend
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Resend account with API key

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd "JOB ALERT SYSTEM"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/jobalert?schema=public"
   RESEND_API_KEY="your_resend_api_key"
   APP_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   CRON_SECRET="your_random_secret_for_cron_protection"
   ```

4. **Set up the database**:
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev --name init
   
   # Seed sample data (optional)
   npx tsx prisma/seed.ts
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses four main models:

- **Subscriber** - Stores user email and verification status
- **Preference** - User's job preferences (categories, locations, keywords)
- **Job** - Job listings with details
- **Notification** - Tracks which jobs have been sent to which subscribers

## API Routes

### Public Routes

- `POST /api/subscribe` - Subscribe to job alerts
- `GET /api/verify?token={token}` - Verify email subscription
- `GET /api/unsubscribe?email={email}` - Unsubscribe from alerts

### Admin Routes

- `POST /api/jobs` - Create a new job listing
- `PUT /api/jobs` - Bulk import jobs

### Cron Routes

- `GET /api/cron/send-alerts` - Send daily job alerts (requires Bearer token)

## Email Configuration

### Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Verify your sending domain
3. Get your API key from the dashboard
4. Update `RESEND_API_KEY` in `.env`
5. Update the `from` field in `lib/email.ts` with your verified domain:
   ```typescript
   from: 'JobAlert <noreply@yourdomain.com>'
   ```

## Setting Up Cron Jobs

For production, you'll want to set up a cron job to automatically send alerts. Here are options:

### Option 1: Vercel Cron (Recommended for Vercel deployments)

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/send-alerts",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Option 2: External Cron Service

Use services like:
- **cron-job.org**
- **EasyCron**
- **GitHub Actions**

Configure to make a GET request to:
```
https://your-domain.com/api/cron/send-alerts
```

With header:
```
Authorization: Bearer YOUR_CRON_SECRET
```

### Option 3: System Cron (Self-hosted)

Add to your crontab:
```bash
0 9 * * * curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.com/api/cron/send-alerts
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── cron/send-alerts/   # Cron job for sending alerts
│   │   ├── jobs/               # Job management API
│   │   ├── subscribe/          # Subscription API
│   │   ├── verify/             # Email verification
│   │   └── unsubscribe/        # Unsubscribe API
│   ├── jobs/                   # Job listing pages
│   ├── subscribe/              # Subscription page
│   ├── verify/                 # Verification page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── lib/
│   ├── prisma.ts               # Prisma client
│   ├── email.ts                # Email sending utilities
│   └── sample-data.ts          # Sample job data
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeding script
├── .env.example                # Environment variables template
└── package.json                # Dependencies
```

## Usage Guide

### For End Users

1. **Browse Jobs**: Visit `/jobs` to see all available positions
2. **Subscribe**: Go to `/subscribe` and fill out preferences
3. **Verify Email**: Check inbox and click verification link
4. **Receive Alerts**: Get daily emails with matching jobs
5. **Unsubscribe**: Click unsubscribe link in any email

### For Admins

#### Add a Single Job

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Developer",
    "company": "Tech Co",
    "location": "Remote",
    "description": "Job description here",
    "category": "Software Engineering",
    "url": "https://example.com/job",
    "salary": "$120k-$150k",
    "type": "Full-time",
    "remote": true
  }'
```

#### Bulk Import Jobs

```bash
curl -X PUT http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "jobs": [
      { /* job 1 */ },
      { /* job 2 */ }
    ]
  }'
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Database Options

- **Vercel Postgres** - Integrated PostgreSQL
- **Supabase** - Free tier available
- **Railway** - Easy PostgreSQL hosting
- **Neon** - Serverless PostgreSQL

## Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Database commands
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Create/run migrations
npx prisma generate        # Generate Prisma Client
npx tsx prisma/seed.ts     # Seed database
```

## Testing the Email Flow

During development, verification URLs will be logged to the console. In production, these will be sent via email.

To test:
1. Subscribe with your email
2. Check console for verification URL
3. Visit the URL to verify
4. Check that subscriber is marked as verified in database

## Customization

### Job Categories

Edit categories in `app/subscribe/page.tsx`:
```typescript
const CATEGORIES = [
  "Software Engineering",
  "Data Science",
  // Add more...
];
```

### Email Templates

Customize email design in `lib/email.ts`:
- `sendVerificationEmail()` - Verification email
- `sendJobAlertEmail()` - Job alert digest

### Styling

Tailwind classes are used throughout. Customize in:
- `tailwind.config.ts` - Theme configuration
- `app/globals.css` - Global styles

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Check connection string format

### Email Not Sending
- Verify `RESEND_API_KEY` is correct
- Check domain is verified in Resend
- Update `from` address in `lib/email.ts`

### Prisma Issues
- Run `npx prisma generate` after schema changes
- Clear `.next` folder and restart dev server

## Future Enhancements

- [ ] Job source integrations (Indeed, LinkedIn APIs)
- [ ] Advanced search with Elasticsearch
- [ ] User dashboard for managing preferences
- [ ] Job application tracking
- [ ] Company profiles
- [ ] Saved jobs feature
- [ ] SMS notifications
- [ ] Multi-language support

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and TypeScript
