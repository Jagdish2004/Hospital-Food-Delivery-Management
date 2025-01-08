import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Chip,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import {
    LocalShipping,
    CheckCircle,
    Notes as NotesIcon
} from '@mui/icons-material';
import { getMyTasks, updateTaskStatus } from '../../services/api';
import { toast } from 'react-toastify';

const DeliveryDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notesDialog, setNotesDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [deliveryNotes, setDeliveryNotes] = useState('');

    useEffect(() => {
        fetchTasks();
        // Set up periodic refresh
        const interval = setInterval(fetchTasks, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await getMyTasks();
            setTasks(response.data);
        } catch (error) {
            toast.error('Error fetching delivery tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleDeliveryComplete = async (taskId) => {
        try {
            await updateTaskStatus(taskId, 'delivered');
            toast.success('Delivery marked as completed');
            fetchTasks();
        } catch (error) {
            toast.error('Error updating delivery status');
        }
    };

    const handleAddNotes = async () => {
        try {
            await updateTaskStatus(selectedTask._id, 'delivered', deliveryNotes);
            toast.success('Delivery completed with notes');
            setNotesDialog(false);
            setDeliveryNotes('');
            fetchTasks();
        } catch (error) {
            toast.error('Error updating delivery status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'assigned_delivery':
                return 'warning';
            case 'delivered':
                return 'success';
            default:
                return 'default';
        }
    };

    const renderDeliveryCard = (task) => (
        <Card key={task._id} sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">
                        Room {task.dietChart.patient.roomNumber}
                    </Typography>
                    <Chip
                        label={task.status}
                        color={getStatusColor(task.status)}
                        size="small"
                    />
                </Box>
                <Typography>
                    <strong>Patient:</strong> {task.dietChart.patient.name}
                </Typography>
                <Typography>
                    <strong>Meal Type:</strong> {task.meal.type}
                </Typography>
                <Typography>
                    <strong>Floor:</strong> {task.dietChart.patient.floorNumber}
                </Typography>
                {task.status === 'assigned_delivery' && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={() => handleDeliveryComplete(task._id)}
                        >
                            Mark Delivered
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<NotesIcon />}
                            onClick={() => {
                                setSelectedTask(task);
                                setNotesDialog(true);
                            }}
                        >
                            Add Notes
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Delivery Dashboard
            </Typography>
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => setTabValue(newValue)}
                >
                    <Tab label="Active Deliveries" />
                    <Tab label="Completed" />
                </Tabs>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {loading ? (
                        <Typography>Loading deliveries...</Typography>
                    ) : (
                        tasks
                            .filter(task => {
                                if (tabValue === 0) {
                                    return task.status === 'assigned_delivery';
                                }
                                return task.status === 'delivered';
                            })
                            .map(renderDeliveryCard)
                    )}
                </Grid>
            </Grid>

            {/* Add Notes Dialog */}
            <Dialog open={notesDialog} onClose={() => setNotesDialog(false)}>
                <DialogTitle>Add Delivery Notes</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        placeholder="Enter any special notes about the delivery..."
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNotesDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleAddNotes}
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