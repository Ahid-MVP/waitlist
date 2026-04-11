import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);

    try {
      jwt.verify(token, process.env.ADMIN_API_KEY!);
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const sql = neon(process.env.DATABASE_URL!);

    const [entries, statsRows, daily] = await Promise.all([
      sql`
        SELECT id, email, brand_name, created_at, created_at::date AS signup_date
        FROM waitlist
        ORDER BY created_at DESC
      `,
      sql`
        SELECT
          COUNT(*)                        AS total_signups,
          COUNT(DISTINCT email)           AS unique_emails,
          COUNT(brand_name)               AS with_brand_name,
          COUNT(*) - COUNT(brand_name)    AS without_brand_name
        FROM waitlist
      `,
      sql`
        SELECT created_at::date AS date, COUNT(*) AS count
        FROM waitlist
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY created_at::date
        ORDER BY date ASC
      `,
    ]);

    return NextResponse.json({
      stats: statsRows[0],
      entries,
      count: entries.length,
      daily,
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
