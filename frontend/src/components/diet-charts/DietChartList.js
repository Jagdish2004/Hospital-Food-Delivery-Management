import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Box,
    Typography,
    Chip,
    CircularProgress
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getDietCharts } from '../../services/api';
import { toast } from 'react-toastify';

const DietChartList = () => {
    const navigate = useNavigate();
    const [dietCharts, setDietCharts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDietCharts();
    }, []);

    const fetchDietCharts = async () => {
        try {
            const response = await getDietCharts();
            setDietCharts(response.data);
        } catch (error) {
            toast.error('Error fetching diet charts');
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
                <Typography variant="h5">Diet Charts</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/diet-charts/new')}
                >
                    Create New Diet Chart
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Patient Name</TableCell>
                            <TableCell>Room</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dietCharts.map((chart) => (
                            <TableRow key={chart._id}>
                                <TableCell>{chart.patient?.name}</TableCell>
                                <TableCell>{chart.patient?.roomNumber}</TableCell>
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
                                        onClick={() => navigate(`/diet-charts/view/${chart._id}`)}
                                        title="View Details"
                                    >
                                        <ViewIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => navigate(`/diet-charts/edit/${chart._id}`)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DietChartList; 