import './App.css';
import { Container, Paper } from '@mui/material';
import IndividualForm from './ui/IndividualForm.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// const email = z.string().email();
// type Email = z.infer<typeof email> & { type: 'Email' };
// function isEmail(str): str is Email {
//   return email.safeParse(str).success;
// }
// const age = z.number().int().min(0).max(150);
// type Age = z.infer<typeof age> & { type: 'Age' };
// function isAge(num): num is Age {
//   return age.safeParse(num).success;
// }

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
