// client/src/theme.ts
"use client";
import { createTheme } from '@mui/material/styles';
import { Inter } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'], display: 'swap' });

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#68de68', contrastText: '#0d0d0d' },
    background: { default: '#0d0d0d', paper: '#1c1c1c' },
    text: { primary: '#f0f0f0', secondary: '#a0a0a0' },
    divider: '#323232',
  },
  typography: { fontFamily: inter.style.fontFamily, h4: { fontWeight: 700 } },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 600 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          backgroundColor: '#0d0d0d',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#323232' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#505050' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#68de68' },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          color: '#a0a0a0',
          marginBottom: '8px',
        },
      },
    },
  },
});
export default theme;