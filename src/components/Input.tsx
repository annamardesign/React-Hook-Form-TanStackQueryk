import { InputProps } from '@/types';
import { Grid } from '@mui/material';
import TextField from '@mui/material/TextField/TextField';
import { Controller } from 'react-hook-form';

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  name,
  label,
  error,
  required,
  control,
  setFocus,
}) => (
  <>
    <Grid item xs={12}>
      <Controller
        name={name}
        control={control}
        defaultValue=''
        render={({ field }) => (
          <TextField
            {...field}
            label={label}
            fullWidth
            type={type}
            placeholder={placeholder}
            required={required}
            onFocus={() => setFocus(name)}
            sx={{
              my: 1.2,
              textAlign: 'center !important',
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#000000',
              },
              '& .MuiOutlinedInput-root': {
                color: '#000',
                background: `${error ? '#ff000012' : 'white'}`,
                borderRadius: '5px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: `${error ? 'red' : '#E7E9EB'}`,
                  borderWidth: '1px',
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: `${error ? 'red' : '#10569c'}`,
                    borderWidth: '2px',
                  },
                },
                '&:hover:not(.Mui-focused)': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: `${error ? 'red' : '#E7E9EB'}`,
                    borderWidth: `${error ? '2px' : ''}`,
                  },
                },
              },
              '& .MuiInputLabel-outlined': {
                color: '#4F4F4F',
                fontSize: 15,
                '&.Mui-focused': {
                  color: `${error ? 'red' : '#4F4F4F'}`,
                  fontSize: 15,
                },
              },
            }}
          />
        )}
      />
      {error && <span className='error-message'>{error.message}</span>}
    </Grid>
  </>
);
export default Input;
