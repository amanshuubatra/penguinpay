"use client";
import Link from "next/link";
import { Penguin } from "./ui/Penguin";
import { Button } from "./ui/Button";

export function Navbar() {
    return (
        <nav className="border-b border-gray-800 bg-brand-black/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <Penguin mood="happy" className="h-8 w-8 text-brand-marigold group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xl text-brand-white">
                        Penguin<span className="text-brand-ocean">Pay</span>
                    </span>
                </Link>
                <div className="flex gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-brand-white hover:text-brand-ocean">Login</Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="bg-brand-marigold hover:bg-amber-600 text-brand-black font-bold">
                            Start Creating
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
