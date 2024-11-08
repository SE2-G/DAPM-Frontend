import React from 'react';
import { Box, Typography, ButtonBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { adminInfo, User } from '../../redux/slices/userSlice';



export default function PersistentDrawerbox() {
    const navigate = useNavigate();

    // Explicitly type adminInfo.userList as an array of User
    const userList: User[] = adminInfo.userList;
    console.log(userList)

    return (
        <Box display="flex" flexDirection="row" gap={2} margin={'15px'}>
            {userList.map((user, index) => (
                <ButtonBase 
                    key={user.id} 
                    onClick={() => {
                        adminInfo.userRegisterActive = false;
                        adminInfo.userSelected = user;
                        navigate(`/admineditpage/`);  // Pass user ID in URL for unique navigation
                    }}
                    sx={{ 
                        padding: 2, 
                        border: '1px solid gray', 
                        borderRadius: 2, 
                        width: '150px', 
                        textAlign: 'center' 
                    }}
                >
                    <Typography variant="h6" color={'white'}>{user.fullName}</Typography>
                </ButtonBase>
            ))}
        </Box>
    );
}