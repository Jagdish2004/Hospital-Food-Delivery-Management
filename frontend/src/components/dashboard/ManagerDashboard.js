import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Chip,
    CircularProgress,
    Divider,
    Avatar,
    LinearProgress,
    Container,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Restaurant as RestaurantIcon,
    Person as PersonIcon,
    Kitchen as KitchenIcon,
    LocalShipping as DeliveryIcon,
    TrendingUp as TrendingIcon,
    Assignment as TaskIcon,
    Group as StaffIcon,
    Pending as PendingIcon,
    Room as RoomIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    LocalHospital as PatientIcon,
    Restaurant as DietIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getManagerStats, getPantryTasks } from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import AssignTaskForm from '../manager/AssignTaskForm';
import { managerService } from '../../services/managerService';
import { 
    PieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer,
    Tooltip,
    Legend 
} from 'recharts';

const COLORS = {
    pending: '#ffc107',    // warning
    preparing: '#2196f3',  // primary
    ready: '#ff9800',      // orange
    in_transit: '#03a9f4', // light blue
    delivered: '#4caf50',  // success
};

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        stats: {
            patientCount: 0,
            dietChartCount: 0,
            pantryStaffCount: 0,
            deliveryStaffCount: 0,
            deliveredCount: 0
        },
        recentPatients: [],
        recentDietCharts: [],
        recentDeliveries: []
    });
    const [tasks, setTasks] = useState([]);
    const [openAssignTask, setOpenAssignTask] = useState(false);
    const [selectedDietChart, setSelectedDietChart] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [pantryStaff, setPantryStaff] = useState([]);
    const [loadingStaff, setLoadingStaff] = useState(true);
    const [deliveryStats, setDeliveryStats] = useState({
        ready: 0,
        inTransit: 0,
        delivered: 0
    });
    const [activeDeliveries, setActiveDeliveries] = useState([]);
    const [taskOverview, setTaskOverview] = useState({
        pending: 0,
        preparing: 0,
        ready: 0,
        inTransit: 0,
        delivered: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        const fetchManagerData = async () => {
            try {
                const [staffData, deliveryData] = await Promise.all([
                    managerService.getPantryStaffList(),
                    managerService.getDeliveryStats()
                ]);
                
                setPantryStaff(staffData);
                setDeliveryStats(deliveryData);
            } catch (error) {
                console.error('Error fetching manager data:', error);
                toast.error('Failed to fetch dashboard data');
            } finally {
                setLoadingStaff(false);
            }
        };

        fetchManagerData();
        const interval = setInterval(fetchManagerData, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [deliveries, overview] = await Promise.all([
                    managerService.getActiveDeliveries(),
                    managerService.getTaskOverview()
                ]);
                
                setActiveDeliveries(deliveries);
                setTaskOverview(overview);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('Failed to fetch dashboard data');
            }
        };

        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await getManagerStats();
            setDashboardData(response);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await getPantryTasks();
            console.log('Fetched tasks:', response); // Debug log
            
            if (response.success) {
                setTasks(response.data);
            } else {
                toast.error(response.error || 'Failed to fetch tasks');
                setTasks([]);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to fetch tasks');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignTask = (chart, meal) => {
        setSelectedDietChart(chart);
        setSelectedMeal(meal);
        setOpenAssignTask(true);
    };

    const getTaskChartData = () => {
        return [
            { name: 'Pending', value: taskOverview.pending },
            { name: 'Preparing', value: taskOverview.preparing },
            { name: 'Ready', value: taskOverview.ready },
            { name: 'In Transit', value: taskOverview.inTransit },
            { name: 'Delivered', value: taskOverview.delivered }
        ].filter(item => item.value > 0);
    };

    const getDeliveryChartData = () => {
        if (!deliveryStats) return [];
        
        return [
            { name: 'Ready', value: deliveryStats.ready || 0 },
            { name: 'In Transit', value: deliveryStats.inTransit || 0 },
            { name: 'Delivered', value: deliveryStats.delivered || 0 }
        ].filter(item => item.value > 0);
    };

    const handleAssignTaskSuccess = async () => {
        try {
            await fetchTasks(); // Refresh tasks
            setOpenAssignTask(false); // Close the dialog
            setSelectedDietChart(null); // Reset selected diet chart
            setSelectedMeal(null); // Reset selected meal
            
            // Remove the assigned meal from the recent diet charts
            const updatedDietCharts = dashboardData.recentDietCharts.map(chart => {
                if (chart._id === selectedDietChart._id) {
                    return {
                        ...chart,
                        meals: chart.meals.filter(meal => 
                            meal.type !== selectedMeal.type || 
                            meal.time !== selectedMeal.time
                        )
                    };
                }
                return chart;
            });

            setDashboardData(prev => ({
                ...prev,
                recentDietCharts: updatedDietCharts
            }));

        } catch (error) {
            console.error('Error refreshing data:', error);
            toast.error('Failed to refresh data');
        }
    };

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
                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                        color: 'white'
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h4">Manager Dashboard</Typography>
                            <Typography variant="subtitle1">
                                Overview and Analytics
                            </Typography>
                        </Box>
                        <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                startIcon={<PersonIcon />}
                                onClick={() => navigate('/patients/new')}
                                sx={{ bgcolor: 'white', color: '#1976d2' }}
                            >
                                Add Patient
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<DietIcon />}
                                onClick={() => navigate('/diet-charts/new')}
                                sx={{ bgcolor: 'white', color: '#1976d2' }}
                            >
                                Create Diet Chart
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {/* Quick Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <PatientIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                <Typography variant="h4" color="primary">
                                    {dashboardData.stats.patientCount}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Total Patients
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <DietIcon sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
                                <Typography variant="h4" color="success.main">
                                    {dashboardData.stats.dietChartCount}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Active Diet Charts
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <KitchenIcon sx={{ fontSize: 40, color: '#ed6c02', mb: 1 }} />
                                <Typography variant="h4" color="warning.main">
                                    {dashboardData.stats.pantryStaffCount}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Pantry Staff
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <DeliveryIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
                                <Typography variant="h4" sx={{ color: 'secondary.main' }}>
                                    {dashboardData.stats.deliveredCount || 0}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Deliveries Today
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Analytics Section */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Task Overview */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ 
                            p: 2, 
                            height: '400px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Typography variant="h6" gutterBottom>
                                Task Overview
                            </Typography>
                            <Box sx={{ 
                                flex: 1,
                                width: '100%',
                                minHeight: 300
                            }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={getTaskChartData()}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {getTaskChartData().map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={COLORS[entry.name.toLowerCase().replace(' ', '_')] || '#000'} 
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Delivery Analytics */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ 
                            p: 2, 
                            height: '400px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Typography variant="h6" gutterBottom>
                                Delivery Analytics
                            </Typography>
                            <Box sx={{ 
                                flex: 1,
                                width: '100%',
                                minHeight: 300
                            }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={getDeliveryChartData()}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            <Cell fill={COLORS.ready} />
                                            <Cell fill={COLORS.in_transit} />
                                            <Cell fill={COLORS.delivered} />
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Staff and Task Management Section */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Pending Deliveries */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Pending Deliveries
                            </Typography>
                            <Box sx={{ 
                                maxHeight: '400px', 
                                overflowY: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '8px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: '#f1f1f1',
                                    borderRadius: '4px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: '#888',
                                    borderRadius: '4px',
                                },
                                '&::-webkit-scrollbar-thumb:hover': {
                                    background: '#555',
                                }
                            }}>
                                <List>
                                    {tasks
                                        .filter(task => task.status === 'pending')
                                        .map((task) => (
                                            <ListItem 
                                                key={task._id}
                                                sx={{ 
                                                    mb: 1,
                                                    bgcolor: 'grey.50',
                                                    borderRadius: 1,
                                                    border: '1px solid',
                                                    borderColor: 'grey.200'
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                                                        <PendingIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Typography variant="subtitle2">
                                                                {task.dietChart?.patient?.name || 'Unknown Patient'}
                                                            </Typography>
                                                            <Chip 
                                                                label="Pending"
                                                                color="warning"
                                                                size="small"
                                                            />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                                                <RoomIcon fontSize="small" color="action" />
                                                                <Typography component="span" variant="body2">
                                                                    Room: {task.dietChart?.patient?.roomNumber || 'N/A'}
                                                                </Typography>
                                                            </Box>
                                                            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                                                <RestaurantIcon fontSize="small" color="action" />
                                                                <Typography component="span" variant="body2">
                                                                    {task.mealType} - {new Date(task.scheduledTime).toLocaleTimeString([], { 
                                                                        hour: '2-digit', 
                                                                        minute: '2-digit' 
                                                                    })}
                                                                </Typography>
                                                            </Box>
                                                            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                                                <PersonIcon fontSize="small" color="action" />
                                                                <Typography component="span" variant="body2">
                                                                    Assigned to: {task.assignedTo?.name || 'Not assigned'}
                                                                </Typography>
                                                            </Box>
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    {tasks.filter(task => task.status === 'pending').length === 0 && (
                                        <Box 
                                            display="flex" 
                                            flexDirection="column" 
                                            alignItems="center" 
                                            py={3}
                                            color="text.secondary"
                                        >
                                            <PendingIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                                            <Typography>No pending tasks</Typography>
                                        </Box>
                                    )}
                                </List>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Active Deliveries */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Active Deliveries
                            </Typography>
                            <Box sx={{ 
                                maxHeight: '400px', 
                                overflowY: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '8px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: '#f1f1f1',
                                    borderRadius: '4px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: '#888',
                                    borderRadius: '4px',
                                },
                                '&::-webkit-scrollbar-thumb:hover': {
                                    background: '#555',
                                }
                            }}>
                                <List>
                                    {activeDeliveries.map((delivery) => (
                                        <ListItem 
                                            key={delivery._id}
                                            sx={{ 
                                                mb: 1,
                                                bgcolor: 'grey.50',
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'grey.200'
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <DeliveryIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={delivery.dietChart?.patient?.name}
                                                secondary={
                                                    <>
                                                        <Typography component="span" variant="body2">
                                                            Room: {delivery.dietChart?.patient?.roomNumber}
                                                        </Typography>
                                                        <br />
                                                        <Typography component="span" variant="body2">
                                                            Delivery Person: {delivery.deliveryPerson?.name}
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                            <Chip 
                                                label="In Transit"
                                                color="info"
                                                size="small"
                                            />
                                        </ListItem>
                                    ))}
                                    {activeDeliveries.length === 0 && (
                                        <Box 
                                            display="flex" 
                                            flexDirection="column" 
                                            alignItems="center" 
                                            py={3}
                                            color="text.secondary"
                                        >
                                            <DeliveryIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                                            <Typography>No active deliveries</Typography>
                                        </Box>
                                    )}
                                </List>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Recent Activity Section */}
                <Grid container spacing={3}>
                    {/* Recent Patients */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Recent Patients
                            </Typography>
                            {dashboardData.recentPatients.map((patient) => (
                                <Box 
                                    key={patient._id} 
                                    sx={{ 
                                        mb: 2, 
                                        p: 1.5, 
                                        borderRadius: 1,
                                        bgcolor: 'grey.50'
                                    }}
                                >
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            {patient.name[0]}
                                        </Avatar>
                                        <Box flex={1}>
                                            <Typography variant="subtitle1">
                                                {patient.name}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Room: {patient.roomNumber}
                                            </Typography>
                                        </Box>
                                        <IconButton 
                                            size="small"
                                            onClick={() => navigate(`/patients/view/${patient._id}`)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                        </Paper>
                    </Grid>

                    {/* Recent Diet Charts */}
                    <Grid item xs={12} md={6}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6" color="primary">
                                        Recent Diet Charts
                                    </Typography>
                                    <Button 
                                        size="small" 
                                        onClick={() => navigate('/diet-charts')}
                                        endIcon={<TrendingIcon />}
                                    >
                                        View All
                                    </Button>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                {dashboardData.recentDietCharts.map((chart) => (
                                    <Box 
                                        key={chart._id} 
                                        sx={{ 
                                            mb: 2, 
                                            p: 1.5, 
                                            borderRadius: 1,
                                            bgcolor: 'grey.50'
                                        }}
                                    >
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Avatar sx={{ bgcolor: 'success.main' }}>
                                                <DietIcon />
                                            </Avatar>
                                            <Box flex={1}>
                                                <Typography variant="subtitle1">
                                                    {chart.patient?.name || 'N/A'}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Created: {new Date(chart.createdAt).toLocaleDateString()}
                                                </Typography>
                                                <Box mt={1}>
                                                    {chart.meals?.map((meal, index) => (
                                                        <Box 
                                                            key={index}
                                                            display="flex" 
                                                            alignItems="center" 
                                                            justifyContent="space-between"
                                                            mt={1}
                                                        >
                                                            <Typography variant="body2">
                                                                {meal.type} - {meal.time}
                                                            </Typography>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() => handleAssignTask(chart, meal)}
                                                            >
                                                                Assign Task
                                                            </Button>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </Box>
                                            <IconButton 
                                                size="small"
                                                onClick={() => navigate(`/diet-charts/view/${chart._id}`)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>

                        <AssignTaskForm
                            open={openAssignTask}
                            onClose={() => setOpenAssignTask(false)}
                            dietChart={selectedDietChart}
                            meal={selectedMeal}
                            onSuccess={handleAssignTaskSuccess}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default ManagerDashboard; 