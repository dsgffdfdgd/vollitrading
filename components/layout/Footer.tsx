import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-background border-t border-white/5 py-12">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <Link href="/" className="flex items-center">
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                                VOLLI<span className="text-primary">FX</span>
                            </span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm text-gray-500 dark:text-gray-400">
                            Professional capital allocation and trading performance management.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link href="/legal" className="hover:underline">Documentation</Link>
                                </li>
                                <li>
                                    <Link href="/legal" className="hover:underline">Trading Rules</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link href="/legal" className="hover:underline">Privacy Policy</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="/legal" className="hover:underline">Terms &amp; Conditions</Link>
                                </li>
                                <li>
                                    <Link href="/legal" className="hover:underline">Risk Disclosure</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                        © 2025 <Link href="/" className="hover:underline">VOLLIFX™</Link>. All Rights Reserved.
                    </span>
                    <div className="flex mt-4 sm:justify-center sm:mt-0 text-xs text-muted-foreground gap-4">
                        <p>Trading involves substantial risk and is not suitable for every investor.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
