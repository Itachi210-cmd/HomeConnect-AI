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
        let successCount = 0;
        for (const prop of newProperties) {
            const res = await addProperty({
                ...prop,
                status: prop.status || 'Active',
            });
            if (res.success) successCount++;
        }
        await fetchProperties(); // Refresh list
        return successCount;
    };

    const updateProperty = async (id, updatedData) => {
        try {
            console.log("CONTEXT: Updating property:", id, "with data:", updatedData);
            const res = await fetch(`/api/properties/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            console.log("CONTEXT: Response status:", res.status);
            console.log("CONTEXT: Response type:", res.type);

            if (res.ok) {
                const savedProperty = await res.json();
                setProperties(prev => prev.map(p => p.id === id ? savedProperty : p));
                return { success: true };
            } else {
                let errorData = {};
                try {
                    errorData = await res.json();
                    console.error("CONTEXT: Server error data:", errorData);
                } catch (e) {
                    const text = await res.text();
                    console.error("CONTEXT: Server returned non-JSON error:", text);
                    errorData = { error: "Non-JSON response", message: text };
                }

                return {
                    success: false,
                    error: errorData.error || "Server error",
                    message: errorData.message || "",
                    raw: errorData
                };
            }
        } catch (error) {
            console.error("CONTEXT: Network/Fetch Error:", error);
            return {
                success: false,
                error: "Network or JSON error",
                message: error.message,
                stack: error.stack
            };
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
            console.error("Error deleting property", error)
            return { success: false };
        }
    };

    const estimateValue = async (id) => {
        try {
            const res = await fetch(`/api/properties/${id}/valuation`, {
                method: 'POST'
            });
            if (res.ok) {
                const data = await res.json();
                // Update local property state with new valuation
                setProperties(prev => prev.map(p =>
                    p.id === id ? { ...p, marketValue: data.marketValue, valuationNotes: data.valuationNotes } : p
                ));
                return { success: true, data };
            }
            return { success: false, error: "Valuation failed" };
        } catch (error) {
            console.error("Valuation Error:", error);
            return { success: false, error: error.message };
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

    // Helper to format price into a user-friendly string (e.g., ₹1.5 Cr or ₹50,00,000)
    const formatPrice = (price) => {
        if (price === undefined || price === null || price === '' || price === 0 || price === "0") return "Price on Request";

        // If it's already a formatted string (contains ₹ or textual denominations)
        if (typeof price === 'string' && (price.includes('₹') || price.toLowerCase().includes('lakh') || price.toLowerCase().includes('cr'))) {
            return price;
        }

        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        if (isNaN(numPrice)) return "Price on Request";

        // For large Indian numbers, convert to Cr/Lakh for readability if it's a plain number
        if (numPrice >= 10000000) {
            return `₹${(numPrice / 10000000).toFixed(2)} Cr`;
        } else if (numPrice >= 100000) {
            return `₹${(numPrice / 100000).toFixed(2)} Lakh`;
        }

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(numPrice);
    };

    return (
        <PropertyContext.Provider value={{
            properties,
            loading,
            addProperty,
            addProperties,
            updateProperty,
            deleteProperty,
            estimateValue,
            wishlist,
            toggleWishlist,
            compareList,
            toggleCompare,
            inquiries,
            addInquiry,
            parsePrice,
            formatPrice
        }}>
            {children}
        </PropertyContext.Provider>
    );
}

export function useProperties() {
    return useContext(PropertyContext);
}
