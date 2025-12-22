"use client";
import { Star, TrendingUp, Thu, ThumbsUp, MessageCircle, AlertCircle, Clock, UserCheck } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

export default function AgentReviewsPage() {
    // Mock Data
    const stats = {
        averageRating: 4.8,
        totalReviews: 124,
        dealsClosed: 45,
        responseTime: "2 hrs"
    };

    const satisfactionScores = [
        { label: "Visit Experience", score: 92, icon: UserCheck, color: "bg-green-500" },
        { label: "Response Time", score: 88, icon: Clock, color: "bg-blue-500" },
        { label: "Professionalism", score: 95, icon: Star, color: "bg-purple-500" },
    ];

    const feedbackAnalysis = {
        compliments: ["Knowledgeable about local market", "Very simplified process", "Friendly and approachable"],
        complaints: ["Follow-up was a bit slow on weekends", "Need more clarity on legal docs"]
    };

    const reviews = [
        { id: 1, user: "Ananya Patel", rating: 5, date: "2 days ago", comment: "Rajesh was incredibly helpful! He found us our dream home in Juhu within a week. Highly recommended.", tags: ["Responsive", "Expert"] },
        { id: 2, user: "Vikram Singh", rating: 4, date: "1 week ago", comment: "Great experience overall. The property visits were well organized.", tags: ["Professional"] },
        { id: 3, user: "Meera Reddy", rating: 5, date: "2 weeks ago", comment: "Best agent in Mumbai! He negotiated a fantastic price for us.", tags: ["Great Negotiator"] },
    ];

    return (
        <div className="space-y-6">
            <FadeIn>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Rating & Improvement</h1>
                        <p style={{ color: 'var(--muted)' }}>Track your performance and buyer satisfaction.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FEF3C7', color: '#D97706', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: '600' }}>
                        <Star fill="#D97706" size={18} />
                        <span>Top Rated Agent</span>
                    </div>
                </div>
            </FadeIn>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FadeIn delay={0.1}>
                    <div className="card p-6 flex flex-col justify-between h-full bg-white border border-border rounded-xl shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Average Rating</p>
                                <h3 className="text-3xl font-bold mt-1">{stats.averageRating}</h3>
                            </div>
                            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><Star size={24} fill="currentColor" /></div>
                        </div>
                        <div className="text-sm text-green-600 flex items-center gap-1 font-medium">
                            <TrendingUp size={16} /> +0.2 this month
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.2}>
                    <div className="card p-6 flex flex-col justify-between h-full bg-white border border-border rounded-xl shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Total Reviews</p>
                                <h3 className="text-3xl font-bold mt-1">{stats.totalReviews}</h3>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><MessageCircle size={24} /></div>
                        </div>
                        <div className="text-sm text-muted-foreground">From verified buyers</div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.3}>
                    <div className="card p-6 flex flex-col justify-between h-full bg-white border border-border rounded-xl shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Deals Closed</p>
                                <h3 className="text-3xl font-bold mt-1">{stats.dealsClosed}</h3>
                            </div>
                            <div className="p-2 bg-green-100 rounded-lg text-green-600"><ThumbsUp size={24} /></div>
                        </div>
                        <div className="text-sm text-green-600 flex items-center gap-1 font-medium">
                            <TrendingUp size={16} /> Top 5% in Region
                        </div>
                    </div>
                </FadeIn>
                <FadeIn delay={0.4}>
                    <div className="card p-6 flex flex-col justify-between h-full bg-white border border-border rounded-xl shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Avg Response Time</p>
                                <h3 className="text-3xl font-bold mt-1">{stats.responseTime}</h3>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Clock size={24} /></div>
                        </div>
                        <div className="text-sm text-muted-foreground">Keep it under 3 hrs</div>
                    </div>
                </FadeIn>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Customer Satisfaction Tracker */}
                <FadeIn delay={0.5}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <UserCheck size={20} className="text-primary" /> Customer Satisfaction Tracker
                        </h3>
                        <div className="space-y-6">
                            {satisfactionScores.map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between mb-2 text-sm font-medium">
                                        <span>{item.label}</span>
                                        <span className="text-primary">{item.score}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color}`}
                                            style={{ width: `${item.score}%`, transition: 'width 1s ease-out' }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700 flex gap-2 items-start">
                            <AlertCircle size={18} className="mt-0.5 shrink-0" />
                            <p><strong>Tip:</strong> Improve your "Response Time" score by enabling mobile notifications for new leads.</p>
                        </div>
                    </div>
                </FadeIn>

                {/* Feedback Analysis */}
                <FadeIn delay={0.6}>
                    <div className="card p-6 bg-white border border-border rounded-xl shadow-sm h-full">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <MessageCircle size={20} className="text-primary" /> Feedback Analysis
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <h4 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-3">Users Love</h4>
                                <ul className="space-y-2">
                                    {feedbackAnalysis.compliments.map((text, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-green-50 p-2 rounded">
                                            <ThumbsUp size={16} className="text-green-500 mt-0.5" /> {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3">To Improve</h4>
                                <ul className="space-y-2">
                                    {feedbackAnalysis.complaints.map((text, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-red-50 p-2 rounded">
                                            <AlertCircle size={16} className="text-red-500 mt-0.5" /> {text}
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
