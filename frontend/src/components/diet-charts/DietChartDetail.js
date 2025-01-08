import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Paper,
    Typography,
    Box,
    Grid,
    Chip,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import {
    Edit as EditIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { getDietChartById } from '../../services/api';
import { toast } from 'react-toastify';

const DietChartDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dietChart, setDietChart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDietChart();
    }, [id]);

    const fetchDietChart = async () => {
        try {
            const response = await getDietChartById(id);
            setDietChart(response.data);
        } catch (error) {
            toast.error('Error fetching diet chart details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!dietChart) {
        return <Typography>Diet chart not found</Typography>;
    }

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/diet-charts')}
                >
                    Back to Diet Charts
                </Button>
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/diet-charts/edit/${id}`)}
                >
                    Edit Diet Chart
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Patient Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Patient Information
                            </Typography>
                            <Typography>
                                <strong>Name:</strong> {dietChart.patient.name}
                            </Typography>
                            <Typography>
                                <strong>Room:</strong> {dietChart.patient.roomNumber}
                            </Typography>
                            <Typography>
                                <strong>Bed:</strong> {dietChart.patient.bedNumber}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Diet Chart Details */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Diet Chart Details
                            </Typography>
                            <Typography>
                                <strong>Start Date:</strong> {new Date(dietChart.startDate).toLocaleDateString()}
                            </Typography>
                            <Typography>
                                <strong>End Date:</strong> {new Date(dietChart.endDate).toLocaleDateString()}
                            </Typography>
                            <Typography>
                                <strong>Status:</strong> <Chip label={dietChart.status} color="primary" size="small" />
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2">Dietary Restrictions:</Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {dietChart.restrictions.map((restriction, index) => (
                                        <Chip key={index} label={restriction} size="small" />
                                    ))}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Meals */}
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Meals
                    </Typography>
                    {dietChart.meals.map((meal, index) => (
                        <Paper key={index} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Special Instructions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {meal.items.map((item, itemIndex) => (
                                            <TableRow key={itemIndex}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{item.specialInstructions}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {meal.specialInstructions.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2">Special Instructions:</Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {meal.specialInstructions.map((instruction, i) => (
                                            <Chip key={i} label={instruction} size="small" />
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Paper>
                    ))}
                </Grid>
            </Grid>
        </Box>
    );
};

export default DietChartDetail; 