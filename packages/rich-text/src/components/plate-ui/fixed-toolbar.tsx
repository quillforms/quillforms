import React from 'react';

import { cn } from '../../lib/utils';

import { Toolbar, ToolbarProps } from './toolbar';

const FixedToolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, ...props }: ToolbarProps, ref) => {
    return (
      <Toolbar
        ref={ref}
        className={cn(
          'left-0 top-[10px] z-50 w-full justify-between overflow-x-auto rounded-t-lg border-b border-b-border',
          className
        )}
        {...props}
      />
    );
  }
);
FixedToolbar.displayName = 'FixedToolbar';

export { FixedToolbar };
