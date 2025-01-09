import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Box,
    Typography,
    CircularProgress,
    Chip
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Restaurant as DietIcon,
    Add as AddIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getPatients } from '../../services/api';
import { toast } from 'react-toastify';

const PatientList = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await getPatients();
            setPatients(response.data);
        } catch (error) {
            toast.error('Error fetching patients');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" m={3}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Patients</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/patients/new')}
                >
                    Add New Patient
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Room</TableCell>
                            <TableCell>Bed</TableCell>
                            <TableCell>Diet Chart</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((patient) => (
                            <TableRow key={patient._id}>
                                <TableCell>{patient.name}</TableCell>
                                <TableCell>{patient.roomNumber}</TableCell>
                                <TableCell>{patient.bedNumber}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={patient.hasDietChart ? 'Active' : 'None'}
                                        color={patient.hasDietChart ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => navigate(`/patients/view/${patient._id}`)}
                                        title="View Details"
                                    >
                                        <ViewIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => navigate(`/patients/edit/${patient._id}`)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    {!patient.hasDietChart && (
                                        <IconButton
                                            color="primary"
                                            onClick={() => navigate(`/diet-charts/new/${patient._id}`)}
                                        >
                                            <DietIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PatientList; 