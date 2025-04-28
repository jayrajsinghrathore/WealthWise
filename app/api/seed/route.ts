// app/api/seed/route.ts

import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma'; // adjust if your path differs

export async function GET() {
  try {
    // Example seeding: Add a dummy user
    await prisma.user.create({
      data: {
        name: 'Demo User',
        email: 'demo@example.com',
      },
    });

    return NextResponse.json({ message: 'Seeded successfully' });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ message: 'Failed to seed database' }, { status: 500 });
  }
}
