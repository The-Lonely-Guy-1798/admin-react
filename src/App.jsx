// src/App.jsx

import { ThemeProvider, CssBaseline } from '@mui/material';
import AppRouter from './routes/AppRouter.jsx';
import { theme } from './theme';

function App() {
  // App's only responsibility is to render the router now
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter />
    </ThemeProvider>
  );
}

export default App;