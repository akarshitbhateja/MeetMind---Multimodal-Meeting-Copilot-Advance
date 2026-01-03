// client/src/components/DuringMeeting.tsx
"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

const VisuallyHiddenInput = styled('input')({ clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', height: 1, overflow: 'hidden', position: 'absolute', bottom: 0, left: 0, whiteSpace: 'nowrap', width: 1 });
interface Poll { id: number; question: string; options: string[]; }

export default function DuringMeeting({ onNext, onBack, initialData }: { onNext: (data: object) => void, onBack: () => void, initialData: any }) {
    const [pptFile, setPptFile] = React.useState<File | null>(null);
    const [polls, setPolls] = React.useState<Poll[]>(initialData.polls || []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { setPptFile(e.target.files[0]); } };
    const addPoll = () => setPolls([...polls, { id: Date.now(), question: '', options: ['', ''] }]);
    const removePoll = (id: number) => setPolls(polls.filter(p => p.id !== id));
    const handlePollChange = (id: number, question: string) => setPolls(polls.map(p => p.id === id ? { ...p, question } : p));
    const handleOptionChange = (pollId: number, optionIndex: number, value: string) => { setPolls(polls.map(p => { if (p.id === pollId) { const newOptions = [...p.options]; newOptions[optionIndex] = value; return { ...p, options: newOptions }; } return p; })); };
    const addOption = (pollId: number) => setPolls(polls.map(p => p.id === pollId ? { ...p, options: [...p.options, ""] } : p));
    const handleNext = () => onNext({ pptFile, polls: polls.map(({ id, ...p }) => p) });

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Meeting Assets</Typography>
            <Box sx={{ my: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>Presentation</Typography>
                <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}><VisuallyHiddenInput type="file" onChange={handleFileChange} />Upload file</Button>
                {pptFile && <Typography variant="body2" sx={{ mt: 1 }}>Selected: {pptFile.name}</Typography>}
            </Box>
            <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>Polls</Typography>
                {polls.map((poll) => (
                    <Card key={poll.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}><TextField label="Poll Question" variant="standard" fullWidth value={poll.question} onChange={(e) => handlePollChange(poll.id, e.target.value)} /><IconButton onClick={() => removePoll(poll.id)}><DeleteOutlineIcon /></IconButton></Box>
                        {poll.options.map((option, i) => (<TextField key={i} label={`Option ${i+1}`} variant="outlined" size="small" fullWidth sx={{ mb: 1 }} value={option} onChange={(e) => handleOptionChange(poll.id, i, e.target.value)} />))}
                        <Button size="small" onClick={() => addOption(poll.id)}>Add Option</Button>
                    </Card>
                ))}
                <Button startIcon={<AddCircleOutlineIcon />} onClick={addPoll}>Add Poll</Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button onClick={onBack} startIcon={<ChevronLeftRoundedIcon />}>Back</Button>
                <Button variant="contained" onClick={handleNext} endIcon={<ChevronRightRoundedIcon />}>Next</Button>
            </Box>
        </React.Fragment>
    );
}