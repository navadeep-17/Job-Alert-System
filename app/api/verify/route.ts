import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/?error=invalid_token', request.url));
  }

  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { verificationToken: token }
    });

    if (!subscriber) {
      return NextResponse.redirect(new URL('/?error=invalid_token', request.url));
    }

    // Mark as verified
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        verified: true,
        verificationToken: null // Clear token after verification
      }
    });

    return NextResponse.redirect(new URL('/?verified=true', request.url));

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(new URL('/?error=server_error', request.url));
  }
}
