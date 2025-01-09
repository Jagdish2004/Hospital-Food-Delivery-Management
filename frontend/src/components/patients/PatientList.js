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
    CircularProgress
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Restaurant as DietIcon
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
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Patients</Typography>
                <Button
                    variant="contained"
                    color="primary"
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
                            <TableCell>Age</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((patient) => (
                            <TableRow key={patient._id}>
                                <TableCell>{patient.name}</TableCell>
                                <TableCell>{patient.roomNumber}</TableCell>
                                <TableCell>{patient.bedNumber}</TableCell>
                                <TableCell>{patient.age}</TableCell>
                                <TableCell>{patient.gender}</TableCell>
                                <TableCell>{patient.contactNumber}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => navigate(`/patients/edit/${patient._id}`)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => navigate(`/diet-charts/new/${patient._id}`)}
                                    >
                                        <DietIcon />
                                    </IconButton>
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