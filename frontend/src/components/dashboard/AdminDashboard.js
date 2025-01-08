import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Box
} from '@mui/material';
import { Person, Restaurant, LocalShipping } from '@mui/icons-material';
import { getPatients } from '../../services/api';

const StatCard = ({ title, value, icon }) => (
    <Card>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {icon}
                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                    {title}
                </Typography>
            </Box>
            <Typography variant="h4">{value}</Typography>
        </CardContent>
    </Card>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        activeDietCharts: 0,
        pendingDeliveries: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const patientsResponse = await getPatients();
                setStats(prev => ({
                    ...prev,
                    totalPatients: patientsResponse.data.length
                }));
                // Add more API calls for other stats
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Total Patients"
                        value={stats.totalPatients}
                        icon={<Person color="primary" />}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Active Diet Charts"
                        value={stats.activeDietCharts}
                        icon={<Restaurant color="primary" />}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard
                        title="Pending Deliveries"
                        value={stats.pendingDeliveries}
                        icon={<LocalShipping color="primary" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Activities
                        </Typography>
                        {/* Add activity list component here */}
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default AdminDashboard; 