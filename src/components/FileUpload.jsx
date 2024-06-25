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

    return (<Box>
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
                sx={{height:"40px", width:{xs: "45%",md:"20%"}, mt:2,mr:{xs:"3%",md:"1.5%"} }}
            >
                Upload CSV
            </Button>
        </label>
        {file && <TextField
            value={file ? file.name : ''}
            placeholder="No file chosen"
            variant="outlined"
            fullWidth
            size='small'
            InputProps={{
                readOnly: true,
            }}
            sx={{ width:{xs: "52%",md:"55%"}, mt:2 }}
        />}

        {error && (
            <Box sx={{ color: 'red', mt: 2 }}>
                {error}
            </Box>
        )}
    </Box>);
}

export default CsvFileInput;
