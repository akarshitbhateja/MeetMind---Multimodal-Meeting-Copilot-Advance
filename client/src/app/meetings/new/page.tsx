// client/src/app/meetings/new/page.tsx
"use client";
import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { useRouter } from 'next/navigation';
import theme from '@/theme';
import PreMeetingForm from '@/components/PreMeetingForm';
import DuringMeeting from '@/components/DuringMeeting';
import PostMeetingForm from '@/components/PostMeetingForm';
import ScheduleConfirmationModal from '@/components/ScheduleConfirmationModal';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const steps = ['Pre-Meeting Details', 'Meeting Assets', 'Final Setup'];

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 22 }, [`&.${stepConnectorClasses.active}`]: { [`& .${stepConnectorClasses.line}`]: { backgroundColor: theme.palette.primary.main } }, [`&.${stepConnectorClasses.completed}`]: { [`& .${stepConnectorClasses.line}`]: { backgroundColor: theme.palette.primary.main } }, [`& .${stepConnectorClasses.line}`]: { height: 2, border: 0, backgroundColor: theme.palette.divider, borderRadius: 1 },}));
const ColorlibStepIconRoot = styled('div')<{ ownerState: { completed?: boolean; active?: boolean } }>(({ theme, ownerState }) => ({ backgroundColor: theme.palette.background.default, zIndex: 1, color: theme.palette.text.secondary, width: 40, height: 40, display: 'flex', borderRadius: '50%', justifyContent: 'center', alignItems: 'center', border: `2px solid ${theme.palette.divider}`, ...(ownerState.active && { color: theme.palette.primary.main, borderColor: theme.palette.primary.main, boxShadow: '0 4px 10px 0 rgba(104, 222, 104, 0.25)', }), ...(ownerState.completed && { color: theme.palette.primary.main, borderColor: theme.palette.primary.main, }),}));
function ColorlibStepIcon(props: any) { const { active, completed, className, icon } = props; const icons: { [index: string]: React.ReactElement } = { 1: <Typography>1</Typography>, 2: <Typography>2</Typography>, 3: <Typography>3</Typography>, }; return (<ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>{completed ? <Check /> : icons[String(icon)]}</ColorlibStepIconRoot>); }

export default function NewMeetingPage() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [meetingData, setMeetingData] = React.useState({});
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleNext = (stepData: object) => {
    setMeetingData(prev => ({ ...prev, ...stepData }));
    if (activeStep < steps.length - 1) { setActiveStep(prev => prev + 1); }
  };
  const handleBack = () => setActiveStep(prev => prev - 1);
  const handleOpenModal = (stepData: object) => {
    setMeetingData(prev => ({ ...prev, ...stepData }));
    setIsModalOpen(true);
  };

  // --- THIS IS THE MASTER FUNCTION THAT PERFORMS THE FINAL API CALL ---
  const handleFinalSchedule = async (postMeetingAssets: object): Promise<string | null> => {
    if (!user) {
      toast.error("You must be logged in.");
      return null;
    }
    const finalMeetingData = { ...meetingData, ...postMeetingAssets, userFirebaseUid: user.uid };
    try {
      const response = await axios.post('http://localhost:5001/api/meetings', finalMeetingData);
      return response.data.meeting.meetingLink; // Return the real link on success
    } catch (error) {
      toast.error("Failed to schedule the meeting. Check server logs.");
      return null; // Return null on failure
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: {xs: 4, md: 8}, px: {xs: 2, md: 4} }}>
        <Box sx={{ maxWidth: '900px', width: '100%', mx: 'auto' }}>
          <Box sx={{ mb: 6 }}><Typography variant="h4" sx={{fontWeight: 'bold'}}>Create Your Meeting</Typography><Typography color="text.secondary">Follow the steps...</Typography></Box>
          <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>{steps.map((label) => <Step key={label}><StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel></Step>)}</Stepper>
          <Box sx={{ mt: 4, p: {xs: 2, md: 4}, backgroundColor: 'background.paper', borderRadius: '12px', border: '1px solid', borderColor: 'divider' }}>
            {activeStep === 0 && <PreMeetingForm onNext={handleNext} initialData={meetingData} />}
            {activeStep === 1 && <DuringMeeting onNext={handleNext} onBack={handleBack} initialData={meetingData} />}
            {activeStep === 2 && <PostMeetingForm onBack={handleBack} onOpenModal={handleOpenModal} initialData={meetingData} />}
          </Box>
        </Box>
      </Box>
      <ScheduleConfirmationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGoToDashboard={() => router.push('/dashboard')}
        onSchedule={handleFinalSchedule}
      />
    </ThemeProvider>
  );
}