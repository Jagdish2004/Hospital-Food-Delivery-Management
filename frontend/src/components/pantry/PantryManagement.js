import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { getPantries, createPantry, updatePantry, getPantryStaff } from '../../services/api';
import { toast } from 'react-toastify';

const PantryManagement = () => {
    const [pantries, setPantries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPantry, setSelectedPantry] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        contactNumber: '',
        status: 'active'
    });
    const [pantryStaff, setPantryStaff] = useState([]);

    useEffect(() => {
        fetchPantries();
        fetchPantryStaff();
    }, []);

    const fetchPantries = async () => {
        try {
            setLoading(true);
            const response = await getPantries();
            setPantries(response.data || []);
        } catch (error) {
            console.error('Error fetching pantries:', error);
            toast.error('Failed to fetch pantries');
        } finally {
            setLoading(false);
        }
    };

    const fetchPantryStaff = async () => {
        try {
            const response = await getPantryStaff();
            setPantryStaff(response.data || []);
        } catch (error) {
            console.error('Error fetching pantry staff:', error);
        }
    };

    const handleOpenDialog = (pantry = null) => {
        if (pantry) {
            setSelectedPantry(pantry);
            setFormData({
                name: pantry.name,
                location: pantry.location,
                contactNumber: pantry.contactNumber,
                status: pantry.status
            });
        } else {
            setSelectedPantry(null);
            setFormData({
                name: '',
                location: '',
                contactNumber: '',
                status: 'active'
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPantry(null);
        setFormData({
            name: '',
            location: '',
            contactNumber: '',
            status: 'active'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedPantry) {
                await updatePantry(selectedPantry._id, formData);
                toast.success('Pantry updated successfully');
            } else {
                await createPantry(formData);
                toast.success('Pantry created successfully');
            }
            handleCloseDialog();
            fetchPantries();
        } catch (error) {
            console.error('Error saving pantry:', error);
            toast.error('Failed to save pantry');
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box p={3}>
                {/* Header */}
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
                        <Typography variant="h4">Pantry Management</Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                        >
                            Add New Pantry
                        </Button>
                    </Box>
                </Paper>

                {/* Pantry List */}
                <Grid container spacing={3}>
                    {pantries.map((pantry) => (
                        <Grid item xs={12} md={6} lg={4} key={pantry._id}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                        <Typography variant="h6" gutterBottom>
                                            {pantry.name}
                                        </Typography>
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleOpenDialog(pantry)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Location: {pantry.location}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        Contact: {pantry.contactNumber}
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <PersonIcon color="primary" fontSize="small" />
                                        <Typography variant="body2">
                                            Staff: {pantry.staffMembers?.length || 0} members
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Add/Edit Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {selectedPantry ? 'Edit Pantry' : 'Add New Pantry'}
                    </DialogTitle>
                    <DialogContent>
                        <Box component="form" sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Pantry Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Contact Number"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            {selectedPantry ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default PantryManagement; 