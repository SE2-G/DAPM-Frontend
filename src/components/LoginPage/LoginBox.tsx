import React from 'react';
import { TextField, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PersistentDrawerbox() {
    const navigate = useNavigate();

    const boxStyle: React.CSSProperties = {

        width: '300px',
        height: '350px',
        backgroundColor: 'rgb(20, 20, 20)', 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderRadius: '20px',
        padding: '20px',
    };

    const textFieldStyle: React.CSSProperties = {
        width: '100%',
    };

    const buttonStyle: React.CSSProperties = {
        marginTop: '10px', 
        width: '95%',
        color: "rgb(255,255,255)",
        backgroundColor: "rgb(60,60,60)",
        borderRadius: '5px',
        bottom: "4%"
    };

    const handleLogin = () => {
        navigate('/userpage'); // Navigate to UserPage
    };

    return (
        <div style={boxStyle}>
            <Typography variant="h6" component="div" color={"rgb(255,255,255)"}>
                Enter Your Details
            </Typography>
            <TextField label="Username" variant="outlined" style={textFieldStyle} />
            <TextField label="Password" variant="outlined" type="password" style={textFieldStyle} />
            <Button variant="contained" color="primary" style={buttonStyle} onClick={handleLogin}>
                Login
            </Button>
        </div>
    );
}