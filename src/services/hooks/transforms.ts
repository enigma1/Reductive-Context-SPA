import { useState, useEffect } from 'react';

export const useFileAsDataUrl = (
  file: File | null | undefined,
): string | undefined => {
  const [dataUrl, setDataUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!file) {
      setDataUrl(undefined);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }, [file]);

  return dataUrl;
};
