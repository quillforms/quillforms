import React from 'react';
import classNames from 'classnames';

interface Props {
  children: React.ReactNode;
  center?: boolean;
  style?: React.CSSProperties;
}

export function Wrapper({ children, center, style }: Props) {
  return (
    <div
      className={classNames('builder-core-blocks-list-wrapper', center && styles.center)}
      style={style}
    >
      {children}
    </div>
  );
}
