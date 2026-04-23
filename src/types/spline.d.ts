import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        url?: string;
        'loading-type'?: 'eager' | 'lazy';
        'events-target'?: 'global' | 'local';
      }, HTMLElement>;
    }
  }
}
