import React, { useState } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Tabs,
    Tab,
    Button,
    Card,
    CardContent,
    CardActions
} from '@mui/material';
import {
    Kitchen as KitchenIcon,
    LocalShipping as DeliveryIcon,
    Assignment as TaskIcon
} from '@mui/icons-material';
import MealTracker from '../pantry/MealTracker';
import { useNavigate } from 'react-router-dom';

const PantryDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const navigate = useNavigate();

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="lg">
            <Box p={3}>
                <Typography variant="h4" gutterBottom>
                    Pantry Dashboard
                </Typography>

                {/* Quick Action Cards */}
                <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Meal Preparation
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Track and manage meal preparation tasks
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button 
                                    startIcon={<KitchenIcon />}
                                    onClick={() => setTabValue(0)}
                                >
                                    View Tasks
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    My Assignments
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    View and manage your assigned tasks
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button 
                                    startIcon={<TaskIcon />}
                                    onClick={() => setTabValue(1)}
                                >
                                    View My Tasks
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Delivery Management
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Coordinate with delivery staff
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button 
                                    startIcon={<DeliveryIcon />}
                                    onClick={() => navigate('/delivery-management')}
                                >
                                    Manage Deliveries
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>

                {/* Task Management Section */}
                <Paper sx={{ mb: 3 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="All Tasks" />
                        <Tab label="My Tasks" />
                    </Tabs>
                </Paper>

                {tabValue === 0 && <MealTracker showAllTasks />}
                {tabValue === 1 && <MealTracker showMyTasks />}
            </Box>
        </Container>
    );
};

export default PantryDashboard; 