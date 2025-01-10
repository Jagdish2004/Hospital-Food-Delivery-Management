import React from 'react';
import { 
    Container, 
    Typography, 
    Button, 
    Box, 
    Paper,
    Grid,
    useTheme
} from '@mui/material';
import { 
    LocalHospital as HospitalIcon,
    RestaurantMenu as FoodIcon,
    LocalShipping as DeliveryIcon,
    QueryStats as StatsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const theme = useTheme();

    const handleDashboardNavigation = () => {
        if (isAuthenticated) {
            switch (user.role) {
                case 'manager': navigate('/manager-dashboard'); break;
                case 'pantry': navigate('/pantry-dashboard'); break;
                case 'delivery': navigate('/delivery-dashboard'); break;
                default: navigate('/login');
            }
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
            py: 4
        }}>
            <Container maxWidth="lg">
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    color: 'white',
                    mb: 6
                }}>
                    {/* Logo and Title Section */}
                    <Box sx={{ 
                        width: 120, 
                        height: 120, 
                        bgcolor: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        boxShadow: 3
                    }}>
                        <HospitalIcon sx={{ 
                            width: 80, 
                            height: 80, 
                            color: theme.palette.primary.main 
                        }} />
                    </Box>
                    <Typography 
                        variant="h2" 
                        component="h1" 
                        sx={{ 
                            fontWeight: 700,
                            textAlign: 'center',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                        }}
                    >
                        <span style={{ color: '#FFD700' }}>Medi</span>Meals
                    </Typography>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mt: 2, 
                            mb: 4,
                            textAlign: 'center',
                            maxWidth: 600,
                            textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                        }}
                    >
                        Streamline your hospital's food service with our comprehensive management system
                    </Typography>

                    {/* Action Buttons */}
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate('/login')}
                            sx={{
                                bgcolor: 'white',
                                color: 'primary.main',
                                '&:hover': {
                                    bgcolor: 'grey.100'
                                },
                                px: 4,
                                py: 1.5
                            }}
                        >
                            Log In
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate('/signup')}
                            sx={{
                                borderColor: 'white',
                                color: 'white',
                                '&:hover': {
                                    borderColor: 'grey.100',
                                    bgcolor: 'rgba(255,255,255,0.1)'
                                },
                                px: 4,
                                py: 1.5
                            }}
                        >
                            Sign Up
                        </Button>
                    </Box>
                </Box>

                {/* Feature Cards */}
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    {[
                        {
                            icon: <FoodIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
                            title: 'Food Service Management',
                            description: 'Efficiently manage meal preparation and dietary requirements'
                        },
                        {
                            icon: <DeliveryIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
                            title: 'Real-time Delivery Tracking',
                            description: 'Track food delivery status across the hospital in real-time'
                        },
                        {
                            icon: <StatsIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
                            title: 'Analytics & Reports',
                            description: 'Comprehensive analytics and reporting for better decision making'
                        }
                    ].map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper 
                                elevation={4}
                                sx={{ 
                                    p: 4, 
                                    height: '100%', 
                                    textAlign: 'center',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)'
                                    }
                                }}
                            >
                                <Box sx={{ mb: 2 }}>
                                    {feature.icon}
                                </Box>
                                <Typography variant="h6" gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Home; 