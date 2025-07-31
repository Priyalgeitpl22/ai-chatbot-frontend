import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Drawer
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store/store';
import { getAIChatbotSettingsData } from '../../../redux/slice/organizationSlice';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { fetchFAQs, createFAQs, updateFAQStatus } from '../../../redux/slice/faqSlice';
import FaqAnswerEditor from '../FaqAnswerEditor/FaqAnswerEditor';
import Papa from 'papaparse';

export default function FAQConfiguration() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { data: organizationData } = useSelector((state: RootState) => state.organization);
  const { faqs, loading } = useSelector((state: RootState) => state.faq);

  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [aiEnabled, setAiEnabled] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const [localFaqs, setLocalFaqs] = useState<{ id: string; question: string; answer: string; enabled: boolean }[]>([]);

  const [csvPreviewOpen, setCsvPreviewOpen] = useState(false);
  const [csvPreviewData, setCsvPreviewData] = useState<{ id: string; question: string; answer: string; enabled: boolean }[]>([]);

  useEffect(() => {
    if (user?.orgId) dispatch(getAIChatbotSettingsData(user.orgId));
  }, [dispatch, user?.orgId]);

  useEffect(() => {
    if (organizationData?.aiEnabled) setAiEnabled(organizationData.aiEnabled || false);
  }, [organizationData]);

  useEffect(() => {
    if (user?.orgId) dispatch(fetchFAQs(user.orgId));
  }, [dispatch, user?.orgId]);

  useEffect(() => {
    setLocalFaqs(faqs.length ? faqs : []);
  }, [faqs]);

  const hasNewFaqs = localFaqs.some(faq => typeof faq.id !== 'number');

  const handleSave = async () => {
    if (!user?.orgId) return;
    setSaving(true);
    try {
      const newFaqs = localFaqs.filter(faq => typeof faq.id !== 'number');
      if (newFaqs.length > 0) {
        await dispatch(createFAQs({
          orgId: user.orgId,
          faqs: newFaqs.map(({ question, answer }) => ({ question, answer })),
        })).unwrap();
      }
      await dispatch(fetchFAQs(user.orgId));
      toast.success('FAQs saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save FAQs');
    } finally {
      setSaving(false);
    }
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const parsed = results.data
          .filter((row: any) => row.question && row.answer)
          .map((row: any, idx: number) => ({
            id: `csv-${Date.now()}-${idx}`,
            question: row.question,
            answer: row.answer,
            enabled: true,
          }));
        if (parsed.length === 0) {
          toast.error('No valid FAQ entries found.');
          return;
        }
        setCsvPreviewData(parsed);
        setCsvPreviewOpen(true);
      },
      error: () => toast.error('Failed to parse CSV.'),
    });
  };

  const handleToggleFAQ = async (faqId: string, enabled: boolean) => {
    try {
      await dispatch(updateFAQStatus({ faqId, enabled: !enabled })).unwrap();
      toast.success('FAQ status updated!');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update FAQ status!');
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: 300 }}>
      {loading && (
        <Box sx={{ position: 'absolute', zIndex: 10, top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={48} />
        </Box>
      )}

      <Button variant="outlined" component="label" sx={{ mb: 2 }}>
        Upload FAQ CSV
        <input type="file" accept=".csv" hidden onChange={handleCsvUpload} />
      </Button>

      <Box sx={{ display: 'flex', gap: 3, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ flex: 1, border: '1px solid #ccc', borderRadius: 2, p: 2, width: 800, display: 'flex', flexDirection: 'column', height: '400px' }}>
          <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
            <Typography variant="h6" sx={{ mt: 2 }}>FAQs</Typography>
            {localFaqs.length > 0 ? (
              localFaqs.map((faq, index) => (
                <Accordion key={faq.id || index} disabled={user?.role !== 'Admin' && !faq.enabled}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ flexGrow: 1 }}>{faq.question || `FAQ #${index + 1}`}</Typography>
                    {user?.role === 'Admin' && (
                      <FormControlLabel
                        control={<Switch checked={faq.enabled} onChange={() => handleToggleFAQ(faq.id, faq.enabled)} color="primary" disabled={saving} />}
                        label={faq.enabled ? 'Enabled' : 'Disabled'}
                        onClick={e => e.stopPropagation()}
                        sx={{ marginLeft: 2 }}
                      />
                    )}
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <Typography sx={{ mt: 2, textAlign: 'center', color: '#888' }}>No FAQs available. Please upload a CSV or add a new FAQ to get started.</Typography>
            )}
          </Box>

          <Stack direction="row" spacing={2} sx={{ pt: 2, borderTop: '1px solid #e0e0e0', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={handleSave} sx={{ width: '50%' }} disabled={!aiEnabled || !hasNewFaqs || saving}>Save All FAQs</Button>
            <Button variant="outlined" onClick={() => setAddDrawerOpen(true)}>ADD NEW FAQ</Button>
          </Stack>
        </Box>
      </Box>

      {/* Add FAQ Drawer */}
      <Drawer anchor="right" open={addDrawerOpen} onClose={() => setAddDrawerOpen(false)}>
        <Box sx={{ width: 500, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Add New FAQ</Typography>
          <TextField label="Question" value={newQuestion} onChange={e => setNewQuestion(e.target.value)} fullWidth sx={{ mb: 2 }} />
          <FaqAnswerEditor
            value={newAnswer}
            onChange={setNewAnswer}
            toolbarId="add-faq-toolbar"
            onCsvImport={(question, answer) => {
              setNewQuestion(question);
              setNewAnswer(answer);
            }}
          />
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={() => setAddDrawerOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                if (!newQuestion.trim() || !newAnswer.trim()) {
                  toast.error('Please fill in both fields');
                  return;
                }
                setLocalFaqs(prev => [...prev, { id: `temp-${Date.now()}`, question: newQuestion, answer: newAnswer, enabled: true }]);
                setAddDrawerOpen(false);
                setNewQuestion('');
                setNewAnswer('');
                toast.success('FAQ added!');
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Drawer>

      {/* CSV Preview Dialog */}
      <Dialog open={csvPreviewOpen} onClose={() => setCsvPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Preview FAQ CSV</DialogTitle>
        <DialogContent dividers>
          {csvPreviewData.length === 0 ? (
            <Typography>No data to preview.</Typography>
          ) : (
            csvPreviewData.map((faq, idx) => (
              <Box key={faq.id} sx={{ mb: 2, borderBottom: '1px solid #ccc', pb: 1 }}>
                <Typography variant="subtitle1">Q{idx + 1}: {faq.question}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }} dangerouslySetInnerHTML={{ __html: faq.answer }} />
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControlLabel
                    control={<Switch checked={faq.enabled} onChange={() => {
                      const updated = [...csvPreviewData];
                      updated[idx].enabled = !faq.enabled;
                      setCsvPreviewData(updated);
                    }} />}
                    label={faq.enabled ? 'Enabled' : 'Disabled'}
                  />
                  <Button color="error" onClick={() => {
                    const updated = csvPreviewData.filter((_, i) => i !== idx);
                    setCsvPreviewData(updated);
                  }}>
                    Delete
                  </Button>
                </Stack>
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCsvPreviewOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            setLocalFaqs(prev => [...prev, ...csvPreviewData]);
            setCsvPreviewOpen(false);
            toast.success('FAQs added from preview!');
          }} disabled={csvPreviewData.length === 0}>
            Confirm Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
