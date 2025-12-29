"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { useState } from "react"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const faqs = [
    {
        question: "What is VOLLIFX?",
        answer: "VOLLIFX is a premium Forex trading platform designed to bridge the gap between institutional-grade trading and individual investors. We offer advanced managed trading pools, real-time analytics, and a secure environment for your capital."
    },
    {
        question: "How do I start trading?",
        answer: "Getting started is simple. Register for an account, complete your profile, and deposit funds into your Main Wallet. From there, you can allocate capital to our Active Trading Pool (Pool A) to start earning based on our expert trading performance."
    },
    {
        question: "What is the minimum deposit and withdrawal?",
        answer: "We strive to make trading accessible. The minimum deposit is $50. The minimum withdrawal amount is also $50 to ensure efficient processing."
    },
    {
        question: "How does the 'Active Trading Pool' work?",
        answer: "When you transfer funds to the Trading Pool, your capital is aggregated with other investors and managed by our professional trading team. Profits (or losses) are calculated daily and distributed proportionally to your allocated equity."
    },
    {
        question: "Is my personal information secure?",
        answer: "Absolutely. We employ state-of-the-art encryption standards (AES-256) and strict data privacy protocols. Your personal and financial data is never shared with third parties without your explicit consent."
    },
    {
        question: "Can I withdraw my funds at any time?",
        answer: "Yes, you have full control over your Main Wallet funds and Profit Wallet. Funds allocated to the active trading pool may have a short lock-up period during active trading sessions, but can generally be withdrawn within 24 hours."
    },
    {
        question: "What fees do you charge?",
        answer: "VOLLIFX operates on a performance-based model. We charge a small performance fee only on the profits we generate for you. There are no hidden monthly maintenance fees."
    },
]

export default function FAQPage() {
    return (
        <div className="flex flex-col min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center p-2 bg-emerald-500/10 rounded-full mb-4">
                            <HelpCircle className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-6">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Everything you need to know about VOLLIFX, our trading pools, and how to manage your investments.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} faq={faq} />
                        ))}
                    </div>

                    <div className="mt-16 text-center bg-gray-900/50 border border-gray-800 rounded-2xl p-8 sm:p-12">
                        <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
                        <p className="text-gray-400 mb-8">
                            Can't find the answer you're looking for? Our support team is here to help.
                        </p>
                        <a
                            href="mailto:support@vollifx.com"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-emerald-400 hover:bg-emerald-500 transition-all duration-200 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

function FAQItem({ faq }: { faq: { question: string, answer: string } }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border border-gray-800 rounded-lg bg-gray-900/30 overflow-hidden transition-all duration-200 hover:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
            >
                <span className="text-lg font-medium text-gray-200">{faq.question}</span>
                <span className={`ml-6 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-gray-800/50 pt-4">
                            {faq.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
