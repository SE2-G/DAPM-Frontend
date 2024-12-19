// Author: s224768

import React, { useEffect, useState } from 'react';
import { Box, Typography, ButtonBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { adminInfo, User, userInfo } from '../../redux/slices/userSlice';
import { fetchStatusLoop, getPath } from '../../services/backendAPI';

//Get the list of all users from the database
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

            return data;
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

    const [userList, setUserList] = useState<User[]>([]);
    console.log(userList);

    //Update the page
    useEffect(() => {
        const fetchUserData = async () => {
            const data = await handleUserList();
            try{
                if (data.result.succeeded){
                    setUserList(data.result.message);
                }
            } catch(error){
                return 0;
            }
        };
        
        fetchUserData(); // get the userlist again
    }, []);
    
    // UI for the user list page
    return (
        <Box display="flex" flexDirection="column" gap={2} margin={'15px'}>
            {/*Loop through a map of the user to draw them all*/}
            {userList.map((user) => (

                // if pressed on the user, then navigate to the edit user page
                <ButtonBase 
                    key={user.Id} 
                    onClick={() => {
                        adminInfo.userRegisterActive = false;
                        adminInfo.userSelected = user;
                        navigate('/admineditpage'); // navigate to edit user page
                    }}
                    sx={{ 
                        padding: 2, 
                        border: '1px solid gray', 
                        borderRadius: 2, 
                        width: '1260px',
                        height: '50px',  
                        textAlign: 'center' 
                    }}
                >
                    <Box display="flex" width="100%" alignItems="center">
                {/* Write the username, fullname and roles of the users in the list */}
                <Typography
                    variant="h6"
                    color="white"
                    sx={{ flex: 1, textAlign: 'left' }}
                >
                    {user.UserName}
                </Typography>
                <Typography
                    variant="h6"
                    color="white"
                    sx={{ flex: 1, textAlign: 'center', width: '200px' }}
                >
                    {user.FullName}
                </Typography>
                <Typography
                    variant="h6"
                    color="white"
                    sx={{ flex: 1, textAlign: 'right' }}
                >
                    {user.Roles.join(', ')}
                </Typography>
            </Box>
                </ButtonBase>
            ))}
        </Box>
    );
}
