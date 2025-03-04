import { FieldError, UseFormRegister, Control } from 'react-hook-form';
import { z, ZodType } from 'zod';

export type FormData = {
  firstName: string;
  middleName?: string;
  lastName: string;
  egn?: string;
  address: string;
  postcode: number;
  phoneNumber?: string;
  emailAddress?: string;
};

export type CreateCustomer = {
  type: 'INDIVIDUAL';
  firstName: string;
  middleName?: string;
  lastName: string;
  egn?: string;
  phoneNumber: string;
  emailAddress: string;
  address?: string;
  postcode?: string;
};

export type InputProps = {
  type: string;
  placeholder: string;
  label: string;
  required?: boolean;
  name: ValidInputNames;
  register: UseFormRegister<FormData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
  control: Control<FormData>;
  setFocus: (name: ValidInputNames) => void;
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
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEgn(egn: string) {
  if (egn && egn.length > 0) {
    if (egn.length !== 10) {
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
  } else {
    return true;
  }
}

function isValidPhoneNumber(phoneNumber: string) {
  if (phoneNumber && phoneNumber.length > 0) {
    return phoneRegex.test(phoneNumber);
  } else {
    return true;
  }
}
function isValidEmail(emailAddress: string) {
  if (emailAddress && emailAddress.length > 0) {
    return emailRegex.test(emailAddress);
  } else {
    return true;
  }
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
    egn: z
      .string()
      .optional()
      .refine((val) => isValidEgn(`${val}`), 'EGN must be 10 digit long'),
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
      .optional()
      .refine(
        (val) => isValidPhoneNumber(`${val}`),
        'Invalid number - must start with +00, followed by 9-16 digits.'
      ),
    emailAddress: z
      .string()
      .optional()
      .refine((val) => isValidEmail(`${val}`), 'This is not a valid email.'),
  })
  .superRefine((data, ctx) => {
    if (!data.phoneNumber && !data.emailAddress) {
      ctx.addIssue({
        path: ['emailAddress'],
        message: 'Either phone number or email address must be provided.',
        code: z.ZodIssueCode.custom,
      });
    }
  });
