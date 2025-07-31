import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store/store';
import { updateOrganization } from '../../../redux/slice/organizationSlice';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function PricingConfiguration() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { data: organizationData } = useSelector((state: RootState) => state.organization);

  const [openAiKey, setOpenAiKey] = useState<string>('');
  const [aiEnabled] = useState<boolean>(true);

  const handleCreate = async () => {
    if (!user?.orgId || !openAiKey.trim()) {
      toast.error("Please enter your OpenAI key");
      return;
    }

    try {
      await dispatch(updateOrganization({
        orgId: user.orgId,
        data: {
          ...organizationData,
          openAiKey: openAiKey.trim(),
        }
      })).unwrap();
      toast.success("OpenAI key updated successfully!");
      setOpenAiKey('');
    } catch (error: unknown) {
      const errorMessage = typeof error === 'string' ? error : "Failed to update OpenAI key";
      toast.error(errorMessage);
    }
  };

  return (
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
        AI Configuration
      </Typography>

      {aiEnabled ? (
        <>
          <Alert
            icon={<span style={{ fontSize: 20, fontWeight: 'bold' }}>⚠️</span>}
            severity="info"
            sx={{ mb: 3 }}
          >
            <Typography>
              <strong>AI Chat Support Pricing:</strong>
            </Typography>
            <Typography>$20 per 1000 user chat sessions.</Typography>
            <Typography>$10 for each additional 5000 user chat sessions.</Typography>
          </Alert>

          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
            Would you like to use your own OpenAI key to avoid usage charge?
          </Typography>

          <TextField
            fullWidth
            placeholder="Enter your OpenAI Key"
            value={openAiKey}
            onChange={(e) => setOpenAiKey(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleCreate}
            disabled={openAiKey.trim() === ""}
          >
            Create
          </Button>
        </>
      ) : (
        <Box
          sx={{
            mb: 3,
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            backgroundColor: '#f5f5f5',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ mb: 2, fontWeight: 600, color: 'error.main' }}
          >
            ❌ AI Chatbot is Disabled
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            To use FAQ features and AI chat support, please enable the AI chatbot from the AI Chatbot Settings.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Go to: Configuration → AI Chatbot Settings → Enable AI Chatbot
          </Typography>
        </Box>
      )}
    </Box>
  );
}
