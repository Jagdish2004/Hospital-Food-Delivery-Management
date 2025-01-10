import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography
} from '@mui/material';
import { getPantryStaff, assignTask } from '../../services/api';
import { toast } from 'react-toastify';

const AssignTaskForm = ({ open, onClose, dietChart, meal, onTaskAssigned }) => {
    const [pantryStaff, setPantryStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState('');
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPantryStaff();
    }, []);

    const fetchPantryStaff = async () => {
        try {
            const response = await getPantryStaff();
            setPantryStaff(response.data);
        } catch (error) {
            console.error('Error fetching pantry staff:', error);
            toast.error('Failed to fetch pantry staff');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStaff) {
            toast.error('Please select a staff member');
            return;
        }

        try {
            setLoading(true);
            const taskData = {
                dietChart: dietChart._id,
                meal: meal._id,
                mealType: meal.type,
                scheduledTime: meal.time,
                assignedTo: selectedStaff,
                specialInstructions: instructions
            };
            
            console.log('Submitting task data:', taskData);
            await assignTask(taskData);
            toast.success('Task assigned successfully');
            onTaskAssigned();
            onClose();
        } catch (error) {
            console.error('Error assigning task:', error);
            toast.error('Failed to assign task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Assign Meal Preparation Task</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Patient: {dietChart?.patient?.name}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Meal: {meal?.type} - {meal?.time}
                    </Typography>
                    
                    <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                        <InputLabel>Assign to Pantry Staff</InputLabel>
                        <Select
                            value={selectedStaff}
                            onChange={(e) => setSelectedStaff(e.target.value)}
                            label="Assign to Pantry Staff"
                            required
                        >
                            {pantryStaff.map((staff) => (
                                <MenuItem key={staff._id} value={staff._id}>
                                    {staff.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Special Instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        margin="normal"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    color="primary"
                    disabled={loading || !selectedStaff}
                >
                    Assign Task
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignTaskForm; 