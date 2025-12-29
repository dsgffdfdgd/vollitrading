import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify token
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // Fetch fresh data
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                wallet: {
                    include: {
                        transactions: {
                            take: 5,
                            orderBy: { createdAt: 'desc' },
                        }
                    }
                }
            }
        });

        // Fetch platform stats via raw query to avoid stale client issues
        const statsRaw: any[] = await prisma.$queryRaw`SELECT "activeTradingDisplay", "sentimentData" FROM "PlatformStat" ORDER BY "updatedAt" DESC LIMIT 1`;
        const stats = statsRaw[0];

        if (!user || !user.wallet) {
            return NextResponse.json({ error: "User or Wallet not found" }, { status: 404 });
        }

        // Fetch extra wallet data via raw query (chartData)
        const walletRaw: any[] = await prisma.$queryRaw`SELECT "chartData" FROM "Wallet" WHERE id = ${user.wallet.id}`;
        const chartData = walletRaw[0]?.chartData || null;

        // Format for dashboard
        const dashboardData = {
            walletId: user.wallet.id,
            equity: (user.wallet.mainBalance + user.wallet.tradingBalance + user.wallet.profitBalance) || 0,

            // Use Global Active Trading Config if available, else fallback to user's allocated
            activeTrading: (stats?.activeTradingDisplay && stats.activeTradingDisplay > 0)
                ? stats.activeTradingDisplay
                : (user.wallet.tradingBalance || 0),

            profit: user.wallet.profitBalance || 0,
            mainBalance: user.wallet.mainBalance || 0,
            chartData: chartData,
            sentimentData: stats?.sentimentData || null,
            wallet: { // Nested object for WalletPage compatibility
                id: user.wallet.id,
                mainBalance: user.wallet.mainBalance || 0,
                tradingBalance: user.wallet.tradingBalance || 0,
                profitBalance: user.wallet.profitBalance || 0,
            },
            user: {
                name: user.name,
                email: user.email
            },
            recentActivity: user.wallet.transactions.map((t: any) => ({
                id: t.id,
                name: t.type === 'DEPOSIT' ? `Deposit (${t.status})` : t.type,
                amount: `$${t.amount.toFixed(2)}`,
                date: new Date(t.createdAt).toLocaleDateString(),
                type: t.type.toLowerCase(),
                status: t.status
            }))
        };

        return NextResponse.json(dashboardData);

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
