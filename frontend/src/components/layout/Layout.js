import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    Person,
    Restaurant,
    LocalShipping,
    ExitToApp,
} from '@mui/icons-material';

// Import dashboard components
import AdminDashboard from '../dashboard/AdminDashboard';
import PantryDashboard from '../dashboard/PantryDashboard';
import DeliveryDashboard from '../dashboard/DeliveryDashboard';
import PatientList from '../patients/PatientList';
import PatientForm from '../patients/PatientForm';

const drawerWidth = 240;

const Layout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        {
            text: 'Dashboard',
            icon: <Dashboard />,
            path: '/dashboard',
            roles: ['admin', 'pantry', 'delivery']
        },
        {
            text: 'Patients',
            icon: <Person />,
            path: '/patients',
            roles: ['admin']
        },
        {
            text: 'Diet Charts',
            icon: <Restaurant />,
            path: '/diet-charts',
            roles: ['admin', 'pantry']
        },
        {
            text: 'Deliveries',
            icon: <LocalShipping />,
            path: '/deliveries',
            roles: ['delivery', 'pantry']
        }
    ];

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Hospital Food
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    item.roles.includes(user?.role) && (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    )
                ))}
            </List>
            <Divider />
            <List>
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon>
                        <ExitToApp />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Hospital Food Management
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            user?.role === 'admin' ? (
                                <AdminDashboard />
                            ) : user?.role === 'pantry' ? (
                                <PantryDashboard />
                            ) : (
                                <DeliveryDashboard />
                            )
                        }
                    />
                    <Route path="/patients" element={<PatientList />} />
                    <Route path="/patients/new" element={<PatientForm />} />
                    <Route path="/patients/edit/:id" element={<PatientForm />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default Layout; 