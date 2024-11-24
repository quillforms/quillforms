import React from 'react';
import { useDroppable, UniqueIdentifier } from '@dnd-kit/core';
import classNames from 'classnames';

import { droppable } from './droppable-svg';

interface Props {
  children: React.ReactNode;
  dragging: boolean;
  id: UniqueIdentifier;
}

export function Droppable({ children, id, dragging }: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={classNames(
        'builder-core-blocks-droppable-wrapper',
        isOver && 'builder-core-blocks-droppable-over',
        dragging && 'builder-core-blocks-droppable-dragging',
        children && 'builder-core-blocks-droppable-dropped'
      )}
      aria-label="Droppable region"
    >
      {children}
      {droppable}
    </div>
  );
}