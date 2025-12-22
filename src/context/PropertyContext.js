"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const PropertyContext = createContext();

export function PropertyProvider({ children }) {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);
    const [compareList, setCompareList] = useState([]); // Array of property objects for comparison
    const [inquiries, setInquiries] = useState([
        { id: 1, propertyId: 1, message: "Is this still available?", date: "2024-10-25", status: "Replied" },
        { id: 2, propertyId: 2, message: "Can I schedule a visit?", date: "2024-10-28", status: "Pending" }
    ]);

    const toggleCompare = (property) => {
        setCompareList(prev => {
            const isSelected = prev.find(p => p.id === property.id);
            if (isSelected) {
                return prev.filter(p => p.id !== property.id);
            } else {
                if (prev.length >= 3) {
                    alert("You can compare up to 3 properties at a time.");
                    return prev;
                }
                return [...prev, property];
            }
        });
    };

    // Fetch properties and wishlist from API
    useEffect(() => {
        fetchProperties();
        fetchWishlist();
    }, []);

    const fetchProperties = async () => {
        try {
            const res = await fetch('/api/properties');
            if (res.ok) {
                const data = await res.json();
                setProperties(data);
            } else {
                console.error("Failed to fetch properties");
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWishlist = async () => {
        try {
            const res = await fetch('/api/wishlist?userId=buyer_default');
            if (res.ok) {
                const data = await res.json();
                // Store only IDs in the wishlist state for quick checking
                setWishlist(data.map(p => p.id));
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    const addProperty = async (newProperty) => {
        try {
            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProperty)
            });
            if (res.ok) {
                const savedProperty = await res.json();
                setProperties(prev => [savedProperty, ...prev]);
                return { success: true };
            } else {
                const error = await res.json();
                return { success: false, error: error.error };
            }
        } catch (error) {
            console.error("Error adding property:", error);
            return { success: false, error: "Network error" };
        }
    };

    const addProperties = async (newProperties) => {
        // Bulk import: Sequentially add properties (for now)
        // Ideally, create a bulk API endpoint
        let successCount = 0;
        for (const prop of newProperties) {
            const res = await addProperty({
                ...prop,
                status: prop.status || 'Active',
                image: prop.image || "https://images.unsplash.com/photo-1600596542815-2251c3052068?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                // Ensure array format for API
                images: prop.image ? [prop.image] : [],
                features: prop.features || []
            });
            if (res.success) successCount++;
        }
        await fetchProperties(); // Refresh list
        return successCount;
    };

    const updateProperty = async (id, updatedData) => {
        try {
            const res = await fetch(`/api/properties/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (res.ok) {
                const savedProperty = await res.json();
                setProperties(prev => prev.map(p => p.id === id ? savedProperty : p));
                return { success: true };
            } else {
                return { success: false };
            }
        } catch (error) {
            console.error("Error updating property", error);
            return { success: false };
        }
    };

    const deleteProperty = async (id) => {
        try {
            const res = await fetch(`/api/properties/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setProperties(prev => prev.filter(p => p.id !== id));
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            console.error("Error deleting property", error);
            return { success: false };
        }
    };

    const toggleWishlist = async (propertyId) => {
        // Optimistic update
        const wasSaved = wishlist.includes(propertyId);
        setWishlist(prev => {
            if (wasSaved) {
                return prev.filter(id => id !== propertyId);
            } else {
                return [...prev, propertyId];
            }
        });

        try {
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ propertyId, userId: 'buyer_default' })
            });

            if (!res.ok) {
                // Rollback if failed
                setWishlist(prev => wasSaved ? [...prev, propertyId] : prev.filter(id => id !== propertyId));
            }
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            // Rollback
            setWishlist(prev => wasSaved ? [...prev, propertyId] : prev.filter(id => id !== propertyId));
        }
    };

    const addInquiry = (inquiry) => {
        setInquiries([...inquiries, { ...inquiry, id: Date.now(), date: new Date().toISOString().split('T')[0], status: 'Pending' }]);
    };

    // Helper to parse price strings like "₹1.5 Cr" or "₹75 Lakhs" into numbers
    // Helper to parse price strings like "₹1.5 Cr" or "₹75 Lakhs" into numbers
    const parsePrice = (priceStr) => {
        if (priceStr === undefined || priceStr === null) return 0;
        if (typeof priceStr === 'number') return priceStr;

        const cleanStr = priceStr.toString().replace(/[^0-9.]/g, '');
        const value = parseFloat(cleanStr);

        if (priceStr.toLowerCase().includes('cr')) {
            return value * 10000000;
        } else if (priceStr.toLowerCase().includes('lakh')) {
            return value * 100000;
        }
        return value || 0;
    };

    return (
        <PropertyContext.Provider value={{
            properties,
            loading,
            addProperty,
            addProperties,
            updateProperty,
            deleteProperty,
            wishlist,
            toggleWishlist,
            compareList,
            toggleCompare,
            inquiries,
            addInquiry,
            parsePrice
        }}>
            {children}
        </PropertyContext.Provider>
    );
}

export function useProperties() {
    return useContext(PropertyContext);
}
