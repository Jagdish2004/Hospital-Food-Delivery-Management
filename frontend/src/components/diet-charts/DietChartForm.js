import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Divider,
    IconButton,
    Card,
    CardContent,
    Alert,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import {
    Save as SaveIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    ArrowBack as BackIcon,
    Restaurant as DietIcon,
    Person as PatientIcon,
    Schedule as TimeIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { createDietChart, updateDietChart, getDietChartById, getPatients } from '../../services/api';
import { toast } from 'react-toastify';

const steps = ['Select Patient', 'Plan Meals', 'Review & Save'];

const initialMeal = {
    type: '',
    time: '',
    items: '',
    calories: '',
    specialInstructions: ''
};

const DietChartForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        patient: '',
        status: 'active',
        meals: [{ ...initialMeal }]
    });

    useEffect(() => {
        fetchPatients();
        if (id) {
            fetchDietChart();
        }
    }, [id]);

    const fetchPatients = async () => {
        try {
            const response = await getPatients();
            setPatients(response.data);
        } catch (error) {
            toast.error('Failed to fetch patients');
        }
    };

    const fetchDietChart = async () => {
        try {
            setLoading(true);
            const response = await getDietChartById(id);
            setFormData(response.data);
        } catch (error) {
            toast.error('Failed to fetch diet chart');
            navigate('/diet-charts');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form data
        if (!formData.patient) {
            toast.error('Please select a patient');
            return;
        }

        if (!formData.meals.length) {
            toast.error('Please add at least one meal');
            return;
        }

        // Validate each meal
        const isValidMeals = formData.meals.every(meal => 
            meal.type && meal.time && meal.items
        );

        if (!isValidMeals) {
            toast.error('Please fill in all required meal fields');
            return;
        }

        try {
            setLoading(true);
            
            // Format the data
            const dietChartData = {
                ...formData,
                meals: formData.meals.map(meal => ({
                    ...meal,
                    items: typeof meal.items === 'string' ? 
                        meal.items.split(',').map(item => item.trim()) : 
                        meal.items
                }))
            };

            if (id) {
                await updateDietChart(id, dietChartData);
                toast.success('Diet chart updated successfully');
            } else {
                await createDietChart(dietChartData);
                toast.success('Diet chart created successfully');
            }
            navigate('/diet-charts');
        } catch (error) {
            console.error('Error saving diet chart:', error);
            toast.error(error.response?.data?.message || 'Failed to save diet chart');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMeal = () => {
        setFormData(prev => ({
            ...prev,
            meals: [...prev.meals, { ...initialMeal }]
        }));
    };

    const handleRemoveMeal = (index) => {
        setFormData(prev => ({
            ...prev,
            meals: prev.meals.filter((_, i) => i !== index)
        }));
    };

    const handleMealChange = (index, field, value) => {
        const updatedMeals = formData.meals.map((meal, i) => 
            i === index ? { ...meal, [field]: value } : meal
        );
        setFormData(prev => ({ ...prev, meals: updatedMeals }));
    };

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box p={3}>
                {/* Header Section */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3, 
                        mb: 4, 
                        background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                        color: 'white'
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={2}>
                            <DietIcon sx={{ fontSize: 40 }} />
                            <Box>
                                <Typography variant="h4">
                                    {id ? 'Edit Diet Chart' : 'Create Diet Chart'}
                                </Typography>
                                <Typography variant="subtitle1">
                                    {id ? 'Modify existing diet plan' : 'Plan a new diet chart'}
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<BackIcon />}
                            onClick={() => navigate('/diet-charts')}
                            sx={{ 
                                bgcolor: 'white', 
                                color: '#2e7d32',
                                '&:hover': {
                                    bgcolor: '#e8f5e9',
                                }
                            }}
                        >
                            Back to List
                        </Button>
                    </Box>
                </Paper>

                {/* Stepper */}
                <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Paper>

                <form onSubmit={handleSubmit}>
                    {/* Patient Selection */}
                    {activeStep === 0 && (
                        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                            <Typography variant="h6" gutterBottom color="primary">
                                Patient Information
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Select Patient</InputLabel>
                                        <Select
                                            value={formData.patient}
                                            onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                                            label="Select Patient"
                                        >
                                            {patients.map((patient) => (
                                                <MenuItem key={patient._id} value={patient._id}>
                                                    {patient.name} - Room {patient.roomNumber}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            label="Status"
                                        >
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="inactive">Inactive</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}

                    {/* Meal Planning */}
                    {activeStep === 1 && (
                        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h6" color="primary">
                                    Meal Schedule
                                </Typography>
                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={handleAddMeal}
                                    variant="outlined"
                                >
                                    Add Meal
                                </Button>
                            </Box>
                            <Divider sx={{ mb: 3 }} />
                            
                            <Grid container spacing={3}>
                                {formData.meals.map((meal, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Card elevation={2}>
                                            <CardContent>
                                                <Box display="flex" justifyContent="space-between" mb={2}>
                                                    <Typography variant="subtitle1" color="primary">
                                                        Meal #{index + 1}
                                                    </Typography>
                                                    <IconButton 
                                                        color="error" 
                                                        onClick={() => handleRemoveMeal(index)}
                                                        disabled={formData.meals.length === 1}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={6}>
                                                        <FormControl fullWidth required>
                                                            <InputLabel>Meal Type</InputLabel>
                                                            <Select
                                                                value={meal.type}
                                                                onChange={(e) => handleMealChange(index, 'type', e.target.value)}
                                                                label="Meal Type"
                                                            >
                                                                <MenuItem value="Breakfast">Breakfast</MenuItem>
                                                                <MenuItem value="Lunch">Lunch</MenuItem>
                                                                <MenuItem value="Snack">Snack</MenuItem>
                                                                <MenuItem value="Dinner">Dinner</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="Time"
                                                            type="time"
                                                            value={meal.time}
                                                            onChange={(e) => handleMealChange(index, 'time', e.target.value)}
                                                            InputLabelProps={{ shrink: true }}
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            fullWidth
                                                            label="Items"
                                                            multiline
                                                            rows={2}
                                                            value={meal.items}
                                                            onChange={(e) => handleMealChange(index, 'items', e.target.value)}
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="Calories"
                                                            type="number"
                                                            value={meal.calories}
                                                            onChange={(e) => handleMealChange(index, 'calories', e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="Special Instructions"
                                                            value={meal.specialInstructions}
                                                            onChange={(e) => handleMealChange(index, 'specialInstructions', e.target.value)}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    )}

                    {/* Review */}
                    {activeStep === 2 && (
                        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                            <Typography variant="h6" gutterBottom color="primary">
                                Review Diet Chart
                            </Typography>
                            <Divider sx={{ mb: 3 }} />
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        Please review the diet chart details before saving
                                    </Alert>
                                </Grid>
                                {/* Add review content here */}
                            </Grid>
                        </Paper>
                    )}

                    {/* Navigation Buttons */}
                    <Box display="flex" justifyContent="space-between">
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            variant="outlined"
                        >
                            Back
                        </Button>
                        <Box>
                            {activeStep === steps.length - 1 ? (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    disabled={loading}
                                >
                                    {id ? 'Update Diet Chart' : 'Create Diet Chart'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    color="primary"
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default DietChartForm; 