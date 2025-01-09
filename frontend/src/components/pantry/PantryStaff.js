import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Chip,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Kitchen as KitchenIcon
} from '@mui/icons-material';
import { getPantryStaff, createPantryStaff, updatePantryStaff, deletePantryStaff, getPantries, assignStaffToPantry } from '../../services/api';
import { toast } from 'react-toastify';

const PantryStaff = () => {
    const [staff, setStaff] = useState([]);
    const [pantries, setPantries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingStaff, setEditingStaff] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        role: 'pantry',
        pantryAssignment: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [staffResponse, pantriesResponse] = await Promise.all([
                getPantryStaff(),
                getPantries()
            ]);
            setStaff(staffResponse.data);
            setPantries(pantriesResponse.data);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignPantry = async (staffId, pantryId) => {
        try {
            await assignStaffToPantry(pantryId, staffId);
            toast.success('Staff assigned to pantry successfully');
            fetchData(); // Refresh data
        } catch (error) {
            toast.error('Failed to assign staff to pantry');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStaff) {
                await updatePantryStaff(editingStaff._id, formData);
                toast.success('Staff member updated successfully');
            } else {
                const staffData = {
                    ...formData,
                    password: formData.contactNumber,
                    role: 'pantry'
                };
                await createPantryStaff(staffData);
                toast.success('Staff member added successfully');
            }
            handleCloseDialog();
            fetchData();
        } catch (error) {
            console.error('Error:', error);
            toast.error(editingStaff 
                ? 'Failed to update staff member' 
                : 'Failed to add staff member. ' + (error.response?.data?.message || '')
            );
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await deletePantryStaff(id);
                toast.success('Staff member deleted successfully');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete staff member');
            }
        }
    };

    const handleOpenDialog = (staff = null) => {
        if (staff) {
            setEditingStaff(staff);
            setFormData({
                name: staff.name,
                email: staff.email,
                contactNumber: staff.contactNumber,
                role: staff.role,
                pantryAssignment: staff.pantry?._id || ''
            });
        } else {
            setEditingStaff(null);
            setFormData({
                name: '',
                email: '',
                contactNumber: '',
                role: 'pantry',
                pantryAssignment: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingStaff(null);
        setFormData({
            name: '',
            email: '',
            contactNumber: '',
            role: 'pantry',
            pantryAssignment: ''
        });
    };

    const filteredStaff = staff.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                {/* Header */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3, 
                        mb: 4, 
                        background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                        color: 'white'
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={2}>
                            <KitchenIcon sx={{ fontSize: 40 }} />
                            <Box>
                                <Typography variant="h4">Pantry Staff</Typography>
                                <Typography variant="subtitle1">
                                    Manage pantry staff members
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            sx={{ 
                                bgcolor: 'white', 
                                color: '#1565c0',
                                '&:hover': {
                                    bgcolor: '#e3f2fd',
                                }
                            }}
                        >
                            Add Staff
                        </Button>
                    </Box>
                </Paper>

                {/* Search Bar */}
                <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                    <TextField
                        fullWidth
                        placeholder="Search by name or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            )
                        }}
                    />
                </Paper>

                {/* Staff Grid */}
                <Grid container spacing={3}>
                    {filteredStaff.map((member) => (
                        <Grid item xs={12} md={6} key={member._id}>
                            <Paper 
                                elevation={3}
                                sx={{
                                    p: 2,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)'
                                    }
                                }}
                            >
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                        {member.name[0]}
                                    </Avatar>
                                    <Box flex={1}>
                                        <Typography variant="h6">{member.name}</Typography>
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <EmailIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="textSecondary">
                                                {member.email}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <PhoneIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="textSecondary">
                                                {member.contactNumber}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <IconButton 
                                            color="primary"
                                            onClick={() => handleOpenDialog(member)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            color="error"
                                            onClick={() => handleDelete(member._id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Box mt={2} display="flex" gap={1}>
                                    <Chip
                                        label={member.role}
                                        color="primary"
                                        size="small"
                                    />
                                    {member.pantry && (
                                        <Chip
                                            icon={<KitchenIcon />}
                                            label={member.pantry.name}
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Add/Edit Staff Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                    </DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Contact Number"
                                        value={formData.contactNumber}
                                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                        required
                                        helperText={!editingStaff ? "This will be used as the initial password" : ""}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Assign to Pantry</InputLabel>
                                        <Select
                                            value={formData.pantryAssignment}
                                            label="Assign to Pantry"
                                            onChange={(e) => {
                                                const pantryId = e.target.value;
                                                setFormData({ ...formData, pantryAssignment: pantryId });
                                            }}
                                        >
                                            <MenuItem value="">Not Assigned</MenuItem>
                                            {pantries.map((pantry) => (
                                                <MenuItem 
                                                    key={pantry._id} 
                                                    value={pantry._id}
                                                    disabled={pantry.staffMembers?.length >= pantry.capacity}
                                                >
                                                    {pantry.name} 
                                                    {pantry.staffMembers?.length >= pantry.capacity && ' (Full)'}
                                                    {` (${pantry.staffMembers?.length || 0}/${pantry.capacity || 'N/A'})`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Cancel</Button>
                            <Button type="submit" variant="contained">
                                {editingStaff ? 'Update' : 'Add'}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Box>
        </Container>
    );
};

export default PantryStaff; 