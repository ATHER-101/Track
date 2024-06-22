import React, { useState } from 'react';
import { TextField, Button, Box, Grid } from '@mui/material';

function CsvFileInput({ file, setFile }) {
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
        <Grid container spacing={2} sx={{ py: 2 }}>
            <Grid item sm={3} md={3} lg={2}>
                <input
                    accept=".csv"
                    id="csv-file-input"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <label htmlFor="csv-file-input">
                    <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        sx={{ width: "100%" }}  // Ensure the button height matches the TextField
                    >
                        Upload CSV
                    </Button>
                </label>
            </Grid>
            <Grid item sm={12} md={6} lg={6}>
                {file && <TextField
                    value={file ? file.name : ''}
                    placeholder="No file chosen"
                    variant="outlined"
                    fullWidth
                    size='small'
                    InputProps={{
                        readOnly: true,
                    }}
                    sx={{width:"100%"}}
                />}

            </Grid>
            <Grid item>
            {error && (
                <Box sx={{ color: 'red', mt: 2 }}>
                    {error}
                </Box>
            )}
            </Grid>
        </Grid>
    );
}

export default CsvFileInput;
