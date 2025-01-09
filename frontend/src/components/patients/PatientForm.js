import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    OutlinedInput
} from '@mui/material';
import { createPatient, getPatientById, updatePatient } from '../../services/api';
import { toast } from 'react-toastify';

const PatientForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        roomNumber: '',
        bedNumber: '',
        age: '',
        gender: '',
        contactNumber: '',
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        },
        dietaryRestrictions: [],
        allergies: [],
        diagnosis: ''
    });

    useEffect(() => {
        if (id) {
            fetchPatientData();
        }
    }, [id]);

    const fetchPatientData = async () => {
        try {
            const response = await getPatientById(id);
            setFormData(response.data);
        } catch (error) {
            toast.error('Error fetching patient data');
            navigate('/dashboard');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleArrayChange = (e, field) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: typeof value === 'string' ? value.split(',') : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (id) {
                await updatePatient(id, formData);
                toast.success('Patient updated successfully');
            } else {
                await createPatient(formData);
                toast.success('Patient created successfully');
            }
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving patient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {id ? 'Edit Patient' : 'Add New Patient'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Patient Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Age"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    label="Gender"
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Contact Number"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Room Number"
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Bed Number"
                                name="bedNumber"
                                value={formData.bedNumber}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Emergency Contact Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Emergency Contact
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Contact Name"
                                name="emergencyContact.name"
                                value={formData.emergencyContact.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Relationship"
                                name="emergencyContact.relationship"
                                value={formData.emergencyContact.relationship}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Contact Phone"
                                name="emergencyContact.phone"
                                value={formData.emergencyContact.phone}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Medical Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Medical Information
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Dietary Restrictions</InputLabel>
                                <Select
                                    multiple
                                    value={formData.dietaryRestrictions}
                                    onChange={(e) => handleArrayChange(e, 'dietaryRestrictions')}
                                    input={<OutlinedInput label="Dietary Restrictions" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Low-Sodium', 'Diabetic'].map((name) => (
                                        <MenuItem key={name} value={name}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Allergies"
                                name="allergies"
                                value={formData.allergies.join(', ')}
                                onChange={(e) => handleArrayChange(e, 'allergies')}
                                helperText="Enter allergies separated by commas"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Diagnosis/Notes"
                                name="diagnosis"
                                value={formData.diagnosis}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/dashboard')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (id ? 'Update Patient' : 'Add Patient')}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default PatientForm; 