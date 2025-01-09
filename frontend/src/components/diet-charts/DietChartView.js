import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Button,
    Divider,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from '@mui/material';
import { getDietChartById, deleteDietChart } from '../../services/api';
import { toast } from 'react-toastify';

const DietChartView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [dietChart, setDietChart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

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

    const handleDelete = async () => {
        try {
            await deleteDietChart(id);
            toast.success('Diet chart deleted successfully');
            navigate('/diet-charts');
        } catch (error) {
            toast.error('Error deleting diet chart');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" m={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (!dietChart) {
        return (
            <Box p={3}>
                <Typography>Diet chart not found</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5">Diet Chart Details</Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/diet-charts')}
                    >
                        Back to List
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {/* Patient Information */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>Patient Information</Typography>
                        <List>
                            <ListItem>
                                <ListItemText 
                                    primary="Patient Name" 
                                    secondary={dietChart.patient?.name} 
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="Room Number" 
                                    secondary={dietChart.patient?.roomNumber} 
                                />
                            </ListItem>
                        </List>
                    </Grid>

                    {/* Diet Chart Details */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" gutterBottom>Chart Details</Typography>
                        <List>
                            <ListItem>
                                <ListItemText 
                                    primary="Start Date" 
                                    secondary={new Date(dietChart.startDate).toLocaleDateString()} 
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="End Date" 
                                    secondary={new Date(dietChart.endDate).toLocaleDateString()} 
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="Status" 
                                    secondary={
                                        <Chip 
                                            label={dietChart.status}
                                            color={dietChart.status === 'active' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    }
                                />
                            </ListItem>
                        </List>
                    </Grid>

                    {/* Meals */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" gutterBottom>Meals</Typography>
                        <List>
                            {dietChart.meals.map((meal, index) => (
                                <React.Fragment key={meal._id || index}>
                                    <ListItem>
                                        <ListItemText
                                            primary={`${meal.type} - ${meal.time}`}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2">
                                                        Items: {meal.items}
                                                    </Typography>
                                                    <br />
                                                    <Typography component="span" variant="body2">
                                                        Calories: {meal.calories || 'Not specified'}
                                                    </Typography>
                                                    {meal.specialInstructions && (
                                                        <>
                                                            <br />
                                                            <Typography component="span" variant="body2">
                                                                Special Instructions: {meal.specialInstructions}
                                                            </Typography>
                                                        </>
                                                    )}
                                                </>
                                            }
                                        />
                                        <Chip 
                                            label={meal.status}
                                            color={meal.status === 'delivered' ? 'success' : 'default'}
                                            size="small"
                                            sx={{ ml: 2 }}
                                        />
                                    </ListItem>
                                    {index < dietChart.meals.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Grid>

                    {/* Special Instructions */}
                    {dietChart.specialInstructions && (
                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" gutterBottom>Special Instructions</Typography>
                            <Typography variant="body1">
                                {dietChart.specialInstructions}
                            </Typography>
                        </Grid>
                    )}

                    {/* Actions */}
                    <Grid item xs={12}>
                        <Box display="flex" gap={2} justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                onClick={() => navigate(`/diet-charts/edit/${dietChart._id}`)}
                            >
                                Edit Diet Chart
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setOpenDialog(true)}
                            >
                                Delete Diet Chart
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                {/* Confirmation Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this diet chart? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={handleDelete} color="error" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Container>
    );
};

export default DietChartView; 