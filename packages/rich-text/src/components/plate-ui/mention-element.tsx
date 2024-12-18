import React, { forwardRef } from 'react';
import {
  getHandler,
  PlateElement,
  PlateElementProps,
  Value,
} from '@udecode/plate-common';
import { TMentionElement } from '@udecode/plate-mention';
import { useFocused, useSelected } from 'slate-react';
import { getPlainExcerpt, useFields, useHiddenFields, useVariables } from "@quillforms/admin-components";
import { Icon } from "@wordpress/components";
import { plus } from "@wordpress/icons";
import classnames from "classnames";
import { css } from "emotion";
import { cn } from '../../lib/utils';
import { useItemsContext } from '../plate/items-provider';

export interface MentionElementProps
  extends PlateElementProps<Value, TMentionElement> {
  /**
   * Prefix rendered before mention
   */
  prefix?: string;
  onClick?: (mentionNode: any) => void;
  renderLabel?: (mentionable: TMentionElement) => string;
}


const MentionElement = forwardRef<
  React.ElementRef<typeof PlateElement>,
  MentionElementProps
>(({ prefix, renderLabel, className, onClick, ...props }, ref) => {
  const { children, element } = props;
  const items = useItemsContext();
  // console.log(items)
  const { mentionType, mentionModifier } = element;
  // Now depending on the mentionType and mentionModifier we will get the item
  // from the fields or variable or hidden_field
  const item = items.find($item => $item.type === mentionType && $item.value === mentionModifier);
  // ? fields.find((field) => field.value === mentionModifier)
  // : mentionType === 'variable'
  //   ? variables.find((variable) => variable.value === mentionModifier)
  //   : hiddenFields.find((hiddenField) => hiddenField.value === mentionModifier);
  const mergeTagIcon = item?.iconBox?.icon ?? plus;

  const renderedIcon = (
    <Icon
      icon={
        (mergeTagIcon?.src)
          ? (mergeTagIcon?.src)
          // @ts-expect-error
          : (mergeTagIcon)
      }
    />
  );
  return (
    <>
      {item ?
        <PlateElement
          ref={ref}
          className={cn(
            'inline-block',
            className
          )}
          data-slate-value={element.value}
          contentEditable={false}
          onClick={() => {
            if (item) {
              getHandler(onClick, element)
            }
          }}
          {...props}
        >
          {/* {prefix}
      {element.value} */}
          < span
            contentEditable={false}
            className={
              classnames(
                'rich-text-merge-tag__node-wrapper',
                css`
                color: #333;
                bordercolor: ${item?.iconBox?.color
                    ? item?.iconBox?.color
                    : '#bb426f'};
                fill: #333;
              `

              )}
          >
            <span
              className={classnames(
                'rich-text-merge-tag__background',
                css`
                background: ${item?.iconBox?.color
                    ? item?.iconBox.color
                    : '#ffc5db'
                  };
          `
              )}
            />
            <span className="rich-text-merge-tag__icon-box">
              {renderedIcon}
            </span>
            <span
              className="rich-text-merge-tag__title"
              dangerouslySetInnerHTML={{
                __html: getPlainExcerpt(item.label),
              }}
            />
          </span>
          {children}

        </PlateElement > :
        (
          <span><span>{element.value}</span> {children} </span>
        )
      }
    </>
  );
});

MentionElement.displayName = 'MentionElement';

export { MentionElement };
