import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Chip,
    Divider,
    Tabs,
    Tab
} from '@mui/material';
import {
    Kitchen as KitchenIcon,
    RestaurantMenu as MenuIcon,
    Schedule as ScheduleIcon,
    Person as PersonIcon,
    Room as RoomIcon,
    LocalDining as DiningIcon
} from '@mui/icons-material';
import { getMyPantryTasks, updateTaskStatus } from '../../services/api';
import { toast } from 'react-toastify';

const PantryDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchTasks();
        // Refresh tasks every minute
        const interval = setInterval(fetchTasks, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await getMyPantryTasks();
            console.log('Fetched tasks:', response.data); // Debug log
            setTasks(response.data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to fetch tasks');
            setTasks([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, { status: newStatus });
            toast.success(`Task marked as ${newStatus}`);
            fetchTasks(); // Refresh the task list
        } catch (error) {
            console.error('Error updating task status:', error);
            toast.error('Failed to update task status');
        }
    };

    const getStatusChipColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'preparing': return 'info';
            case 'ready': return 'success';
            default: return 'default';
        }
    };

    const renderTaskCard = (task) => (
        <Grid item xs={12} md={6} lg={4} key={task._id}>
            <Card elevation={2}>
                <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <PersonIcon color="primary" />
                        <Typography variant="h6">
                            {task.dietChart?.patient?.name}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <RoomIcon color="action" />
                        <Typography color="textSecondary">
                            Room {task.dietChart?.patient?.roomNumber}
                        </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <DiningIcon color="primary" />
                        <Typography variant="body1">
                            {task.mealType}
                        </Typography>
                    </Box>
                    <Typography variant="body2" gutterBottom>
                        <strong>Scheduled:</strong> {task.scheduledTime}
                    </Typography>
                    {task.specialInstructions && (
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            <strong>Instructions:</strong> {task.specialInstructions}
                        </Typography>
                    )}
                    <Box mt={2}>
                        <Chip 
                            label={task.status.toUpperCase()}
                            color={getStatusChipColor(task.status)}
                            sx={{ mb: 2 }}
                        />
                        {task.status === 'pending' && (
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => handleStatusUpdate(task._id, 'preparing')}
                            >
                                Start Preparation
                            </Button>
                        )}
                        {task.status === 'preparing' && (
                            <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                onClick={() => handleStatusUpdate(task._id, 'ready')}
                            >
                                Mark as Ready
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    // Filter tasks by status
    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const preparingTasks = tasks.filter(task => task.status === 'preparing');
    const readyTasks = tasks.filter(task => task.status === 'ready');

    return (
        <Container maxWidth="lg">
            <Box p={3}>
                {/* Dashboard Header */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3, 
                        mb: 4, 
                        background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                        color: 'white'
                    }}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <KitchenIcon sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h4">Kitchen Tasks</Typography>
                            <Typography variant="subtitle1">
                                View and manage meal preparation tasks
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Task Statistics */}
                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} md={4}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <MenuIcon sx={{ fontSize: 40, color: '#f57c00', mb: 1 }} />
                                <Typography variant="h4" color="warning.main">
                                    {pendingTasks.length}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Pending Tasks
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <KitchenIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                <Typography variant="h4" color="primary.main">
                                    {preparingTasks.length}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    In Preparation
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <ScheduleIcon sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
                                <Typography variant="h4" color="success.main">
                                    {readyTasks.length}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Ready for Delivery
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Task Tabs */}
                <Paper elevation={3} sx={{ mb: 3 }}>
                    <Tabs
                        value={tabValue}
                        onChange={(e, newValue) => setTabValue(newValue)}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label={`Pending (${pendingTasks.length})`} />
                        <Tab label={`In Preparation (${preparingTasks.length})`} />
                        <Tab label={`Ready (${readyTasks.length})`} />
                    </Tabs>
                </Paper>

                {/* Task Lists */}
                <Grid container spacing={3}>
                    {tabValue === 0 && pendingTasks.map(task => renderTaskCard(task))}
                    {tabValue === 1 && preparingTasks.map(task => renderTaskCard(task))}
                    {tabValue === 2 && readyTasks.map(task => renderTaskCard(task))}
                    
                    {tabValue === 0 && pendingTasks.length === 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="textSecondary" textAlign="center">
                                No pending tasks at the moment
                            </Typography>
                        </Grid>
                    )}
                    {tabValue === 1 && preparingTasks.length === 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="textSecondary" textAlign="center">
                                No tasks currently in preparation
                            </Typography>
                        </Grid>
                    )}
                    {tabValue === 2 && readyTasks.length === 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="textSecondary" textAlign="center">
                                No tasks ready for delivery
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Container>
    );
};

export default PantryDashboard; 