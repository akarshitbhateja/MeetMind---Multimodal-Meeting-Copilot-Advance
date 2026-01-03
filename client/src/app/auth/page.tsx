// client/src/app/auth/page.tsx
"use client";
import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import theme from '@/theme';
import AuthForm from '@/components/AuthForm';

export default function AuthPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: '100dvh',
          p: 4,
          '&::before': {
            content: '""', position: 'absolute', zIndex: -1, inset: 0,
            backgroundImage: 'radial-gradient(at 50% 50%, hsla(0, 0%, 10%, 0.5), hsl(0, 0%, 5%))',
          },
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: '480px',
            p: 4,
            gap: 2,
            // --- THE DEFINITIVE FIX ---
            backgroundColor: 'rgb(var(--card))', // Use the new, much darker card background
            border: '1px solid',
            borderColor: 'rgb(var(--border))',   // Use the new, subtle light gray border
            boxShadow: '0px 25px 50px -12px hsla(0, 0%, 0%, 0.5)',
            borderRadius: '12px',
          }}
        >
          <AuthForm />
        </Card>
      </Stack>
    </ThemeProvider>
  );
}