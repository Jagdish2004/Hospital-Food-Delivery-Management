import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Link,
    IconButton
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home as HomeIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { user } = await login(formData);
            toast.success('Login successful!');
            
            // Redirect based on user role
            switch (user.role) {
                case 'manager':
                    navigate('/dashboard');
                    break;
                case 'pantry':
                    navigate('/pantry-dashboard');
                    break;
                case 'delivery':
                    navigate('/delivery-dashboard');
                    break;
                default:
                    navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
            py: 8,
            position: 'relative'
        }}>
            {/* Home Button */}
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
                    <Typography 
                        variant="h4" 
                        align="center" 
                        gutterBottom
                        sx={{ 
                            color: 'primary.main',
                            fontWeight: 700,
                            mb: 4
                        }}
                    >
                        Welcome Back
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            margin="normal"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            margin="normal"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            sx={{ mb: 3 }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                                py: 1.5,
                                mb: 2,
                                fontSize: '1.1rem'
                            }}
                        >
                            Log In
                        </Button>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" color="textSecondary">
                                Don't have an account?{' '}
                                <Link 
                                    component={RouterLink} 
                                    to="/signup"
                                    sx={{
                                        color: 'primary.main',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Sign Up
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login; 