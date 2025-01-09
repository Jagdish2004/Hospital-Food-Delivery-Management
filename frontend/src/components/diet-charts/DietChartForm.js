import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { createDietChart, updateDietChart, getDietChartById, getPatients } from '../../services/api';
import { toast } from 'react-toastify';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

const DietChartForm = () => {
    const navigate = useNavigate();
    const { chartId, patientId } = useParams();
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        patient: patientId || '',
        startDate: null,
        endDate: null,
        meals: [],
        specialInstructions: '',
        status: 'active'
    });

    // New state for meal form
    const [mealForm, setMealForm] = useState({
        type: '',
        time: '',
        items: '',
        calories: '',
        specialInstructions: ''
    });

    useEffect(() => {
        fetchPatients();
        if (chartId) {
            fetchDietChart();
        }
    }, [chartId]);

    const fetchPatients = async () => {
        try {
            const response = await getPatients();
            setPatients(response.data);
        } catch (error) {
            toast.error('Error fetching patients');
        }
    };

    const fetchDietChart = async () => {
        try {
            const response = await getDietChartById(chartId);
            console.log('Fetched diet chart:', response.data);
            
            setFormData({
                ...response.data,
                patient: response.data.patient._id,
                startDate: response.data.startDate ? new Date(response.data.startDate) : null,
                endDate: response.data.endDate ? new Date(response.data.endDate) : null,
                meals: response.data.meals.map(meal => ({
                    ...meal,
                    id: meal._id || Date.now()
                }))
            });
        } catch (error) {
            console.error('Error fetching diet chart:', error);
            toast.error('Error fetching diet chart');
            navigate('/diet-charts');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMealFormChange = (e) => {
        const { name, value } = e.target;
        setMealForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addMeal = () => {
        if (!mealForm.type || !mealForm.time || !mealForm.items) {
            toast.error('Please fill in all required meal fields');
            return;
        }

        setFormData(prev => ({
            ...prev,
            meals: [...prev.meals, { ...mealForm, id: Date.now() }]
        }));

        setMealForm({
            type: '',
            time: '',
            items: '',
            calories: '',
            specialInstructions: ''
        });
    };

    const removeMeal = (mealId) => {
        setFormData(prev => ({
            ...prev,
            meals: prev.meals.filter(meal => meal.id !== mealId)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patient || !formData.startDate || !formData.endDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.meals.length === 0) {
            toast.error('Please add at least one meal');
            return;
        }

        try {
            setLoading(true);
            const dataToSubmit = {
                ...formData,
                patient: formData.patient,
                meals: formData.meals.map(meal => ({
                    type: meal.type,
                    time: meal.time,
                    items: meal.items,
                    calories: meal.calories,
                    specialInstructions: meal.specialInstructions
                }))
            };

            console.log('Submitting data:', dataToSubmit);

            if (chartId) {
                await updateDietChart(chartId, dataToSubmit);
                toast.success('Diet chart updated successfully');
            } else {
                await createDietChart(dataToSubmit);
                toast.success('Diet chart created successfully');
            }
            navigate('/diet-charts');
        } catch (error) {
            console.error('Error saving diet chart:', error);
            toast.error(error.response?.data?.message || 'Error saving diet chart');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {chartId ? 'Edit Diet Chart' : 'Create New Diet Chart'}
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Patient Selection */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Patient</InputLabel>
                                <Select
                                    name="patient"
                                    value={formData.patient || ''}
                                    onChange={handleChange}
                                    required
                                    disabled={!!patientId || chartId}
                                >
                                    {patients.map((patient) => (
                                        <MenuItem key={patient._id} value={patient._id}>
                                            {patient.name} - Room: {patient.roomNumber}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Date Selection */}
                        <Grid item xs={12} md={6}>
                            <DatePicker
                                label="Start Date"
                                value={formData.startDate}
                                onChange={(newValue) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        startDate: newValue
                                    }));
                                }}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <DatePicker
                                label="End Date"
                                value={formData.endDate}
                                onChange={(newValue) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        endDate: newValue
                                    }));
                                }}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Grid>

                        {/* Meal Form */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>Add Meals</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Meal Type</InputLabel>
                                        <Select
                                            name="type"
                                            value={mealForm.type}
                                            onChange={handleMealFormChange}
                                        >
                                            {MEAL_TYPES.map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        fullWidth
                                        label="Time"
                                        name="time"
                                        value={mealForm.time}
                                        onChange={handleMealFormChange}
                                        type="time"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Items"
                                        name="items"
                                        value={mealForm.items}
                                        onChange={handleMealFormChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        fullWidth
                                        label="Calories"
                                        name="calories"
                                        type="number"
                                        value={mealForm.calories}
                                        onChange={handleMealFormChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={addMeal}
                                        startIcon={<AddIcon />}
                                    >
                                        Add Meal
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Meals List */}
                        <Grid item xs={12}>
                            <List>
                                {formData.meals.map((meal, index) => (
                                    <React.Fragment key={meal.id || index}>
                                        <ListItem>
                                            <ListItemText
                                                primary={`${meal.type} - ${meal.time}`}
                                                secondary={
                                                    <>
                                                        <Typography component="span" variant="body2">
                                                            Items: {meal.items}
                                                            {meal.calories && ` | Calories: ${meal.calories}`}
                                                        </Typography>
                                                        {meal.specialInstructions && (
                                                            <>
                                                                <br />
                                                                <Typography component="span" variant="body2">
                                                                    Instructions: {meal.specialInstructions}
                                                                </Typography>
                                                            </>
                                                        )}
                                                    </>
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => removeMeal(meal.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {index < formData.meals.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Grid>

                        {/* Special Instructions */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Special Instructions"
                                name="specialInstructions"
                                value={formData.specialInstructions}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    {/* Form Actions */}
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/diet-charts')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (chartId ? 'Update' : 'Create')}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default DietChartForm; 