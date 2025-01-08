import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Chip,
    Button
} from '@mui/material';
import {
    Person,
    Restaurant,
    LocalShipping,
    Assessment,
    Warning
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../services/api';
import { toast } from 'react-toastify';

const StatCard = ({ title, value, icon, color }) => (
    <Card>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {icon}
                <Typography variant="h6" sx={{ ml: 1 }}>
                    {title}
                </Typography>
            </Box>
            <Typography variant="h3" color={color}>
                {value}
            </Typography>
        </CardContent>
    </Card>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
        const interval = setInterval(fetchDashboardStats, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await getDashboardStats();
            setStats(response.data);
        } catch (error) {
            toast.error('Error fetching dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>

            {/* Quick Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={3}>
                    <StatCard
                        title="Active Patients"
                        value={stats?.activePatients || 0}
                        icon={<Person color="primary" />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard
                        title="Today's Meals"
                        value={stats?.todayMeals || 0}
                        icon={<Restaurant color="secondary" />}
                        color="secondary"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard
                        title="Pending Deliveries"
                        value={stats?.pendingDeliveries || 0}
                        icon={<LocalShipping color="warning" />}
                        color="warning.main"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard
                        title="Completed Today"
                        value={stats?.completedDeliveries || 0}
                        icon={<Assessment color="success" />}
                        color="success.main"
                    />
                </Grid>
            </Grid>

            {/* Alerts and Notifications */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Alerts
                        </Typography>
                        <List>
                            {stats?.alerts?.map((alert, index) => (
                                <ListItem key={index}>
                                    <Warning color="error" sx={{ mr: 1 }} />
                                    <ListItemText
                                        primary={alert.message}
                                        secondary={new Date(alert.timestamp).toLocaleString()}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Recent Activities */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Activities
                        </Typography>
                        <List>
                            {stats?.recentActivities?.map((activity, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={activity.description}
                                        secondary={new Date(activity.timestamp).toLocaleString()}
                                    />
                                    <Chip
                                        label={activity.type}
                                        size="small"
                                        color={activity.type === 'delivery' ? 'primary' : 'secondary'}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Actions
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/patients/new')}
                            >
                                Add New Patient
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/diet-charts/new')}
                            >
                                Create Diet Chart
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/reports')}
                            >
                                View Reports
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard; 