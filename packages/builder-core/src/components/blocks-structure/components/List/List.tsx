import React, { forwardRef } from 'react';
import classNames from 'classnames';


export interface Props {
  children: React.ReactNode;
  columns?: number;
  style?: React.CSSProperties;
  horizontal?: boolean;
}

export const List = forwardRef<HTMLUListElement, Props>(
  ({ children, columns = 1, horizontal, style }: Props, ref) => {
    return (
      <ul
        ref={ref}
        style={
          {
            ...style,
            '--columns': columns,
          } as React.CSSProperties
        }
        className={classNames('builder-core-blocks-list', horizontal && styles.horizontal)}
      >
        {children}
      </ul>
    );
  }
);
