// client/src/components/ScheduleConfirmationModal.tsx
"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

interface Props {
  open: boolean;
  onClose: () => void;
  onGoToDashboard: () => void;
  previousData: any;
}

export default function ScheduleConfirmationModal({ open, onClose, onGoToDashboard, previousData }: Props) {
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [meetingLink, setMeetingLink] = React.useState('');
    const [selectedAssets, setSelectedAssets] = React.useState({ recording: true, summary: true, notes: true });
    const { user } = useAuth();
    
    // Ref to manage the polling interval so we can clear it easily
    const pollInterval = React.useRef<NodeJS.Timeout | null>(null);

    const handleToggle = (asset: keyof typeof selectedAssets) => setSelectedAssets(prev => ({ ...prev, [asset]: !prev[asset] }));

    const handleScheduleClick = async () => {
        if (!user) { toast.error("You must be logged in."); return; }
        setLoading(true);

        const finalMeetingData = { 
            ...previousData, 
            postMeetingAssets: selectedAssets, 
            userFirebaseUid: user.uid 
        };
        
        try {
            // 1. Create the meeting (returns immediately with "processing..." link)
            const response = await axios.post('http://localhost:5001/api/meetings', finalMeetingData);
            const meetingId = response.data.meeting._id;

            // 2. Start Polling for the real link
            let attempts = 0;
            pollInterval.current = setInterval(async () => {
                attempts++;
                try {
                    const check = await axios.get(`http://localhost:5001/api/meetings/${meetingId}`);
                    const link = check.data.meetingLink;
                    
                    // If we have a real link (not processing and not empty)
                    if (link && link !== 'processing...' && link.includes('http')) {
                        if (pollInterval.current) clearInterval(pollInterval.current);
                        setMeetingLink(link);
                        setSuccess(true);
                        setLoading(false);
                        toast.success("Meeting Scheduled!");
                    }
                    
                    // Timeout after 30 seconds (approx 15 attempts)
                    if (attempts > 15) {
                        if (pollInterval.current) clearInterval(pollInterval.current);
                        toast.error("Link generation timed out, but meeting was saved.");
                        onGoToDashboard();
                    }
                } catch (err) {
                    console.error("Polling error", err);
                }
            }, 2000); // Check every 2 seconds

        } catch (error) {
            toast.error("Failed to schedule the meeting.");
            setLoading(false);
            handleClose();
        }
    };
    
    const copyToClipboard = () => { navigator.clipboard.writeText(meetingLink); toast.success("Copied!"); };
    
    const handleClose = () => { 
        if (pollInterval.current) clearInterval(pollInterval.current);
        onClose(); 
        setTimeout(() => { setLoading(false); setSuccess(false); setMeetingLink(''); }, 300); 
    };

    return (
      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { backgroundColor: 'background.paper', borderRadius: '12px', backgroundImage: 'none' } }}>
        {loading ? ( 
          <DialogContent sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress color="primary" />
            <Typography sx={{ mt: 2 }}>Scheduling & Generating Link...</Typography>
          </DialogContent>
        ) : success ? ( 
          <DialogContent sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircleOutlineIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <DialogTitle sx={{ p: 0, mb: 1 }}>Success!</DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <TextField value={meetingLink} fullWidth size="small" InputProps={{ readOnly: true }} />
              <IconButton onClick={copyToClipboard}><ContentCopyIcon /></IconButton>
            </Box>
            <Button onClick={onGoToDashboard} variant="contained" fullWidth>Go to Dashboard</Button>
          </DialogContent>
        ) : (
          <>
            <DialogTitle>Final Follow-up Options</DialogTitle>
            <DialogContent>
              <Typography color="text.secondary" sx={{ mb: 2 }}>Select assets to be sent after the meeting.</Typography>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={selectedAssets.recording} onChange={() => handleToggle('recording')} />} label="Meeting Recording" />
                <FormControlLabel control={<Checkbox checked={selectedAssets.summary} onChange={() => handleToggle('summary')} />} label="AI-Generated Summary" />
                <FormControlLabel control={<Checkbox checked={selectedAssets.notes} onChange={() => handleToggle('notes')} />} label="Presentation Notes (PPT)" />
              </FormGroup>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleScheduleClick} variant="contained">Schedule</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    );
}