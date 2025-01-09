import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    CircularProgress,
    Divider
} from '@mui/material';
import {
    Kitchen as KitchenIcon,
    LocalShipping as DeliveryIcon,
    Person as PersonIcon,
    Room as RoomIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import { getPantryTasks, updateTaskStatus } from '../../services/api';
import { toast } from 'react-toastify';

const MealTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await getPantryTasks();
            setTasks(response.data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, { status: newStatus });
            toast.success('Task status updated successfully');
            fetchTasks();
        } catch (error) {
            toast.error('Failed to update task status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'warning',
            preparing: 'info',
            ready: 'success',
            delivered: 'default'
        };
        return colors[status] || 'default';
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box p={3}>
                <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
                    <Typography variant="h4">Meal Tasks</Typography>
                    <Typography variant="subtitle1">
                        Manage and track meal preparation tasks
                    </Typography>
                </Paper>

                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : tasks.length > 0 ? (
                    <Grid container spacing={3}>
                        {tasks.map((task) => (
                            <Grid item xs={12} key={task._id}>
                                <Card elevation={3}>
                                    <CardContent>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} md={4}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <PersonIcon color="primary" />
                                                    <Typography variant="h6">
                                                        {task.dietChart?.patient?.name}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center" gap={1} mt={1}>
                                                    <RoomIcon color="action" />
                                                    <Typography variant="body2">
                                                        Room: {task.dietChart?.patient?.roomNumber}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <Box display="flex" flexDirection="column" gap={1}>
                                                    <Typography variant="subtitle2">
                                                        Meal Details:
                                                    </Typography>
                                                    {task.meals?.map((meal, index) => (
                                                        <Chip
                                                            key={index}
                                                            icon={<KitchenIcon />}
                                                            label={`${meal.type} - ${meal.items.join(', ')}`}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    ))}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                                                    <Chip
                                                        label={task.status}
                                                        color={getStatusColor(task.status)}
                                                    />
                                                    {task.status === 'pending' && (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleStatusUpdate(task._id, 'preparing')}
                                                        >
                                                            Start Preparing
                                                        </Button>
                                                    )}
                                                    {task.status === 'preparing' && (
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size="small"
                                                            onClick={() => handleStatusUpdate(task._id, 'ready')}
                                                        >
                                                            Mark as Ready
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box p={3}>
                        {/* Empty state without any message */}
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default MealTasks; 