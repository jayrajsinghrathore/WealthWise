
// app/api/push-schema/route.ts

import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma'; // adjust path if needed

export async function GET() {
  try {
    // Just checking DB connection
    await prisma.$executeRawUnsafe('SELECT 1');
    return NextResponse.json({ message: 'Database connected successfully' });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ message: 'Failed to connect to database' }, { status: 500 });
  }
}

