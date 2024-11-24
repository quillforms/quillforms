import React from 'react';
import classNames from 'classnames';

export interface Props {
  children: React.ReactNode;
}

export function FloatingControls({ children }: Props) {
  return <div className={'builder-core-blocks-list__floating-controls'}>{children}</div>;
}
