import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Paper,
    Grid,
    TextField,
    Button,
    Typography,
    Box,
    Autocomplete,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { createDietChart, getDietChartById, updateDietChart, getPatients } from '../../services/api';
import { toast } from 'react-toastify';

const initialMeal = {
    type: '',
    items: [{ name: '', quantity: '', specialInstructions: '' }],
    specialInstructions: []
};

const mealTypes = ['breakfast', 'lunch', 'dinner'];

const DietChartForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        patientId: '',
        startDate: '',
        endDate: '',
        meals: [{ ...initialMeal }],
        restrictions: []
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
            toast.error('Error fetching patients');
        }
    };

    const fetchDietChart = async () => {
        try {
            const response = await getDietChartById(id);
            const { patient, startDate, endDate, meals, restrictions } = response.data;
            setFormData({
                patientId: patient._id,
                startDate: startDate.split('T')[0],
                endDate: endDate.split('T')[0],
                meals,
                restrictions
            });
        } catch (error) {
            toast.error('Error fetching diet chart');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await updateDietChart(id, formData);
                toast.success('Diet chart updated successfully');
            } else {
                await createDietChart(formData);
                toast.success('Diet chart created successfully');
            }
            navigate('/diet-charts');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving diet chart');
        } finally {
            setLoading(false);
        }
    };

    const handleMealChange = (index, field, value) => {
        const updatedMeals = [...formData.meals];
        updatedMeals[index] = {
            ...updatedMeals[index],
            [field]: value
        };
        setFormData({ ...formData, meals: updatedMeals });
    };

    const addMeal = () => {
        setFormData({
            ...formData,
            meals: [...formData.meals, { ...initialMeal }]
        });
    };

    const removeMeal = (index) => {
        const updatedMeals = formData.meals.filter((_, i) => i !== index);
        setFormData({ ...formData, meals: updatedMeals });
    };

    const handleMealItemChange = (mealIndex, itemIndex, field, value) => {
        const updatedMeals = [...formData.meals];
        updatedMeals[mealIndex].items[itemIndex] = {
            ...updatedMeals[mealIndex].items[itemIndex],
            [field]: value
        };
        setFormData({ ...formData, meals: updatedMeals });
    };

    const addMealItem = (mealIndex) => {
        const updatedMeals = [...formData.meals];
        updatedMeals[mealIndex].items.push({ name: '', quantity: '', specialInstructions: '' });
        setFormData({ ...formData, meals: updatedMeals });
    };

    const removeMealItem = (mealIndex, itemIndex) => {
        const updatedMeals = [...formData.meals];
        updatedMeals[mealIndex].items = updatedMeals[mealIndex].items.filter((_, i) => i !== itemIndex);
        setFormData({ ...formData, meals: updatedMeals });
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                {id ? 'Edit Diet Chart' : 'Create Diet Chart'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Form fields */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Patient</InputLabel>
                            <Select
                                value={formData.patientId}
                                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                required
                            >
                                {patients.map((patient) => (
                                    <MenuItem key={patient._id} value={patient._id}>
                                        {`${patient.name} - Room ${patient.roomNumber}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Start Date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>
                    {/* Meals Section */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Meals
                        </Typography>
                        {formData.meals.map((meal, mealIndex) => (
                            <Box key={mealIndex} sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Meal Type</InputLabel>
                                            <Select
                                                value={meal.type}
                                                onChange={(e) => handleMealChange(mealIndex, 'type', e.target.value)}
                                                required
                                            >
                                                {mealTypes.map((type) => (
                                                    <MenuItem key={type} value={type}>
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1">Items</Typography>
                                        {meal.items.map((item, itemIndex) => (
                                            <Box key={itemIndex} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                                <TextField
                                                    label="Item Name"
                                                    value={item.name}
                                                    onChange={(e) => handleMealItemChange(mealIndex, itemIndex, 'name', e.target.value)}
                                                    required
                                                />
                                                <TextField
                                                    label="Quantity"
                                                    value={item.quantity}
                                                    onChange={(e) => handleMealItemChange(mealIndex, itemIndex, 'quantity', e.target.value)}
                                                    required
                                                />
                                                <TextField
                                                    label="Special Instructions"
                                                    value={item.specialInstructions}
                                                    onChange={(e) => handleMealItemChange(mealIndex, itemIndex, 'specialInstructions', e.target.value)}
                                                />
                                                <IconButton
                                                    color="error"
                                                    onClick={() => removeMealItem(mealIndex, itemIndex)}
                                                    disabled={meal.items.length === 1}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        ))}
                                        <Button
                                            startIcon={<AddIcon />}
                                            onClick={() => addMealItem(mealIndex)}
                                        >
                                            Add Item
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Autocomplete
                                            multiple
                                            freeSolo
                                            options={[]}
                                            value={meal.specialInstructions}
                                            onChange={(_, newValue) => handleMealChange(mealIndex, 'specialInstructions', newValue)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Special Instructions"
                                                    placeholder="Add special instructions"
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                {formData.meals.length > 1 && (
                                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            color="error"
                                            onClick={() => removeMeal(mealIndex)}
                                        >
                                            Remove Meal
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        ))}
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={addMeal}
                        >
                            Add Meal
                        </Button>
                    </Grid>

                    {/* Dietary Restrictions */}
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            freeSolo
                            options={[]}
                            value={formData.restrictions}
                            onChange={(_, newValue) => setFormData({ ...formData, restrictions: newValue })}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Dietary Restrictions"
                                    placeholder="Add restrictions"
                                />
                            )}
                        />
                    </Grid>

                    {/* Submit Buttons */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
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
                                {loading ? 'Saving...' : (id ? 'Update' : 'Create')}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default DietChartForm; 