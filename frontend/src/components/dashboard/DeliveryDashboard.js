import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Button,
    Chip,
    Box
} from '@mui/material';
import { LocalShipping, CheckCircle } from '@mui/icons-material';

const DeliveryDashboard = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [completedDeliveries, setCompletedDeliveries] = useState([]);

    useEffect(() => {
        // Fetch assigned deliveries
        // Add API integration here
        setDeliveries([
            {
                id: 1,
                roomNumber: '301',
                patientName: 'John Doe',
                mealType: 'Lunch',
                status: 'ready'
            },
            // Add more mock data
        ]);
    }, []);

    const handleDeliveryComplete = async (deliveryId) => {
        try {
            // API call to mark delivery as complete
            const updatedDelivery = deliveries.find(d => d.id === deliveryId);
            setCompletedDeliveries([...completedDeliveries, updatedDelivery]);
            setDeliveries(deliveries.filter(d => d.id !== deliveryId));
        } catch (error) {
            console.error('Error completing delivery:', error);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Delivery Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LocalShipping color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">
                                Pending Deliveries
                            </Typography>
                        </Box>
                        <List>
                            {deliveries.map((delivery) => (
                                <ListItem key={delivery.id}>
                                    <ListItemText
                                        primary={`Room ${delivery.roomNumber} - ${delivery.patientName}`}
                                        secondary={`Meal: ${delivery.mealType}`}
                                    />
                                    <ListItemSecondaryAction>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleDeliveryComplete(delivery.id)}
                                            startIcon={<CheckCircle />}
                                        >
                                            Mark Delivered
                                        </Button>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Completed Deliveries
                        </Typography>
                        <List>
                            {completedDeliveries.map((delivery) => (
                                <ListItem key={delivery.id}>
                                    <ListItemText
                                        primary={`Room ${delivery.roomNumber} - ${delivery.patientName}`}
                                        secondary={`Meal: ${delivery.mealType}`}
                                    />
                                    <Chip
                                        label="Delivered"
                                        color="success"
                                        icon={<CheckCircle />}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default DeliveryDashboard; 