import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Tabs,
    Tab,
    Card,
    CardContent,
    Button,
    Divider,
    Avatar,
    IconButton,
    Chip
} from '@mui/material';
import {
    Kitchen as KitchenIcon,
    LocalShipping as DeliveryIcon,
    Assignment as TaskIcon,
    RestaurantMenu as MenuIcon,
    Schedule as ScheduleIcon,
    TrendingUp as TrendingIcon,
    Refresh as RefreshIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';
import MealTracker from './MealTracker';
import { useNavigate } from 'react-router-dom';
import { getPantryTasks } from '../../services/api';

const PantryDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const navigate = useNavigate();

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getPantryTasks();
                const tasks = response.data || [];
                
                // Update stats silently
                document.getElementById('pending-tasks').textContent = 
                    tasks.filter(t => t.status === 'pending').length || '0';
                document.getElementById('preparing-tasks').textContent = 
                    tasks.filter(t => t.status === 'preparing').length || '0';
                document.getElementById('ready-tasks').textContent = 
                    tasks.filter(t => t.status === 'ready').length || '0';
                document.getElementById('delivered-tasks').textContent = 
                    tasks.filter(t => t.status === 'delivered').length || '0';
            } catch (error) {
                // Handle error silently
                console.error('Error fetching tasks:', error);
                ['pending-tasks', 'preparing-tasks', 'ready-tasks', 'delivered-tasks'].forEach(id => {
                    document.getElementById(id).textContent = '0';
                });
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Container maxWidth="lg">
            <Box p={3}>
                {/* Header Section */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3, 
                        mb: 4, 
                        background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                        color: 'white'
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={2}>
                            <KitchenIcon sx={{ fontSize: 40 }} />
                            <Box>
                                <Typography variant="h4">Pantry Dashboard</Typography>
                                <Typography variant="subtitle1">
                                    Manage meal preparation and delivery tasks
                                </Typography>
                            </Box>
                        </Box>
                        <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                startIcon={<RefreshIcon />}
                                onClick={() => window.location.reload()}
                                sx={{ 
                                    bgcolor: 'white', 
                                    color: '#2e7d32',
                                    '&:hover': {
                                        bgcolor: '#e8f5e9',
                                    }
                                }}
                            >
                                Refresh Tasks
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<DeliveryIcon />}
                                onClick={() => navigate('/delivery-management')}
                                sx={{ 
                                    bgcolor: 'white', 
                                    color: '#2e7d32',
                                    '&:hover': {
                                        bgcolor: '#e8f5e9',
                                    }
                                }}
                            >
                                Delivery Status
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<TaskIcon />}
                                onClick={() => navigate('/meal-tasks')}
                                sx={{ 
                                    bgcolor: 'white', 
                                    color: '#2e7d32',
                                    '&:hover': {
                                        bgcolor: '#e8f5e9',
                                    }
                                }}
                            >
                                View All Tasks
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {/* Quick Stats */}
                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <MenuIcon sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
                                <Typography variant="h4" color="success.main" id="pending-tasks">
                                    0
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Pending Tasks
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <ScheduleIcon sx={{ fontSize: 40, color: '#ed6c02', mb: 1 }} />
                                <Typography variant="h4" color="warning.main" id="preparing-tasks">
                                    0
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    In Preparation
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <TaskIcon sx={{ fontSize: 40, color: '#0288d1', mb: 1 }} />
                                <Typography variant="h4" color="info.main" id="ready-tasks">
                                    0
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Ready for Delivery
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <DeliveryIcon sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
                                <Typography variant="h4" color="success.main" id="delivered-tasks">
                                    0
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Delivered Today
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Task Management Section */}
                <Paper elevation={3} sx={{ mb: 3 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            sx={{
                                '& .MuiTab-root': {
                                    minHeight: '64px',
                                    fontSize: '1rem'
                                }
                            }}
                        >
                            <Tab 
                                icon={<TaskIcon />} 
                                label="All Tasks" 
                                iconPosition="start"
                            />
                            <Tab 
                                icon={<AssignmentIcon />} 
                                label="My Tasks" 
                                iconPosition="start"
                            />
                        </Tabs>
                    </Box>
                    
                    <Box sx={{ p: 2 }}>
                        {tabValue === 0 && <MealTracker showAllTasks />}
                        {tabValue === 1 && <MealTracker showMyTasks />}
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default PantryDashboard; 