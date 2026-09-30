import type { InputHTMLAttributes } from 'react';
import type { StatusType } from './status';

export type WrapLayout = 'stack' | 'inline';

export type CommonFieldProps = {
  id?: string;
  htmlFor?: string;
  label?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  $status?: StatusType;
  $notice?: string;
  endAdornment?: React.ReactNode;
  onValueChange?: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'>;

export type FieldAdapter = {
  onChange: (value: string) => void;
  value: unknown;
  name: string;
};

export type Option = {
  value: string;
  label?: string;
  disabled?: boolean;
  $editable?: boolean;
};

export type OptionGroup = {
  label: string;
  options: readonly Option[];
};

export type ListScrollInfo = {
  scrollHeight: number;
  scrollTop: number;
  clientHeight: number;
};
