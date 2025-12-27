import { useState, useEffect } from 'react';
import { Star, TrendingUp, ThumbsUp, MessageCircle, AlertCircle, Clock, UserCheck, Activity } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

export default function AgentReviewsPage() {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    const reviews = [
        { id: 1, user: "Ananya Patel", rating: 5, date: "2 days ago", comment: "Rajesh was incredibly helpful! He found us our dream home in Juhu within a week. Highly recommended.", tags: ["Responsive", "Expert"] },
        { id: 2, user: "Vikram Singh", rating: 4, date: "1 week ago", comment: "Great experience overall. The property visits were well organized.", tags: ["Professional"] },
        { id: 3, user: "Meera Reddy", rating: 5, date: "2 weeks ago", comment: "Best agent in Mumbai! He negotiated a fantastic price for us.", tags: ["Great Negotiator"] },
    ];

    useEffect(() => {
        const analyzeReviews = async () => {
            try {
                const res = await fetch('/api/ai/sentiment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reviews: reviews.map(r => r.comment) })
                });
                if (res.ok) {
                    setAnalysis(await res.json());
                }
            } catch (err) {
                console.error("Analysis failed:", err);
            } finally {
                setLoading(false);
            }
        };
        analyzeReviews();
    }, []);

    const stats = {
        averageRating: 4.8,
        totalReviews: reviews.length,
        dealsClosed: 45,
        responseTime: "2 hrs"
    };

    return (
        <div className="space-y-6">
            <FadeIn>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Rating & AI Insights</h1>
                        <p style={{ color: 'var(--muted)' }}>Real-time sentiment analysis of your client feedback.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F0FDF4', color: '#166534', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: '600', border: '1px solid #BBF7D0' }}>
                        <Activity size={18} className="text-green-600" />
                        <span>AI Analysis Active</span>
                    </div>
                </div>
            </FadeIn>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FadeIn delay={0.1}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm">
                        <p className="text-sm text-muted-foreground font-medium">Average Rating</p>
                        <h3 className="text-3xl font-bold mt-1">{stats.averageRating}</h3>
                        <div className="text-sm text-green-600 flex items-center gap-1 font-medium mt-2">
                            <Star size={16} fill="currentColor" /> High Performance
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.2}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm">
                        <p className="text-sm text-muted-foreground font-medium">Sentiment Score</p>
                        <h3 className="text-3xl font-bold mt-1">{analysis?.sentimentScore || "--"}%</h3>
                        <div className={`text-sm flex items-center gap-1 font-medium mt-2 ${analysis?.sentimentLabel === 'Positive' ? 'text-green-600' : 'text-blue-600'}`}>
                            {analysis?.sentimentLabel || "Analyzing..."}
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.3}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm">
                        <p className="text-sm text-muted-foreground font-medium">Total Reviews</p>
                        <h3 className="text-3xl font-bold mt-1">{stats.totalReviews}</h3>
                        <div className="text-sm text-muted-foreground mt-2">From verified buyers</div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.4}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm">
                        <p className="text-sm text-muted-foreground font-medium">Avg Response Time</p>
                        <h3 className="text-3xl font-bold mt-1">{stats.responseTime}</h3>
                        <div className="text-sm text-purple-600 font-medium mt-2">Elite response rate</div>
                    </div>
                </FadeIn>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Sentiment Analysis Card */}
                <FadeIn delay={0.5}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm h-full">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Activity size={20} className="text-primary" /> AI Reputation Summary
                        </h3>
                        {loading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-gray-700 italic border-l-4 border-primary pl-4 py-1">
                                    "{analysis?.summary || "Your clients value your negotiation skills and responsiveness."}"
                                </p>
                                <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-800 flex gap-2 items-start">
                                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                    <p><strong>Insight:</strong> Buyers frequently mention your Juhu market expertise. Keep highlighting this in your bio.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </FadeIn>

                {/* Feedback Analysis */}
                <FadeIn delay={0.6}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm h-full">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <MessageCircle size={20} className="text-primary" /> Sentiment Highlights
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <h4 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3">Strongest Areas</h4>
                                <ul className="space-y-2">
                                    {(analysis?.topCompliments || ["Speed", "Pricing", "Local Knowledge"]).map((text, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-green-50 p-2 rounded-lg border border-green-100">
                                            <ThumbsUp size={16} className="text-green-500 mt-0.5" /> {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Growth Areas</h4>
                                <ul className="space-y-2">
                                    {(analysis?.topComplaints || ["Initial Follow-up", "Documentation Clarity"]).map((text, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-amber-50 p-2 rounded-lg border border-amber-100">
                                            <AlertCircle size={16} className="text-amber-500 mt-0.5" /> {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* Recent Reviews */}
            <FadeIn delay={0.7}>
                <div className="card p-6 bg-white border border-border rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold">Recent Reviews</h3>
                        <a href="#" className="text-primary text-sm font-medium hover:underline">View All</a>
                    </div>
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                            {review.user[0]}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{review.user}</div>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <span>{review.date}</span> • Verified Buyer
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed mb-3 pl-14">"{review.comment}"</p>
                                <div className="flex gap-2 pl-14">
                                    {review.tags.map((tag, i) => (
                                        <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
