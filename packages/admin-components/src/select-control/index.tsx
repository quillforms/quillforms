// Forked from @WordPress/components and added a feature of supporting item labels as React components.
/**
 * External dependencies
 */
import { useSelect } from 'downshift';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Icon, check, chevronDown } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';
import { useCallback } from 'react';
import { render } from 'react-dom';

/**
 * Internal dependencies
 */
import {
	Button,
	VisuallyHidden,
} from '@wordpress/components';

const itemToString = (item) => {
	if (item?.name) {
		if (typeof item.name === 'string') {
			return item.name;
		}
		const span = document.createElement('span');
		render(item.name, span);
		const tmp = document.createElement('div');
		tmp.appendChild(span);
		// @ts-expect-error
		return tmp.children[0]?.innerText;
		// var div = document.createElement( 'div' );
		// div.innerHTML = reactToHtmlString;
		// return div.textContent || div.innerText || '';
	}
	return undefined;
};
// This is needed so that in Windows, where
// the menu does not necessarily open on
// key up/down, you can still switch between
// options with the menu closed.
const stateReducer = (
	{ selectedItem },
	{ type, changes, props: { items } }
) => {
	switch (type) {
		case useSelect.stateChangeTypes.ToggleButtonKeyDownArrowDown:
			// If we already have a selected item, try to select the next one,
			// without circular navigation. Otherwise, select the first item.
			return {
				selectedItem:
					items[
					selectedItem
						? Math.min(
							items.indexOf(selectedItem) + 1,
							items.length - 1
						)
						: 0
					],
			};
		case useSelect.stateChangeTypes.ToggleButtonKeyDownArrowUp:
			// If we already have a selected item, try to select the previous one,
			// without circular navigation. Otherwise, select the last item.
			return {
				selectedItem:
					items[
					selectedItem
						? Math.max(items.indexOf(selectedItem) - 1, 0)
						: items.length - 1
					],
			};
		default:
			return changes;
	}
};

interface Props {
	className?: string;
	label?: string;
	options?: object;
	onChange: (item: any) => void;
	value: any;
}
const SelectControl: React.FC<Props> = ({
	/** Start opting into the larger default height that will become the default size in a future version. */
	// @ts-expect-error
	__next36pxDefaultSize = false,
	className,
	// @ts-expect-error
	hideLabelFromVision,
	label,
	// @ts-expect-error
	describedBy,
	options: items,
	onChange: onSelectedItemChange,
	value: _selectedItem,
}) => {
	const {
		getLabelProps,
		getToggleButtonProps,
		getMenuProps,
		getItemProps,
		isOpen,
		highlightedIndex,
		selectedItem,
	} = useSelect({
		initialSelectedItem: items && items.length > 0 ? items[0] : null,
		items: items || [],
		itemToString,
		onSelectedItemChange,
		...(typeof _selectedItem !== 'undefined' && _selectedItem !== null
			? { selectedItem: _selectedItem }
			: undefined),
		stateReducer,
	});

	function getDescribedBy() {
		if (describedBy) {
			return describedBy;
		}

		if (!selectedItem) {
			return __('No selection');
		}

		// translators: %s: The selected option.
		return sprintf(__('Currently selected: %s'), selectedItem.name);
	}

	const menuProps = getMenuProps({
		className: 'components-custom-select-control__menu',
		'aria-hidden': !isOpen,
	});

	const onKeyDownHandler = useCallback(
		(e) => {
			e.stopPropagation();
			menuProps?.onKeyDown?.(e);
		},
		[menuProps]
	);

	// We need this here, because the null active descendant is not fully ARIA compliant.
	if (
		menuProps['aria-activedescendant']?.startsWith('downshift-null')
	) {
		delete menuProps['aria-activedescendant'];
	}

	return (
		<div className="admin-components-select-control">
			<div
				className={classnames(
					'components-custom-select-control',
					className
				)}
			>
				{hideLabelFromVision ? (
					<VisuallyHidden as="label" {...getLabelProps()}>
						{label}
					</VisuallyHidden>
				) : (
					/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */
					<label
						{...getLabelProps({
							className:
								'components-custom-select-control__label',
						})}
					>
						{label}
					</label>
				)}
				<Button
					{...getToggleButtonProps({
						// This is needed because some speech recognition software don't support `aria-labelledby`.
						'aria-label': label,
						'aria-labelledby': undefined,
						className: classnames(
							'components-custom-select-control__button',
							{
								'is-next-36px-default-size':
									__next36pxDefaultSize,
							}
						),
						// @ts-expect-error
						describedBy: getDescribedBy(),
					})}
				>
					{selectedItem?.name}
					<Icon
						icon={chevronDown}
						className={classnames(
							'components-custom-select-control__button-icon',
							{
								'is-next-36px-default-size':
									__next36pxDefaultSize,
							}
						)}
						size={18}
					/>
				</Button>
				{ /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
				<ul {...menuProps} onKeyDown={onKeyDownHandler}>
					{isOpen &&
						items &&
						items.map((item, index) => {
							// Ensure item exists and has required properties
							if (!item) return null;

							const itemKey = item.key || `item-${index}`;

							return (
								<li
									key={itemKey}
									{...getItemProps({
										item,
										index,
										className: classnames(
											item.className,
											'components-custom-select-control__item',
											{
												'is-highlighted': index === highlightedIndex,
												'has-hint': !!item.__experimentalHint,
												'is-next-36px-default-size': __next36pxDefaultSize,
											}
										),
										style: item.style,
									})}
								>
									{item.name}
									{item.__experimentalHint && (
										<span className="components-custom-select-control__item-hint">
											{item.__experimentalHint}
										</span>
									)}
									{item === selectedItem && (
										<Icon
											icon={check}
											className="components-custom-select-control__item-icon"
										/>
									)}
								</li>
							);
						})}
				</ul>
			</div>
		</div >
	);
};
export default SelectControl;