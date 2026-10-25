import { InputHTMLAttributes, useEffect, useRef } from 'react';
import { CheckIcon, MinusIcon } from 'lucide-react';
import { FormFieldWrapper } from './FormCommon';

type CheckboxFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'checked' | 'onChange'
> & {
  label?: string;
  notice?: string;
  status?: 'error' | 'success';
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  wrapLayout?: 'inline' | 'stack';
  wrapClass?: string;
  labelClass?: string;
};

export const CheckboxField = ({
  id,
  label,
  title,
  notice,
  status,
  checked,
  onChange,
  wrapLayout = 'inline',
  labelClass,
  wrapClass,
  indeterminate = false,
  disabled = false,
}: CheckboxFieldProps) => {
  const ref = useRef<HTMLInputElement | null>(null);
  if ((id && !label) || (!id && label)) {
    console.warn('CheckboxField: Wrong use having id without label');
  }
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <FormFieldWrapper
      label={label ?? id}
      htmlFor={id}
      labelClass={labelClass}
      wrapLayout={wrapLayout}
      wrapClass={wrapClass}
      $notice={notice}
      $status={status}
    >
      <input
        ref={ref}
        id={id}
        type='checkbox'
        checked={checked}
        onChange={(e) => {
          onChange(e.target.checked);
        }}
        disabled={disabled}
        title={title}
      />

      <span
        className='box'
        onClick={() => {
          // if (!id && !label) ref.current?.click();
          ref.current?.click();
        }}
      >
        {checked && <CheckIcon size={14} />}
        {!checked && indeterminate && <MinusIcon size={14} />}
      </span>
    </FormFieldWrapper>
  );
};
