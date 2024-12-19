// Author: s224768

import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { adminInfo } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'center',
}));

// draw UI of the sidebar
export default function PersistentDrawerbox() {
    const navigate = useNavigate();

return (
    <Drawer
    PaperProps={{
        sx: {
        backgroundColor: '#292929',
        color: 'white',
        },
    }}
    sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        },
    }}
    variant="permanent"
    anchor="left"
    >
    
    {/*Back button to the userpage*/}
    <Button 
        sx={{ 
            position: 'fixed',
            transform: 'translateY(40%)',
            left: '-5px',
            color: 'white',
            zIndex: 999,
        }} 
        onClick={() => {navigate('/userpage')}}
    >
        <ArrowBackIcon />
    </Button>

    {/*Sidebar header*/}
    <DrawerHeader>
        <Typography variant="h5">Admin page</Typography>
    </DrawerHeader>
    
    <Divider />

    {/*Creat the list of buttons for the navigation*/}
    <List>
        <ListItem disablePadding>
        <ListItemButton> 
            <ListItemText 
                primary="Register User"
                onClick={
                    () => {
                        adminInfo.userRegisterActive = true
                        
                        navigate('/admineditpage')
                    }
                }
            />
        </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
        <ListItemButton>
            <ListItemText 
                primary="User List"
                onClick={
                    async () => {
                        adminInfo.userRegisterActive = false
                        navigate('/adminlistpage')
                    }
                }
            />
        </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
        <ListItemButton>
            <ListItemText 
                primary="Roles"
                onClick={
                    async () => {
                        adminInfo.userRegisterActive = false
                        navigate('/adminrolepage')
                    }
                }
            />
        </ListItemButton>
        </ListItem>
    </List>
    </Drawer>
);
}