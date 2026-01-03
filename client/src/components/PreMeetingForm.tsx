// client/src/components/PreMeetingForm.tsx
"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import toast from 'react-hot-toast';

const StyledFormLabel = ({ htmlFor, children, ...props }: any) => ( <Typography component="label" htmlFor={htmlFor} variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1, display: 'block' }} {...props}>{children}{props.required && <Box component="span" sx={{ color: 'primary.main' }}> *</Box>}</Typography>);

export default function PreMeetingForm({ onNext, initialData }: { onNext: (data: object) => void; initialData: any }) {
    const [title, setTitle] = React.useState(initialData.title || '');
    const [startTime, setStartTime] = React.useState(initialData.startTime || '');
    const [endTime, setEndTime] = React.useState(initialData.endTime || '');
    const [description, setDescription] = React.useState(initialData.description || '');
    const [attendees, setAttendees] = React.useState(initialData.attendees ? initialData.attendees.join(', ') : '');

    const handleNext = () => {
        if (!title || !startTime || !endTime || !attendees) {
            toast.error("Please fill all required fields.");
            return;
        }
        onNext({ title, startTime, endTime, description, attendees: attendees.split(',').map(e => e.trim()) });
    };

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Pre-Meeting Details</Typography>
            
            {/* ======================================================= */}
            {/* THE DEFINITIVE & SYNTACTICALLY CORRECT GRID LAYOUT      */}
            {/* ======================================================= */}
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                    <StyledFormLabel htmlFor="title" required>Meeting Title</StyledFormLabel>
                    <TextField id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledFormLabel htmlFor="startTime" required>Start Time</StyledFormLabel>
                    <TextField id="startTime" name="startTime" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledFormLabel htmlFor="endTime" required>End Time</StyledFormLabel>
                    <TextField id="endTime" name="endTime" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required fullWidth InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12}>
                    <StyledFormLabel htmlFor="description">Description</StyledFormLabel>
                    <TextField id="description" name="description" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <StyledFormLabel htmlFor="attendees" required>Attendee Emails</StyledFormLabel>
                    <TextField id="attendees" name="attendees" value={attendees} onChange={(e) => setAttendees(e.target.value)} required fullWidth />
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button variant="contained" onClick={handleNext} endIcon={<ChevronRightRoundedIcon />}>Next</Button>
            </Box>
        </React.Fragment>
    );
}