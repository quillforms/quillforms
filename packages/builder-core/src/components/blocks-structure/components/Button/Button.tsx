import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';

import styles from './Button.module.css';

export interface Props extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, ...props }: Props) {
  return (
    <button className={classNames('builder-core-blocks-list-button')} {...props}>
      {children}
    </button>
  );
}
