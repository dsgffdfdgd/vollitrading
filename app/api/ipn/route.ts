import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY || "";
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET || "";

const PROD_URL = "https://pay.pesapal.com/v3";
const SANDBOX_URL = "https://cybqa.pesapal.com/pesapalv3";

async function authenticate(baseUrl: string, key: string, secret: string) {
    try {
        const res = await fetch(`${baseUrl}/api/Auth/RequestToken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ consumer_key: key, consumer_secret: secret }),
        });
        const data = await res.json();
        return { ok: res.ok, data };
    } catch (e) {
        return { ok: false, data: { error: { message: "Network Error" } } };
    }
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orderTrackingId = searchParams.get('OrderTrackingId');
    const orderMerchantReference = searchParams.get('OrderMerchantReference');

    // Sometimes Pesapal sends 'OrderNotificationType' as 'IPNCHANGE' or similar

    if (!orderTrackingId || !orderMerchantReference) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        // 1. Authenticate (Try Prod, then Sandbox)
        let activeUrl = PROD_URL;
        let authResult = await authenticate(PROD_URL, PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET);

        if (!authResult.ok) {
            authResult = await authenticate(SANDBOX_URL, PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET);
            activeUrl = SANDBOX_URL;
        }

        if (!authResult.ok || !authResult.data.token) {
            console.error("IPN: Auth Failed");
            return NextResponse.json({ error: "Auth Failed" }, { status: 500 });
        }

        const token = authResult.data.token;

        // 2. Get Transaction Status
        const statusRes = await fetch(`${activeUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const statusData = await statusRes.json();
        // statusData usually contains: { payment_status_description: "Completed", ... }

        const paymentStatus = statusData.payment_status_description; // "Completed", "Failed", "Pending"

        if (!paymentStatus) {
            return NextResponse.json({ status: "Unknown Status Code" });
        }

        console.log(`IPN Update for ${orderMerchantReference}: ${paymentStatus}`);

        // 3. Update Database
        const transaction = await prisma.transaction.findFirst({
            where: { reference: orderMerchantReference },
            include: { wallet: true }
        });

        if (!transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        // Only process if not already completed/failed (idempotency)
        if (transaction.status !== "COMPLETED" && transaction.status !== "FAILED") {
            let newStatus = "PENDING";
            if (paymentStatus === "Completed") newStatus = "COMPLETED";
            else if (paymentStatus === "Failed" || paymentStatus === "Reversed") newStatus = "FAILED";

            if (newStatus === "COMPLETED") {
                // Update Transaction AND Wallet Balance
                await prisma.$transaction([
                    prisma.transaction.update({
                        where: { id: transaction.id },
                        data: { status: "COMPLETED", updatedAt: new Date() }
                    }),
                    prisma.wallet.update({
                        where: { id: transaction.walletId },
                        data: {
                            mainBalance: { increment: transaction.amount }
                        }
                    })
                ]);
            } else if (newStatus === "FAILED") {
                await prisma.transaction.update({
                    where: { id: transaction.id },
                    data: { status: "FAILED", updatedAt: new Date() }
                });
            }
        }

        return NextResponse.json({
            orderNotificationType: "IPNCHANGE",
            orderTrackingId: orderTrackingId,
            orderMerchantReference: orderMerchantReference,
            status: 200
        });

    } catch (error) {
        console.error("IPN Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
