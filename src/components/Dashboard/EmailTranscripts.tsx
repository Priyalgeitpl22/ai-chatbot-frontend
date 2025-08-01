import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import MailIcon from '@mui/icons-material/Mail';
import DownloadIcon from '@mui/icons-material/Download';

const EmailTranscriptsCard = styled(Box)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 100%;
`;

const EmailTranscripts: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmailTranscriptCount = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await api.get('/analytics/email-transcript-count');
        
        // Mock data for now - matching the dashboard image
        setCount(225);
      } catch (error) {
        console.error('Failed to fetch email transcript count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmailTranscriptCount();
  }, []);

  const handleDownloadReport = () => {
    // TODO: Implement CSV download functionality
    console.log('Downloading email transcripts report...');
  };

  if (loading) {
    return (
      <EmailTranscriptsCard>
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <CircularProgress size={40} />
        </Box>
      </EmailTranscriptsCard>
    );
  }

  return (
    <EmailTranscriptsCard>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box display="flex" alignItems="center">
          <MailIcon sx={{ mr: 1, color: '#3B82F6', fontSize: 28 }} />
          <Typography variant="h6" fontWeight={600}>
            Email Transcripts
          </Typography>
        </Box>
      </Box>

      <Box mb={2}>
        <Typography variant="h3" fontWeight={700} color="#3B82F6" mb={1}>
          {count?.toLocaleString() || '—'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Transcripts sent this month
        </Typography>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadReport}
          fullWidth
          sx={{
            borderColor: '#3B82F6',
            color: '#3B82F6',
            '&:hover': {
              borderColor: '#2563EB',
              backgroundColor: '#EFF6FF'
            }
          }}
        >
          Download Report
        </Button>
      </motion.div>
    </EmailTranscriptsCard>
  );
};

export default EmailTranscripts;

