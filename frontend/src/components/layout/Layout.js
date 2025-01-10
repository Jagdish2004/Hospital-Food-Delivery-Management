import React, { useState } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    Menu,
    MenuItem,
    useTheme,
    Collapse
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    Restaurant as DietIcon,
    Kitchen as PantryIcon,
    LocalShipping as DeliveryIcon,
    Assessment as ReportIcon,
    Settings as SettingsIcon,
    ExpandLess,
    ExpandMore,
    AccountCircle,
    Logout as LogoutIcon,
    Assignment as TaskIcon,
    Group as StaffIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const Layout = ({ children }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOpen, setMenuOpen] = useState({});

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuClick = (key) => {
        setMenuOpen(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const getMenuItems = () => {
        const menuItems = [];
        
        if (user?.role === 'manager' || user?.role === 'admin') {
            menuItems.push(
                { path: '/dashboard', icon: <DashboardIcon />, text: 'Dashboard' },
                { path: '/patients', icon: <PersonIcon />, text: 'Patients' },
                { path: '/diet-charts', icon: <DietIcon />, text: 'Diet Charts' },
                { path: '/pantry-management', icon: <PantryIcon />, text: 'Pantry Management' },
                { path: '/pantry-staff', icon: <StaffIcon />, text: 'Pantry Staff' },
                { path: '/reports', icon: <ReportIcon />, text: 'Reports' }
            );
        } else if (user?.role === 'pantry') {
            menuItems.push(
                { path: '/pantry-dashboard', icon: <DashboardIcon />, text: 'Dashboard' }
            );
        } else if (user?.role === 'delivery') {
            menuItems.push(
                { path: '/delivery-dashboard', icon: <DeliveryIcon />, text: 'Delivery Dashboard' }
            );
        }

        return menuItems;
    };

    const drawer = (
        <Box>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    {user?.name?.[0] || 'U'}
                </Avatar>
                <Box>
                    <Typography variant="subtitle1">{user?.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                        {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    </Typography>
                </Box>
            </Box>
            <Divider />
            <List>
                {getMenuItems().map((item) => (
                    item.subItems ? (
                        <React.Fragment key={item.key}>
                            <ListItem button onClick={() => handleMenuClick(item.key)}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                                {menuOpen[item.key] ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={menuOpen[item.key]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.subItems.map((subItem) => (
                                        <ListItem
                                            button
                                            key={subItem.path}
                                            onClick={() => navigate(subItem.path)}
                                            sx={{
                                                pl: 4,
                                                bgcolor: isActive(subItem.path) ? 'action.selected' : 'inherit'
                                            }}
                                        >
                                            <ListItemText primary={subItem.text} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </React.Fragment>
                    ) : (
                        <ListItem
                            button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            sx={{
                                bgcolor: isActive(item.path) ? 'action.selected' : 'inherit'
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    )
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
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
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Hospital Food Service Management
                    </Typography>
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        onClick={handleProfileMenuOpen}
                    >
                        <AccountCircle />
                    </IconButton>
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
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
                    mt: 8
                }}
            >
                {children}
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
            >
                <MenuItem onClick={handleProfileMenuClose}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default Layout; 