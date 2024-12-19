// Author: s224768

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Typography, TextField, Box, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { adminInfo, userInfo } from '../../redux/slices/userSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { fetchStatusLoop, getPath } from '../../services/backendAPI';

//draw UI of the admin edit user page
export default function PersistentDrawerbox() {
    const navigate = useNavigate()
    
    const [roles, setRoles] = useState<string[]>([]);
    const [availableRoles, setAvailableRoles] = useState<string[]>([]);
    const [roleInput, setRoleInput] = useState<string>('');

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [id, setId] = useState<number>(-1);
    const [error, setError] = useState<string | null>(null);

    //change the header text based on the page
    const boxTitle = adminInfo.userRegisterActive ? "Register User" : "Edit user";

    useEffect(() => {
        if (!adminInfo.userRegisterActive && adminInfo.userSelected) {
            setId(adminInfo.userSelected.Id);
            setUsername(adminInfo.userSelected.UserName);
            setFullName(adminInfo.userSelected.FullName);
            setPassword(adminInfo.userSelected.Password);
            setRoles(adminInfo.userSelected.Roles);
        }
    }, [adminInfo.userRegisterActive, adminInfo.userSelected]);

    // Fetch available roles
    useEffect(() => {
        handleRoleList();
    }, []);

    //remove role from the created user from the list of roles
    const handleRemoveRole = (role: string) => {
        setRoles((prevRoles) => prevRoles.filter((r) => r !== role));
    };

    //Get the list of roles for the drop down menu
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

            if (response.ok) {
                const jsonData = await response.json();
                const data = await fetchStatusLoop(jsonData.ticketId as string);

                if (data?.result?.message) {
                    setAvailableRoles(data.result.message.map((role: { RoleName: string }) => role.RoleName)); // set the roles to the ticket information
                } else {
                    setAvailableRoles([]);
                }
            } else {
                setAvailableRoles([]);
            }
        } catch (error) {
            setAvailableRoles([]);
        }
    };

    // add role to the user role list
    const handleAddRole = () => {
        if (roleInput.trim() && !roles.includes(roleInput.trim()) && availableRoles.includes(roleInput.trim())) {
            setRoles((prevRoles) => [...prevRoles, roleInput.trim()]); 
            setRoleInput(""); 
        }
    };

    // Delete the user on the edit page
    const handleDeleteUser = async () => {
        setError(null);
    
        try {
            const response = await fetch(getPath() + '/auth/deleteUser/'+username, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`,
                },
            });
    
            if (response.ok) {
                const jsonData = await response.json();
                const data = await fetchStatusLoop(jsonData.ticketId as string);

                if (data.result.succeeded){
                    navigate('/adminlistpage');
                }
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (err) {
            setError('Failed to delete user. Please try again.');
        }
    };

    // Register the user
    const handleRegistration = async () => {
        setError(null);

        try {
            const response = await fetch(getPath()+'/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: username,
                    password: password,
                    fullName: fullName,
                    roles: roles
                }),
            });

            if (response.ok) {
                const jsonData = await response.json();
                const data = await fetchStatusLoop(jsonData.ticketId as string);

                if (data.result.succeeded){
                    localStorage.setItem('token', data.result.message.token);
                    navigate('/adminlistpage'); // goto the user list
                }
                 
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    // Edit the user
    const handleEditUser = async () => {
        setError(null);

        try {
            const response = await fetch(getPath()+'/auth/EditAsAdmin', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({
                    id: id,
                    userName: username,
                    password: (password == undefined) ? "" : password,
                    fullName: fullName,
                    roles: roles
                }),
            });

            if (response.ok) {
                const data = await response.json();
                navigate('/adminlistpage')
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    //UI for the edit page
    return (
        //UI box
        <Box 
            sx={{
                display: 'flex',
                height: '70vh',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '20px auto',
                transform: 'translateY(15%)'
            }}
        >
            <Box 
                sx={{
                    width: '85%',
                    maxWidth: 500,
                    height: 'auto',
                    padding: 3,
                    backgroundColor: '#292929',
                    borderRadius: 2,
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',            
                }}
            >
                {/*Back button if on edit user page*/}
                {!adminInfo.userRegisterActive &&
                <Button 
                    sx={{ 
                        position: 'fixed',
                        transform: 'translateY(-10%)',
                        left: '20px',
                        color: 'white',
                        zIndex: 999,
                    }} 
                    onClick={() => {navigate('/adminlistpage')}}
                >
                    <ArrowBackIcon />
                </Button>
                }

                {/*Delete user button if the user isn't the main admin user, and it's on the edit user page*/}
                {!adminInfo.userRegisterActive && id != 1 && (
                    <Button
                        variant="contained"
                        color="error"
                        sx={{
                            position: 'fixed',
                            top: '-70px',
                            left: '50%',
                            zIndex: 9999,
                        }}
                        onClick={handleDeleteUser}
                    >
                        Delete User
                    </Button>
                )}
                
                <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: 'white' }}>
                    {boxTitle}
                </Typography>

                {/*Text feilds for the user information, username, password, full name, roles*/}
                <TextField 
                    label="Username" 
                    variant="outlined" 
                    fullWidth 
                    sx={{ mb: 2 }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField 
                    label="Password" 
                    type="password" 
                    variant="outlined" 
                    fullWidth 
                    sx={{ mb: 2 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField 
                    label="Full Name" 
                    variant="outlined" 
                    fullWidth 
                    sx={{ mb: 2 }}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                {/* Dropdown menu for selecting a role */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Roles</InputLabel>
                    <Select
                        value={roleInput}
                        label="Roles"
                        onChange={(e) => setRoleInput(e.target.value)}
                    >
                        {availableRoles.map((role, index) => (
                            <MenuItem key={index} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/*Adds the roles from the dropdown menu*/}
                <Button 
                    variant="contained" 
                    sx={{ 
                        backgroundColor: '#444', 
                        color: '#fff',
                        mb: 3,
                    }}
                    onClick={handleAddRole} 
                >
                    Add Role
                </Button>

                {/*Submit the new / edited user*/}
                <Button 
                    variant="contained"
                    sx={{ 
                        backgroundColor: '#444', 
                        color: '#fff' 
                    }}  
                    fullWidth
                    onClick={() => {adminInfo.userRegisterActive ? handleRegistration() : handleEditUser()}}
                >
                    Submit
                </Button>
            </Box>

            {/*The user roles, in a list*/}
            <Box
                sx={{
                    width: 200,
                    padding: 2,
                    backgroundColor: '#292929',
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    height: '60vh',
                    marginLeft: 2,
                }}
            >
                <Typography variant="h5" sx={{ p: 1, textAlign: 'center', color: 'white' }}>
                    Roles
                </Typography>
                <List>
                    {roles.map((role, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={() => id != 1 && handleRemoveRole(role)}>
                                <ListItemText primary={role} sx={{ color: 'white', textAlign: 'center' }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
}
