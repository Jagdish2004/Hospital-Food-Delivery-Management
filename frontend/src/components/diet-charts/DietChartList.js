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
    Menu,
    MenuItem,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getDietCharts, deleteDietChart } from '../../services/api';
import { toast } from 'react-toastify';

const DietChartList = () => {
    const navigate = useNavigate();
    const [dietCharts, setDietCharts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedChart, setSelectedChart] = useState(null);

    useEffect(() => {
        fetchDietCharts();
    }, []);

    const fetchDietCharts = async () => {
        try {
            setLoading(true);
            const response = await getDietCharts();
            setDietCharts(response.data || []);
        } catch (error) {
            console.error('Error fetching diet charts:', error);
            toast.error('Failed to fetch diet charts');
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, chart) => {
        setAnchorEl(event.currentTarget);
        setSelectedChart(chart);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedChart(null);
    };

    const handleEdit = () => {
        if (selectedChart) {
            navigate(`/diet-charts/edit/${selectedChart._id}`);
        }
        handleMenuClose();
    };

    const handleDelete = async () => {
        if (selectedChart) {
            try {
                await deleteDietChart(selectedChart._id);
                toast.success('Diet chart deleted successfully');
                fetchDietCharts();
            } catch (error) {
                console.error('Error deleting diet chart:', error);
                toast.error('Failed to delete diet chart');
            }
        }
        handleMenuClose();
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box p={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4">Diet Charts</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/diet-charts/new')}
                    >
                        Create New Diet Chart
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {dietCharts.map((chart) => (
                        <Grid item xs={12} md={6} lg={4} key={chart._id}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                        <Typography variant="h6" gutterBottom>
                                            {chart.patient?.name || 'Unknown Patient'}
                                        </Typography>
                                        <IconButton 
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, chart)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Room: {chart.patient?.roomNumber || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        Meals: {chart.meals?.length || 0}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Status: {chart.status}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleEdit}>
                        <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
                    </MenuItem>
                </Menu>
            </Box>
        </Container>
    );
};

export default DietChartList; 