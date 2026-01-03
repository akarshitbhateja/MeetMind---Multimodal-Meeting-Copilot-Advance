// client/src/app/dashboard/page.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import React from "react";

// MUI Imports
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

// THE DEFINITIVE, DOCUMENTATION-VERIFIED ICON IMPORT
import AddIcon from '@mui/icons-material/Add'; 

import theme from '@/theme';
import Header from "@/components/Header";
import EmptyDashboard from "@/components/EmptyDashboard";
import MeetingListItem from "@/components/MeetingListItem";

interface Meeting { _id: string; title: string; startTime: string; meetingLink: string; attendees: string[]; }

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(true);

  // All your working backend logic is preserved.
  const fetchMeetings = useCallback(async () => { if (user) { try { const res = await axios.get(`http://localhost:5001/api/meetings`, { params: { userFirebaseUid: user.uid } }); setMeetings(res.data); } catch (error) { toast.error("Could not fetch meetings."); } finally { setIsLoadingMeetings(false); } } }, [user]);
  useEffect(() => { if (!authLoading && user) { fetchMeetings(); } if (!authLoading && !user) { router.push('/auth'); } }, [user, authLoading, router, fetchMeetings]);

  if (authLoading || !user) {
    return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'background.default' }}>Loading...</Box>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Header />
        <Box sx={{ maxWidth: 1200, width: '100%', mx: 'auto', py: 6, px: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <div>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>Meetings</Typography>
              <Typography color="text.secondary">Manage and track all your meetings</Typography>
            </div>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => router.push('/meetings/new')}>
              New Meeting
            </Button>
          </Box>
          
          {isLoadingMeetings ? (
            <Card variant="outlined" sx={{ p: 8, textAlign: 'center' }}><Typography color="text.secondary">Loading meetings...</Typography></Card>
          ) : meetings.length === 0 ? (
            <EmptyDashboard />
          ) : (
            <Card variant="outlined">
              <List sx={{ p: 0 }}>
                {meetings.map((meeting, index) => (
                  <React.Fragment key={meeting._id}>
                    <MeetingListItem meeting={meeting} />
                    {index < meetings.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Card>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}