import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { fetchStatusLoop } from '../../services/backendAPI';
import { userInfo, adminInfo } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'center',
}));

interface DrawerInterface {
    setRefreshKey: React.Dispatch<React.SetStateAction<number>>
}

const handleUserList = async () => {

    try {
        const response = await fetch('http://localhost:5000/auth/GetUsers', {
            method: 'GET',
            mode: "cors",
            cache: "no-cache",
            headers: {
                'Authorization': `Bearer ${userInfo.token}`,
                'Content-Type': 'application/json'
            },
            redirect: "follow",
            referrerPolicy: "no-referrer"
        });

        if (response.ok) {
            const jsonData = await response.json();
            const data = await fetchStatusLoop(jsonData.ticketId as string);
            adminInfo.userList = data;
        } else {
            console.error("Failed to fetch: ", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
};

export default function PersistentDrawerbox({setRefreshKey}: DrawerInterface) {
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
    variant="permanent" // Make it a fixed sidebar
    anchor="left"
    >
    <DrawerHeader>
        <Typography variant="h5">Admin page</Typography>
    </DrawerHeader>
    
    <Divider />

    <List>
        <ListItem disablePadding>
        <ListItemButton> 
            <ListItemText 
                primary="Register User"
                onClick={
                    () => {
                        adminInfo.userRegisterActive = true
                        setRefreshKey((prev) => prev + 1)
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
                    () => {
                        adminInfo.userRegisterActive = false
                        handleUserList()
                        navigate('/adminlistpage')
                    }
                } 
            />
        </ListItemButton>
        </ListItem>
    </List>
    </Drawer>
);
}