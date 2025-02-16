import './App.css';
import { Container, Paper } from '@mui/material';
import IndividualForm from './ui/IndividualForm.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Container component='main'>
        <Paper variant='outlined' elevation={10} sx={{ padding: '1rem' }}>
          <IndividualForm />
        </Paper>
      </Container>
    </QueryClientProvider>
  );
};

export default App;
