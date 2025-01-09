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
    ListItemText
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Restaurant as DietIcon,
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
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getManagerStats } from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

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

    useEffect(() => {
        fetchDashboardData();
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
                                Overview of hospital food service operations
                            </Typography>
                        </Box>
                        <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                startIcon={<PersonIcon />}
                                onClick={() => navigate('/patients/new')}
                                sx={{ 
                                    bgcolor: 'white', 
                                    color: '#1976d2',
                                    '&:hover': {
                                        bgcolor: '#e3f2fd',
                                    }
                                }}
                            >
                                Add Patient
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<DietIcon />}
                                onClick={() => navigate('/diet-charts/new')}
                                sx={{ 
                                    bgcolor: 'white', 
                                    color: '#1976d2',
                                    '&:hover': {
                                        bgcolor: '#e3f2fd',
                                    }
                                }}
                            >
                                Create Diet Chart
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {/* Stats Cards */}
                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} md={3}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <PersonIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                <Typography variant="h4" color="primary">
                                    {dashboardData.stats.patientCount}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Active Patients
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

                {/* Add Pantry Staff Section */}
                <Paper elevation={3} sx={{ mb: 4 }}>
                    <Box p={2} bgcolor="primary.light" color="primary.contrastText" 
                        display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                            <StaffIcon />
                            <Typography variant="h6">Pantry Staff Management</Typography>
                        </Box>
                        <Button 
                            variant="contained" 
                            component={Link} 
                            to="/pantry-staff"
                            sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                        >
                            View All
                        </Button>
                    </Box>
                    <Divider />
                    <List>
                        {dashboardData.stats?.recentPantryStaff?.slice(0, 5).map((staff) => (
                            <ListItem
                                key={staff._id}
                                sx={{
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    '&:last-child': { borderBottom: 'none' }
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar>{staff.name[0]}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={staff.name}
                                    secondary={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="body2" component="span">
                                                {staff.email}
                                            </Typography>
                                            {staff.pantry && (
                                                <Chip
                                                    size="small"
                                                    icon={<KitchenIcon />}
                                                    label={staff.pantry.name}
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                {/* Deliveries Section */}
                <Grid container spacing={3}>
                    {/* Pending Deliveries */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3}>
                            <Box p={2} bgcolor="warning.light" color="warning.contrastText">
                                <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                                    <PendingIcon />
                                    Pending Deliveries
                                </Typography>
                            </Box>
                            <Divider />
                            <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
                                {dashboardData.recentDeliveries?.filter(delivery => 
                                    delivery.status === 'ready' || delivery.status === 'out_for_delivery'
                                ).map((delivery) => (
                                    <ListItem
                                        key={delivery._id}
                                        sx={{
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                            '&:hover': { bgcolor: 'action.hover' }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'warning.main' }}>
                                                <DeliveryIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Typography variant="subtitle1">
                                                        {delivery.dietChart?.patient?.name}
                                                    </Typography>
                                                    <Chip
                                                        size="small"
                                                        icon={<RoomIcon />}
                                                        label={`Room ${delivery.dietChart?.patient?.roomNumber}`}
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Meal: {delivery.mealType}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Status: {delivery.status === 'ready' ? 'Ready for Delivery' : 'Out for Delivery'}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                        <Chip
                                            size="small"
                                            color="warning"
                                            label={new Date(delivery.scheduledTime).toLocaleTimeString()}
                                        />
                                    </ListItem>
                                ))}
                                {!dashboardData.recentDeliveries?.some(delivery => 
                                    delivery.status === 'ready' || delivery.status === 'out_for_delivery'
                                ) && (
                                    <Box p={3} textAlign="center" color="text.secondary">
                                        <Typography>No pending deliveries</Typography>
                                    </Box>
                                )}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Recent Deliveries */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6" color="primary">
                                        Recent Deliveries
                                    </Typography>
                                    <Button 
                                        size="small" 
                                        onClick={() => navigate('/delivery-management')}
                                        endIcon={<TrendingIcon />}
                                    >
                                        View All
                                    </Button>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Grid container spacing={2}>
                                    {dashboardData.recentDeliveries?.map((delivery) => (
                                        <Grid item xs={12} md={6} key={delivery._id}>
                                            <Paper 
                                                elevation={1}
                                                sx={{ 
                                                    p: 2,
                                                    bgcolor: 'grey.50'
                                                }}
                                            >
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                                        <DeliveryIcon />
                                                    </Avatar>
                                                    <Box flex={1}>
                                                        <Typography variant="subtitle1">
                                                            {delivery.dietChart?.patient?.name || 'N/A'}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {delivery.mealType} - Room: {delivery.dietChart?.patient?.roomNumber || 'N/A'}
                                                        </Typography>
                                                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                                                            <Chip
                                                                label="Delivered"
                                                                size="small"
                                                                color="success"
                                                            />
                                                            <Typography variant="caption" color="textSecondary">
                                                                {new Date(delivery.deliveryCompletionTime).toLocaleTimeString()}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Recent Activities Section */}
                <Grid container spacing={3}>
                    {/* Recent Patients */}
                    <Grid item xs={12} md={6}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6" color="primary">
                                        Recent Patients
                                    </Typography>
                                    <Button 
                                        size="small" 
                                        onClick={() => navigate('/patients')}
                                        endIcon={<TrendingIcon />}
                                    >
                                        View All
                                    </Button>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
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
                            </CardContent>
                        </Card>
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
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default ManagerDashboard; 