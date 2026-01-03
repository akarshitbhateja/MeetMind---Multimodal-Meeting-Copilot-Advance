// client/src/components/PostMeetingForm.tsx
"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';

// Hidden Input Style
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', height: 1,
  overflow: 'hidden', position: 'absolute', bottom: 0, left: 0,
  whiteSpace: 'nowrap', width: 1,
});

// Markdown Renderer
const MarkdownRenderer = ({ text }: { text: string }) => {
    const html = text
      .replace(/### \*\*(.*?)\*\*/g, '<h3 style="font-size: 1.1rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #f0f0f0;">$1</h3>')
      .replace(/\* \[ \]/g, '<li style="list-style-type: none; margin-left: 0.5rem; margin-bottom: 0.25rem;">⬜')
      .replace(/- /g, '<li style="list-style-type: disc; margin-left: 1.5rem; color: #a0a0a0; margin-bottom: 0.25rem;">')
      .replace(/\n/g, '<br />');
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

// --- UPDATE: Add onFinalSave to props ---
export default function PostMeetingForm({ onBack, onFinalSave, initialData }: { onBack: () => void, onFinalSave: (data: any) => void, initialData: any }) {
  const router = useRouter();
  const [audioFile, setAudioFile] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingStep, setLoadingStep] = React.useState('');
  const [results, setResults] = React.useState<{ fullTranscript: string; geminiResult: string } | null>(null);
  
  // Modal States
  const [openModal, setOpenModal] = React.useState(false);
  const [shareOptions, setShareOptions] = React.useState({
    video: true,
    notes: true,
    ppt: true
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!audioFile) { toast.error("Please choose an audio file first."); return; }
    setIsLoading(true); setResults(null); setLoadingStep('Uploading audio...');

    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      const response = await axios.post('http://localhost:5001/api/ai/process-audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && progressEvent.loaded === progressEvent.total) {
            setLoadingStep('Processing with Groq Whisper (Fast)...');
          }
        }
      });
      setResults(response.data);
      toast.success("Processed successfully!");
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Processing failed. Check backend.";
      toast.error(errMsg);
    } finally {
      setIsLoading(false); setLoadingStep('');
    }
  };

  const handleShareSubmit = () => {
    setOpenModal(false);
    
    // --- THE FIX: CALL THE PARENT SAVE FUNCTION ---
    // We pass the share options AND any AI results we generated
    onFinalSave({
        postMeetingAssets: shareOptions,
        aiResults: results // This will be null if they skipped AI, which is fine
    });
  };

  return (
    <React.Fragment>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Post-Meeting AI Assistant</Typography>
        <Typography variant="body2" color="text.secondary">
          (Optional) Upload audio to generate notes. You can skip this and finish setup below.
        </Typography>
      </Box>
      
      {/* AI Section */}
      <Card variant="outlined" sx={{ p: 3, borderColor: 'divider', backgroundColor: 'background.paper', borderRadius: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
          <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} disabled={isLoading}>
            Upload Audio
            <VisuallyHiddenInput type="file" accept="audio/*" onChange={handleFileChange} />
          </Button>
          {audioFile && <Typography variant="body2" color="primary">{audioFile.name}</Typography>}
        </Box>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleGenerate} 
          disabled={isLoading || !audioFile} 
          fullWidth
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
          sx={{ py: 1.5, fontWeight: 'bold' }}
        >
          {isLoading ? 'Processing...' : 'Generate Transcript & Summary'}
        </Button>
        
        {isLoading && (
            <Box sx={{ mt: 2 }}>
                <LinearProgress color="primary" />
                <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center', color: 'text.secondary' }}>
                    {loadingStep}
                </Typography>
            </Box>
        )}
      </Card>

      {/* Results Display */}
      {results && (
        <Box sx={{ mt: 4, mb: 4, animation: 'fadeIn 0.5s ease-in' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>AI Insights</Typography>
          <Card variant="outlined" sx={{ p: 3, borderColor: 'primary.main', backgroundColor: 'rgba(104, 222, 104, 0.05)', mb: 4 }}>
             <MarkdownRenderer text={results.geminiResult} />
          </Card>
          
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'text.secondary' }}>Full Transcript</Typography>
          <Card variant="outlined" sx={{ p: 2, borderColor: 'divider', maxHeight: '200px', overflowY: 'auto', backgroundColor: 'background.default' }}>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {results.fullTranscript}
            </Typography>
          </Card>
        </Box>
      )}

      {/* THE FINISH BUTTON */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
         <Button onClick={onBack} startIcon={<ChevronLeftRoundedIcon />}>Back</Button>
         <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            endIcon={<SendIcon />}
            onClick={() => setOpenModal(true)}
            sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
         >
            Finish Setup
         </Button>
      </Box>

      {/* --- THE SHARE POP-UP MODAL --- */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)}
        PaperProps={{ sx: { borderRadius: 3, padding: 2, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', minWidth: '400px' } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            <CheckCircleIcon color="primary" sx={{ fontSize: 40, mb: 1, display: 'block', mx: 'auto' }} />
            Share Meeting Assets
        </DialogTitle>
        <DialogContent>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Select what you want to share with the attendees:
            </Typography>
            <FormGroup sx={{ backgroundColor: 'background.default', p: 2, borderRadius: 2 }}>
                <FormControlLabel 
                    control={<Checkbox checked={shareOptions.video} onChange={(e) => setShareOptions({...shareOptions, video: e.target.checked})} color="primary" />} 
                    label="1. Recording Video" 
                />
                <FormControlLabel 
                    control={<Checkbox checked={shareOptions.notes} onChange={(e) => setShareOptions({...shareOptions, notes: e.target.checked})} color="primary" />} 
                    label="2. AI Notes & Summary" 
                />
                <FormControlLabel 
                    control={<Checkbox checked={shareOptions.ppt} onChange={() => setShareOptions({...shareOptions, ppt: e.target.checked})} color="primary" />} 
                    label="3. Presentation (PPT)" 
                />
            </FormGroup>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button onClick={() => setOpenModal(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
            <Button onClick={handleShareSubmit} variant="contained" color="primary" sx={{ px: 4 }}>
                Share & Done
            </Button>
        </DialogActions>
      </Dialog>

    </React.Fragment>
  );
}