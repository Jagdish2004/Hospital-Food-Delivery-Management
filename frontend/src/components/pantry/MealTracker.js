import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress
} from '@mui/material';
import {
    PlayArrow as StartIcon,
    Done as CompleteIcon,
    LocalShipping as DeliveryIcon,
    Check as CheckIcon
} from '@mui/icons-material';
import { getPantryTasks, updateTaskStatus, getMyPantryTasks } from '../../services/api';
import { toast } from 'react-toastify';

const MealTracker = ({ showMyTasks = false }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 60000);
        return () => clearInterval(interval);
    }, [showMyTasks]);

    const fetchTasks = async () => {
        try {
            const response = await (showMyTasks ? getMyPantryTasks() : getPantryTasks());
            setTasks(response.data);
        } catch (error) {
            toast.error('Error fetching tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, {
                status: newStatus,
                notes: notes,
                timestamp: new Date()
            });
            toast.success('Status updated successfully');
            fetchTasks();
            setOpenDialog(false);
            setNotes('');
        } catch (error) {
            toast.error('Error updating status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'default',
            preparing: 'warning',
            ready: 'info',
            out_for_delivery: 'primary',
            delivered: 'success',
            cancelled: 'error'
        };
        return colors[status] || 'default';
    };

    const renderActionButtons = (task) => {
        switch (task.status) {
            case 'pending':
                return (
                    <Button
                        startIcon={<StartIcon />}
                        onClick={() => {
                            setSelectedTask(task);
                            setOpenDialog(true);
                        }}
                        size="small"
                    >
                        Start Preparation
                    </Button>
                );
            case 'preparing':
                return (
                    <Button
                        startIcon={<CompleteIcon />}
                        onClick={() => {
                            setSelectedTask(task);
                            setOpenDialog(true);
                        }}
                        size="small"
                        color="warning"
                    >
                        Mark Ready
                    </Button>
                );
            case 'ready':
                return (
                    <Button
                        startIcon={<DeliveryIcon />}
                        onClick={() => {
                            setSelectedTask(task);
                            setOpenDialog(true);
                        }}
                        size="small"
                        color="info"
                    >
                        Start Delivery
                    </Button>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" m={3}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box p={3}>
                <Typography variant="h5" gutterBottom>
                    Meal Preparation & Delivery Tracker
                </Typography>

                <Grid container spacing={3}>
                    {/* Summary Cards */}
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Pending</Typography>
                            <Typography variant="h4">
                                {tasks.filter(t => t.status === 'pending').length}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Preparing</Typography>
                            <Typography variant="h4">
                                {tasks.filter(t => t.status === 'preparing').length}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Ready</Typography>
                            <Typography variant="h4">
                                {tasks.filter(t => t.status === 'ready').length}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Delivered</Typography>
                            <Typography variant="h4">
                                {tasks.filter(t => t.status === 'delivered').length}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Tasks Table */}
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Patient</TableCell>
                                        <TableCell>Meal Type</TableCell>
                                        <TableCell>Scheduled Time</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Assigned To</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tasks.map((task) => (
                                        <TableRow key={task._id}>
                                            <TableCell>
                                                {task.dietChart.patient.name}
                                                <Typography variant="caption" display="block">
                                                    Room: {task.dietChart.patient.roomNumber}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{task.mealType}</TableCell>
                                            <TableCell>{task.scheduledTime}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={task.status.replace('_', ' ').toUpperCase()}
                                                    color={getStatusColor(task.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{task.assignedTo?.name || 'Unassigned'}</TableCell>
                                            <TableCell>{renderActionButtons(task)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>

                {/* Status Update Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Update Status</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button
                            onClick={() => {
                                const nextStatus = {
                                    pending: 'preparing',
                                    preparing: 'ready',
                                    ready: 'out_for_delivery'
                                }[selectedTask.status];
                                handleStatusUpdate(selectedTask._id, nextStatus);
                            }}
                            color="primary"
                            variant="contained"
                        >
                            Update Status
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default MealTracker; 