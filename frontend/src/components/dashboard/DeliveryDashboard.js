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
    Chip,
    CircularProgress,
    Divider,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';
import {
    LocalShipping as DeliveryIcon,
    CheckCircle as CompletedIcon,
    DirectionsBike as BikeIcon,
    Schedule as PendingIcon,
    TrendingUp as TrendingIcon,
    Person as PersonIcon,
    Room as RoomIcon,
    Restaurant as MealIcon
} from '@mui/icons-material';
import { getDeliveryTasks, updateDeliveryStatus } from '../../services/api';
import { toast } from 'react-toastify';

const DeliveryDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await getDeliveryTasks();
            setTasks(response.data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, status) => {
        try {
            await updateDeliveryStatus(taskId, status);
            toast.success('Delivery status updated');
            fetchTasks();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getTaskCounts = () => {
        return {
            pending: tasks.filter(t => t.status === 'ready').length,
            inProgress: tasks.filter(t => t.status === 'out_for_delivery').length,
            completed: tasks.filter(t => t.status === 'delivered').length,
            total: tasks.length
        };
    };

    const counts = getTaskCounts();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box p={3}>
                {/* Header Section */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3, 
                        mb: 4, 
                        background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                        color: 'white'
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={2}>
                            <DeliveryIcon sx={{ fontSize: 40 }} />
                            <Box>
                                <Typography variant="h4">Delivery Dashboard</Typography>
                                <Typography variant="subtitle1">
                                    Track and manage your delivery tasks
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<TrendingIcon />}
                            onClick={fetchTasks}
                            sx={{ 
                                bgcolor: 'white', 
                                color: '#1565c0',
                                '&:hover': {
                                    bgcolor: '#e3f2fd',
                                }
                            }}
                        >
                            Refresh Tasks
                        </Button>
                    </Box>
                </Paper>

                {/* Stats Section */}
                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <PendingIcon sx={{ fontSize: 40, color: '#1565c0', mb: 1 }} />
                                <Typography variant="h4" color="primary">
                                    {counts.pending}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Pending Deliveries
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <BikeIcon sx={{ fontSize: 40, color: '#ed6c02', mb: 1 }} />
                                <Typography variant="h4" color="warning.main">
                                    {counts.inProgress}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    In Progress
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <CompletedIcon sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
                                <Typography variant="h4" color="success.main">
                                    {counts.completed}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Completed Today
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <DeliveryIcon sx={{ fontSize: 40, color: '#0288d1', mb: 1 }} />
                                <Typography variant="h4" color="info.main">
                                    {counts.total}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Total Tasks
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Active Deliveries */}
                <Paper elevation={3} sx={{ mb: 4, p: 3 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                        Active Deliveries
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        {tasks.filter(task => task.status !== 'delivered').map((task) => (
                            <ListItem
                                key={task._id}
                                sx={{
                                    mb: 2,
                                    bgcolor: 'grey.50',
                                    borderRadius: 1,
                                    '&:hover': {
                                        bgcolor: 'grey.100',
                                    }
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="subtitle1">
                                                {task.dietChart?.patient?.name}
                                            </Typography>
                                            <Chip
                                                size="small"
                                                icon={<RoomIcon />}
                                                label={`Room ${task.dietChart?.patient?.roomNumber}`}
                                            />
                                            <Chip
                                                size="small"
                                                icon={<MealIcon />}
                                                label={task.mealType}
                                            />
                                        </Box>
                                    }
                                    secondary={`Scheduled Time: ${task.scheduledTime}`}
                                />
                                <ListItemSecondaryAction>
                                    {task.status === 'ready' && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            startIcon={<BikeIcon />}
                                            onClick={() => handleStatusUpdate(task._id, 'out_for_delivery')}
                                        >
                                            Start Delivery
                                        </Button>
                                    )}
                                    {task.status === 'out_for_delivery' && (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            startIcon={<CompletedIcon />}
                                            onClick={() => handleStatusUpdate(task._id, 'delivered')}
                                        >
                                            Mark Delivered
                                        </Button>
                                    )}
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                        {tasks.filter(task => task.status !== 'delivered').length === 0 && (
                            <Box textAlign="center" py={3}>
                                <DeliveryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                <Typography color="textSecondary">
                                    No active deliveries at the moment
                                </Typography>
                            </Box>
                        )}
                    </List>
                </Paper>
            </Box>
        </Container>
    );
};

export default DeliveryDashboard; 