import { useEffect, useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Typography, TextField, Box, Button } from '@mui/material';
import { adminInfo} from '../../redux/slices/userSlice';

interface DrawerInterface{
    refreshKey: number
}

export default function PersistentDrawerbox({refreshKey} : DrawerInterface) {
    // Initial roles list
    const [roles, setRoles] = useState(["Standard"]);
    const [roleInput, setRoleInput] = useState("");

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const boxTitle = adminInfo.userRegisterActive ? "Register User" : "Edit user"

    const handleRemoveRole = (role: string) => {
        setRoles((prevRoles) => prevRoles.filter((r) => r !== role));
    };

    const handleAddRole = () => {

        if (roleInput.trim() && !roles.includes(roleInput.trim())) {
            setRoles((prevRoles) => [...prevRoles, roleInput.trim()]); 
            setRoleInput(""); 
        }
    };

    const handleRegistration = async () => {
        setError(null);

        try {
            const response = await fetch('http://localhost:5002/api/Authentication/register', {
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
                const data = await response.json();
                localStorage.setItem('token', data.token);
                 
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    return (
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
            {/* Registration Box */}
            <Box 
                sx={{
                    width: 300,
                    height: '53vh',
                    padding: 3,              
                    backgroundColor: '#292929', 
                    borderRadius: 2,         
                    boxShadow: 3,            
                }}
            >
                <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', color: 'white' }}>
                    {boxTitle}
                </Typography>

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

                <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <TextField 
                        label="Roles" 
                        variant="outlined" 
                        fullWidth 
                        value={roleInput}          // Bind the input value
                        onChange={(e) => setRoleInput(e.target.value)} // Update the input state
                        sx={{ mr: 1 }}
                    />
                    <Button 
                        variant="contained" 
                        sx={{ backgroundColor: '#444', color: '#fff' }}
                        onClick={() =>
                            {
                                handleAddRole()
                            }
                        }   // Use the handler to add the role
                    >
                        Add
                    </Button>
                </Box>

                <Button 
                    variant="contained"
                    sx={{ backgroundColor: '#444', color: '#fff' }}  
                    fullWidth
                    onClick={() => handleRegistration()}
                >
                    Submit
                </Button>
            </Box>

            {/* Roles Sidebar */}
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
                            <ListItemButton onClick={() => handleRemoveRole(role)}>
                                <ListItemText primary={role} sx={{ color: 'white', textAlign: 'center' }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
}