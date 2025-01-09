import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import { getReports } from '../../services/api';
import { toast } from 'react-toastify';

const Reports = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await getReports();
            setReports(response.data);
        } catch (error) {
            toast.error('Failed to fetch reports');
        } finally {
            setLoading(false);
        }
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
                {/* Add your reports UI here using the reports data */}
                <Typography variant="h4" gutterBottom>
                    Reports Dashboard
                </Typography>
                {/* Example of displaying data */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6">Patients</Typography>
                            <Typography>Total: {reports?.totalPatients}</Typography>
                            <Typography>Active: {reports?.activePatients}</Typography>
                        </Paper>
                    </Grid>
                    {/* Add more report sections as needed */}
                </Grid>
            </Box>
        </Container>
    );
};

export default Reports; 