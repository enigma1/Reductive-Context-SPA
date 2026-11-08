import { DragEvent, ChangeEvent, useRef, useState } from 'react';
import clsx from 'clsx';
import { FileIcon, UploadIcon } from 'lucide-react';

import { StatusType } from '>/types';
import { formatSize } from '>/services/utils';

type DropFileAreaText = {
  title?: string;
  subtitle?: string;
  browseButton?: string;
  replaceButton?: string;
  removeButton?: string;
};

type DropFileAreaProps = {
  value?: File | string | null;
  label?: string;
  notice?: string;
  status?: StatusType;
  className?: string;
  texts: DropFileAreaText;
  open: () => void;
  onDrop: (file: File | null) => void;
  onRemove: () => void;
};

const DropFileArea = ({
  value,
  className,
  texts,
  open,
  onDrop,
  onRemove,
}: DropFileAreaProps) => {
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const { title, subtitle, browseButton, replaceButton, removeButton } = texts;

  const isString = typeof value === 'string';
  const name = isString ? 'icon' : (value?.name ?? '');
  const size = isString ? new Blob([value]).size : (value?.size ?? 0);
  const previewSrc = isString
    ? value.startsWith('data:')
      ? value
      : `data:image/svg+xml,${encodeURIComponent(value)}`
    : value
      ? URL.createObjectURL(value)
      : null;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current--;

    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    onDrop(e.dataTransfer.files?.[0] ?? null);
  };

  return (
    <div
      className={clsx(
        'drop-area',
        {
          dragging: isDragging,
          'has-file': !!value,
        },
        className,
      )}
      onClick={open}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {value ? (
        <>
          <FileIcon />
          {previewSrc && <img src={previewSrc} alt='' className='w-8 h-8' />}
          <div>{name || 'icon'}</div>
          <div>{formatSize(size)}</div>
          <button type='button'>{replaceButton}</button>
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            {removeButton}
          </button>
        </>
      ) : (
        <>
          <UploadIcon />
          <div>{title}</div>
          <div>{subtitle}</div>
          <button type='button'>{browseButton}</button>
        </>
      )}
    </div>
  );
};

type DropFileFieldBaseProps = {
  status?: StatusType;
  notice?: string;
  value?: File | string | null;
  texts: DropFileAreaText;
  onValueChange: (value: File | string | null) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  convertToDataUrl?: boolean;
};

export const DropFileFieldBase = ({
  value,
  texts,
  onValueChange,
  inputProps,
  containerProps,
  convertToDataUrl,
}: DropFileFieldBaseProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleDrop = async (file: File | null) => {
    if (!file) return onValueChange(null);
    if (convertToDataUrl) {
      onValueChange(await fileToDataUrl(file));
    } else {
      onValueChange(file); // raw File, no conversion
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] ?? null;
    if (!file) return onValueChange(null);
    if (convertToDataUrl) {
      onValueChange(await fileToDataUrl(file));
    } else {
      onValueChange(file);
    }
  };
  const handleRemove = () => onValueChange(null);
  const open = () => inputRef.current?.click();

  return (
    <>
      <DropFileArea
        {...containerProps}
        value={value}
        open={open}
        onRemove={handleRemove}
        onDrop={handleDrop}
        texts={texts}
        className={clsx('drop-area', containerProps?.className)}
      />
      <input
        {...inputProps}
        ref={inputRef}
        hidden
        type='file'
        onChange={handleChange}
      />
    </>
  );
};

type DropFileFieldProps = Omit<
  DropFileFieldBaseProps,
  'value' | 'onValueChange' | 'convertToDataUrl'
> & {
  value?: File | null;
  onValueChange: (value: File | null) => void;
};
export const DropFileField = (props: DropFileFieldProps) => (
  <DropFileFieldBase
    {...props}
    onValueChange={props.onValueChange as (value: File | string | null) => void}
    convertToDataUrl={false}
  />
);

type DropIconFieldProps = Omit<
  DropFileFieldBaseProps,
  'value' | 'onValueChange' | 'convertToDataUrl'
> & {
  value?: string | null;
  onValueChange: (value: string | null) => void;
};

export const DropIconField = (props: DropIconFieldProps) => (
  <DropFileFieldBase
    {...props}
    onValueChange={props.onValueChange as (value: File | string | null) => void}
    convertToDataUrl
  />
);
