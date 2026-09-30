import { FormFieldWrapper } from './FormCommon';

export type TextAreaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    htmlFor?: string;
    label?: string;
    notice?: string;
    status?: 'error' | 'success';
    wrapClass?: string;
  };

export const TextAreaField = ({
  htmlFor,
  label,
  notice,
  status,
  wrapClass,
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
      <textarea {...props} />
    </FormFieldWrapper>
  );
};
