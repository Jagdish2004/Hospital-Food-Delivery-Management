import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
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
import ManagerDashboard from '../dashboard/ManagerDashboard';

const drawerWidth = 240;

const Layout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    console.log('Layout - Current user:', user); // Debug log

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

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
            roles: ['admin', 'manager', 'pantry', 'delivery']
        },
        {
            text: 'Patients',
            icon: <Person />,
            path: '/patients',
            roles: ['admin', 'manager']
        },
        {
            text: 'Diet Charts',
            icon: <Restaurant />,
            path: '/diet-charts',
            roles: ['admin', 'manager', 'pantry']
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

    const getDashboardComponent = () => {
        console.log('Getting dashboard for role:', user?.role); // Debug log
        
        if (!user) {
            return <Navigate to="/login" />;
        }

        switch (user.role) {
            case 'admin':
                return <AdminDashboard />;
            case 'manager':
                return <ManagerDashboard />;
            case 'pantry':
                return <PantryDashboard />;
            case 'delivery':
                return <DeliveryDashboard />;
            default:
                console.log('No matching role found, redirecting to login'); // Debug log
                return <Navigate to="/login" />;
        }
    };

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
                        element={getDashboardComponent()}
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