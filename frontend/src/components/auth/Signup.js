import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    CircularProgress
} from '@mui/material';
import { register } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import HomeIcon from '@mui/icons-material/Home';

const Signup = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'delivery',
        contactNumber: '',
        department: ''
    });

    const roles = [
        { value: 'manager', label: 'Food Service Manager' },
        { value: 'pantry', label: 'Pantry Staff' },
        { value: 'delivery', label: 'Delivery Personnel' }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate passwords match
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }

            // Remove confirmPassword before sending to API
            const { confirmPassword, ...signupData } = formData;

            // Register user
            const response = await register(signupData);
            
            if (response.data) {
                toast.success('Registration successful!');
                
                // Attempt to log in with new credentials
                try {
                    await login({
                        email: formData.email,
                        password: formData.password
                    });
                    navigate('/dashboard');
                } catch (loginError) {
                    console.error('Auto-login failed:', loginError);
                    navigate('/login');
                }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Registration failed';
            toast.error(errorMessage);
            console.error('Signup error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
            py: 8,
            position: 'relative'
        }}>
            <IconButton
                onClick={() => navigate('/')}
                sx={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    bgcolor: 'white',
                    '&:hover': {
                        bgcolor: 'grey.100'
                    }
                }}
            >
                <HomeIcon color="primary" />
            </IconButton>

            <Container maxWidth="sm">
                <Paper elevation={4} sx={{ 
                    p: 4, 
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <Typography component="h1" variant="h5" align="center">
                        Sign Up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Full Name"
                            name="name"
                            autoFocus
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Role</InputLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                label="Role"
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role.value} value={role.value}>
                                        {role.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="contactNumber"
                            label="Contact Number"
                            value={formData.contactNumber}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="department"
                            label="Department"
                            value={formData.department}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => navigate('/login')}
                        >
                            Already have an account? Sign in
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Signup; 