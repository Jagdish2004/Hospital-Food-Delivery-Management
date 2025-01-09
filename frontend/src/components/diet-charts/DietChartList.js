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
    Avatar,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Restaurant as DietIcon,
    Search as SearchIcon,
    Person as PersonIcon,
    Event as DateIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getDietCharts, deleteDietChart } from '../../services/api';
import { toast } from 'react-toastify';

const DietChartList = () => {
    const navigate = useNavigate();
    const [dietCharts, setDietCharts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDietCharts();
    }, []);

    const fetchDietCharts = async () => {
        try {
            setLoading(true);
            const response = await getDietCharts();
            setDietCharts(response.data);
        } catch (error) {
            toast.error('Failed to fetch diet charts');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this diet chart?')) {
            try {
                await deleteDietChart(id);
                toast.success('Diet chart deleted successfully');
                fetchDietCharts();
            } catch (error) {
                toast.error('Failed to delete diet chart');
            }
        }
    };

    const filteredCharts = dietCharts.filter(chart => 
        chart.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chart.patient?.roomNumber?.toString().includes(searchTerm)
    );

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
                        background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                        color: 'white'
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={2}>
                            <DietIcon sx={{ fontSize: 40 }} />
                            <Box>
                                <Typography variant="h4">Diet Charts</Typography>
                                <Typography variant="subtitle1">
                                    Manage patient diet plans
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/diet-charts/new')}
                            sx={{ 
                                bgcolor: 'white', 
                                color: '#2e7d32',
                                '&:hover': {
                                    bgcolor: '#e8f5e9',
                                }
                            }}
                        >
                            Create Diet Chart
                        </Button>
                    </Box>
                </Paper>

                {/* Search and Filter Section */}
                <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Search by patient name or room number"
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
                            <Box display="flex" justifyContent="flex-end" gap={1}>
                                <Button startIcon={<FilterIcon />}>
                                    Filter
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    color="primary"
                                    onClick={fetchDietCharts}
                                >
                                    Refresh
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Diet Charts Grid */}
                <Grid container spacing={3}>
                    {filteredCharts.length > 0 ? (
                        filteredCharts.map((chart) => (
                            <Grid item xs={12} md={6} lg={4} key={chart._id}>
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
                                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                <PersonIcon />
                                            </Avatar>
                                            <Box flex={1}>
                                                <Typography variant="h6" color="primary">
                                                    {chart.patient?.name}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Room: {chart.patient?.roomNumber}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={chart.status.toUpperCase()}
                                                color={chart.status === 'active' ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <DateIcon color="action" fontSize="small" />
                                            <Typography variant="body2" color="textSecondary">
                                                Created: {new Date(chart.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <DietIcon color="action" fontSize="small" />
                                            <Typography variant="body2" color="textSecondary">
                                                {chart.meals?.length || 0} Meals Planned
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <Box 
                                        sx={{ 
                                            mt: 'auto', 
                                            p: 2, 
                                            borderTop: 1, 
                                            borderColor: 'divider',
                                            display: 'flex',
                                            gap: 1
                                        }}
                                    >
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            onClick={() => navigate(`/diet-charts/edit/${chart._id}`)}
                                        >
                                            Edit
                                        </Button>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(chart._id)}
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 4, textAlign: 'center' }}>
                                <DietIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="textSecondary">
                                    No diet charts found
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {searchTerm ? 'Try different search terms' : 'Click the "Create Diet Chart" button to add one'}
                                </Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Container>
    );
};

export default DietChartList; 