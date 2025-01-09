import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Restaurant as DietIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getManagerStats } from '../../services/api';
import { toast } from 'react-toastify';

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        stats: {
            patientCount: 0,
            dietChartCount: 0,
            pantryStaffCount: 0,
            deliveryStaffCount: 0
        },
        recentPatients: [],
        recentDietCharts: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await getManagerStats();
            console.log('Raw API Response:', response); // Debug log

            // Check if response has data property
            const data = response.data || response;
            console.log('Processed data:', data); // Debug log

            setDashboardData({
                stats: {
                    patientCount: data?.stats?.patientCount ?? 0,
                    dietChartCount: data?.stats?.dietChartCount ?? 0,
                    pantryStaffCount: data?.stats?.pantryStaffCount ?? 0,
                    deliveryStaffCount: data?.stats?.deliveryStaffCount ?? 0
                },
                recentPatients: data?.recentPatients ?? [],
                recentDietCharts: data?.recentDietCharts ?? []
            });
        } catch (error) {
            console.error('Dashboard Error:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" m={3}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Manager Dashboard</Typography>
                <Box display="flex" gap={2}>
                    <Button
                        variant="contained"
                        startIcon={<PersonIcon />}
                        onClick={() => navigate('/patients/new')}
                    >
                        Add Patient
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<DietIcon />}
                        onClick={() => navigate('/diet-charts/new')}
                    >
                        Create Diet Chart
                    </Button>
                </Box>
            </Box>

            {/* Statistics */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Total Patients</Typography>
                        <Typography variant="h4">{dashboardData.stats.patientCount}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Diet Charts</Typography>
                        <Typography variant="h4">{dashboardData.stats.dietChartCount}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Pantry Staff</Typography>
                        <Typography variant="h4">{dashboardData.stats.pantryStaffCount}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Delivery Staff</Typography>
                        <Typography variant="h4">{dashboardData.stats.deliveryStaffCount}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Recent Patients */}
            <Paper sx={{ mb: 3, p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Recent Patients</Typography>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/patients')}
                    >
                        View All Patients
                    </Button>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Room</TableCell>
                                <TableCell>Bed</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dashboardData.recentPatients.map((patient) => (
                                <TableRow key={patient._id}>
                                    <TableCell>{patient.name}</TableCell>
                                    <TableCell>{patient.roomNumber}</TableCell>
                                    <TableCell>{patient.bedNumber}</TableCell>
                                    <TableCell>
                                        <IconButton 
                                            onClick={() => navigate(`/patients/edit/${patient._id}`)}
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => navigate(`/diet-charts/new/${patient._id}`)}
                                            size="small"
                                            color="primary"
                                        >
                                            <DietIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Recent Diet Charts */}
            <Paper sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Recent Diet Charts</Typography>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/diet-charts')}
                    >
                        View All Diet Charts
                    </Button>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Patient</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dashboardData.recentDietCharts.map((chart) => (
                                <TableRow key={chart._id}>
                                    <TableCell>{chart.patient?.name}</TableCell>
                                    <TableCell>
                                        {new Date(chart.startDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(chart.endDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={chart.status}
                                            color={chart.status === 'active' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => navigate(`/diet-charts/edit/${chart._id}`)}
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default ManagerDashboard; 