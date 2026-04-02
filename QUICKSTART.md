# Ahid Waitlist - Quick Start Guide 🚀

Your waitlist is now configured to use **Neon PostgreSQL** instead of file storage. This solves the deployment issue and allows your app to work on serverless platforms like Vercel.

## ✅ What Changed

- ❌ **Before**: Saved to `waitlist.json` (doesn't work on Vercel)
- ✅ **Now**: Saves to PostgreSQL database (works everywhere)

## 🎯 Setup Steps

### 1. Create Neon Database (5 minutes)

1. Go to [neon.tech](https://neon.tech) and sign up (free)
2. Create a new project called `ahid-waitlist`
3. Copy your **Connection String**
4. In Neon SQL Editor, run the SQL from `scripts/init-db.sql`

**Full guide:** [DATABASE_SETUP.md](DATABASE_SETUP.md)

### 2. Update Environment Variables

Edit `.env.local` and add your database URL:

```env
DATABASE_URL=postgresql://your-connection-string-here
```

### 3. Test Locally

```bash
npm run dev
```

Go to `http://localhost:3000` and submit the form. Check your Neon dashboard to see the entry!

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Import to Vercel
3. Add environment variables in Vercel settings:
   - `DATABASE_URL` - Your Neon connection string
   - `RESEND_API_KEY` - Your Resend API key  
   - `FROM_EMAIL` - Your verified email
   - `ADMIN_API_KEY` - Generate with `openssl rand -hex 32`

## 📊 View Your Waitlist

### Option 1: Neon Dashboard
- Go to Neon → SQL Editor
- Run: `SELECT * FROM waitlist ORDER BY created_at DESC;`

### Option 2: Admin API
```bash
curl https://your-domain.com/api/admin/waitlist \
  -H "Authorization: Bearer your_admin_api_key"
```

## 📧 Email Features

✅ **Emails are working!** You already have:
- Resend API key configured
- Verified sender: `noreply@ezconadvisory.com`
- Beautiful welcome email template

Every signup automatically receives a welcome email!

## 🗃️ Database Schema

```sql
waitlist
├── id              (SERIAL PRIMARY KEY)
├── email           (VARCHAR 255) NOT NULL
├── brand_name      (VARCHAR 255) NULL
├── created_at      (TIMESTAMP) DEFAULT NOW()
└── UNIQUE(email, brand_name)
```

## 🔧 Key Files

- `app/api/waitlist/route.ts` - Main signup endpoint (updated for PostgreSQL)
- `app/api/admin/waitlist/route.ts` - Admin endpoint to view signups
- `scripts/init-db.sql` - Database initialization script
- `lib/email-template.tsx` - Welcome email template
- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Detailed database setup
- [EMAIL_SETUP.md](EMAIL_SETUP.md) - Email configuration guide

## 🚨 Important Notes

1. **Never commit** `.env.local` - It's already in `.gitignore`
2. **Generate a secure** `ADMIN_API_KEY` for production
3. **Test locally** before deploying
4. **Monitor** Neon dashboard for signups

## ✨ Features

- ✅ PostgreSQL database (serverless-friendly)
- ✅ Duplicate prevention
- ✅ Email notifications with branding
- ✅ Optional brand name field
- ✅ Admin API for viewing signups
- ✅ Mobile-responsive design
- ✅ Success animation & feedback

## 🆘 Troubleshooting

### "Connection refused" error
→ Check your `DATABASE_URL` in `.env.local`

### "Table doesn't exist"
→ Run `scripts/init-db.sql` in Neon SQL Editor

### "Email sending failed"
→ Already configured! Check Resend dashboard for logs

### "Read-only file system"
→ Fixed! You're now using PostgreSQL instead of files

## 📚 Additional Guides

- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Complete database setup
- [EMAIL_SETUP.md](EMAIL_SETUP.md) - Email configuration
- [MIGRATION.md](MIGRATION.md) - Migrate old JSON data (if needed)

## 🎉 You're All Set!

Just add your `DATABASE_URL` to `.env.local` and you're ready to go!

Need help? Check the guides above or refer to:
- [Neon Docs](https://neon.tech/docs)
- [Resend Docs](https://resend.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
