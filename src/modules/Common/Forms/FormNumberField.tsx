import { InputFieldProps, InputField } from './FormInputField';

export type NumberFieldProps = Omit<
  InputFieldProps,
  'type' | 'onValueChange'
> & {
  onValueChange?: (value: number | undefined) => void;
};

export const NumberField = ({ onValueChange, ...props }: NumberFieldProps) => (
  <InputField
    {...props}
    type='number'
    onValueChange={(value) => {
      const numeric = value === '' ? undefined : Number(value);
      onValueChange?.(numeric);
    }}
  />
);
