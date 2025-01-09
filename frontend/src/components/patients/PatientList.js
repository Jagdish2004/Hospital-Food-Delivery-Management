import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Button,
    Card,
    CardContent,
    IconButton,
    Chip,
    CircularProgress,
    Divider,
    TextField,
    InputAdornment,
    Menu,
    MenuItem,
    Avatar
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Person as PersonIcon,
    Assignment as AssignmentIcon,
    MoreVert as MoreIcon,
    Room as RoomIcon,
    Phone as PhoneIcon,
    Event as DateIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getPatients, deletePatient } from '../../services/api';
import { toast } from 'react-toastify';

const PatientList = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await getPatients();
            setPatients(response.data);
        } catch (error) {
            toast.error('Failed to fetch patients');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await deletePatient(id);
                toast.success('Patient deleted successfully');
                fetchPatients();
            } catch (error) {
                toast.error('Failed to delete patient');
            }
        }
    };

    const handleMenuOpen = (event, patient) => {
        setAnchorEl(event.currentTarget);
        setSelectedPatient(patient);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedPatient(null);
    };

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.roomNumber.toString().includes(searchTerm)
    );

    const getStatusColor = (status) => {
        return (status || '').toLowerCase() === 'active' ? 'success' : 'default';
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
                        background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                        color: 'white'
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={2}>
                            <PersonIcon sx={{ fontSize: 40 }} />
                            <Box>
                                <Typography variant="h4">Patients</Typography>
                                <Typography variant="subtitle1">
                                    Manage patient information
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/patients/new')}
                            sx={{ 
                                bgcolor: 'white', 
                                color: '#1565c0',
                                '&:hover': {
                                    bgcolor: '#e3f2fd',
                                }
                            }}
                        >
                            Add Patient
                        </Button>
                    </Box>
                </Paper>

                {/* Search and Stats Section */}
                <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Search by name or room number"
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
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Typography color="textSecondary">
                                    Total Patients: {patients.length}
                                </Typography>
                                <Typography color="success.main">
                                    Active: {patients.filter(p => p.status === 'active').length}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Patients Grid */}
                <Grid container spacing={3}>
                    {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                            <Grid item xs={12} md={6} lg={4} key={patient._id}>
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
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    {patient.name[0]}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" color="primary">
                                                        {patient.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        ID: {patient._id}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, patient)}
                                            >
                                                <MoreIcon />
                                            </IconButton>
                                        </Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Box display="flex" flexDirection="column" gap={1}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <RoomIcon color="action" fontSize="small" />
                                                <Typography variant="body2">
                                                    Room {patient.roomNumber}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <PhoneIcon color="action" fontSize="small" />
                                                <Typography variant="body2">
                                                    {patient.contactNumber}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <DateIcon color="action" fontSize="small" />
                                                <Typography variant="body2">
                                                    Admitted: {new Date(patient.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box mt={2} display="flex" gap={1}>
                                            <Chip
                                                label={(patient.status || 'INACTIVE').toUpperCase()}
                                                color={getStatusColor(patient.status)}
                                                size="small"
                                            />
                                            {patient.dietChart && (
                                                <Chip
                                                    icon={<AssignmentIcon />}
                                                    label="Diet Chart"
                                                    color="info"
                                                    size="small"
                                                />
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 4, textAlign: 'center' }}>
                                <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="textSecondary">
                                    No patients found
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {searchTerm ? 'Try different search terms' : 'Click the "Add Patient" button to add one'}
                                </Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>

                {/* Actions Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => {
                        navigate(`/patients/edit/${selectedPatient?._id}`);
                        handleMenuClose();
                    }}>
                        <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                    </MenuItem>
                    <MenuItem onClick={() => {
                        navigate(`/diet-charts/new/${selectedPatient?._id}`);
                        handleMenuClose();
                    }}>
                        <AssignmentIcon fontSize="small" sx={{ mr: 1 }} /> Create Diet Chart
                    </MenuItem>
                    <MenuItem 
                        onClick={() => {
                            handleDelete(selectedPatient?._id);
                            handleMenuClose();
                        }}
                        sx={{ color: 'error.main' }}
                    >
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                    </MenuItem>
                </Menu>
            </Box>
        </Container>
    );
};

export default PatientList; 