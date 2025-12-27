"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function LegalPage() {
    return (
        <div className="bg-background min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        Legal & Compliance
                    </h1>

                    <Card className="p-6 bg-secondary/10 border-white/10 backdrop-blur-sm">
                        <Tabs defaultValue="documentation" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 bg-black/20">
                                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                                <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
                                <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
                                <TabsTrigger value="risk">Risk Disclosure</TabsTrigger>
                            </TabsList>

                            <div className="prose prose-invert max-w-none text-gray-300">
                                <TabsContent value="documentation" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                                    <div>
                                        <h2 className="text-2xl font-bold text-emerald-400 mb-4">1. Documentation</h2>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">1.1 Overview</h3>
                                        <p>VOLLIFX is a proprietary trading and analytics brand focused on disciplined risk management, structured trading methodologies, and transparent operational standards. This documentation outlines how VOLLIFX operates, the tools provided, and the expectations placed on traders and users.</p>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">1.2 Services Offered</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Proprietary trading programs</li>
                                            <li>Trading education and market analysis</li>
                                            <li>Risk-managed trading models</li>
                                            <li>Performance analytics and reporting</li>
                                            <li>Trading journals and execution frameworks</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">1.3 Supported Markets</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Forex (major, minor, and selected exotic pairs)</li>
                                            <li>Commodities (e.g., XAUUSD, USOIL)</li>
                                            <li>Indices (where applicable)</li>
                                            <li>Cryptocurrencies (limited and subject to risk controls)</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">1.4 Trading Platforms & Tools</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>MetaTrader 5 (MT5)</li>
                                            <li>Custom indicators and expert advisors (EAs)</li>
                                            <li>Charting and alert systems</li>
                                            <li>Performance dashboards</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">1.5 Account Structure</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Demo accounts for evaluation and testing</li>
                                            <li>Funded or simulated proprietary accounts</li>
                                            <li>Tiered account sizes subject to performance and compliance</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">1.6 Support & Communication</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Official communication channels only</li>
                                            <li>Scheduled performance reviews</li>
                                            <li>Educational updates and system notices</li>
                                        </ul>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-white/10">
                                        <h2 className="text-2xl font-bold text-emerald-400 mb-4">2. Trading Rules</h2>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">2.1 General Trading Conduct</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Traders must operate with discipline, integrity, and professionalism.</li>
                                            <li>Any attempt to manipulate systems, exploit pricing errors, or bypass controls is strictly prohibited.</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">2.2 Risk Management Rules</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Maximum risk per trade: predefined percentage of account equity (e.g., 0.5%–2%).</li>
                                            <li>Daily maximum drawdown: strictly enforced.</li>
                                            <li>Overall account drawdown limits apply at all times.</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">2.3 Position Management</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Stop-loss orders are mandatory on all trades.</li>
                                            <li>Partial closes and trailing stops must follow approved strategies.</li>
                                            <li>Overleveraging is prohibited.</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">2.4 Trading Strategies</h3>
                                        <p className="mb-2"><strong>Permitted strategies may include:</strong></p>
                                        <ul className="list-disc pl-6 space-y-1 mb-4">
                                            <li>Price action and market structure trading</li>
                                            <li>Order block and liquidity-based setups</li>
                                            <li>Trend-following with confirmation filters</li>
                                        </ul>
                                        <p className="mb-2"><strong>Prohibited strategies include:</strong></p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Grid trading without stops</li>
                                            <li>Martingale or reverse martingale systems</li>
                                            <li>Latency arbitrage or tick exploitation</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">2.5 News & Volatility Trading</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Trading during high-impact news events may be restricted.</li>
                                            <li>Holding trades over major announcements is at the trader’s own risk and may be limited.</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">2.6 Monitoring & Compliance</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>All trading activity is monitored.</li>
                                            <li>Rule violations may result in warnings, account suspension, or termination.</li>
                                        </ul>
                                    </div>
                                    <div className="mt-12 pt-8 border-t border-white/10">
                                        <h2 className="text-2xl font-bold text-emerald-400 mb-4">3. Legal</h2>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">3.1 Legal Status</h3>
                                        <p>VOLLIFX operates as a trading brand providing educational content, proprietary trading simulations, and performance-based trading opportunities. VOLLIFX does not act as a broker and does not accept public deposits.</p>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">3.2 No Investment Advisory</h3>
                                        <p>VOLLIFX does not provide personalized investment advice. All information provided is for educational and informational purposes only.</p>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">3.3 Jurisdiction</h3>
                                        <p>Users are responsible for ensuring that participation in VOLLIFX services complies with local laws and regulations in their country of residence.</p>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">3.4 Limitation of Liability</h3>
                                        <p>VOLLIFX shall not be held liable for:</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Trading losses</li>
                                            <li>Technical failures beyond reasonable control</li>
                                            <li>Third-party platform outages</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">3.5 Intellectual Property</h3>
                                        <p>All content, systems, logos, and materials are the intellectual property of VOLLIFX and may not be copied, redistributed, or resold without written consent.</p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="privacy" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                                    <div>
                                        <h2 className="text-2xl font-bold text-blue-400 mb-4">4. Privacy Policy</h2>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">4.1 Information Collected</h3>
                                        <p>VOLLIFX may collect:</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Personal identification information (name, email, contact details)</li>
                                            <li>Trading performance data</li>
                                            <li>Platform usage data</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">4.2 Use of Information</h3>
                                        <p>Collected data is used to:</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Provide and improve services</li>
                                            <li>Monitor compliance with trading rules</li>
                                            <li>Communicate updates and support</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">4.3 Data Protection</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>User data is stored securely.</li>
                                            <li>Reasonable measures are taken to prevent unauthorized access.</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">4.4 Data Sharing</h3>
                                        <p>VOLLIFX does not sell or rent personal data. Information may be shared only:</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>When legally required</li>
                                            <li>With trusted service providers for operational purposes</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">4.5 User Rights</h3>
                                        <p>Users may request:</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Access to their personal data</li>
                                            <li>Correction of inaccurate information</li>
                                            <li>Deletion of data subject to legal and operational requirements</li>
                                        </ul>
                                    </div>
                                </TabsContent>

                                <TabsContent value="terms" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                                    <div>
                                        <h2 className="text-2xl font-bold text-indigo-400 mb-4">5. Terms & Conditions</h2>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">5.1 Acceptance of Terms</h3>
                                        <p>By accessing or using VOLLIFX services, users agree to be bound by these Terms & Conditions.</p>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">5.2 Eligibility</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Users must be of legal age in their jurisdiction.</li>
                                            <li>Users must provide accurate and truthful information.</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">5.3 Account Usage</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Accounts are non-transferable.</li>
                                            <li>One account per individual unless otherwise approved.</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">5.4 Fees & Payments</h3>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Evaluation or service fees, where applicable, are non-refundable unless stated otherwise.</li>
                                            <li>Payouts are subject to compliance with all trading rules.</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">5.5 Termination</h3>
                                        <p>VOLLIFX reserves the right to suspend or terminate access for:</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Rule violations</li>
                                            <li>Misrepresentation</li>
                                            <li>Abuse of services</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">5.6 Amendments</h3>
                                        <p>VOLLIFX may update these terms at any time. Continued use constitutes acceptance of updated terms.</p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="risk" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                                    <div>
                                        <h2 className="text-2xl font-bold text-red-400 mb-4">6. Risk Disclosure</h2>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">6.1 Trading Risk Warning</h3>
                                        <p className="border-l-4 border-red-500 pl-4 py-2 bg-red-500/10">Trading leveraged financial instruments involves substantial risk and may result in the loss of all capital.</p>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">6.2 No Guaranteed Profits</h3>
                                        <p>Past performance does not guarantee future results. No strategy or system ensures consistent profitability.</p>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">6.3 Market Volatility</h3>
                                        <p>Prices can move rapidly due to:</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>Economic news</li>
                                            <li>Political events</li>
                                            <li>Market sentiment</li>
                                        </ul>
                                        <p className="mt-2 text-sm text-gray-400">Such movements may lead to slippage or losses exceeding expectations.</p>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">6.4 Trader Responsibility</h3>
                                        <p>Traders acknowledge that:</p>
                                        <ul className="list-disc pl-6 space-y-1">
                                            <li>They understand the risks involved</li>
                                            <li>They trade at their own discretion</li>
                                            <li>They are financially capable of bearing potential losses</li>
                                        </ul>

                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">6.5 Final Acknowledgment</h3>
                                        <p>By engaging with VOLLIFX, users confirm that they have read, understood, and accepted this Risk Disclosure.</p>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    )
}
