import React, { useState } from 'react';
import { TextField, Button, Box, Grid, Skeleton } from '@mui/material';

function CsvFileInput({ file, setFile, submiting }) {
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setError('');
        } else {
            setFile(null);
            setError('Please select a valid CSV file.');
        }
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={6} md={3}>
                <input
                    accept=".csv"
                    id="csv-file-input"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                {submiting ? (<Skeleton
                    variant="rounded"
                    sx={{ height: "40px", width: "100%", mt: 2 }} />
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ height: "40px", width: "100%", mt: 2 }}
                    >
                        <label htmlFor="csv-file-input">
                            Upload CSV
                        </label>
                    </Button>

                )}
            </Grid>
            <Grid item xs={6} md={5}>
                {submiting ? (<Skeleton
                    variant="rounded"
                    sx={{
                        height: "40px", width: "100%", mt: 2
                    }} />
                ) : (
                    file && <TextField
                        value={file ? file.name : ''}
                        placeholder="No file chosen"
                        variant="outlined"
                        fullWidth
                        size='small'
                        InputProps={{
                            readOnly: true,
                        }}
                        sx={{ width: "100%", mt: 2 }}
                    />)}
            </Grid>

            {error && (
                <Box sx={{ color: 'red', mt: 2 }}>
                    {error}
                </Box>
            )}
        </Grid>);
}

export default CsvFileInput;
