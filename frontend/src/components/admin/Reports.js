import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { getReports } from '../../services/api';
import { toast } from 'react-toastify';

const Reports = () => {
    const [reportType, setReportType] = useState('delivery');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            toast.error('Please select both start and end dates');
            return;
        }

        setLoading(true);
        try {
            const response = await getReports({
                type: reportType,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            });
            setReportData(response.data);
        } catch (error) {
            toast.error('Error generating report');
        } finally {
            setLoading(false);
        }
    };

    const renderReportTable = () => {
        if (!reportData) return null;

        switch (reportType) {
            case 'delivery':
                return (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Total Deliveries</TableCell>
                                    <TableCell>On-Time</TableCell>
                                    <TableCell>Delayed</TableCell>
                                    <TableCell>Success Rate</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportData.map((row) => (
                                    <TableRow key={row.date}>
                                        <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{row.totalDeliveries}</TableCell>
                                        <TableCell>{row.onTime}</TableCell>
                                        <TableCell>{row.delayed}</TableCell>
                                        <TableCell>{row.successRate}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                );
            // Add more cases for different report types
            default:
                return null;
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Reports
            </Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Report Type</InputLabel>
                            <Select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                            >
                                <MenuItem value="delivery">Delivery Report</MenuItem>
                                <MenuItem value="meals">Meal Preparation Report</MenuItem>
                                <MenuItem value="patients">Patient Diet Report</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={setStartDate}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={setEndDate}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button
                            variant="contained"
                            onClick={handleGenerateReport}
                            disabled={loading}
                            fullWidth
                        >
                            Generate Report
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {reportData && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Report Results
                    </Typography>
                    {renderReportTable()}
                </Paper>
            )}
        </Box>
    );
};

export default Reports; 