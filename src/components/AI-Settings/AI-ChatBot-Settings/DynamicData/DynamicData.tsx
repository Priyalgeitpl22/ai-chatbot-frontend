import {
  Box,
  Typography,
  TextField,
  Button,
  } from '@mui/material';
import Grid from "@mui/material/Grid2";
import { useState } from 'react';

export default function DynamicData() {
  const [prompt, setPrompt] = useState('');
  const [curlUrl, setCurlUrl] = useState('');

return<>
    <Box
      sx={{
        width: 550,
        border: '1px solid #ccc',
        borderRadius: 2,
        p: 3,
        height: 'fit-content',
      }}
    >
      <Typography variant="h6" sx={{ mb: 3 }}>
        Dynamic Data Configuration
      </Typography>
     <>
       <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              label="Prompt"
              multiline
              rows={4}
              fullWidth
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your AI prompt..."
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Url"
              fullWidth
              value={curlUrl}
              onChange={(e) => setCurlUrl(e.target.value)}
              placeholder="Enter curl endpoint..."
            />
          </Grid>

          {/* Save Button */}
          <Grid size={12} sx={{ textAlign: 'right', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={!prompt || !curlUrl}
              sx={{ textTransform: 'none', px: 4 }}
            >
              Go
            </Button>
          </Grid>
        </Grid>
     </>
    </Box>
  </>
}
