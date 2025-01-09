import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
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
    LocalShipping as DeliveryIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getPatients, getDietCharts, getDeliveryStatus, getManagerStats } from '../../services/api';
import { toast } from 'react-toastify';

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalPatients: 0,
            activeDietCharts: 0,
            pendingDeliveries: 0
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
            setError(null);
            console.log('Fetching dashboard data...');
            const response = await getManagerStats();
            console.log('Dashboard data received:', response.data);
            
            if (!response.data || !response.data.stats) {
                console.error('Invalid data structure:', response.data);
                throw new Error('Invalid data received from server');
            }

            setDashboardData(response.data);
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                request: error.request
            });
            setError(error.response?.data?.message || 'Error fetching dashboard data');
            toast.error(error.response?.data?.message || 'Error fetching dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDietChart = (patientId) => {
        navigate(`/diet-charts/new/${patientId}`);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" m={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" m={3}>
                <Typography color="error" gutterBottom>{error}</Typography>
                <Button variant="contained" onClick={fetchDashboardData}>
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Manager Dashboard
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Patients
                            </Typography>
                            <Typography variant="h3">
                                {dashboardData.stats.totalPatients}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Active Diet Charts
                            </Typography>
                            <Typography variant="h3">{dashboardData.stats.activeDietCharts}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Pending Deliveries
                            </Typography>
                            <Typography variant="h3">{dashboardData.stats.pendingDeliveries}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Patients */}
            <Paper sx={{ mb: 3, p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Recent Patients</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/patients/new')}
                    >
                        Add Patient
                    </Button>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Room</TableCell>
                                <TableCell>Bed</TableCell>
                                <TableCell>Age</TableCell>
                                <TableCell>Gender</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(dashboardData.recentPatients) && dashboardData.recentPatients.map((patient) => (
                                <TableRow key={patient._id}>
                                    <TableCell>{patient.name}</TableCell>
                                    <TableCell>{patient.roomNumber}</TableCell>
                                    <TableCell>{patient.bedNumber}</TableCell>
                                    <TableCell>{patient.age}</TableCell>
                                    <TableCell>{patient.gender}</TableCell>
                                    <TableCell>{patient.contactNumber}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => navigate(`/patients/edit/${patient._id}`)}
                                            size="small"
                                            title="Edit Patient"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        {!patient.hasDietChart && (
                                            <IconButton
                                                onClick={() => handleCreateDietChart(patient._id)}
                                                size="small"
                                                color="primary"
                                                title="Create Diet Chart"
                                            >
                                                <DietIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Recent Diet Charts */}
            <Paper sx={{ mb: 3, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Recent Diet Charts
                </Typography>
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
                                    <TableCell>{chart.patient.name}</TableCell>
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