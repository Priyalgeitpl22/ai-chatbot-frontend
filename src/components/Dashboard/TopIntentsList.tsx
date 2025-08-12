import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  List,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { TrendingUp, Close } from '@mui/icons-material';
import { AppDispatch, RootState } from '../../redux/store/store';
import { fetchTopIntentsData } from '../../redux/slice/analyticsSlice';

const TopIntentsCard = styled(Box)`
  background: white;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  width: 80%;
  display: flex;
  flex-direction: column;
  font-size: 0.5rem;
  position: relative;
`;

const TopIntentsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { topIntentsData, topIntentsLoading, topIntentsError } = useSelector(
    (state: RootState) => state.analytics
  );

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchTopIntentsData());
  }, [dispatch]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <TopIntentsCard>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrendingUp sx={{ color: '#3660D0', fontSize: 14 }} />
        <Typography fontWeight={600} fontSize={14} color="text.primary">
          Top Chat Intents
        </Typography>
      </Box>

      {/* Error */}
      {topIntentsError && (
        <Box sx={{ mb: 2, p: 1, bgcolor: '#ffebee', borderRadius: 1 }}>
          <Typography variant="body2" color="error">
            Error: {topIntentsError}
          </Typography>
        </Box>
      )}

      {/* Loading */}
      {topIntentsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress size={40} />
        </Box>
      ) : !topIntentsData || topIntentsData.intents.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <Typography variant="body2" color="text.secondary">
            No intents data available
          </Typography>
        </Box>
      ) : (
        <>
          {/* Top 4 Intents */}
          <List sx={{ flex: 1, overflow: 'auto' }}>
            {topIntentsData.intents.slice(0, 4).map((intent, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #f0f0f0',
                  py: 1.5,
                  px: 1,
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Typography variant="body2" color="text.primary" fontSize={12}>
                  {intent.intent}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontSize={12} fontWeight={500}>
                  {intent.count}
                </Typography>
              </Box>
            ))}
          </List>

          {/* More Button */}
          {topIntentsData.intents.length > 4 && (
            <Button
              onClick={handleOpenDialog}
              sx={{
                mt: 1,
                textTransform: 'none',
                fontSize: 12,
                alignSelf: 'flex-start',
                px: 1,
                color: '#3660D0',
              }}
            >
              More →
            </Button>
          )}

          {/* Popup Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              All Chat Intents
              <IconButton onClick={handleCloseDialog} size="small">
                <Close fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {topIntentsData.intents.slice(4).map((intent, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #f0f0f0',
                    py: 1.5,
                    px: 1,
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Typography variant="body2" color="text.primary" fontSize={12}>
                    {intent.intent}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontSize={12} fontWeight={500}>
                    {intent.count}
                  </Typography>
                </Box>
              ))}
            </DialogContent>
          </Dialog>
        </>
      )}
    </TopIntentsCard>
  );
};

export default TopIntentsList;
