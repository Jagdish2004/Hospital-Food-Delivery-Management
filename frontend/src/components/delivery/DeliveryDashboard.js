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
    LocalShipping as DeliveryIcon,
    RestaurantMenu as MenuIcon,
    Schedule as ScheduleIcon,
    Person as PersonIcon,
    Room as RoomIcon
} from '@mui/icons-material';
import { deliveryService } from '../../services/deliveryService';
import { toast } from 'react-toastify';

const DeliveryDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await deliveryService.getMyTasks();
            console.log('Fetched tasks:', response.data);
            setTasks(response.data || []);
        } catch (error) {
            console.error('Error fetching delivery tasks:', error);
            toast.error('Failed to fetch tasks');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            console.log('Updating status:', { taskId, newStatus }); // Debug log
            
            if (!taskId) {
                toast.error('Invalid task ID');
                return;
            }

            await deliveryService.updateStatus(taskId, newStatus);
            toast.success(`Task marked as ${newStatus}`);
            await fetchTasks(); // Refresh the task list
        } catch (error) {
            console.error('Error updating task status:', error);
            // Error toast is handled in the service
        }
    };

    const getStatusChipColor = (status) => {
        switch (status) {
            case 'ready': return 'warning';
            case 'in_transit': return 'info';
            case 'delivered': return 'success';
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
    const readyTasks = tasks.filter(task => task.status === 'ready');
    const inTransitTasks = tasks.filter(task => task.status === 'in_transit');
    const deliveredTasks = tasks.filter(task => task.status === 'delivered');

    return (
        <Container maxWidth="lg">
            <Box p={3}>
                {/* Header */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3, 
                        mb: 4, 
                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                        color: 'white'
                    }}
                >
                    <Box display="flex" alignItems="center" gap={2}>
                        <DeliveryIcon sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h4">Delivery Dashboard</Typography>
                            <Typography variant="subtitle1">
                                Manage meal deliveries
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
                                    {readyTasks.length}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Ready for Delivery
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <DeliveryIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                <Typography variant="h4" color="primary.main">
                                    {inTransitTasks.length}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    In Transit
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <ScheduleIcon sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
                                <Typography variant="h4" color="success.main">
                                    {deliveredTasks.length}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Delivered Today
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Tabs for Task Categories */}
                <Paper sx={{ mb: 3 }}>
                    <Tabs
                        value={tabValue}
                        onChange={(e, newValue) => setTabValue(newValue)}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="Ready for Delivery" />
                        <Tab label="In Transit" />
                        <Tab label="Completed" />
                    </Tabs>
                </Paper>

                {/* Task Lists */}
                <Grid container spacing={3}>
                    {tabValue === 0 && readyTasks.map((task) => (
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
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={() => handleStatusUpdate(task._id, 'in_transit')}
                                        >
                                            Start Delivery
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {tabValue === 1 && inTransitTasks.map((task) => (
                        <Grid item xs={12} md={6} lg={4} key={task._id}>
                            <Card elevation={2}>
                                <CardContent>
                                    {/* Same task details as above */}
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
                                        <Button
                                            variant="contained"
                                            color="success"
                                            fullWidth
                                            onClick={() => handleStatusUpdate(task._id, 'delivered')}
                                        >
                                            Mark as Delivered
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {tabValue === 2 && deliveredTasks.map((task) => (
                        <Grid item xs={12} md={6} lg={4} key={task._id}>
                            <Card elevation={2}>
                                <CardContent>
                                    {/* Same task details as above */}
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
                                            label="DELIVERED"
                                            color="success"
                                            sx={{ mb: 2 }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {tabValue === 0 && readyTasks.length === 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="textSecondary" textAlign="center">
                                No tasks ready for delivery
                            </Typography>
                        </Grid>
                    )}
                    {tabValue === 1 && inTransitTasks.length === 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="textSecondary" textAlign="center">
                                No tasks in transit
                            </Typography>
                        </Grid>
                    )}
                    {tabValue === 2 && deliveredTasks.length === 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="textSecondary" textAlign="center">
                                No completed deliveries
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Container>
    );
};

export default DeliveryDashboard; 