"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { LogOut, DollarSign, Users, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { Penguin } from "@/components/ui/Penguin";

export default function DashboardPage() {
    const [stats, setStats] = useState({ earnings: '₹0', supporters: '0' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token === 'mock_jwt_token') {
                    setStats({ earnings: '₹12,500', supporters: '128' });
                    setLoading(false);
                    return;
                }

                const res = await api.get('/auth/me');
                if (res.data.creator) {
                    setStats({
                        earnings: `₹${res.data.creator.total_earnings || 0} `,
                        supporters: '0' // We'd need a separate query count for this, hardcoding for now
                    });
                }
            } catch (err) {
                console.error("Failed to fetch stats", err);
                // Redirect to login if unauthorized?
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Earnings', value: stats.earnings, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Total Supporters', value: stats.supporters, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    ];

    // Mock recent donations for now as we don't have an endpoint for it yet
    const recentDonations = [
        { id: 1, name: 'Anonymous', amount: '₹500', message: 'Keep up the great work!', date: 'Recently' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="font-bold text-xl">🐧 PenguinPay</div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Hello, Creator</span>
                    <Button variant="outline" size="sm" className="gap-2">
                        <LogOut size={16} /> Logout
                    </Button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <Link href="/demo-user" target="_blank">
                        <Button variant="secondary" className="gap-2">
                            View Public Page <ArrowUpRight size={16} />
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {statCards.map((stat) => (
                        <div key={stat.label} className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
                            <div className={`p - 3 rounded - lg ${stat.bg} ${stat.color} `}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h2 className="font-bold">Recent Tips</h2>
                    </div>
                    <div className="p-0">
                        {recentDonations.map((donation) => (
                            <div key={donation.id} className="p-6 border-b last:border-0 hover:bg-gray-50 transition flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                        {donation.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{donation.name}</p>
                                        <p className="text-gray-500 text-sm">{donation.message}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">{donation.amount}</p>
                                    <p className="text-xs text-gray-400">{donation.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
