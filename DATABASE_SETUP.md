# Database Setup Guide - Neon PostgreSQL

This guide will help you set up a PostgreSQL database using Neon for your Ahid waitlist.

## Why Neon?

- ✅ **Free tier available** (3 GB storage, unlimited compute hours)
- ✅ **Serverless** - Works perfectly with Vercel
- ✅ **Fast** - Low latency globally
- ✅ **No sleep** - Always ready unlike Heroku free tier
- ✅ **Auto-scaling** - Scales with your traffic

## Step 1: Create a Neon Account

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub or email (free account)
3. You'll be taken to the dashboard

## Step 2: Create a Database

1. Click **"Create a project"**
2. Choose a project name: `ahid-waitlist`
3. Select a region closest to your users
4. Click **"Create project"**

## Step 3: Get Your Connection String

1. After project creation, you'll see the **Connection Details**
2. Copy the **Connection string** (it looks like):
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. Keep this safe - you'll need it next!

## Step 4: Initialize the Database

1. In the Neon dashboard, click **"SQL Editor"**
2. Paste the contents of `scripts/init-db.sql`:
   ```sql
   CREATE TABLE IF NOT EXISTS waitlist (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) NOT NULL,
     brand_name VARCHAR(255),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     CONSTRAINT unique_email_brand UNIQUE (email, brand_name)
   );

   CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
   CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
   ```
3. Click **"Run"** to execute the SQL

## Step 5: Configure Environment Variables

1. Open `.env.local` in your project
2. Replace the `DATABASE_URL` with your connection string:
   ```env
   DATABASE_URL=postgresql://your-actual-connection-string-here
   ```

## Step 6: Test Your Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000`
3. Submit the waitlist form
4. Check the Neon dashboard → **Tables** → `waitlist` to see your entry!

## Deployment (Vercel)

When deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - `DATABASE_URL` = Your Neon connection string
   - `RESEND_API_KEY` = Your Resend API key
   - `FROM_EMAIL` = Your verified email

## Viewing Waitlist Data

### Option 1: Neon SQL Editor
1. Go to Neon dashboard
2. Click **"SQL Editor"**
3. Run: `SELECT * FROM waitlist ORDER BY created_at DESC;`

### Option 2: Admin API Endpoint

The app includes a protected admin endpoint at `/api/admin/waitlist`.

**Setup:**
1. Generate a secure API key:
   ```bash
   openssl rand -hex 32
   ```
2. Add to `.env.local`:
   ```env
   ADMIN_API_KEY=your_generated_secure_key_here
   ```

**Usage:**
```bash
# Get all waitlist entries with statistics
curl http://localhost:3000/api/admin/waitlist \
  -H "Authorization: Bearer your_generated_secure_key_here"
```

**Response:**
```json
{
  "stats": {
    "total_signups": 42,
    "unique_emails": 40,
    "with_brand_name": 15,
    "without_brand_name": 27
  },
  "entries": [
    {
      "id": 1,
      "email": "user@example.com",
      "brand_name": "Brand Name",
      "created_at": "2026-04-02T10:30:00.000Z",
      "signup_date": "2026-04-02"
    }
  ],
  "count": 42
}
```

⚠️ **Security**: Never commit your `ADMIN_API_KEY` to version control!

## Database Schema

```
waitlist
├── id (SERIAL) - Auto-incrementing primary key
├── email (VARCHAR) - User's email address
├── brand_name (VARCHAR) - Optional brand name
├── created_at (TIMESTAMP) - When they signed up
└── UNIQUE(email, brand_name) - Prevents duplicates
```

## Troubleshooting

### Connection Error
- Check your `DATABASE_URL` is correct
- Ensure SSL is enabled (`?sslmode=require`)
- Verify your IP isn't blocked (Neon allows all by default)

### Table Doesn't Exist
- Run the `init-db.sql` script in Neon SQL Editor
- Verify the table was created in **Tables** view

### Duplicate Entry Error
- This is expected! The app prevents duplicate signups
- Check existing entries with: `SELECT * FROM waitlist WHERE email = 'user@example.com'`

## Neon Free Tier Limits

- **3 GB** storage
- **Unlimited** compute hours (branching)
- **100 million** rows inspected/month
- **100 GB** data transfer/month

Perfect for a waitlist! You'll likely need thousands of signups before hitting limits.

## Next Steps

1. ✅ Database set up
2. ✅ Email configured
3. 🚀 Deploy to Vercel
4. 📊 Monitor signups in Neon dashboard
5. 📧 Check email deliveries in Resend dashboard

## Resources

- [Neon Documentation](https://neon.tech/docs)
- [Neon + Vercel Guide](https://neon.tech/docs/guides/vercel)
- [SQL Editor Tutorial](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor)
