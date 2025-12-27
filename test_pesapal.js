const https = require('https');

const PESAPAL_CONSUMER_KEY = "vLWPDMX8o/0BtGsGdDrKuaC8RbmKIBUl";
const PESAPAL_CONSUMER_SECRET = "sIuyZY/sSQ0p13FpP92Fj3NmepM=";

const PROD_URL = "https://pay.pesapal.com/v3";
const SANDBOX_URL = "https://cybqa.pesapal.com/pesapalv3";

function authenticate(baseUrl, key, secret) {
    return new Promise((resolve) => {
        const url = new URL(`${baseUrl}/api/Auth/RequestToken`);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, data: json, status: res.statusCode });
                } catch (e) {
                    resolve({ ok: false, data: data, error: e.message, status: res.statusCode });
                }
            });
        });

        req.on('error', (e) => {
            resolve({ ok: false, error: e.message });
        });

        req.write(JSON.stringify({ consumer_key: key, consumer_secret: secret }));
        req.end();
    });
}

async function test() {
    console.log("Testing Prod...");
    const prodRes = await authenticate(PROD_URL, PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET);
    console.log("Prod Result:", JSON.stringify(prodRes, null, 2));

    console.log("\nTesting Sandbox...");
    const sandboxRes = await authenticate(SANDBOX_URL, PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET);
    console.log("Sandbox Result:", JSON.stringify(sandboxRes, null, 2));

    if (!prodRes.ok && !sandboxRes.ok) {
        console.error("\nFAIL: Both environments rejected the keys.");
    } else {
        console.log("\nSUCCESS: At least one environment accepted the keys.");
    }
}

test();
