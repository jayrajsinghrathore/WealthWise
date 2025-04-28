import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const { stdout } = await execAsync('pnpm prisma db seed');
    console.log('Database seeded:', stdout);
    return NextResponse.json({ message: 'Seeded successfully' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ message: 'Seeding failed' }, { status: 500 });
  }
}
