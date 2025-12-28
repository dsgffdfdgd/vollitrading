import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// This would typically involve sending an email via SendGrid, Resend, or AWS SES.
// Since we don't have an email provider set up in this demo environment, 
// we will simulate the "Sending" and logging the reset token for debugging/demo purposes.

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // For security, don't reveal if user exists. 
            // Just pretend to send it.
            return NextResponse.json({ success: true });
        }

        // Generate a reset token (in a real app, you'd save this to the DB with an expiry)
        // For simplicity here, we'll just log it. A real implementation needs a 'ResetToken' model.
        const resetToken = crypto.randomBytes(32).toString("hex");

        // TODO: Save token to database (users table or separate tokens table)
        // await prisma.passwordResetToken.create({ ... })

        console.log(`[DEMO] Password Reset Request for ${email}. Token: ${resetToken}`);
        console.log(`[DEMO] Reset Link: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`);

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
