import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { Handle, Remove } from '../Item/components';

export interface Props {
  children: React.ReactNode;
  columns?: number;
  label?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  onClick?(): void;
  onRemove?(): void;
}

export const Container = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      columns = 1,
      handleProps,
      horizontal,
      hover,
      onClick,
      onRemove,
      label,
      placeholder,
      style,
      scrollable,
      shadow,
      unstyled,
      ...props
    }: Props,
    ref
  ) => {
    const Component = onClick ? 'button' : 'div';

    return (
      <Component
        {...props}
        ref={ref}
        style={
          {
            ...style,
            '--columns': columns,
          } as React.CSSProperties
        }
        className={classNames(
          'builder-core-blocks-container-wrapper',
          unstyled && 'builder-core-blocks-container-unstyled',
          horizontal && 'builder-core-blocks-container-horizontal',
          hover && 'builder-core-blocks-container-hover',
          placeholder && 'builder-core-blocks-container-placeholder',
          scrollable && 'builder-core-blocks-container-scrollable',
          shadow && 'builder-core-blocks-container-shadow'
        )}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
      >
        {label ? (
          <div className="builder-core-blocks-container-header">
            {label}
            <div className="builder-core-blocks-container-actions">
              {onRemove ? <Remove onClick={onRemove} /> : undefined}
              <Handle {...handleProps} />
            </div>
          </div>
        ) : null}
        {placeholder ? children : <ul>{children}</ul>}
      </Component>
    );
  }
);