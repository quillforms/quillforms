import React, { PropsWithChildren } from 'react';

interface Props {
  onConfirm(): void;
  onDeny(): void;
}

export const ConfirmModal = ({
  onConfirm,
  onDeny,
  children,
}: PropsWithChildren<Props>) => (
  <div className={'builder-core-blocks-list__confirm-modal'}>

    <h1>{children}</h1>
    <div>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onDeny}>No</button>
    </div>
  </div>
);
