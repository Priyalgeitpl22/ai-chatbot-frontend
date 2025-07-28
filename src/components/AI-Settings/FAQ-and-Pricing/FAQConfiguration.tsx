import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store/store';
import { getAIChatbotSettingsData } from '../../../redux/slice/organizationSlice';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { fetchFAQs, createFAQs } from '../../../redux/slice/faqSlice';
import FaqAnswerEditor from '../FaqAnswerEditor/FaqAnswerEditor'
import Papa from 'papaparse';


export default function FAQConfiguration() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { data: organizationData } = useSelector((state: RootState) => state.organization);
  const { faqs, loading } = useSelector((state: RootState) => state.faq);

  const [localFaqs, setLocalFaqs] = useState<{ id: string; question: string; answer: string }[]>([
    { id: '1', question: '', answer: '' }
  ]);
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

  const hasNewFaqs = localFaqs.some(faq => typeof faq.id !== "number");

  // CSV upload handler
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const newFaqs = results.data
          .filter((row: any) => row.question && row.answer)
          .map((row: any, idx: number) => ({
            id: `csv-${Date.now()}-${idx}`,
            question: row.question,
            answer: row.answer
          }));
        if (newFaqs.length === 0) {
          toast.error('No valid FAQ entries found in CSV.');
          return;
        }
        setLocalFaqs(prev => [...prev, ...newFaqs]);
        toast.success('FAQs imported from CSV!');
      },
      error: () => toast.error('Failed to parse CSV file.')
    });
  };

  const handleCsvImport = async (id: string, question: string, answer: string) => {
    setLocalFaqs(prev =>
      prev.map(faq =>
        faq.id === id ? { ...faq, question, answer } : faq
      )
    );
    if (!user || !user.orgId) return;
    try {
      await dispatch(createFAQs({
        orgId: user.orgId,
        faqs: [{ question, answer }]
      })).unwrap();
      toast.success('FAQ saved successfully');
      dispatch(fetchFAQs(user.orgId));
    } catch (error) {
      toast.error('Failed to save FAQ to database.');
    }
  };

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

      {/* CSV Upload Button */}
      <Button
        variant="outlined"
        component="label"
        sx={{ mb: 2 }}
      >
        Upload FAQ CSV
        <input
          type="file"
          accept=".csv"
          hidden
          onChange={handleCsvUpload}
        />
      </Button>

      <Box
  sx={{
    display: 'flex',
          gap: 3,
          maxWidth: 1200,
          mx: 'auto',
  }}
>
  <Box
    sx={{
     flex: 1,
            border: '1px solid #ccc',
            borderRadius: 2,
            p: 2,
            width: 600,
            display: 'flex',
            flexDirection: 'column',
            height: '400px', 
    }}
  >
          {/* Scrollable Content Area */}
          <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
            <Typography variant="h6" sx={{ mt: 2 }}>
              FAQs
            </Typography>

            {localFaqs.map((faq, index) => (
              <Box key={faq.id || index} sx={{ mt: 2, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    FAQ #{index + 1}
                  </Typography>
                  {localFaqs.length > 1 && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveFaq(faq.id)}
                      sx={{ minWidth: "auto", p: 0.5 }}
                      disabled={!aiEnabled}
                    >
                      ✕
                    </Button>
                  )}
                </Box>

                <TextField
                  label="Question"
                  value={faq.question}
                  onChange={e => handleChange(faq.id, "question", e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  disabled={!aiEnabled}
                />

                {user && user.orgId ? (
                  <FaqAnswerEditor
                    value={faq.answer}
                    onChange={(val:any) => handleChange(faq.id, 'answer', val)}
                    onCsvImport={(question, answer) => handleCsvImport(faq.id, question, answer)}
                    toolbarId={`custom-toolbar-${faq.id}`}
                  />
                ) : (
                  <Typography color="error">Organization ID not found. Please log in again.</Typography>
                )}
              </Box>

            ))}
          </Box>

          
          <Stack direction="row" spacing={2} sx={{ pt: 2, borderTop: "1px solid #e0e0e0", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ width: "50%" }}
              disabled={!aiEnabled || !hasNewFaqs || saving}
            >
              Save All FAQs
            </Button>
            <Button
              variant="outlined"
              onClick={handleAddNew}
              sx={{ width: "50%" }}
              disabled={!aiEnabled}
            >
              Add New FAQ
            </Button>
          </Stack>
        </Box>

      </Box>
    </Box>
  );
}
