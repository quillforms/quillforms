import React from 'react';

interface Props {
  children: React.ReactNode;
}

export function OverflowWrapper({ children }: Props) {
  return <div className={'builder-core-blocks-list__overflow-wrapper'}>{children}</div>;
}
