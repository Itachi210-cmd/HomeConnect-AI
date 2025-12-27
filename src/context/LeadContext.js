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
                setLeads(prev => [newLead, ...prev]);
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            console.error("Error adding lead:", error);
            return { success: false };
        }
    };

    const addLeads = async (newLeads) => {
        let successCount = 0;
        for (const lead of newLeads) {
            const res = await addLead(lead);
            if (res.success) successCount++;
        }
        await fetchLeads(); // Refresh the list
        return successCount;
    };

    const updateLead = async (id, updatedData) => {
        try {
            const res = await fetch(`/api/leads/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (res.ok) {
                const updatedLead = await res.json();
                setLeads(prev => prev.map(lead => lead.id === id ? updatedLead : lead));
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            console.error("Error updating lead:", error);
            return { success: false };
        }
    };

    const updateLeadStatus = async (id, newStatus) => {
        await updateLead(id, { status: newStatus });
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
        <LeadContext.Provider value={{ leads, addLead, addLeads, updateLead, updateLeadStatus, deleteLead, fetchLeads, loading }}>
            {children}
        </LeadContext.Provider>
    );
}

export function useLeads() {
    return useContext(LeadContext);
}
