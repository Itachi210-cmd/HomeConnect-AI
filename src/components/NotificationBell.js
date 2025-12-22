"use client";
import { useState, useEffect, useRef } from 'react';
import { Bell, MessageSquare, Calendar, Info, Check } from 'lucide-react';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async () => {
        try {
            await fetch('/api/notifications', { method: 'PATCH' });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getIcon = (type) => {
        switch (type) {
            case 'MESSAGE': return <MessageSquare size={16} className="text-blue-500" />;
            case 'APPOINTMENT': return <Calendar size={16} className="text-green-500" />;
            default: return <Info size={16} className="text-slate-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen && unreadCount > 0) markAsRead();
                }}
                className="p-2 text-slate-600 hover:text-primary transition-colors relative"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                        {unreadCount > 0 && <span className="text-xs text-primary font-medium">{unreadCount} new</span>}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                                    onClick={() => {
                                        if (n.link) window.location.href = n.link;
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="flex gap-3">
                                        <div className="mt-1 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-bold text-slate-900 leading-tight">{n.title}</p>
                                                {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                            </div>
                                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                                            <span className="text-[10px] text-slate-400 mt-2 block">
                                                {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Bell size={24} className="text-slate-400" />
                                </div>
                                <p className="text-slate-500 text-sm">All caught up!</p>
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                            <button className="text-xs text-slate-500 font-medium hover:text-primary transition-colors">View All Activity</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
