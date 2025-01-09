import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress
} from '@mui/material';
import { getDeliveryTasks } from '../../services/api';

const DeliveryManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
        // Refresh tasks every minute
        const interval = setInterval(fetchTasks, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await getDeliveryTasks();
            // Safely handle the response data
            const deliveredTasks = response?.data?.filter(task => task?.status === 'delivered') || [];
            setTasks(deliveredTasks);
        } catch (error) {
            // Silently handle error by setting empty array
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    // Get today's delivered count
    const getDeliveredToday = () => {
        if (!tasks || tasks.length === 0) return 0;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return tasks.filter(task => {
            if (!task.deliveryCompletionTime) return false;
            const deliveryTime = new Date(task.deliveryCompletionTime);
            return deliveryTime >= today;
        }).length;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" m={3}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box p={3}>
                <Typography variant="h5" gutterBottom>
                    Delivery Tracking
                </Typography>

                {/* Summary Card */}
                <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Delivered Today</Typography>
                            <Typography variant="h4">
                                {getDeliveredToday()}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Delivered Tasks Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Patient</TableCell>
                                <TableCell>Room</TableCell>
                                <TableCell>Meal Type</TableCell>
                                <TableCell>Delivery Time</TableCell>
                                <TableCell>Delivered By</TableCell>
                                <TableCell>Notes</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <TableRow key={task._id}>
                                        <TableCell>
                                            {task.dietChart?.patient?.name || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {task.dietChart?.patient?.roomNumber || '-'}
                                        </TableCell>
                                        <TableCell>{task.mealType || '-'}</TableCell>
                                        <TableCell>
                                            {task.deliveryCompletionTime 
                                                ? new Date(task.deliveryCompletionTime).toLocaleString()
                                                : '-'
                                            }
                                        </TableCell>
                                        <TableCell>{task.deliveryPerson?.name || '-'}</TableCell>
                                        <TableCell>{task.deliveryNotes || '-'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="textSecondary">
                                            No deliveries to display
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default DeliveryManagement; 