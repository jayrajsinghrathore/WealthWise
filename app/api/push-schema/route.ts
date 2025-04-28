
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const { stdout } = await execAsync('pnpm prisma db push');
    console.log('Database connected:', stdout);
    return NextResponse.json({ message: 'Database connected successfully' });
  } catch (error) {
    console.error('Error pushing database:', error);
    return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
  }
}


