import 'react';

declare module 'react' {
  interface CSSProperties {
    '--tx'?: string;
    '--ty'?: string;
  }
}
