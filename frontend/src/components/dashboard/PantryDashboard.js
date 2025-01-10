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
    Divider
} from '@mui/material';
import {
    Kitchen as KitchenIcon,
    RestaurantMenu as MenuIcon,
    Schedule as ScheduleIcon,
    Person as PersonIcon,
    Room as RoomIcon
} from '@mui/icons-material';
import { getMyPantryTasks, updateTaskStatus } from '../../services/api';
import { toast } from 'react-toastify';

const PantryDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

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
            console.log('Fetched tasks:', response.data);
            setTasks(response.data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to fetch tasks');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, { status: newStatus });
            toast.success(`Task marked as ${newStatus}`);
            fetchTasks();
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
                {/* Header */}
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
                            <Typography variant="h4">Kitchen Dashboard</Typography>
                            <Typography variant="subtitle1">
                                Manage meal preparation tasks
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

                {/* Task List */}
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        My Tasks
                    </Typography>
                    <Grid container spacing={3}>
                        {tasks.map((task) => (
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
                                        <Typography variant="body1" gutterBottom>
                                            <strong>Meal:</strong> {task.mealType}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            <strong>Time:</strong> {task.scheduledTime}
                                        </Typography>
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
                        ))}
                        {tasks.length === 0 && (
                            <Grid item xs={12}>
                                <Typography variant="body1" color="textSecondary" textAlign="center">
                                    No tasks assigned
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
};

export default PantryDashboard; 