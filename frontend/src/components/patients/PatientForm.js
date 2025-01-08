import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Paper,
    Grid,
    TextField,
    Button,
    Typography,
    Box,
    Autocomplete,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { createPatient, getPatientById, updatePatient } from '../../services/api';
import { toast } from 'react-toastify';

const PatientForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        roomNumber: '',
        bedNumber: '',
        floorNumber: '',
        diseases: [],
        allergies: [],
        contactNumber: '',
        emergencyContact: {
            name: '',
            relation: '',
            phone: ''
        },
        dietaryRestrictions: []
    });

    useEffect(() => {
        if (id) {
            fetchPatient();
        }
    }, [id]);

    const fetchPatient = async () => {
        try {
            const response = await getPatientById(id);
            setFormData(response.data);
        } catch (error) {
            toast.error('Error fetching patient details');
            console.error('Error:', error);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await updatePatient(id, formData);
                toast.success('Patient updated successfully');
            } else {
                await createPatient(formData);
                toast.success('Patient added successfully');
            }
            navigate('/patients');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving patient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                {id ? 'Edit Patient' : 'Add New Patient'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Patient Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Age"
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
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
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Room Number"
                            name="roomNumber"
                            value={formData.roomNumber}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Bed Number"
                            name="bedNumber"
                            value={formData.bedNumber}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Floor Number"
                            name="floorNumber"
                            value={formData.floorNumber}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            freeSolo
                            options={[]}
                            value={formData.diseases}
                            onChange={(e, newValue) => {
                                setFormData(prev => ({
                                    ...prev,
                                    diseases: newValue
                                }));
                            }}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={option}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Diseases"
                                    placeholder="Add diseases"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            freeSolo
                            options={[]}
                            value={formData.allergies}
                            onChange={(e, newValue) => {
                                setFormData(prev => ({
                                    ...prev,
                                    allergies: newValue
                                }));
                            }}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={option}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Allergies"
                                    placeholder="Add allergies"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Contact Number"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Emergency Contact
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name="emergencyContact.name"
                                    value={formData.emergencyContact.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Relation"
                                    name="emergencyContact.relation"
                                    value={formData.emergencyContact.relation}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="emergencyContact.phone"
                                    value={formData.emergencyContact.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/patients')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (id ? 'Update' : 'Save')}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default PatientForm; 