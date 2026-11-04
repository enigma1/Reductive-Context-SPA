import { FormFieldWrapper } from './FormCommon';
import type { CommonFieldProps } from '>/types';

export type InputFieldProps = CommonFieldProps & {
  inputClassName?: string;
  wrapClass?: string;
  wrapLayout?: 'inline' | 'stack';
};

export const InputField = ({
  id,
  label,
  $notice,
  $status,
  endAdornment,
  inputClassName,
  wrapLayout = 'stack',
  wrapClass = 'label-left',
  value,
  type,
  onChange,
  onValueChange,
  ...props
}: InputFieldProps) => (
  <FormFieldWrapper
    label={label}
    htmlFor={id}
    $notice={$notice}
    $status={$status}
    wrapLayout={wrapLayout}
    wrapClass={wrapClass}
  >
    <div className='field-control'>
      <input
        {...props}
        {...(value !== undefined ? { value } : {})}
        type={type ?? 'text'}
        id={id}
        className={`w-full input ${inputClassName ?? ''}`}
        data-status={$status}
        onChange={(e) => {
          onChange?.(e);
          onValueChange?.(e.currentTarget.value);
        }}
      />
      {endAdornment}
    </div>
  </FormFieldWrapper>
);
