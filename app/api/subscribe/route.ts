import { sendVerificationEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email(),
  categories: z.array(z.string()).min(1),
  location: z.string().nullable(),
  keywords: z.array(z.string())
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, categories, location, keywords } = subscribeSchema.parse(body);

    // Check if subscriber already exists
    let subscriber = await prisma.subscriber.findUnique({
      where: { email }
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    if (subscriber) {
      // Update existing subscriber
      subscriber = await prisma.subscriber.update({
        where: { email },
        data: {
          verificationToken,
          verified: false, // Reset verification
          preferences: {
            deleteMany: {}, // Remove old preferences
            create: categories.map(category => ({
              category,
              location,
              keywords
            }))
          }
        }
      });
    } else {
      // Create new subscriber
      subscriber = await prisma.subscriber.create({
        data: {
          email,
          verificationToken,
          preferences: {
            create: categories.map(category => ({
              category,
              location,
              keywords
            }))
          }
        }
      });
    }

    // Send verification email
    const verificationUrl = `${process.env.APP_URL}/api/verify?token=${verificationToken}`;
    
    try {
      await sendVerificationEmail(email, verificationUrl);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue even if email fails - subscriber is created
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email sent. Please check your inbox.'
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
