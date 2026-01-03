// client/src/components/EmptyDashboard.tsx
"use client";
import { useRouter } from "next/navigation";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';

export default function EmptyDashboard() {
  const router = useRouter();
  return (
    <Card variant="outlined" sx={{ borderColor: 'var(--border)', p: {xs: 4, md: 10}, mt: 4, textAlign: 'center' }}>
      <Box sx={{ mb: 3, display: 'inline-block', p: 2.5, border: '1px solid var(--border)', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
        <CalendarMonthIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
      </Box>
      <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 1.5 }}>
        No Meetings Yet
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: '300px', mx: 'auto' }}>
        Create your first meeting and it will show up here.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => router.push('/meetings/new')}
      >
        Create Meeting
      </Button>
    </Card>
  );
}