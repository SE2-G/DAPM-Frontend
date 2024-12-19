// Author: s224768
// Author: s191446

import { Box } from "@mui/material";
import AdminUserListPage from "../components/AdminPage/AdminUserListPage";
import AdminSidebar from "../components/AdminPage/AdminSidebar";
import AdminEditPage from "../components/AdminPage/AdminEditPage";
import AdminRolePage from "../components/AdminPage/AdminRolePage";
import AdminActivityLogPage from "../components/AdminPage/AdminActivityLogPage"; // Adjust the path if needed

import { adminInfo } from "../redux/slices/userSlice";
import { useSelector } from 'react-redux';
import { RootState } from "../App";
import { useState } from "react";
import ProtectedRoute from "./ProtectedRoute";

export function AdminEditRoute() {

    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <AdminSidebar />
                <AdminEditPage />
            </Box>
        </div>
    );
}

export function AdminListRoute() {
    
    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <AdminSidebar />
                
                <AdminUserListPage />
            </Box>
        </div>
    );



}
export const AdminActivityLogRoute = () => {
    return (
        <ProtectedRoute>
            <AdminActivityLogPage />
        </ProtectedRoute>
    );
};

export function AdminRoleRoute() {
    
    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <AdminSidebar />
                
                <AdminRolePage />
            </Box>
        </div>
    );
}