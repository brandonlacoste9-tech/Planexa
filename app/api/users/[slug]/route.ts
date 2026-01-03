import { NextRequest, NextResponse } from 'next/server';
import { getUserBySlug } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const user = getUserBySlug(slug);
  
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
  }
  
  return NextResponse.json(user);
}
