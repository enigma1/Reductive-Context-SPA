import { FormFieldWrapper } from './FormCommon';

export type TextAreaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    htmlFor?: string;
    label?: string;
    notice?: string;
    status?: 'error' | 'success';
    wrapClass?: string;
    onValueChange?: (value: string) => void;
  };

export const TextAreaField = ({
  htmlFor,
  label,
  notice,
  status,
  wrapClass,
  onChange,
  onValueChange,
  ...props
}: TextAreaProps) => {
  return (
    <FormFieldWrapper
      wrapClass={wrapClass}
      label={label}
      $notice={notice}
      $status={status}
      htmlFor={htmlFor ?? props.id}
    >
      <textarea
        {...props}
        onChange={(e) => {
          onChange?.(e);
          onValueChange?.(e.currentTarget.value);
        }}
      />
    </FormFieldWrapper>
  );
};
