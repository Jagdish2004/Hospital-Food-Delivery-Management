import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid,
    TextField,
    Box,
    Chip
} from '@mui/material';

const TaskDetails = ({ task, open, onClose, onStatusUpdate }) => {
    const [notes, setNotes] = React.useState('');
    const [temperature, setTemperature] = React.useState('');

    const handleSubmit = () => {
        onStatusUpdate(task._id, {
            status: getNextStatus(task.status),
            notes,
            temperature: temperature ? parseFloat(temperature) : undefined
        });
        onClose();
    };

    const getNextStatus = (currentStatus) => {
        const statusFlow = {
            pending: 'preparing',
            preparing: 'ready',
            ready: 'out_for_delivery',
            out_for_delivery: 'delivered'
        };
        return statusFlow[currentStatus] || currentStatus;
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Task Details</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1">Patient</Typography>
                        <Typography>{task?.dietChart?.patient?.name}</Typography>
                        <Typography variant="caption">
                            Room: {task?.dietChart?.patient?.roomNumber}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1">Meal Details</Typography>
                        <Typography>{task?.mealType}</Typography>
                        <Typography variant="caption">
                            Scheduled: {task?.scheduledTime}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Box my={2}>
                            <Chip 
                                label={task?.status?.replace('_', ' ').toUpperCase()}
                                color={getStatusColor(task?.status)}
                            />
                        </Box>
                    </Grid>
                    {task?.status === 'ready' && (
                        <Grid item xs={12}>
                            <TextField
                                label="Temperature"
                                type="number"
                                value={temperature}
                                onChange={(e) => setTemperature(e.target.value)}
                                fullWidth
                                helperText="Enter food temperature in °C"
                            />
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <TextField
                            label="Notes"
                            multiline
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Update Status
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskDetails; 