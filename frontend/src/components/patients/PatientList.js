import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
    IconButton,
    Box,
    Chip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { getPatients } from '../../services/api';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await getPatients();
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleEdit = (patientId) => {
        navigate(`/patients/edit/${patientId}`);
    };

    const handleDelete = async (patientId) => {
        // Add delete confirmation and API integration
    };

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Patients</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/patients/new')}
                >
                    Add Patient
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Room</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Diseases</TableCell>
                            <TableCell>Diet Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((patient) => (
                            <TableRow key={patient._id}>
                                <TableCell>{patient.name}</TableCell>
                                <TableCell>{`${patient.roomNumber} (Bed ${patient.bedNumber})`}</TableCell>
                                <TableCell>{patient.age}</TableCell>
                                <TableCell>
                                    {patient.diseases.map((disease, index) => (
                                        <Chip
                                            key={index}
                                            label={disease}
                                            size="small"
                                            sx={{ mr: 0.5 }}
                                        />
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label="Active"
                                        color="success"
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEdit(patient._id)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(patient._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default PatientList; 