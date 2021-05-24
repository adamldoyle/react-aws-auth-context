import { TextField, TextFieldProps } from '@material-ui/core';
import { useField } from 'formik';

export interface InputFieldProps {
  label: string;
  field: string;
  type?: string;
}

type AllProps = InputFieldProps & TextFieldProps;

export function InputField({
  label,
  field,
  type,
  ...textFieldProps
}: AllProps): JSX.Element {
  const [fieldProps, meta] = useField(field);
  const showError = meta.touched && Boolean(meta.error);
  return (
    <TextField
      id={`${field}-input`}
      type={type ?? 'text'}
      label={label}
      fullWidth
      error={showError}
      helperText={showError ? meta.error : undefined}
      InputProps={fieldProps}
      {...textFieldProps}
    />
  );
}
