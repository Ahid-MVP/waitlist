import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  try {
    // Basic authentication check
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.ADMIN_API_KEY}`;
    
    if (!authHeader || authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);
    
    // Get all waitlist entries
    const results = await sql`
      SELECT 
        id,
        email,
        brand_name,
        created_at,
        created_at::date as signup_date
      FROM waitlist 
      ORDER BY created_at DESC
    `;

    // Get statistics
    const stats = await sql`
      SELECT 
        COUNT(*) as total_signups,
        COUNT(DISTINCT email) as unique_emails,
        COUNT(brand_name) as with_brand_name,
        COUNT(*) - COUNT(brand_name) as without_brand_name
      FROM waitlist
    `;

    return NextResponse.json({
      stats: stats[0],
      entries: results,
      count: results.length
    });
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waitlist' },
      { status: 500 }
    );
  }
}
