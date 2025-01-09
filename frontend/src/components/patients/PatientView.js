import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Button,
    Divider,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from '@mui/material';
import { getPatientById, deletePatient } from '../../services/api';
import { toast } from 'react-toastify';

const PatientView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchPatient();
    }, [id]);

    const fetchPatient = async () => {
        try {
            const response = await getPatientById(id);
            setPatient(response.data);
        } catch (error) {
            toast.error('Error fetching patient details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deletePatient(id);
            toast.success('Patient deleted successfully');
            navigate('/patients');
        } catch (error) {
            toast.error('Error deleting patient');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" m={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (!patient) {
        return (
            <Box p={3}>
                <Typography>Patient not found</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 3, mt: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5">Patient Details</Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/patients')}
                    >
                        Back to List
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>Basic Information</Typography>
                        <List>
                            <ListItem>
                                <ListItemText primary="Name" secondary={patient.name} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Age" secondary={patient.age} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Gender" secondary={patient.gender} />
                            </ListItem>
                        </List>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>Contact & Room Details</Typography>
                        <List>
                            <ListItem>
                                <ListItemText primary="Room Number" secondary={patient.roomNumber} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Bed Number" secondary={patient.bedNumber} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Contact Number" secondary={patient.contactNumber} />
                            </ListItem>
                        </List>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" gutterBottom>Medical Information</Typography>
                        <List>
                            <ListItem>
                                <ListItemText 
                                    primary="Medical Conditions" 
                                    secondary={patient.medicalConditions?.join(', ') || 'None'} 
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="Allergies" 
                                    secondary={patient.allergies?.join(', ') || 'None'} 
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary="Dietary Restrictions" 
                                    secondary={patient.dietaryRestrictions?.join(', ') || 'None'} 
                                />
                            </ListItem>
                        </List>
                    </Grid>

                    <Grid item xs={12}>
                        <Box display="flex" gap={2} justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                onClick={() => navigate(`/patients/edit/${patient._id}`)}
                            >
                                Edit Patient
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setOpenDialog(true)}
                            >
                                Delete Patient
                            </Button>
                            {!patient.hasDietChart && (
                                <Button
                                    variant="contained"
                                    onClick={() => navigate(`/diet-charts/new/${patient._id}`)}
                                >
                                    Create Diet Chart
                                </Button>
                            )}
                        </Box>
                    </Grid>
                </Grid>

                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this patient? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={handleDelete} color="error" autoFocus>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Container>
    );
};

export default PatientView; 