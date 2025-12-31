```javascript
import Link from "next/link";
import { ArrowRight, Zap, Shield, Heart } from "lucide-react";
import { Button } from '@/components/ui/Button';
import { Penguin } from "@/components/ui/Penguin";
import { Navbar } from '@/components/Navbar';

export default function Home() {
    return (
        <div className="min-h-screen bg-brand-black text-brand-white selection:bg-brand-marigold selection:text-brand-black">
            {/* Navbar */}
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
                    <div className="mb-8 hover:scale-110 transition duration-500 cursor-pointer">
                        <Penguin size={180} mood="waving" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-brand-black">
                        Supercharge your <br />
                        <span className="bg-gradient-to-r from-brand-marigold via-orange-500 to-red-500 bg-clip-text text-transparent">
                            Streaming Career 🇮🇳
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        The friendly way to accept UPI payments. <br />
                        <b>Zero fees</b>. Instant settlement. Made for India's creators.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/signup" className="px-8 py-4 bg-brand-black text-white rounded-full text-lg font-bold hover:scale-105 transition flex items-center gap-2 shadow-xl shadow-gray-300">
                            Start Collecting Tips <ArrowRight size={20} />
                        </Link>
                        <Link href="/demo-user" className="px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-full text-lg font-medium hover:bg-gray-50 transition flex items-center gap-2">
                            View Demo Page
                        </Link>
                    </div>
                </section>

                {/* Features */}
                <section className="py-20 px-6 bg-white border-y relative overflow-hidden">
                    <div className="absolute top-10 left-10 opacity-10 rotate-12">
                        <Penguin size={100} mood="working" />
                    </div>
                    <div className="absolute bottom-10 right-10 opacity-10 -rotate-12">
                        <Penguin size={100} mood="chilling" />
                    </div>

                    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
                        <div className="p-8 bg-brand-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-brand-ocean">
                                <Zap size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-brand-black">Instant UPI Payments</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Fans can pay using GPay, PhonePe, Paytm or any UPI app. Money slides directly into your bank account.
                            </p>
                        </div>
                        <div className="p-8 bg-brand-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                                <Shield size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-brand-black">Secure & Verified</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Powered by Razorpay's trusted gateway. We keep the bad fish away so you can focus on creating.
                            </p>
                        </div>
                        <div className="p-8 bg-brand-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-brand-marigold">
                                <Heart size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-brand-black">Creator Friendly</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Customizable pages that match your vibe. Detailed analytics to track every rupee of support.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-12 text-center text-gray-500 border-t bg-brand-white">
                <div className="flex justify-center mb-4 opacity-50">
                    <Penguin size={40} mood="sleeping" />
                </div>
                <p className="font-medium">&copy; {new Date().getFullYear()} PenguinPay.</p>
                <p className="text-sm mt-2">Built with ❤️ in India.</p>
            </footer>
        </div>
    );
}
