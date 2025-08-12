import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store/store';
import { fetchEmailTranscriptData } from '../../redux/slice/analyticsSlice';

const EmailTranscriptsCard = styled(Box)`
  background: white;
  border-radius: 16px;
  padding: 7px;
  height:200;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 32%;
  text-wrap: nowrap;
   position:relative;
`;


const EmailTranscripts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { emailTranscriptData, emailTranscriptLoading, emailTranscriptError } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    const fetchData = async () => {
      // Calculate date range for last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      await dispatch(fetchEmailTranscriptData({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }));
    };

    fetchData();
  }, [dispatch]);

  return (
    <EmailTranscriptsCard>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box display="flex" alignItems="center">
          <Typography fontWeight={600} fontSize={14}>
            Email Transcripts
          </Typography>
        </Box>
      </Box>

      {/* Error Display */}
      {emailTranscriptError && (
        <Box sx={{ mb: 2, p: 1, bgcolor: '#ffebee', borderRadius: 1 }}>
          <Typography variant="body2" color="error">
            Error: {emailTranscriptError}
          </Typography>
        </Box>
      )}

      <Box mb={2}>
        {emailTranscriptLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="60px">
            <CircularProgress size={30} />
          </Box>
        ) : (
          <Typography fontSize={14} fontWeight={300} color="rgba(0, 0, 0, 0.87)" mb={1}>
            {emailTranscriptData?.count?.toLocaleString() || '0'}
          </Typography>
        )}
      </Box>

    </EmailTranscriptsCard>
  );
};

export default EmailTranscripts;

