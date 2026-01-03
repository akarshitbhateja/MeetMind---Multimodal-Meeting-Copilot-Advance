// client/src/components/Header.tsx
"use client";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Rocket } from "lucide-react";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      router.push('/auth');
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 1400, width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Rocket style={{ color: '#68de68' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            MeetMind
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ display: { xs: 'none', sm: 'block' } }} color="text.secondary" fontSize="0.875rem">{user?.email}</Typography>
          <Button variant="outlined" size="small" onClick={handleSignOut}>Sign Out</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}