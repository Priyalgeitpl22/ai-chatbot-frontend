import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
} from '@mui/material';

export default function FAQConfiguration() {
  const [aiSupportEnabled, setAiSupportEnabled] = useState(false);
  const [faq, setFaq] = useState({ question: '', answer: '' });
  const [openAiKey, setOpenAiKey] = useState<string>('');

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setFaq({ ...faq, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log('Save:', faq);
    
  };

  const handleAddNew = () => {
    setFaq({ question: '', answer: '' });
  };

  const handleCreate = () => {
    console.log('OpenAI Key:', openAiKey);
   
  };

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: 2,
        p: 3,
        maxWidth: 400,
        mx: 'auto',
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={aiSupportEnabled}
            onChange={(e) => setAiSupportEnabled(e.target.checked)}
          />
        }
        label="Enable AI Support"
      />

      <Typography variant="h6" sx={{ mt: 2 }}>
        FAQs
      </Typography>

      <TextField
        label="Question"
        name="question"
        value={faq.question}
        onChange={handleChange}
        fullWidth
        sx={{ mt: 1 }}
      />

      <TextField
        label="Answer"
        name="answer"
        value={faq.answer}
        onChange={handleChange}
        fullWidth
        sx={{ mt: 2 }}
      />

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outlined" onClick={handleAddNew}>
          Add New
        </Button>
      </Stack>

      <Alert
        icon={<span style={{ fontSize: 20, fontWeight: 'bold' }}>⚠️</span>}
        severity="info"
        sx={{ mt: 4 }}
      >
        <Typography>
          <strong>AI Chat Support Pricing:</strong>
        </Typography>
        <Typography>$20 per 1000 user chat sessions.</Typography>
        <Typography>
          $10 for each additional 5000 user chat sessions.
        </Typography>
      </Alert>

      <Typography sx={{ mt: 3 }}>
        Would you like to use your own OpenAI key to avoid usage charge?
      </Typography>

      <TextField
        fullWidth
        placeholder="Enter your OpenAI Key"
        value={openAiKey}
        onChange={(e) => setOpenAiKey(e.target.value)}
        sx={{ mt: 1 }}
      />

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleCreate}
      >
        Crete
      </Button>
    </Box>
  );
}
