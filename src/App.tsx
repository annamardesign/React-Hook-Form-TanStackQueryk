import './App.css';
import { Container, Paper } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import IndividualForm from './ui/IndividualForm.tsx';

const queryClient = new QueryClient();
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container component='main'>
          <Paper variant='outlined' elevation={10} sx={{ padding: '1rem' }}>
            <IndividualForm />
          </Paper>
        </Container>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
