"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const LeadContext = createContext();

export function LeadProvider({ children }) {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch leads on mount
    const fetchLeads = async () => {
        try {
            const res = await fetch('/api/leads');
            if (res.ok) {
                const data = await res.json();
                setLeads(data);
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const addLead = async (lead) => {
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lead)
            });
            if (res.ok) {
                const newLead = await res.json();
                // Optimistically update if we are viewing the list, but for public user it doesn't matter
                setLeads(prev => [newLead, ...prev]);
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            console.error("Error adding lead:", error);
            return { success: false };
        }
    };

    const updateLeadStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/leads/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
            }
        } catch (error) {
            console.error("Error updating lead status:", error);
        }
    };

    const deleteLead = async (id) => {
        try {
            const res = await fetch(`/api/leads/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setLeads(leads.filter(lead => lead.id !== id));
            }
        } catch (error) {
            console.error("Error deleting lead:", error);
        }
    };

    return (
        <LeadContext.Provider value={{ leads, addLead, updateLeadStatus, deleteLead, fetchLeads, loading }}>
            {children}
        </LeadContext.Provider>
    );
}

export function useLeads() {
    return useContext(LeadContext);
}
