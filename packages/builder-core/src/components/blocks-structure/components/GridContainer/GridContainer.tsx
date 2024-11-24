import React from 'react';

export interface Props {
  children: React.ReactNode;
  columns: number;
}

export function GridContainer({ children, columns }: Props) {
  return (
    <ul
      className={'builder-core-blocks-list__grid-container'}
      style={
        {
          '--col-count': columns,
        } as React.CSSProperties
      }
    >
      {children}
    </ul>
  );
}
