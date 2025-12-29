import { ShieldCheck, Globe, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Regulations() {
    const regulators = [
        {
            name: "CySEC",
            fullName: "Cyprus Securities and Exchange Commission",
            icon: <Globe className="h-10 w-10 text-blue-500" />,
            description: "Regulated by the Cyprus Securities and Exchange Commission under license number 123/45. Ensuring adherence to European financial standards.",
            color: "bg-blue-500/10 border-blue-500/20"
        },
        {
            name: "FCA",
            fullName: "Financial Conduct Authority",
            icon: <ShieldCheck className="h-10 w-10 text-rose-500" />,
            description: "Authorized and regulated by the Financial Conduct Authority in the UK. Setting the benchmark for conduct and consumer protection.",
            color: "bg-rose-500/10 border-rose-500/20"
        },
        {
            name: "ASIC",
            fullName: "Australian Securities and Investments Commission",
            icon: <Scale className="h-10 w-10 text-emerald-500" />,
            description: "Regulated by ASIC in Australia, ensuring fair, transparent, and efficient financial markets for all investors.",
            color: "bg-emerald-500/10 border-emerald-500/20"
        }
    ];

    return (
        <section className="py-20 bg-background/50 border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                        Global Regulatory Compliance
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        We operate under strict regulatory frameworks to ensure the safety of your funds and the integrity of our trading environment.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {regulators.map((reg, index) => (
                        <Card key={index} className={`relative overflow-hidden border-2 ${reg.color} bg-transparent transition-all hover:scale-105 duration-300`}>
                            <CardContent className="pt-8 text-center space-y-4">
                                <div className="mx-auto w-20 h-20 rounded-full bg-background flex items-center justify-center border border-white/10 shadow-lg">
                                    {reg.icon}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{reg.name}</h3>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">
                                        {reg.fullName}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {reg.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
