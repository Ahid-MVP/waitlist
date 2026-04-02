import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';
import { generateWelcomeEmailHTML } from '@/lib/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, brandName } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Connect to Neon database
    const sql = neon(process.env.DATABASE_URL!);

    // Check if user already exists with same email and brand
    const existingEntry = await sql`
      SELECT * FROM waitlist 
      WHERE email = ${email} 
      AND brand_name IS NOT DISTINCT FROM ${brandName || null}
      LIMIT 1
    `;

    if (existingEntry.length > 0) {
      return NextResponse.json(
        { message: 'You have already signed up for the waitlist with this email and brand name' },
        { status: 200 }
      );
    }

    // Insert new entry
    const result = await sql`
      INSERT INTO waitlist (email, brand_name, created_at)
      VALUES (${email}, ${brandName || null}, NOW())
      RETURNING id, email, brand_name, created_at
    `;

    console.log('Successfully added to waitlist:', result[0]);

    // Send welcome email
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'Ahid <onboarding@resend.dev>',
        to: email,
        subject: "Welcome to Ahid! You're on the waitlist 🎉",
        html: generateWelcomeEmailHTML(email, brandName),
      });
      console.log(`Welcome email sent to ${email}`);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      { success: true, message: 'Successfully added to waitlist', data: result[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving to waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to save to waitlist' },
      { status: 500 }
    );
  }
}
