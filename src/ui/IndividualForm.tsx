import { useForm } from 'react-hook-form';
import { CreateCustomer, IndividualSchema } from '../types.tsx';
import { zodResolver } from '@hookform/resolvers/zod';
import '../App.css';
import Input from '../components/Input.tsx';
import Button from '@mui/material/Button';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FormData } from '../types';

function IndividualForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setFocus,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(IndividualSchema),
    mode: 'onChange',
  });
  const queryClient = useQueryClient();
  async function postCustomer(newData: CreateCustomer) {
    return await axios.post('http://localhost:4000/api/customers', newData, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }
  const mutation = useMutation({
    mutationFn: postCustomer,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formData'] });
      reset();
      setTimeout(() => {
        mutation.reset();
      }, 3000);
    },
    onError: (error) => {
      console.error('Error submitting form', error);
    },
  });

  const onSubmitHandler = async (data: FormData) => {
    const customerData: CreateCustomer = {
      type: 'INDIVIDUAL',
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      egn: data.egn ? data.egn.toString() : '',
      phoneNumber: data.phoneNumber ? data.phoneNumber.toString() : '',
      emailAddress: data.emailAddress || '',
      address: data.address,
      postcode: data.postcode.toString(),
    };
    mutation.mutate(customerData);
  };

  const handleKeyDown = (event: {
    key: string;
    preventDefault: () => void;
  }) => {
    if (event.key == 'Enter') {
      event.preventDefault();
      handleSubmit(onSubmitHandler)();
    }
  };

  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      minHeight='100vh'
      bgcolor='#f5f5f5'
    >
      <Paper
        elevation={10}
        style={{ padding: '3.2rem', maxWidth: '50rem', width: '100%' }}
      >
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          onKeyDown={handleKeyDown}
        >
          <Grid container spacing={2}>
            <Box bgcolor='#e8f9fd' padding='1rem' borderRadius='4px'>
              <Grid item xs={12}>
                <Typography variant='h5' component='h1' gutterBottom>
                  Personal Names
                </Typography>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Input
                    type='firstName'
                    placeholder='First Name'
                    name='firstName'
                    register={register}
                    required
                    error={errors.firstName}
                    label='First Name'
                    control={control}
                    setFocus={setFocus}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    type='middleName'
                    placeholder='Middle Name'
                    name='middleName'
                    register={register}
                    error={errors.middleName}
                    label='Middle Name'
                    control={control}
                    setFocus={setFocus}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    type='lastName'
                    placeholder='Last Name'
                    name='lastName'
                    register={register}
                    required
                    error={errors.lastName}
                    label='Last Name'
                    control={control}
                    setFocus={setFocus}
                  />
                </Grid>
              </Grid>
            </Box>

            <Grid item xs={12}>
              <Input
                type='egn'
                placeholder='EGN'
                name='egn'
                register={register}
                error={errors.egn}
                label='EGN'
                control={control}
                setFocus={setFocus}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                type='address'
                placeholder='Address'
                name='address'
                register={register}
                required
                error={errors.address}
                label='Address'
                control={control}
                setFocus={setFocus}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                type='postcode'
                placeholder='Postcode'
                name='postcode'
                register={register}
                required
                error={errors.postcode}
                label='Postcode'
                control={control}
                setFocus={setFocus}
              />
            </Grid>
            <Grid item xs={12}>
              <Input
                type='phoneNumber'
                placeholder='+00123456789'
                name='phoneNumber'
                register={register}
                error={errors.phoneNumber}
                label='Phone Number'
                control={control}
                setFocus={setFocus}
              />
            </Grid>

            <Grid item xs={12}>
              <Input
                type='emailAddress'
                placeholder='Email Address'
                name='emailAddress'
                register={register}
                error={errors.emailAddress}
                label='Email Address'
                control={control}
                setFocus={setFocus}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography align='center'>
                <Button
                  variant='contained'
                  size='medium'
                  type='submit'
                  disabled={mutation.status === 'pending'}
                  color='secondary'
                >
                  {mutation.status === 'pending' ? 'Submitting...' : 'Submit'}{' '}
                </Button>
              </Typography>
            </Grid>
          </Grid>
          {mutation.isError && (
            <Typography sx={{ mt: 2 }}>
              Error: {mutation.error.message}
            </Typography>
          )}
          {mutation.isSuccess && (
            <Typography sx={{ mt: 2 }}>Form submitted successfully!</Typography>
          )}
        </form>
      </Paper>
    </Box>
  );
}
export default IndividualForm;
