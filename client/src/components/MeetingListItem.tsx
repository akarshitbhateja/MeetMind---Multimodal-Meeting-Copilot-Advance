// client/src/components/MeetingListItem.tsx
"use client";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';

interface Meeting { title: string; startTime: string; attendees: string[]; meetingLink: string; }

export default function MeetingListItem({ meeting }: { meeting: Meeting }) {
  const meetingDate = new Date(meeting.startTime);
  const isProcessing = meeting.meetingLink === 'processing...';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meeting.meetingLink);
    toast.success("Link copied!");
  };

  return (
    <ListItem
      secondaryAction={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip label={`${meeting.attendees?.length || 0} attendees`} size="small" variant="outlined" sx={{ borderColor: 'primary.main', color: 'primary.main', backgroundColor: 'rgba(104, 222, 104, 0.1)' }} />
          {isProcessing ? (
            <CircularProgress size={24} color="primary" />
          ) : (
            <IconButton onClick={copyToClipboard} size="small" aria-label="copy link">
              <ContentCopyIcon sx={{ fontSize: 20, color: 'text.secondary', '&:hover': { color: 'primary.main' } }} />
            </IconButton>
          )}
        </Box>
      }
      sx={{ py: 2 }}
    >
      <ListItemText
        primary={<Typography variant="subtitle1" sx={{ fontWeight: '600' }}>{meeting.title}</Typography>}
        secondary={meetingDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      />
    </ListItem>
  );
}