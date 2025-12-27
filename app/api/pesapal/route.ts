import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const PESAPAL_CONSUMER_KEY = "vLWPDMX8o/0BtGsGdDrKuaC8RbmKIBUl";
const PESAPAL_CONSUMER_SECRET = "sIuyZY/sSQ0p13FpP92Fj3NmepM=";
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-this";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    return NextResponse.json({ status: "PesaPal Service Ready" });
}

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

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, currency, email, firstName, lastName, phoneNumber } = body;

        // 0. Authenticate User
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: { wallet: true }
        });

        if (!user || !user.wallet) {
            return NextResponse.json({ error: "User or Wallet not found" }, { status: 404 });
        }

        // 1. Attempt Production Auth
        let activeUrl = PROD_URL;
        let authResult = await authenticate(PROD_URL, PESAPAL_CONSUMER_KEY.trim(), PESAPAL_CONSUMER_SECRET.trim());

        // 2. Fallback to Sandbox if Prod failed
        if (!authResult.ok || !authResult.data.token) {
            console.warn("Production Auth failed, trying Sandbox...");
            const sandboxResult = await authenticate(SANDBOX_URL, PESAPAL_CONSUMER_KEY.trim(), PESAPAL_CONSUMER_SECRET.trim());

            if (sandboxResult.ok && sandboxResult.data.token) {
                activeUrl = SANDBOX_URL;
                authResult = sandboxResult;
                console.log("Switched to Sandbox Environment (Keys matched Sandbox)");
            } else {
                // Both failed - Return Actual Error
                console.error("PesaPal Auth Failed on both Prod and Sandbox.");
                const msg = authResult.data?.error?.message || "Invalid Consumer Key or Secret for both Live and Sandbox.";
                return NextResponse.json({ error: msg }, { status: 401 });
            }
        }

        const tokenAuth = authResult.data.token;

        // 2. Register IPN (simplified)
        let notification_id = "";
        try {
            const ipnRes = await fetch(`${activeUrl}/api/URLSetup/RegisterIPN`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${tokenAuth}`
                },
                body: JSON.stringify({
                    url: "https://vollitrading.com/api/ipn",
                    ipn_notification_type: "GET"
                })
            });
            const ipnData = await ipnRes.json();
            notification_id = ipnData.ipn_id || "c195d430-67c8-47bc-ad74-3253aa77382f";
        } catch (e) {
            notification_id = "c195d430-67c8-47bc-ad74-3253aa77382f";
        }

        const merchantReference = "VOLLIFX-" + Date.now();

        // 3. Create Pending Transaction in DB
        await prisma.transaction.create({
            data: {
                walletId: user.wallet.id,
                type: "DEPOSIT",
                amount: parseFloat(amount),
                status: "PENDING",
                reference: merchantReference
            }
        });

        const orderPayload = {
            id: merchantReference,
            currency: currency || "USD",
            amount: parseFloat(amount),
            description: "Wallet Deposit",
            callback_url: "https://vollitrading.com/dashboard/wallet",
            notification_id: notification_id,
            billing_address: {
                email_address: email || "user@example.com",
                phone_number: phoneNumber || "",
                country_code: "KE",
                first_name: firstName || "Trader",
                middle_name: "",
                last_name: lastName || "One",
                line_1: "",
                line_2: "",
                city: "",
                state: "",
                postal_code: "",
                zip_code: ""
            }
        };

        const orderRes = await fetch(`${activeUrl}/api/Transactions/SubmitOrderRequest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${tokenAuth}`
            },
            body: JSON.stringify(orderPayload),
        });

        const orderData = await orderRes.json();

        if (orderData.error) {
            console.error("PesaPal Order Failed:", orderData);
            return NextResponse.json({ error: orderData.error.message || "Payment initiation failed" }, { status: 400 });
        }

        return NextResponse.json({
            redirect_url: orderData.redirect_url,
            merchant_reference: merchantReference
        });

    } catch (error) {
        console.error("PesaPal Integration Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
