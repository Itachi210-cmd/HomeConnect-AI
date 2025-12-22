"use client";
import { useState } from 'react';
import FadeIn from '@/components/FadeIn';
import Button from '@/components/Button';
import { ShieldCheck, Eye, Check, X, FileText, AlertCircle } from 'lucide-react';

export default function KYCVerification() {
    const [selectedDoc, setSelectedDoc] = useState(null);

    // Mock Data
    const verificationQueue = [
        { id: 1, user: "Vikram Singh", role: "Agent", docType: "Real Estate License", date: "2 hours ago", status: "Pending", fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
        { id: 2, user: "Anjali Gupta", role: "Seller", docType: "Property Deed", date: "5 hours ago", status: "Pending", fileUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
        { id: 3, user: "Rahul Verma", role: "Agent", docType: "ID Proof", date: "1 day ago", status: "Rejected", fileUrl: null },
    ];

    return (
        <div className="space-y-6">
            <FadeIn>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">KYC Verification</h1>
                        <p className="text-muted-foreground">Verify agent licenses and property documents to ensure trust.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium flex items-center gap-2">
                            <AlertCircle size={16} /> 2 Pending Requests
                        </div>
                    </div>
                </div>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    {verificationQueue.map((item) => (
                        <FadeIn key={item.id} delay={0.1}>
                            <div className="card p-4 bg-white border border-border rounded-xl shadow-sm flex items-center justify-between group hover:border-primary transition-colors cursor-pointer" onClick={() => setSelectedDoc(item)}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${item.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{item.user}</h4>
                                        <p className="text-sm text-muted-foreground">{item.docType} • {item.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-muted-foreground hidden md:block">{item.date}</span>
                                    {item.status === 'Pending' ? (
                                        <Button size="sm" variant="outline">Review</Button>
                                    ) : (
                                        <span className="text-sm font-bold text-red-600">Rejected</span>
                                    )}
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-1">
                    <FadeIn delay={0.3}>
                        <div className="bg-white border border-border rounded-xl p-6 shadow-sm sticky top-6">
                            {selectedDoc ? (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold mb-1">Document Preview</h3>
                                        <p className="text-sm text-muted-foreground">Reviewing {selectedDoc.user}'s document.</p>
                                    </div>

                                    <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border border-border relative group">
                                        <img src={selectedDoc.fileUrl} alt="Document" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="secondary" className="flex items-center gap-2">
                                                <Eye size={16} /> View Full Size
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                                            <X size={16} className="mr-2" /> Reject
                                        </Button>
                                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                                            <Check size={16} className="mr-2" /> Approve
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground">
                                    <ShieldCheck size={48} className="mb-4 text-gray-300" />
                                    <p>Select a document to review</p>
                                </div>
                            )}
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
