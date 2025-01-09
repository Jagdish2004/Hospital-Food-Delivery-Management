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
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    Restaurant,
    LocalShipping,
    Person,
    Edit as EditIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    getPantryTasks,
    updateTaskStatus,
    assignDeliveryPersonnel,
    getDeliveryStaff
} from '../../services/api';

const PantryDashboard = () => {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [tasks, setTasks] = useState([]);
    const [deliveryStaff, setDeliveryStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assignDialog, setAssignDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState('');

    useEffect(() => {
        fetchTasks();
        fetchDeliveryStaff();
        // Refresh tasks every 2 minutes
        const interval = setInterval(fetchTasks, 120000);
        return () => clearInterval(interval);
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

    const fetchDeliveryStaff = async () => {
        try {
            const response = await getDeliveryStaff();
            setDeliveryStaff(response.data);
        } catch (error) {
            toast.error('Error fetching delivery staff');
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
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
            setAssignDialog(false);
            setSelectedTask(null);
            setSelectedDeliveryPerson('');
            fetchTasks();
        } catch (error) {
            toast.error('Error assigning delivery personnel');
        }
    };

    const openAssignDialog = (task) => {
        setSelectedTask(task);
        setAssignDialog(true);
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
                        {task.status === 'pending' && (
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleStatusUpdate(task._id, 'preparing')}
                            >
                                Start Preparing
                            </Button>
                        )}
                        {task.status === 'preparing' && (
                            <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => handleStatusUpdate(task._id, 'ready')}
                            >
                                Mark Ready
                            </Button>
                        )}
                        {task.status === 'ready' && (
                            <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={() => openAssignDialog(task)}
                            >
                                Assign Delivery
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
                Pantry Dashboard
            </Typography>

            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Pending" />
                    <Tab label="In Progress" />
                    <Tab label="Ready for Delivery" />
                    <Tab label="Completed" />
                </Tabs>
            </Paper>

            <Grid container spacing={3}>
                {tasks
                    .filter(task => {
                        if (tabValue === 0) return task.status === 'pending';
                        if (tabValue === 1) return task.status === 'preparing';
                        if (tabValue === 2) return task.status === 'ready';
                        return task.status === 'delivered';
                    })
                    .map(renderTaskCard)}
            </Grid>

            {/* Assign Delivery Dialog */}
            <Dialog open={assignDialog} onClose={() => setAssignDialog(false)}>
                <DialogTitle>Assign Delivery Personnel</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Select Delivery Staff</InputLabel>
                        <Select
                            value={selectedDeliveryPerson}
                            onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
                            label="Select Delivery Staff"
                        >
                            {deliveryStaff.map((staff) => (
                                <MenuItem key={staff._id} value={staff._id}>
                                    {staff.name} - {staff.contactNumber}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
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