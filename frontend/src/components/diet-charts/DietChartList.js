import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
    Box,
    Chip,
    IconButton
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { getDietCharts } from '../../services/api';
import { toast } from 'react-toastify';

const DietChartList = () => {
    const [dietCharts, setDietCharts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'completed':
                return 'default';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Diet Charts</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/diet-charts/new')}
                >
                    Create Diet Chart
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Patient</TableCell>
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
                                <TableCell>{chart.patient.name}</TableCell>
                                <TableCell>
                                    {`${chart.patient.roomNumber} (Bed ${chart.patient.bedNumber})`}
                                </TableCell>
                                <TableCell>
                                    {new Date(chart.startDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {new Date(chart.endDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={chart.status}
                                        color={getStatusColor(chart.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => navigate(`/diet-charts/${chart._id}`)}
                                    >
                                        <ViewIcon />
                                    </IconButton>
                                    <IconButton
                                        color="primary"
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
        </div>
    );
};

export default DietChartList; 