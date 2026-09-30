import { useState } from 'react';
import { FormFieldWrapper } from './FormCommon';
import { ComboBox } from '>/modules';
import {
  Option,
  OptionGroup,
  ListScrollInfo,
  CommonFieldProps,
  WrapLayout,
} from '>/types';

type ComboValue = string | string[];
type ComboCommonFields = {
  $options?: readonly Option[];
  $groups?: OptionGroup[];
  $editable?: boolean;
  $multiple?: boolean;
  $placeholder?: string;
  onListScroll?: (info: ListScrollInfo) => void;
  wrapLayout?: WrapLayout;
  wrapClass?: string;
};

type ComboFieldProps = Omit<
  CommonFieldProps,
  'onChange' | 'onValueChange' | 'value' | 'type'
> &
  ComboCommonFields & {
    value?: ComboValue;
    defaultValue?: ComboValue;
    onChange: (value: ComboValue) => void;
  };
export const ComboField = ({
  label,
  onChange,
  htmlFor,
  $notice,
  $status,
  wrapClass,
  wrapLayout,
  $multiple,
  ...props
}: ComboFieldProps) => {
  const [internalValue, setInternalValue] = useState(
    props.defaultValue ?? ($multiple ? [] : ''),
  );
  const isControlled = 'value' in props;
  const currentValue = isControlled ? props.value : internalValue;

  const controlledProps = {
    ...props,
    $multiple,
    value: currentValue,
  };

  const handleChange = (value: ComboValue) => {
    if (!isControlled) {
      setInternalValue(value);
    }
    onChange?.(value);
  };
  return (
    <FormFieldWrapper
      label={label}
      $notice={$notice}
      $status={$status}
      htmlFor={htmlFor ?? props.id}
      wrapClass={wrapClass}
      wrapLayout={wrapLayout}
    >
      <ComboBox {...controlledProps} onChange={handleChange} />
    </FormFieldWrapper>
  );
};
