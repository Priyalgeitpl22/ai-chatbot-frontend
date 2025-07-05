import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store/store';
import { getAIChatbotSettingsData, updateOrganization } from '../../../redux/slice/organizationSlice';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { fetchFAQs, createFAQs } from '../../../redux/slice/faqSlice';

export default function FAQConfiguration() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { data: organizationData } = useSelector((state: RootState) => state.organization);
  const { faqs, loading } = useSelector((state: RootState) => state.faq);
  
  const [localFaqs, setLocalFaqs] = useState<{ id: string; question: string; answer: string }[]>([
    { id: '1', question: '', answer: '' }
  ]);
  const [openAiKey, setOpenAiKey] = useState<string>('');
  const [aiEnabled, setAiEnabled] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Load AI chatbot settings on component mount
  useEffect(() => {
    if (user?.orgId) {
      dispatch(getAIChatbotSettingsData(user.orgId));
    }
  }, [dispatch, user?.orgId]);

  // Update local state when organization data changes
  useEffect(() => {
    if (organizationData?.aiEnabled) {
      setAiEnabled(organizationData.aiEnabled || false);
    }
  }, [organizationData]);

  // Fetch FAQs on mount
  useEffect(() => {
    if (user?.orgId) {
      dispatch(fetchFAQs(user.orgId));
    }
  }, [dispatch, user?.orgId]);

  // Sync local state with Redux FAQs
  useEffect(() => {
    setLocalFaqs(faqs.length ? faqs : [{ id: "1", question: "", answer: "" }]);
  }, [faqs]);

  const handleChange = (id: string, field: 'question' | 'answer', value: string) => {
    setLocalFaqs(prev =>
      prev.map(faq => (faq.id === id ? { ...faq, [field]: value } : faq))
    );
  };

  const handleSave = async () => {
    if (!user?.orgId) return;
    setSaving(true);
    try {
      // Only send FAQs that don't have a numeric id
      const newFaqs = localFaqs.filter(
        faq => typeof faq.id !== "number"
      );
      if (newFaqs.length > 0) {
        await dispatch(createFAQs({ orgId: user.orgId, faqs: newFaqs.map(({ question, answer }) => ({ question, answer })) })).unwrap();
      }
      // Always fetch the updated list after saving
      await dispatch(fetchFAQs(user.orgId));
      toast.success("FAQs saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save FAQs");
    } finally {
      setSaving(false);
    }
  };

  const handleAddNew = () => {
    const newId = `temp-${Date.now()}`;
    setLocalFaqs(prevFaqs => [...prevFaqs, { id: newId, question: '', answer: '' }]);
  };

  const handleRemoveFaq = (id: string) => {
    if (localFaqs.length > 1) {
      setLocalFaqs(prev => prev.filter(faq => faq.id !== id));
    }
  };

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
          openAiKey: openAiKey.trim()
        }
      })).unwrap();
      toast.success("OpenAI key updated successfully!");
      setOpenAiKey('');
    } catch (error: unknown) {
      const errorMessage = typeof error === 'string' ? error : "Failed to update OpenAI key";
      toast.error(errorMessage);
    }
  };

  const hasNewFaqs = localFaqs.some(faq => typeof faq.id !== "number");

  return (
    <Box sx={{ position: 'relative', minHeight: 300 }}>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            zIndex: 10,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(255,255,255,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={48} />
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          gap: 3,
          // p: 3,
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        {/* Left Column - FAQs */}
        <Box
          sx={{
            flex: 1,
            border: '1px solid #ccc',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '400px', // Fixed height for the container
          }}
        >
          {/* Scrollable Content Area */}
          <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
            <Typography variant="h6" sx={{ mt: 2 }}>
              FAQs
            </Typography>

            {localFaqs.map((faq, index) => (
              <Box key={faq.id} sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    FAQ #{index + 1}
                  </Typography>
                  {localFaqs.length > 1 && (
                    <Button 
                      size="small" 
                      color="error" 
                      onClick={() => handleRemoveFaq(faq.id)}
                      sx={{ minWidth: 'auto', p: 0.5 }}
                    >
                      ✕
                    </Button>
                  )}
                </Box>
                
                <TextField
                  label="Question"
                  value={faq.question}
                  onChange={(e) => handleChange(faq.id, 'question', e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Answer"
                  value={faq.answer}
                  onChange={(e) => handleChange(faq.id, 'answer', e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Box>
            ))}
          </Box>

          {/* Fixed Button Area */}
          <Stack direction="row" spacing={2} sx={{ pt: 2, borderTop: '1px solid #e0e0e0', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ width: '50%' }}
              disabled={!hasNewFaqs || saving}
            >
              Save All FAQs
            </Button>
            <Button
              variant="outlined"
              onClick={handleAddNew}
              sx={{ width: '50%' }}
            >
              Add New FAQ
            </Button>
          </Stack>
        </Box>

        {/* Right Column - Pricing & OpenAI Key */}
        <Box
          sx={{
            width: 350,
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
              {!aiEnabled && <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#f5f5f5' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  AI Chatbot Status
                </Typography>
                <Typography variant="body2" color="success.main">
                  ✅ AI Chatbot is Enabled
                </Typography>
              </Box>}

              <Alert
                icon={<span style={{ fontSize: 20, fontWeight: 'bold' }}>⚠️</span>}
                severity="info"
                sx={{ mb: 3 }}
              >
                <Typography>
                  <strong>AI Chat Support Pricing:</strong>
                </Typography>
                <Typography>$20 per 1000 user chat sessions.</Typography>
                <Typography>
                  $10 for each additional 5000 user chat sessions.
                </Typography>
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
            <Box sx={{ mb: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'error.main' }}>
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
      </Box>
    </Box>
  );
}
