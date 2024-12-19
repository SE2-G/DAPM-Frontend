// Author: s224768
import { Box } from "@mui/material";
import AdminUserListPage from "../components/AdminPage/AdminUserListPage";
import AdminSidebar from "../components/AdminPage/AdminSidebar";
import AdminEditPage from "../components/AdminPage/AdminEditPage";
import AdminRolePage from "../components/AdminPage/AdminRolePage";
import { adminInfo } from "../redux/slices/userSlice";
import { useSelector } from 'react-redux';
import { RootState } from "../App";
import { useState } from "react";

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