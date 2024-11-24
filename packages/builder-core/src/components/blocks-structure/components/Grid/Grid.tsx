import React from 'react';

export interface Props {
  size: number;
  step?: number;
  onSizeChange(size: number): void;
}

export function Grid({ size }: Props) {
  return (
    <div
      className={'builder-core-blocks-list__grid'}
      style={
        {
          '--grid-size': `${size}px`,
        } as React.CSSProperties
      }
    />
  );
}
