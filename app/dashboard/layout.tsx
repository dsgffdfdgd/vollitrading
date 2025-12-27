import { Sidebar } from "@/components/dashboard/Sidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex h-full flex-col">
                <Sidebar />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm z-10 md:hidden">
                    <div className="font-bold text-xl">VOLLIFX</div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 border-r-border w-64 bg-card text-foreground">
                            <Sidebar className="w-full border-none" />
                        </SheetContent>
                    </Sheet>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
