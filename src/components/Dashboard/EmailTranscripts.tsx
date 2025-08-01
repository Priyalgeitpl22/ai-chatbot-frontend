import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import MailIcon from '@mui/icons-material/Mail';

const EmailTranscriptsCard = styled(Box)`
  background: white;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 100%;
  text-wrap: nowrap;
`;

const EmailTranscripts: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmailTranscriptCount = async () => {
      try {
        setCount(225);
      } catch (error) {
        console.error('Failed to fetch email transcript count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmailTranscriptCount();
  }, []);

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
          <Typography fontWeight={600} fontSize={14}>
            Email Transcripts
          </Typography>
        </Box>
      </Box>

      <Box mb={2}>
        <Typography fontSize={24} fontWeight={700} color="#3B82F6" mb={1}>
          {count?.toLocaleString() || '—'}
        </Typography>
      </Box>

      {/* <motion.div
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
      </motion.div> */}
    </EmailTranscriptsCard>
  );
};

export default EmailTranscripts;

