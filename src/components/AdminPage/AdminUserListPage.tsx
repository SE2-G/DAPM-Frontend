import React, { useEffect, useState } from 'react';
import { Box, Typography, ButtonBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { adminInfo, User, userInfo } from '../../redux/slices/userSlice';
import { fetchStatusLoop, getPath } from '../../services/backendAPI';

const handleUserList = async () => {
    try {
        const response = await fetch(getPath() + '/auth/GetUsers', {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Authorization': `Bearer ${userInfo.token}`,
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        });

        if (response.ok) {
            const jsonData = await response.json();
            const data = await fetchStatusLoop(jsonData.ticketId as string);
            return data; // Return the fetched user data
        } else {
            console.error('Failed to fetch:', response.status, response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Network error:', error);
        return [];
    }
};

export default function PersistentDrawerbox() {
    const navigate = useNavigate();

    // Explicitly type adminInfo.userList as an array of User
    const [userList, setUserList] = useState<User[]>([]);
    console.log(userList);

    useEffect(() => {
        const fetchUserData = async () => {
            const users = await handleUserList();
            setUserList(users); // Update state with the fetched user data
        };

        fetchUserData(); // Fetch the user list when the component mounts
    }, []);

    return (
        <Box display="flex" flexDirection="row" gap={2} margin={'15px'}>
            {userList.map((user, index) => (
                <ButtonBase 
                    key={user.Id} 
                    onClick={() => {
                        adminInfo.userRegisterActive = false;
                        adminInfo.userSelected = user;
                        navigate('/admineditpage');  // Pass user ID in URL for unique navigation
                    }}
                    sx={{ 
                        padding: 2, 
                        border: '1px solid gray', 
                        borderRadius: 2, 
                        width: '150px', 
                        textAlign: 'center' 
                    }}
                >
                    <Typography variant="h6" color={'white'}>{user.FullName}</Typography>
                </ButtonBase>
            ))}
        </Box>
    );
}