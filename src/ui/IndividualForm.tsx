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
    setError,
    control,
    setFocus,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(IndividualSchema),
    mode: 'onTouched',
  });
  const queryClient = useQueryClient();
  async function postCustomer(newData: CreateCustomer) {
    return await axios.post('http://localhost:4000/formData', newData, {
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
    <>
      <Paper variant='outlined' elevation={10} sx={{ padding: '1rem' }}>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          onKeyDown={handleKeyDown}
        >
          <Box
            component='section'
            sx={{
              borderRadius: '1rem',
              m: 2,
              p: 2,
            }}
          >
            <Typography
              component='h1'
              variant='h4'
              align='center'
              sx={{
                my: 2,
                p: 2,
              }}
            >
              Personal Names
            </Typography>
            <Input
              type='firstName'
              placeholder='First Name'
              name='firstName'
              register={register}
              required
              error={errors.firstName}
              label='First Name (Собствено име)'
              control={control}
              setFocus={setFocus}
            />

            <Input
              type='middleName'
              placeholder='Middle Name'
              name='middleName'
              register={register}
              error={errors.middleName}
              label='Middle Name (Презиме)'
              control={control}
              setFocus={setFocus}
            />

            <Input
              type='lastName'
              placeholder='Last Name'
              name='lastName'
              register={register}
              required
              error={errors.lastName}
              label='Last Name (Фамилия)'
              control={control}
              setFocus={setFocus}
            />
          </Box>
          <Grid container spacing={{ xs: 1, sm: 2, md: 4 }}>
            <Grid item xs={12}>
              <Input
                type='egn'
                placeholder='EGN'
                name='egn'
                register={register}
                error={errors.egn}
                label='EGN (ЕГН)'
                control={control}
                setFocus={setFocus}
              />

              <Input
                type='address'
                placeholder='Address'
                name='address'
                register={register}
                required
                error={errors.address}
                label='Address (Адрес)'
                control={control}
                setFocus={setFocus}
              />

              <Input
                type='postcode'
                placeholder='Postcode'
                name='postcode'
                register={register}
                required
                error={errors.postcode}
                label='Postcode (Пощенски код)'
                control={control}
                setFocus={setFocus}
              />

              <Input
                type='phoneNumber'
                placeholder='+00123456789'
                name='phoneNumber'
                register={register}
                error={errors.phoneNumber}
                label='Phone Number (Телефонен номер)'
                control={control}
                setFocus={setFocus}
              />

              <Input
                type='emailAddress'
                placeholder='Email Address'
                name='emailAddress'
                register={register}
                error={errors.emailAddress}
                label='Email Address (Имейл адрес)'
                control={control}
                setFocus={setFocus}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography align='center'>
                <Button
                  variant='contained'
                  type='submit'
                  disabled={mutation.isLoading}
                  sx={{
                    maxWidth: '16rem',
                  }}
                >
                  {mutation.isLoading ? 'Submitting...' : 'Submit'}
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </form>
        {mutation.isError && <p>Error: {mutation.error.message}</p>}
        {mutation.isSuccess && <p>Form submitted successfully!</p>}
      </Paper>
    </>
  );
}
export default IndividualForm;
