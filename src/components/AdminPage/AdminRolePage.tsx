// Author: s224768

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon
import { useEffect, useState } from 'react';
import { Typography, TextField, Box, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { adminInfo, userInfo } from '../../redux/slices/userSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { fetchStatusLoop, getPath } from '../../services/backendAPI';

//draw the ui of the role page
export default function PersistentDrawerbox() {
    const [roles, setRoles] = useState<{ RoleName: string }[]>([]);
    const [newRole, setNewRole] = useState(''); // State to store the role name from the TextField

    //Get the list of all roles in the database
    const handleRoleList = async () => {
        try {
            const response = await fetch(getPath() + '/auth/GetRoles', {
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

            //if response is confirmed
            if (response.ok) {
                const jsonData = await response.json();
                const data = await fetchStatusLoop(jsonData.ticketId as string);

                if (data?.result?.message) {
                    setRoles(data.result.message);
                } else {
                    console.error('Invalid data format:', data);
                    setRoles([]);
                }
            } else {
                setRoles([]);
            }
        } catch (error) {
            setRoles([]);
        }
    };

    //Add a role to the database
    const handleAddRole = async () => {
        if (!newRole.trim()) return;

        try {
            const response = await fetch(getPath() + '/auth/addRoles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify([newRole]),
            });

            if (response.ok) {
                const jsonData = await response.json();
                const data = await fetchStatusLoop(jsonData.ticketId as string);

                if (data.result.succeeded) {
                    localStorage.setItem('token', data.result.message.token);
                    setNewRole('');
                    handleRoleList(); // Refresh the role list after adding
                }
            }
        } catch (err) {
            console.error('Error adding role:', err);
        }
    };

    //Delete a role from the database
    const handleDeleteRole = async (roleName: string) => {
        if (!roleName) return;

        try {
            const response = await fetch(getPath() + '/auth/deleteRoles', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify([roleName]), // Pass the role to be deleted
            });

            if (response.ok) {
                const jsonData = await response.json();
                const data = await fetchStatusLoop(jsonData.ticketId as string);

                if (data.result.succeeded) {
                    localStorage.setItem('token', data.result.message.token);
                    handleRoleList(); // update the page
                }
            }
        } catch (err) {
            console.error('Error deleting role:', err);
        }
    };

    useEffect(() => {
        handleRoleList();
    }, []);

    return (
        //UI box
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                height: '100vh',
                paddingTop: '20px',
                paddingLeft: '20px',
                paddingRight: '20px',
            }}
        >
            {/*Role textfield and header text*/}
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Roles
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    variant="outlined"
                    placeholder="Enter roles"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    sx={{
                        width: '1100px',
                        marginRight: '10px',
                        input: { color: 'white' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white',
                            },
                        },
                    }}
                />
                <Button variant="contained" onClick={handleAddRole}>Create</Button>
            </Box>
            {/*Draw the list of roles*/}
            <List
                sx={{
                    marginTop: '20px',
                    width: '100%',
                    maxWidth: '1100px',
                    backgroundColor: '#222222',
                    borderRadius: '4px',
                    color: 'white',
                }}
            >
                {roles.map((role, index) => (
                    <ListItem key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <ListItemText
                            primary={role.RoleName}
                            sx={{ color: 'white' }}
                        />
                        <IconButton onClick={() => handleDeleteRole(role.RoleName)}>
                            <CloseIcon sx={{ color: 'white' }} />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
