// client/src/components/QuickActions.tsx
"use client";
import { useRouter } from "next/navigation";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

export default function QuickActions() {
  const router = useRouter();
  return (
    <Card variant="outlined" sx={{ borderColor: 'var(--border)', p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Quick Actions</Typography>
      <Stack spacing={2}>
        <Button variant="contained" color="primary" onClick={() => router.push('/meetings/new')}>Create Meeting</Button>
        <Button variant="outlined">View All Meetings</Button>
        <Button variant="outlined">Settings</Button>
      </Stack>
    </Card>
  );
}