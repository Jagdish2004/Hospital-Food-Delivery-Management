import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    Chip
} from '@mui/material';
import {
    Person,
    Restaurant,
    LocalShipping,
    Assessment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../services/api';

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

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [stats, setStats] = useState({
        totalPatients: 0,
        activeDietCharts: 0,
        pendingDeliveries: 0,
        staffOnDuty: 0
    });

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await getDashboardStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Manager Dashboard
            </Typography>

            {/* Stats Overview */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <StatCard
                        title="Total Patients"
                        value={stats.totalPatients}
                        icon={<Person color="primary" />}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard
                        title="Active Diet Charts"
                        value={stats.activeDietCharts}
                        icon={<Restaurant color="primary" />}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard
                        title="Pending Deliveries"
                        value={stats.pendingDeliveries}
                        icon={<LocalShipping color="primary" />}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard
                        title="Staff on Duty"
                        value={stats.staffOnDuty}
                        icon={<Person color="primary" />}
                    />
                </Grid>
            </Grid>

            {/* Quick Actions */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/patients/new')}
                    >
                        Add Patient
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/diet-charts/new')}
                    >
                        Create Diet Chart
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/staff-schedule')}
                    >
                        Manage Staff
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/reports')}
                    >
                        View Reports
                    </Button>
                </Box>
            </Paper>

            {/* Tasks and Activities */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Today's Tasks
                        </Typography>
                        <List>
                            {/* Add task list items here */}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Activities
                        </Typography>
                        <List>
                            {/* Add activity list items here */}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ManagerDashboard; 