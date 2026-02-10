import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { email },
      include: { preferences: true }
    });

    if (!subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    // Delete subscriber and all related data (cascades to preferences and notifications)
    await prisma.subscriber.delete({
      where: { id: subscriber.id }
    });

    return NextResponse.redirect(new URL('/?unsubscribed=true', request.url));

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
