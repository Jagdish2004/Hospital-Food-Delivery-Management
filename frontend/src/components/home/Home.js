import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Stack
} from '@mui/material';
import {
    Restaurant,
    LocalHospital,
    DeliveryDining,
    Security
} from '@mui/icons-material';

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <LocalHospital fontSize="large" color="primary" />,
            title: 'Patient Care',
            description: 'Personalized diet plans for every patient based on their medical conditions.'
        },
        {
            icon: <Restaurant fontSize="large" color="primary" />,
            title: 'Diet Management',
            description: 'Efficient food preparation and dietary requirement tracking system.'
        },
        {
            icon: <DeliveryDining fontSize="large" color="primary" />,
            title: 'Timely Delivery',
            description: 'Real-time tracking of meal preparations and deliveries.'
        },
        {
            icon: <Security fontSize="large" color="primary" />,
            title: 'Quality Assurance',
            description: 'Strict adherence to dietary restrictions and food safety standards.'
        }
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    py: 8,
                    position: 'relative'
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h2" component="h1" gutterBottom>
                                Hospital Food Management System
                            </Typography>
                            <Typography variant="h5" paragraph>
                                Streamlining patient meal services with efficiency and care
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    size="large"
                                    onClick={() => navigate('/signup')}
                                >
                                    Sign Up
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                component="img"
                                src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                alt="Hospital Food Service"
                                sx={{
                                    width: '100%',
                                    maxWidth: 500,
                                    height: 'auto',
                                    display: 'block',
                                    margin: 'auto'
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography
                    variant="h3"
                    component="h2"
                    align="center"
                    gutterBottom
                    sx={{ mb: 6 }}
                >
                    Our Features
                </Typography>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={6} lg={3} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    p: 2
                                }}
                            >
                                <Box sx={{ p: 2 }}>{feature.icon}</Box>
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="h3"
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Home; 