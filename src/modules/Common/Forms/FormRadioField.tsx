/* File: FormRadioField.tsx
  Supports Single Label Mode or Label Options
  Support for radio buttons in controlled/uncontrolled state
  You must not specify 'value' prop for uncontrolled implementations
  Supports specified RadioOptions or automatic options woth a 0-based radio counter
*/
import { type ReactNode, useState, InputHTMLAttributes } from 'react';
import { CheckIcon, AsteriskIcon } from 'lucide-react';
import { hasObjectProps } from '>/services/utils';
import { FormFieldWrapper } from './FormCommon';
import { StatusType, WrapLayout } from '>/types';

export type RadioOption = {
  id: string;
  label: string;
  value?: string;
};

type RadioFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange' | 'defaultValue'
> & {
  label?: ReactNode;
  notice?: string;
  status?: StatusType;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  options?: RadioOption[];
  radioCount?: number;
  wrapLayout?: WrapLayout;
  wrapClass?: string;
  labelClass?: string;
};

export const RadioFields = (props: RadioFieldProps) => {
  const {
    label,
    notice,
    status,
    value,
    defaultValue,
    onChange,
    options,
    radioCount = 2,
    wrapLayout = 'stack',
    labelClass,
    wrapClass,
    disabled,
    name,
  } = props;

  if ((!options || options.length === 0) && !label) {
    console.error('RadioFields: Missing label when no options array');
  }
  if (options && options.length > 0 && !name) {
    console.error(
      'RadioFields: Name must be provided when the options array is used',
    );
  }
  // options provided but empty → fall back to single-label mode with a warning
  if (options && options.length === 0) {
    console.error(
      'RadioFields: options array is empty, falling back to single-label mode',
    );
  }
  // radioCount invalid (only matters in single-label mode)
  if ((!options || options.length === 0) && radioCount <= 0) {
    console.error('RadioFields: radioCount must be a positive integer');
    return null; // or return an empty FormFieldWrapper
  }
  // Both options and radioCount provided → options wins, warn about the conflict
  if (options && options.length > 0 && radioCount !== 2) {
    console.warn(
      'RadioFields: both options and radioCount provided, radioCount is ignored',
    );
  }

  const [internalValue, setInternalValue] = useState<string>(
    defaultValue ?? '',
  );
  const isControlled = hasObjectProps(props, ['value']);
  const currentValue = isControlled ? (value ?? '') : internalValue;

  const radioList: RadioOption[] =
    options && options.length > 0
      ? options
      : Array.from({ length: radioCount }, (_, index) => ({
          id: `${'radio'}-${index}`,
          label: `${label || 'Option'} ${index + 1}`,
          value: String(index),
        }));

  const handleSelect = (val: string | undefined) => {
    if (!isControlled) {
      setInternalValue(val ?? '');
    }
    onChange?.(val);
  };

  const handleRadioClick = (val: string) => {
    if (disabled) return;
    if (currentValue === val) {
      handleSelect(undefined);
    } else {
      handleSelect(val);
    }
  };

  const handleSingleLabelClick = () => {
    if (disabled) return;

    const currentIndex = radioList.findIndex(
      (opt) => (opt.value ?? opt.id) === currentValue,
    );

    const nextIndex = currentIndex + 1;

    if (nextIndex >= radioList.length) {
      handleSelect(undefined);
    } else {
      const nextOpt = radioList[nextIndex];
      handleSelect(nextOpt.value ?? nextOpt.id);
    }
  };

  if (!options || options.length === 0) {
    return (
      <div onClick={handleSingleLabelClick} className='cursor-pointer'>
        <FormFieldWrapper
          label={label}
          labelClass={labelClass}
          wrapLayout={wrapLayout}
          wrapClass={wrapClass}
          $notice={notice}
          $status={status}
        >
          <div className='inline-flex items-center gap-1 w-fit'>
            {radioList.map((opt) => {
              const val = opt.value ?? opt.id;
              const isSelected = currentValue === val;
              return (
                <span
                  key={opt.id}
                  className='inline-flex center box'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRadioClick(val);
                  }}
                >
                  {isSelected && <AsteriskIcon size={14} />}
                </span>
              );
            })}
          </div>
        </FormFieldWrapper>
      </div>
    );
  }

  return (
    <FormFieldWrapper
      label={label}
      labelClass={labelClass}
      wrapLayout={wrapLayout}
      wrapClass={wrapClass}
      $notice={notice}
      $status={status}
    >
      <div className='flex flex-wrap gap-4'>
        {radioList.map((opt) => {
          const val = opt.value ?? opt.id;
          const isSelected = currentValue === val;
          return (
            <label
              key={opt.id}
              className='check-label cursor-pointer'
              onClick={(e) => {
                e.preventDefault();
                handleRadioClick(val);
              }}
            >
              <input
                type='radio'
                name={name}
                value={val}
                checked={isSelected}
                disabled={disabled}
                onChange={() => {}}
                className='hidden'
              />
              <span className='inline-flex items-center justify-center box'>
                {isSelected && <CheckIcon size={24} />}
              </span>
              <span className='truncate min-w-0'>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </FormFieldWrapper>
  );
};
