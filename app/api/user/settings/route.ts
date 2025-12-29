import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const body = await req.json();
        const { action } = body;

        if (action === "profile") {
            const { firstName, lastName } = body;
            await prisma.user.update({
                where: { id: decoded.userId },
                data: {
                    name: `${firstName} ${lastName}`.trim()
                }
            });
            return NextResponse.json({ success: true, message: "Profile updated" });
        }

        if (action === "security") {
            const { currentPassword, newPassword } = body;

            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
            if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: decoded.userId },
                data: { password: hashedPassword }
            });

            return NextResponse.json({ success: true, message: "Password updated" });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("Settings Update Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
