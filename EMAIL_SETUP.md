# Email Setup Guide

This waitlist application sends welcome emails to users who sign up. Here's how to set it up:

## 1. Create a Resend Account

1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account
3. Get your API key from the dashboard

## 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Resend API key to `.env.local`:
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   FROM_EMAIL=Ahid <noreply@yourdomain.com>
   ```

## 3. Verify Your Domain (Optional but Recommended)

For production use, you should verify your domain in Resend:
1. Go to Resend Dashboard → Domains
2. Add your domain
3. Add the DNS records provided
4. Update `FROM_EMAIL` in `.env.local` to use your domain

For testing, you can use `onboarding@resend.dev` as the sender.

## 4. Test the Email

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Submit the waitlist form with your email
3. Check your inbox for the welcome email

## Email Features

- ✨ Beautiful HTML email template
- 🎨 Branded with Ahid colors (teal & lime)
- 📧 Personalized with user's email
- 🏷️ Mentions brand name if provided
- 📱 Mobile-responsive design

## Troubleshooting

- **Email not sending**: Check your `RESEND_API_KEY` is correct
- **From address rejected**: Verify your domain in Resend or use `onboarding@resend.dev`
- **Email in spam**: Set up SPF, DKIM records for your domain

## Production Considerations

- Always use a verified domain for FROM_EMAIL
- Monitor your Resend usage/quota
- Consider adding email rate limiting
- Set up monitoring for failed email deliveries
