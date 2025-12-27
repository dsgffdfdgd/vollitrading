import { ArrowRight, Banknote, LineChart, Lock, UserPlus } from "lucide-react"

const steps = [
    {
        name: "Create Account & Deposit",
        description: "Register your secure account and deposit funds (Min $100) via Crypto or Card.",
        icon: UserPlus,
    },
    {
        name: "Allocate Capital",
        description: "Move funds from your Main Wallet to the Trading Wallet to participate in the pool.",
        icon: ArrowRight,
    },
    {
        name: "Performance Trading",
        description: "Our system trades the aggregated pool. Profits (or losses) are applied daily/weekly.",
        icon: LineChart,
    },
    {
        name: "Withdraw or Compound",
        description: "Withdraw your profits anytime to your external wallet or reinvest to grow your capital.",
        icon: Banknote,
    },
]

export function HowItWorks() {
    return (
        <section id="how-it-works" className="relative isolate overflow-hidden bg-secondary/20 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-emerald-400">Workflow</h2>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">How It Works</h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Simple, transparent steps to start your trading journey with VOLLIFX.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-4 lg:gap-x-8">
                        {steps.map((step, index) => (
                            <div key={step.name} className="relative flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white/5 transition-colors">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                    <step.icon className="h-8 w-8 text-emerald-400" />
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-[22%] left-[60%] w-[80%] h-[2px] bg-emerald-500/10" />
                                )}
                                <h3 className="text-lg font-semibold leading-8 text-white">{step.name}</h3>
                                <p className="mt-2 text-base leading-7 text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
