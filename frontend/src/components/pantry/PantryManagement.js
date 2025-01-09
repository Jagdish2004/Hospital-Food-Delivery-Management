import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    CircularProgress,
    Card,
    CardContent,
    Divider,
    Avatar
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Kitchen as KitchenIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Group as StaffIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getPantries, createPantry, updatePantry } from '../../services/api';
import { toast } from 'react-toastify';

const initialFormState = {
    name: '',
    location: '',
    contactNumber: '',
    status: 'active'
};

const PantryManagement = () => {
    const navigate = useNavigate();
    const [pantries, setPantries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormState);
    const [editMode, setEditMode] = useState(false);
    const [selectedPantryId, setSelectedPantryId] = useState(null);

    useEffect(() => {
        fetchPantries();
    }, []);

    const fetchPantries = async () => {
        try {
            setLoading(true);
            const response = await getPantries();
            setPantries(response.data);
        } catch (error) {
            console.error('Error fetching pantries:', error);
            toast.error('Failed to fetch pantries');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await updatePantry(selectedPantryId, formData);
                toast.success('Pantry updated successfully');
            } else {
                await createPantry(formData);
                toast.success('Pantry created successfully');
            }
            setOpenDialog(false);
            setFormData(initialFormState);
            setEditMode(false);
            fetchPantries();
        } catch (error) {
            console.error('Error saving pantry:', error);
            toast.error('Failed to save pantry');
        }
    };

    const handleEdit = (pantry) => {
        setFormData({
            name: pantry.name,
            location: pantry.location,
            contactNumber: pantry.contactNumber,
            status: pantry.status
        });
        setSelectedPantryId(pantry._id);
        setEditMode(true);
        setOpenDialog(true);
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
                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                        color: 'white'
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={2}>
                            <KitchenIcon sx={{ fontSize: 40 }} />
                            <Box>
                                <Typography variant="h4">Pantry Management</Typography>
                                <Typography variant="subtitle1">
                                    Manage your pantry locations and staff
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setFormData(initialFormState);
                                setEditMode(false);
                                setOpenDialog(true);
                            }}
                            sx={{ 
                                bgcolor: 'white', 
                                color: '#1976d2',
                                '&:hover': {
                                    bgcolor: '#e3f2fd',
                                }
                            }}
                        >
                            Add New Pantry
                        </Button>
                    </Box>
                </Paper>

                {/* Stats Section */}
                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} md={4}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <KitchenIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                <Typography variant="h4" color="primary">
                                    {pantries.length}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Total Pantries
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <StaffIcon sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
                                <Typography variant="h4" color="success.main">
                                    {pantries.filter(p => p.status === 'active').length}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Active Pantries
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card elevation={3}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <LocationIcon sx={{ fontSize: 40, color: '#ed6c02', mb: 1 }} />
                                <Typography variant="h4" color="warning.main">
                                    {pantries.filter(p => p.status === 'inactive').length}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Inactive Pantries
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Pantries Grid */}
                <Grid container spacing={3}>
                    {pantries.length > 0 ? (
                        pantries.map((pantry) => (
                            <Grid item xs={12} md={6} lg={4} key={pantry._id}>
                                <Card 
                                    elevation={3}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)'
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                            <Typography variant="h6" color="primary">
                                                {pantry.name}
                                            </Typography>
                                            <Chip
                                                label={pantry.status.toUpperCase()}
                                                color={pantry.status === 'active' ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <LocationIcon color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {pantry.location}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <PhoneIcon color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {pantry.contactNumber}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <StaffIcon color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {pantry.staffMembers?.length || 0} Staff Members
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <Box 
                                        sx={{ 
                                            mt: 'auto', 
                                            p: 2, 
                                            borderTop: 1, 
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEdit(pantry)}
                                        >
                                            Edit Details
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 4, textAlign: 'center' }}>
                                <KitchenIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    No pantries found
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Click the "Add New Pantry" button to create one
                                </Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>

                {/* Create/Edit Dialog */}
                <Dialog 
                    open={openDialog} 
                    onClose={() => {
                        setOpenDialog(false);
                        setFormData(initialFormState);
                        setEditMode(false);
                    }}
                    maxWidth="sm"
                    fullWidth
                >
                    <form onSubmit={handleSubmit}>
                        <DialogTitle sx={{ pb: 1 }}>
                            <Box display="flex" alignItems="center" gap={1}>
                                {editMode ? <EditIcon color="primary" /> : <AddIcon color="primary" />}
                                <Typography variant="h6">
                                    {editMode ? 'Edit Pantry' : 'Create New Pantry'}
                                </Typography>
                            </Box>
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Pantry Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Location"
                                        name="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Contact Number"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
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
                        </DialogContent>
                        <DialogActions sx={{ p: 2.5, backgroundColor: 'grey.50' }}>
                            <Button 
                                onClick={() => {
                                    setOpenDialog(false);
                                    setFormData(initialFormState);
                                    setEditMode(false);
                                }}
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained"
                                startIcon={editMode ? <EditIcon /> : <AddIcon />}
                            >
                                {editMode ? 'Update Pantry' : 'Create Pantry'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Box>
        </Container>
    );
};

export default PantryManagement; 