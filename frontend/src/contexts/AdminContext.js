import axios from "axios";
import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAdminData = useCallback(async () => {
        try {
            const response = await axios.get("/api/admin");
            setAdminData(response.data);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAdminData();
    }, [fetchAdminData]);

    const contextValue = useMemo(() => ({
        adminData,
        loading,
    }), [adminData, loading]);

    return (
        
        <AdminContext.Provider value={contextValue}>
            {children}
        </AdminContext.Provider>
    );
};



export { AdminProvider };