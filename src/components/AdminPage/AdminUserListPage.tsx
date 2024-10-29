import React from 'react';
import { Box, Typography, ButtonBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { adminInfo } from '../../redux/slices/userSlice';

export default function PersistentDrawerbox() {
    const navigate = useNavigate();

    const userList = [
        { fullname: "Alice Doe", username: "alice123" },
        { fullname: "Bob Smith", username: "bob_smith" },
        { fullname: "Charlie Brown", username: "charlieb" },
        // Add more users as needed
    ];

    return (
        <Box display="flex" flexDirection="row" gap={2} margin={'15px'}>
            {userList.map((user, index) => (
                <ButtonBase 
                    key={index} 
                    onClick={() => 
                        {
                            adminInfo.userRegisterActive = false
                            navigate('/admineditpage')
                        }
                    }
                    sx={{ 
                        padding: 2, 
                        border: '1px solid gray', 
                        borderRadius: 2, 
                        width: '150px', 
                        textAlign: 'center' 
                    }}
                >
                    <Typography variant="h6" color={'white'}>{user.fullname}</Typography>
                </ButtonBase>
            ))}
        </Box>
    );
}