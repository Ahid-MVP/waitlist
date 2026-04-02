import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
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

    // Path to the waitlist JSON file
    const filePath = path.join(process.cwd(), 'waitlist.json');

    // Read existing data or create new array
    let waitlistData = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      waitlistData = JSON.parse(fileContent);
    }

    // Create new entry
    const newEntry = {
      email,
      brandName: brandName || null,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
    };

    const existingEntry = waitlistData.find((entry:any) => {
        return entry.email === email && entry.brandName === brandName;
    });

    if(existingEntry) {
        return NextResponse.json(
            { message: 'You have already signed up for the waitlist with this email and brand name' },
            {status: 200}
        );
    }

    // Add new entry to the array
    waitlistData.push(newEntry);

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(waitlistData, null, 2));

    // Send welcome email
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
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
      { success: true, message: 'Successfully added to waitlist' },
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
