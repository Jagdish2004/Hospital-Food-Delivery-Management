import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Chip
} from '@mui/material';

const PantryDashboard = () => {
    const [pendingMeals, setPendingMeals] = useState([]);
    const [inProgress, setInProgress] = useState([]);

    useEffect(() => {
        // Fetch pending and in-progress meals
        // Add API integration here
    }, []);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Pantry Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Pending Meals
                        </Typography>
                        <List>
                            {pendingMeals.map((meal) => (
                                <ListItem key={meal.id}>
                                    <ListItemText
                                        primary={`Room ${meal.roomNumber} - ${meal.patientName}`}
                                        secondary={meal.mealType}
                                    />
                                    <Chip label="Pending" color="warning" />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            In Progress
                        </Typography>
                        <List>
                            {inProgress.map((meal) => (
                                <ListItem key={meal.id}>
                                    <ListItemText
                                        primary={`Room ${meal.roomNumber} - ${meal.patientName}`}
                                        secondary={meal.mealType}
                                    />
                                    <Chip label="In Progress" color="primary" />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default PantryDashboard; 