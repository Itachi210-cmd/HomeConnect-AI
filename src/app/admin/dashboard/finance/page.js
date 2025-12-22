"use client";
import { useState, useEffect } from 'react';
import FadeIn from '@/components/FadeIn';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import { CreditCard, CheckCircle, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function FinancialManagement() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFinance = async () => {
            try {
                const res = await fetch('/api/admin/finance');
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch finance:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFinance();
    }, []);

    if (loading) return <Loading />;
    if (!data) return <div className="p-8 text-center">Failed to load financial data.</div>;

    const formatPrice = (amt) => {
        if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(1)}Cr`;
        if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)}L`;
        return `₹${amt.toLocaleString()}`;
    };

    return (
        <div className="space-y-8">
            <FadeIn>
                <div>
                    <h1 className="text-3xl font-bold">Financial Management</h1>
                    <p className="text-muted-foreground">Manage subscriptions, commissions, and revenue reports.</p>
                </div>
            </FadeIn>

            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FadeIn delay={0.1}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
                                <h3 className="text-3xl font-bold mt-1 text-gray-900">{formatPrice(data.stats.totalRevenue)}</h3>
                            </div>
                            <div className="p-2 bg-green-100 rounded-lg text-green-600"><DollarSign size={24} /></div>
                        </div>
                        <div className="text-sm text-green-600 flex items-center gap-1 font-medium">
                            <ArrowUpRight size={16} /> +{data.stats.growth}% this month
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.2}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Subscription Income</p>
                                <h3 className="text-3xl font-bold mt-1 text-gray-900">{formatPrice(data.stats.subscriptionRevenue)}</h3>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><CreditCard size={24} /></div>
                        </div>
                        <div className="text-sm text-green-600 flex items-center gap-1 font-medium">
                            <ArrowUpRight size={16} /> Stable
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.3}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Commission Revenue</p>
                                <h3 className="text-3xl font-bold mt-1 text-gray-900">{formatPrice(data.stats.commissionRevenue)}</h3>
                            </div>
                            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><DollarSign size={24} /></div>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1 font-medium">
                            From property sales
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* Transaction History */}
            <FadeIn delay={0.4}>
                <div className="card bg-white border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-bold">Recent Transactions</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="p-4 font-semibold text-sm text-muted-foreground">User</th>
                                    <th className="p-4 font-semibold text-sm text-muted-foreground">Type</th>
                                    <th className="p-4 font-semibold text-sm text-muted-foreground">Amount</th>
                                    <th className="p-4 font-semibold text-sm text-muted-foreground">Date</th>
                                    <th className="p-4 font-semibold text-sm text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.transactions.length > 0 ? (
                                    data.transactions.map((tx) => (
                                        <tr key={tx.id} className="border-t border-border hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium text-gray-900">{tx.user}</div>
                                                <div className="text-xs text-muted-foreground">{tx.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.type === 'SUBSCRIPTION' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="p-4 font-bold text-gray-900">{formatPrice(tx.amount)}</td>
                                            <td className="p-4 text-sm text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                    <CheckCircle size={14} /> {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-muted-foreground">No transactions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </FadeIn>

            {/* Subscription Plans */}
            <FadeIn delay={0.5}>
                <h2 className="text-xl font-bold mb-4">Subscription Plans Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Basic Plan */}
                    <div className="bg-white border border-border rounded-xl p-6 shadow-sm flex flex-col hover:border-primary transition-colors cursor-pointer group">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary">Basic</h3>
                            <div className="flex items-baseline mt-2">
                                <span className="text-3xl font-bold">₹0</span>
                                <span className="text-gray-500 ml-1">/month</span>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-6 flex-1">
                            <li className="flex items-center text-sm text-gray-600"><CheckCircle size={16} className="text-green-500 mr-2" /> 5 Listings</li>
                            <li className="flex items-center text-sm text-gray-600"><CheckCircle size={16} className="text-green-500 mr-2" /> Basic Analytics</li>
                            <li className="flex items-center text-sm text-gray-600"><CheckCircle size={16} className="text-green-500 mr-2" /> Email Support</li>
                        </ul>
                        <Button variant="outline" fullWidth>Edit Plan</Button>
                    </div>

                    {/* Standard Plan */}
                    <div className="bg-white border-2 border-primary rounded-xl p-6 shadow-md flex flex-col relative">
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Standard</h3>
                            <div className="flex items-baseline mt-2">
                                <span className="text-3xl font-bold">₹2,999</span>
                                <span className="text-gray-500 ml-1">/month</span>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-6 flex-1">
                            <li className="flex items-center text-sm text-gray-600"><CheckCircle size={16} className="text-green-500 mr-2" /> 50 Listings</li>
                            <li className="flex items-center text-sm text-gray-600"><CheckCircle size={16} className="text-green-500 mr-2" /> Advanced Specs</li>
                            <li className="flex items-center text-sm text-gray-600"><CheckCircle size={16} className="text-green-500 mr-2" /> Priority Support</li>
                            <li className="flex items-center text-sm text-gray-600"><CheckCircle size={16} className="text-green-500 mr-2" /> "Verified" Badge</li>
                        </ul>
                        <Button fullWidth>Edit Plan</Button>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-white border border-border rounded-xl p-6 shadow-sm flex flex-col hover:border-primary transition-colors cursor-pointer group">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary">Premium</h3>
                            <div className="flex items-baseline mt-2">
                                <span className="text-3xl font-bold">₹9,999</span>
                                <span className="text-gray-500 ml-1">/month</span>
                            </div>
                        </div>
                        <ul className="space-y-3 mb-6 flex-1">
                            <li className="flex items-center text-sm text-gray-600"><CheckCircle size={16} className="text-green-500 mr-2" /> Unlimited Listings</li>
                            <li className="flex items-center text-sm text-gray-600"><CheckCircle size={16} className="text-green-500 mr-2" /> AI Insights</li>
                            <li className="flex items-center text-sm text-gray-600"><CheckCircle size={16} className="text-green-500 mr-2" /> Dedicated Manager</li>
                            <li className="flex items-center text-sm text-gray-600"><CheckCircle size={16} className="text-green-500 mr-2" /> Featured Spot</li>
                        </ul>
                        <Button variant="outline" fullWidth>Edit Plan</Button>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
