import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // 1. Verify User Exists
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Return success to prevent email enumeration
            return NextResponse.json({ success: true });
        }

        // 2. Generate Token
        // In a real production app, store this in a 'PasswordResetToken' table with expiry.
        // For this demo, we will just simulate the link creation.
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

        // 3. Send Email (Simulation / Logic)
        console.log("=========================================");
        console.log(" PASSWORD RESET REQUEST ");
        console.log("=========================================");
        console.log(`Email: ${email}`);
        console.log(`Reset Token: ${resetToken}`);
        console.log(`Reset Link: ${resetLink}`);
        console.log("=========================================");

        // Note: To make this actually send emails, configure SMTP vars:
        // SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: '"VOLLIFX Security" <noreply@vollitrading.com>',
                to: email,
                subject: "Reset Your Password",
                html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
