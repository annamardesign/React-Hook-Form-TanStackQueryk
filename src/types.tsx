import { FieldError, UseFormRegister } from 'react-hook-form';
import { z, ZodType } from 'zod';

export type FormData = {
  type: string;
  firstName: string;
  middleName: string;
  lastName: string;
  egn: string;
  address: string;
  postcode: string;
  phoneNumber: string | undefined;
  emailAddress: string | undefined;
};

export type InputProps = {
  type: object;
  placeholder: string;
  label: string;
  required: boolean;
  name: ValidInputNames;
  register: UseFormRegister<FormData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};

export type ValidInputNames =
  | 'firstName'
  | 'middleName'
  | 'lastName'
  | 'egn'
  | 'address'
  | 'postcode'
  | 'phoneNumber'
  | 'emailAddress';

const phoneRegex = new RegExp(/^\+00\d{9,16}$/);
const nameRegex = new RegExp(/^[A-Za-z' -]+$/);

function isValidEgn(egn) {
  if (!egn || egn.length !== 10) {
    return false;
  }
  let monthBorn = Number(egn.substr(2, 2));
  const dayBorn = Number(egn.substr(4, 2));
  let yearFlag = 1900;

  if (monthBorn > 40) {
    yearFlag += 100;
  } else if (monthBorn > 20) {
    yearFlag -= 100;
  }

  monthBorn = (monthBorn % 20) - 1;

  const dateBorn = new Date(
    yearFlag + Number(egn.substr(0, 2)),
    monthBorn,
    dayBorn,
    0,
    0,
    0
  );

  if (
    egn.length !== 10 ||
    new Date().getTime() < dateBorn.getTime() ||
    dateBorn.getMonth() !== monthBorn ||
    dateBorn.getDate() !== dayBorn
  ) {
    return false;
  }

  const flagNum = [2, 4, 8, 5, 10, 9, 7, 3, 6, 0];
  let lastNum = 0;
  let curNum;

  for (let i = 0; i < flagNum.length; i += 1) {
    curNum = Number(egn.substr(i, 1));

    lastNum += flagNum[i] * curNum;
  }
  return (lastNum % 11) % 10 === curNum;
}

export const IndividualSchema: ZodType<FormData> = z
  .object({
    firstName: z
      .string({
        required_error: 'First name is required',
      })
      .regex(
        nameRegex,
        'Invalid characters. Only letters, apostrophes, hyphens, and spaces are allowed.'
      )
      .min(2, { message: 'Name is too short' })
      .max(64, { message: 'Name is too long' }),
    middleName: z
      .string()
      .regex(
        nameRegex,
        'Invalid characters. Only letters, apostrophes, hyphens, and spaces are allowed.'
      )
      .min(2, { message: 'Name is too short' })
      .max(64, { message: 'Name is too long' })
      .optional()
      .or(z.literal('')),
    lastName: z
      .string({
        required_error: 'Last Name is required',
      })
      .regex(
        nameRegex,
        'Invalid characters. Only letters, apostrophes, hyphens, and spaces are allowed.'
      )
      .min(2, { message: 'Name is too short' })
      .max(64, { message: 'Name is too long' }),
    egn: z.coerce
      .number({
        invalid_type_error: 'EGN must be a number',
      })
      .refine((val) => isValidEgn(`${val}`), 'EGN must be 10 digit long')
      .optional()
      .or(z.literal('')),
    address: z
      .string({
        required_error: 'Address is required',
      })
      .min(2, { message: 'Address is too short' })
      .max(255, { message: 'Address is too long' }),
    postcode: z.coerce
      .number({
        required_error: 'Postal Code is required',
        invalid_type_error: 'Postal Code must be a number',
      })
      .refine(
        (val) => `${val}`.length === 4,
        'Postal Code must be 4 digit long'
      ),
    phoneNumber: z
      .string()
      .regex(
        phoneRegex,
        'Invalid number - must start with +00, followed by 9-16 digits.'
      )
      .or(z.literal('')),
    emailAddress: z
      .string()
      .email('This is not a valid email.')
      .or(z.literal('')),
  })
  .superRefine((values, ctx) => {
    if (!values.phoneNumber && !values.emailAddress) {
      ctx.addIssue({
        message: 'Either phone or email should be filled in.',
        code: z.ZodIssueCode.custom,
        path: ['phoneNumber'],
      });
      ctx.addIssue({
        message: 'Either phone or email should be filled in.',
        code: z.ZodIssueCode.custom,
        path: ['emailAddress'],
      });
    }
  });
