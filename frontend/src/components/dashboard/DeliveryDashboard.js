import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip
} from '@mui/material';
import {
    LocalShipping,
    CheckCircle,
    Schedule
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getDeliveryTasks, updateDeliveryStatus } from '../../services/api';

const DeliveryDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [selectedTask, setSelectedTask] = useState(null);
    const [deliveryNotes, setDeliveryNotes] = useState('');
    const [completeDialog, setCompleteDialog] = useState(false);

    useEffect(() => {
        fetchTasks();
        // Refresh tasks every 2 minutes
        const interval = setInterval(fetchTasks, 120000);
        return () => clearInterval(interval);
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await getDeliveryTasks();
            setTasks(response.data);
        } catch (error) {
            toast.error('Error fetching delivery tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, status) => {
        try {
            await updateDeliveryStatus(taskId, status, deliveryNotes);
            toast.success('Delivery status updated successfully');
            setCompleteDialog(false);
            setSelectedTask(null);
            setDeliveryNotes('');
            fetchTasks();
        } catch (error) {
            toast.error('Error updating delivery status');
        }
    };

    const openCompleteDialog = (task) => {
        setSelectedTask(task);
        setCompleteDialog(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'assigned':
                return 'warning';
            case 'in_transit':
                return 'info';
            case 'delivered':
                return 'success';
            default:
                return 'default';
        }
    };

    const renderTaskCard = (task) => (
        <Grid item xs={12} md={6} key={task._id}>
            <Card>
                <CardContent>
                    <Typography variant="h6">
                        Patient: {task.patient.name}
                    </Typography>
                    <Typography color="textSecondary">
                        Room: {task.patient.roomNumber} | Bed: {task.patient.bedNumber}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Meal Type: {task.meal.type}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Chip
                            label={task.status}
                            color={getStatusColor(task.status)}
                            sx={{ mr: 1 }}
                        />
                        {task.status === 'assigned' && (
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleStatusUpdate(task._id, 'in_transit')}
                                startIcon={<LocalShipping />}
                            >
                                Start Delivery
                            </Button>
                        )}
                        {task.status === 'in_transit' && (
                            <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => openCompleteDialog(task)}
                                startIcon={<CheckCircle />}
                            >
                                Complete Delivery
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Delivery Dashboard
            </Typography>

            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Assigned" />
                    <Tab label="In Transit" />
                    <Tab label="Delivered" />
                </Tabs>
            </Paper>

            <Grid container spacing={3}>
                {tasks
                    .filter(task => {
                        if (tabValue === 0) return task.status === 'assigned';
                        if (tabValue === 1) return task.status === 'in_transit';
                        return task.status === 'delivered';
                    })
                    .map(renderTaskCard)}
            </Grid>

            {/* Complete Delivery Dialog */}
            <Dialog open={completeDialog} onClose={() => setCompleteDialog(false)}>
                <DialogTitle>Complete Delivery</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        label="Delivery Notes"
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        placeholder="Add any notes about the delivery..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCompleteDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleStatusUpdate(selectedTask?._id, 'delivered')}
                        disabled={!deliveryNotes.trim()}
                    >
                        Complete Delivery
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DeliveryDashboard; 