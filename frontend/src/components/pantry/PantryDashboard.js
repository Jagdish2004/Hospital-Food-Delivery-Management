import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Tabs,
    Tab,
    Card,
    CardContent,
    Button,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    Assignment as AssignmentIcon,
    LocalShipping as ShippingIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { getPantryTasks, updateTaskStatus, assignDeliveryPersonnel } from '../../services/api';
import { toast } from 'react-toastify';

const PantryDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState('');
    const [deliveryStaff, setDeliveryStaff] = useState([]); // This should be fetched from API

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await getPantryTasks();
            setTasks(response.data);
        } catch (error) {
            toast.error('Error fetching tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, newStatus);
            toast.success('Task status updated');
            fetchTasks();
        } catch (error) {
            toast.error('Error updating task status');
        }
    };

    const handleAssignDelivery = async () => {
        try {
            await assignDeliveryPersonnel(selectedTask._id, selectedDeliveryPerson);
            toast.success('Delivery personnel assigned successfully');
            setAssignDialogOpen(false);
            fetchTasks();
        } catch (error) {
            toast.error('Error assigning delivery personnel');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'preparing':
                return 'info';
            case 'ready':
                return 'success';
            case 'delivered':
                return 'default';
            default:
                return 'default';
        }
    };

    const renderTaskCard = (task) => (
        <Card key={task._id} sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    {task.status === 'pending' && (
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleStatusChange(task._id, 'preparing')}
                            startIcon={<AssignmentIcon />}
                        >
                            Start Preparation
                        </Button>
                    )}
                    {task.status === 'preparing' && (
                        <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleStatusChange(task._id, 'ready')}
                            startIcon={<CheckIcon />}
                        >
                            Mark Ready
                        </Button>
                    )}
                    {task.status === 'ready' && (
                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                setSelectedTask(task);
                                setAssignDialogOpen(true);
                            }}
                            startIcon={<ShippingIcon />}
                        >
                            Assign Delivery
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Pantry Dashboard
            </Typography>
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => setTabValue(newValue)}
                >
                    <Tab label="Pending" />
                    <Tab label="In Progress" />
                    <Tab label="Ready for Delivery" />
                    <Tab label="Completed" />
                </Tabs>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {loading ? (
                        <Typography>Loading tasks...</Typography>
                    ) : (
                        tasks
                            .filter(task => {
                                switch (tabValue) {
                                    case 0:
                                        return task.status === 'pending';
                                    case 1:
                                        return task.status === 'preparing';
                                    case 2:
                                        return task.status === 'ready';
                                    case 3:
                                        return task.status === 'delivered';
                                    default:
                                        return false;
                                }
                            })
                            .map(renderTaskCard)
                    )}
                </Grid>
            </Grid>

            {/* Assign Delivery Dialog */}
            <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)}>
                <DialogTitle>Assign Delivery Personnel</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Select Delivery Staff</InputLabel>
                        <Select
                            value={selectedDeliveryPerson}
                            onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
                        >
                            {deliveryStaff.map((staff) => (
                                <MenuItem key={staff._id} value={staff._id}>
                                    {staff.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleAssignDelivery}
                        disabled={!selectedDeliveryPerson}
                    >
                        Assign
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PantryDashboard; 