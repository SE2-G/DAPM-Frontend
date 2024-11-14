import { Box } from "@mui/material";
import AdminUserListPage from "../components/AdminPage/AdminUserListPage";
import AdminSidebar from "../components/AdminPage/AdminSidebar";
import AdminEditPage from "../components/AdminPage/AdminEditPage";
import { adminInfo } from "../redux/slices/userSlice";
import { useSelector } from 'react-redux';
import { RootState } from "../App";
import { useState } from "react";

export function AdminEditRoute() {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <AdminSidebar setRefreshKey = {setRefreshKey} />
                <AdminEditPage refreshKey = {refreshKey} />
            </Box>
        </div>
    );
}

export function AdminListRoute() {
    const [refreshKey, setRefreshKey] = useState(0);
    
    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <AdminSidebar setRefreshKey = {setRefreshKey} />
                
                <AdminUserListPage />
            </Box>
        </div>
    );
}