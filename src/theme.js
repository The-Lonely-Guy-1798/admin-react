import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00AEEF', // A vibrant, futuristic blue
    },
    background: {
      default: '#0D1117',
      // This is the new card background - a subtle gradient
      paper: 'linear-gradient(145deg, #2D323C 0%, #1E2128 100%)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#BDBDBD',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600, color: '#FFFFFF' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          // Use the gradient background defined in the palette
          background: 'linear-gradient(145deg, #2D323C 0%, #1E2128 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.3)',
          // Add a transition for the glow effect on hover
          transition: 'box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out',
          '&:hover': {
             borderColor: 'rgba(0, 174, 239, 0.5)',
             boxShadow: '0 0 20px 0 rgba(0, 174, 239, 0.3)', // The "Glow"
          }
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
            backgroundColor: '#161B22', // A solid, dark sidebar
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: 'none',
        }
      }
    },
     MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});