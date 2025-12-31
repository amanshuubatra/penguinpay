"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Input } from '@/components/ui/Input';
import { Penguin } from '@/components/ui/Penguin';
import { BadgeCheck, Coffee } from 'lucide-react';
import api from '@/lib/api';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function ProfilePage({ params }: { params: { username: string } }) {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [isLoading, setIsLoading] = useState(false);
    const [recipientId, setRecipientId] = useState<string | null>(null);

    const presetAmounts = [100, 500, 1000];

    useEffect(() => {
        // Load Razorpay SDK
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        // Fetch user ID
        api.get(`/users/${params.username}`)
            .then(res => {
                setCreator(res.data.creator);
                setLoading(false);
            })
            .catch(err => {
                console.error("User not found", err);
                setLoading(false);
            });
    }, [params.username]);

    const handlePayment = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (!executeRecaptcha) {
            alert('Recaptcha not ready');
            return;
        }

        try {
            setIsLoading(true);
            const token = await executeRecaptcha('payment');

            // 1. Create Order
            const { data: order } = await api.post('/payment/create-order', {
                amount: Number(amount),
                creatorId: creator.id,
                message,
                senderName: 'Anonymous',
                recaptchaToken: token
            });

            // Mock Mode Detection
            if (order.id.startsWith('order_mock_')) {
                // Simulate success immediately
                alert('🐧 Demo Mode: Payment Simulated Successfully!');
                const verifyPayload = {
                    razorpay_order_id: order.id,
                    razorpay_payment_id: 'pay_mock_' + Date.now(),
                    razorpay_signature: 'mock_signature'
                };
                await api.post('/payment/verify-payment', verifyPayload);
                setAmount('');
                setMessage('');
                setLoading(false);
                return;
            }

            // 2. Open Razorpay (Real Mode)
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "PenguinPay",
                description: `Tip for ${creator.display_name}`,
                order_id: order.id,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        const verifyPayload = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        };
                        await api.post('/payment/verify-payment', verifyPayload);
                        alert('Payment Successful!');
                        setAmount('');
                        setMessage('');
                    } catch (err) {
                        alert('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: "Supporter",
                    email: "supporter@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#F59E0B"
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
            alert('Payment execution failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
                <Penguin mood="waving" size={120} />
                <p className="animate-pulse text-lg font-medium text-gray-600">Finding creator...</p>
            </div>
        );
    }

    if (!creator) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
                <Penguin mood="confused" size={120} />
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Creator Not Found</h1>
                    <p className="text-gray-600 mb-6">We couldn't find a creator with that username.</p>
                    <Link href="/" className="px-6 py-3 bg-brand-black text-white rounded-full">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            <div className="max-w-2xl mx-auto px-6 -mt-16">
                <div className="bg-white rounded-2xl shadow-xl p-8 border mb-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 shadow-md flex items-center justify-center text-4xl mb-4 overflow-hidden">
                            🐧
                        </div>
                        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
                            {params.username} <BadgeCheck className="text-blue-500 fill-blue-100" />
                        </h1>
                        <p className="text-gray-600 mb-6 max-w-md">
                            Creating awesome content for the internet. Support me to keep the penguins fed! 🐟
                        </p>

                        {/* Payment Card */}
                        <div className="w-full bg-gray-50 rounded-xl p-6 border">
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Coffee className="text-yellow-600" /> Buy me a coffee
                            </h2>

                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {presetAmounts.map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setAmount(amt.toString())}
                                        className={`py - 2 rounded - lg border font - medium transition ${amount === amt.toString()
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white hover:bg-gray-100'
                                            } `}
                                    >
                                        ₹{amt}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                                    <Input
                                        type="number"
                                        placeholder="Enter amount"
                                        className="pl-8"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                                <Input
                                    placeholder="Say something nice... (optional)"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <Button
                                    className="w-full py-6 text-lg"
                                    onClick={handlePayment}
                                    isLoading={isLoading}
                                    disabled={!amount}
                                >
                                    Support {params.username}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center text-sm text-gray-400 pb-8">
                    Powered by 🐧 PenguinPay
                </div>
            </div>
        </div>
    );
}
