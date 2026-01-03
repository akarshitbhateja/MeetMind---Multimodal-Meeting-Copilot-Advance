// client/src/components/AuthForm.tsx
"use client";
import * as React from 'react';
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { GoogleIcon, AuthLogo } from './CustomIcons';

export default function AuthForm() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true);
    try {
      const action = isLogin ? signInWithEmailAndPassword : createUserWithEmailAndPassword;
      await action(auth, email, password);
      toast.success(isLogin ? "Welcome back!" : "Account created!");
      router.push('/dashboard');
    } catch (error: any) {
      const msg = error.code?.split('/')[1]?.replace(/-/g, ' ') || "An error occurred";
      toast.error(`Error: ${msg.charAt(0).toUpperCase() + msg.slice(1)}`);
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <AuthLogo />
      <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
        {isLogin ? 'Sign in' : 'Create Account'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2, mt: 2 }}>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <TextField id="email" type="email" name="email" placeholder="your@email.com" required fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <TextField name="password" placeholder="••••••••" type="password" id="password" required fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        {isLogin && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel control={<Checkbox value="remember" color="primary" sx={{p:0, pl: 1, pr: 1}} />} label="Remember me" />
            <Link component="button" type="button" variant="body2" color="text.secondary">Forgot password?</Link>
          </Box>
        )}
        <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 1 }}>
          {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Create Account'}
        </Button>
      </Box>
      <Divider sx={{ my: 1 }}>or</Divider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button fullWidth variant="outlined" startIcon={<GoogleIcon />}>Sign in with Google</Button>
        <Typography sx={{ textAlign: 'center' }} color="text.secondary">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link component="button" type="button" onClick={() => setIsLogin(!isLogin)} variant="body2" color="primary">
            {isLogin ? 'Sign up' : 'Sign in'}
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}