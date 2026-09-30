/// <reference types="vite/client" />

declare module '*.css' {}

declare interface ImportMetaEnv {
  readonly VITE_MOCK_MODE?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.svg?react' {
  import * as React from 'react';

  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
